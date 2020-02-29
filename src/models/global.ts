import { IconDefinition } from '@fortawesome/pro-light-svg-icons';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import humps from 'humps';
import JWTDecode from 'jwt-decode';
import { uniqBy } from 'lodash';

import { ExceptionRoutes, Routes } from '../routes';
import { AuthService, AxiosInstance, UserService, WorkspaceService } from '../services';
import { cookieKeys, localStorageKey, ProductId, WorkspaceStatus } from '../utils/constants';
import { deleteCookie, getCookie, setCookie } from '../utils/cookies';
import { statusAssign } from '../utils/dataFormat';
import { Company } from './company';
import { Action, Effects } from './dispatch';
import { Auth, DecodedToken, UserProfile } from './user';

// Global state interface
export interface GlobalState {
  onlineUsers: string[];
  auth: Auth;
  collapsed: boolean;
  profile: UserProfile;
  profiles: UserProfile[];
  passwordValidation: any;
  companies: Company[];
  headerTitle: string;
  chatHeaderDetails: {
    title?: string;
    statusIcon?: IconDefinition;
    iconColor?: string;
    jobPosition?: string;
  };
  loginStatus: {
    success: boolean;
    message: string;
  };
  passwordRecovered: boolean;
  emailSent: boolean;
  emailSendingErrors: any[];
}

const initialState: GlobalState = {
  onlineUsers: [],
  collapsed: false,
  auth: {
    isChecking: true,
    isAuthenticated: false,
    permissions: [],
  },
  profile: {},
  profiles: [],
  passwordValidation: {
    errors: [],
    validateStatus: '',
  },
  companies: [],
  headerTitle: '',
  chatHeaderDetails: {
    title: '',
    iconColor: '',
    jobPosition: '',
  },
  loginStatus: {
    success: false,
    message: '',
  },
  passwordRecovered: false,
  emailSent: false,
  emailSendingErrors: [],
};

export default {
  namespace: 'global',

  state: initialState,

  effects: {
    *login(action: Action, { call, put }: Effects) {
      yield put({
        type: 'setLoginStatus',
        payload: { sucess: false, error: '' },
      });
      try {
        const { payload } = action;
        const { username, password } = payload;

        yield put({ type: 'checkUsernameInvalidPassword', payload: { message: '' } });

        const response = yield call(AuthService.loginAccount, { username, password });
        const { data } = response;

        if (data) {
          yield put({ type: 'fetchMyProfiles', payload: data.token });
        }
      } catch (error) {
        const {
          response: {
            data: { status, message },
          },
        } = error;

        if (status === 403) {
          yield put({
            type: 'setLoginStatus',
            payload: { sucess: false, message },
          });
        } else {
          throw error;
        }
      }
    },

    *updateLoginStatus(action: Action, { put }: Effects) {
      yield put({ type: 'setLoginStatus' });
    },

    *fetchMyProfiles(action: Action, { call, put }: any) {
      try {
        const { payload } = action;
        const { data } = yield call(UserService.fetchUserMyProfiles, payload);

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);

          const profile = data.items.find((item: any) => item.productId === ProductId);

          if (profile) {
            yield put({
              type: 'saveAuthUser',
              payload: {
                token: payload,
                profileId: profile.profileId,
              },
            });

            yield put({
              type: 'selectProfile',
              payload: {
                token: payload,
                profileId: profile.profileId,
              },
            });

            yield put(routerRedux.push(Routes.Candidate));
          } else {
            yield put({
              type: 'checkUsernameInvalidPassword',
              payload: { message: 'We can’t find that user profile, please try again.' },
            });
          }
        }
      } catch (error) {
        const { response } = error;

        if (response.status === 401) {
          yield put({ type: 'logout' });
        } else {
          throw error;
        }
      }
    },

    *fetchCompanies(action: Action, { call, put }: Effects) {
      try {
        const response = yield call(WorkspaceService.fetchWorkSpaces, { expand: 'signed_logo' });
        const { data } = response;

        if (data && data.items) {
          const companies = humps.camelizeKeys(data.items);
          const activeCompanies = companies.filter((company: any) => company.status === WorkspaceStatus.ACTIVE);
          yield put({ type: 'setCompanies', payload: activeCompanies });
        }
      } catch (err) {
        throw err;
      }
    },

    *selectProfile({ payload }: Action, { call, put }: Effects) {
      try {
        const { token, profileId } = payload;
        let { data } = yield call(AuthService.selectProfile, profileId, token);

        if (data) {
          data = humps.camelizeKeys(data);

          yield put({
            type: 'authorize',
            payload: {
              isChecking: false,
              isAuthenticated: true,
              permissions: [],
            },
          });
          yield put({ type: 'saveAuthData', payload: { ...data } });
          yield put({ type: 'loadUserProfile', payload: data.profile });
        }
      } catch (error) {
        throw error;
      }
    },

    *fetchProfiles(action: Action, { call, put, select }: Effects) {
      try {
        const { profile } = yield select(({ global }: any) => global);
        const response = yield call(UserService.fetchUserProfiles, { 'per-page': 100 });
        const { data } = response;

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);

          yield put({
            type: 'loadUserProfiles',
            payload: uniqBy([...data.items, profile], (profile: UserProfile) => profile.profileId),
          });
        }
      } catch (err) {
        throw err;
      }
    },

    *logout(action: Action, { put }: Effects) {
      yield put({ type: 'channel/unsubscribe' });
      yield put({
        type: 'deauthorize',
        payload: {
          isChecking: false,
          isAuthenticated: false,
          permissions: [],
        },
      });
    },

    *changePassword({ payload }: Action, { call, put }: Effects) {
      try {
        const { profileId, data } = payload;

        yield call(UserService.changePassword, profileId, humps.decamelizeKeys(data));
        yield put({ type: 'common/showOrHideModal', modal: 'showPasswordModal', payload: false });
        notification.success({ message: 'Password changed successfully.' });
      } catch (error) {
        const { response } = error;

        if (response && response.status === 422) {
          const errors = response.data.map((each: any) => ({ ...each, field: humps.camelize(each.field) }));
          return yield put({ type: 'setPasswordValidation', payload: errors });
        }

        throw error;
      }
    },

    *changeHeaderTitle({ payload }: Action, { put }: Effects) {
      yield put({ type: 'updateHeaderTitle', payload });
      yield put({ type: 'loadChatHeaderDetails', payload });
    },

    *forgotPassword({ payload }: Action, { call, put }: Effects) {
      try {
        yield call(AuthService.forgotPassword, payload);
        yield put({ type: 'loadEmailSent', payload: true });
        yield put({ type: 'loadEmailSendingErrors', payload: [] });
      } catch (error) {
        const { response } = error;
        if (response && response.status === 404) {
          yield put({
            type: 'loadEmailSendingErrors',
            payload: [
              {
                fieldName: 'email',
                message: 'We couldn’t find that email. Please try again.',
              },
            ],
          });
          return;
        }
        throw error;
      }
    },

    *fillNewPassword({ payload }: Action, { call, put }: Effects) {
      try {
        const { authKey, data } = payload;
        yield call(AuthService.fillNewPassword, humps.decamelizeKeys(data), authKey);
        yield put({ type: 'loadPasswordRecovered', payload: true });
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    authorize(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, auth: payload };
    },

    deauthorize(state: GlobalState, { payload }: Action): GlobalState {
      deleteCookie(cookieKeys.SELECTED_PROFILE_ID, false);
      deleteCookie(cookieKeys.USER_TOKEN_KEY);
      deleteCookie(cookieKeys.PROFILE_TOKEN_KEY, false);
      localStorage.removeItem(localStorageKey.PROFILE_MODEL);
      return { ...initialState, auth: payload };
    },

    loadUserProfile(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, profile: payload };
    },

    loadUserProfiles(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, profiles: payload };
    },

    saveAuthUser(state: GlobalState, { payload }: Action): GlobalState {
      setCookie(cookieKeys.USER_TOKEN_KEY, payload.token, 10 * 365 * 24 * 60 * 60);
      if (payload.profileId) {
        setCookie(cookieKeys.SELECTED_PROFILE_ID, payload.profileId, 10 * 365 * 24 * 60 * 60, false);
      }
      return state;
    },

    saveAuthData(state: GlobalState, { payload }: Action): GlobalState {
      // Rewrite authorization token, don't remove it!!!
      AxiosInstance.defaults.headers = {
        Authorization: `Bearer ${payload.token}`,
      };

      setCookie(cookieKeys.PROFILE_TOKEN_KEY, payload.token, 60 * 60, false);
      localStorage.setItem(localStorageKey.PROFILE_MODEL, JSON.stringify(payload.profile));
      return state;
    },

    setLoginStatus(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, loginStatus: payload };
    },

    invalidUsername(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, profile: payload };
    },

    changeMenuCollapsed(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, collapsed: payload };
    },

    setCompanies(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, companies: payload };
    },

    setProfileStatus(state: GlobalState, { payload }: Action): GlobalState {
      if (!(payload && payload.length)) {
        return state;
      }
      return {
        ...state,
        profiles: payload && payload.length ? statusAssign(payload, state.profiles) : state.profiles,
      };
    },

    setOnlineUsersIds(state: GlobalState, { payload }: Action): GlobalState {
      return {
        ...state,
        onlineUsers: payload,
      };
    },

    setPasswordValidation: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      passwordValidation: {
        errors: payload,
      },
    }),

    updateHeaderTitle: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      headerTitle: payload.title,
    }),

    loadChatHeaderDetails(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, chatHeaderDetails: payload };
    },

    loadPasswordRecovered: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      passwordRecovered: payload,
    }),

    loadEmailSent: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      emailSent: payload,
    }),

    loadEmailSendingErrors: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      emailSendingErrors: payload,
    }),
  },

  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ pathname }: Location) => {
        if (ExceptionRoutes.includes(pathname)) {
          return;
        }
        const token = getCookie(cookieKeys.PROFILE_TOKEN_KEY);
        const userToken = getCookie(cookieKeys.USER_TOKEN_KEY);
        const profileId = getCookie(cookieKeys.SELECTED_PROFILE_ID);
        const profile = JSON.parse(localStorage.getItem(localStorageKey.PROFILE_MODEL) || '{}');

        try {
          if (token && profile) {
            const now = new Date().getTime();
            const decoded: DecodedToken = JWTDecode(token);

            // Rewrite authorization token
            AxiosInstance.defaults.headers = {
              Authorization: `Bearer ${token}`,
            };

            dispatch({
              type: 'authorize',
              payload: {
                isChecking: false,
                isAuthenticated: true,
                permissions: [],
              },
            });

            if (decoded && decoded.exp && decoded.exp * 1000 <= now) {
              dispatch({
                type: 'selectProfile',
                payload: {
                  profileId,
                  token: userToken,
                },
              });

              return;
            }
            dispatch({ type: 'loadUserProfile', payload: profile });

            if (pathname === Routes.Login) {
              dispatch(routerRedux.push(Routes.Candidate));
            }

            return;
          }

          if (userToken) {
            if (profileId) {
              dispatch({
                type: 'selectProfile',
                payload: {
                  profileId,
                  token: userToken,
                },
              });
              return;
            }
            dispatch({ type: 'fetchMyProfiles', payload: userToken });

            return;
          }

          dispatch({
            type: 'authorize',
            payload: {
              isChecking: false,
              isAuthenticated: false,
              permissions: [],
            },
          });

          if (pathname !== Routes.Login) {
            dispatch(routerRedux.push(Routes.Login));
            return;
          }
        } catch (error) {
          throw error;
        }
      });
    },
  },
  // tslint:disable-next-line:max-file-line-count
};
