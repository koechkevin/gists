import { get } from 'lodash';

import { Action, Effects } from '../../../models/dispatch';
import { AuthService } from '../../../services';
import { SignUpProgress, SignUpSteps } from '../../../utils/constants';
import { ApplyAuthState } from './interfaces';

const initialState: ApplyAuthState = {
  exist: false,
  email: '',
  firstname: '',
  lastname: '',
  loading: false,
  message: '',
  userId: '',
  status: '',
  activeKey: '1',
  progressStatus: 0,
  showModal: false,
};

export default {
  namespace: 'applyAuth',

  state: initialState,

  effects: {
    *signUp({ payload }: Action, { call, put }: Effects) {
      try {
        const response = yield call(AuthService.signUpAccount, payload);
        const { data } = response;
        if (data) {
          yield put({
            type: 'getAccountActiveStatus',
            payload: {
              userId: get(data, 'user.user_id'),
              status: get(data, 'user.status'),
            },
          });
          yield put({
            type: 'updateProgressStatus',
            payload: { activeKey: SignUpSteps.VerifyEmail, progressStatus: SignUpProgress.VerifyEmail },
          });
        }
      } catch (error) {
        throw error;
      }
    },

    *checkUsername(action: Action, { call, put }: Effects) {
      const { payload } = action;

      try {
        const response = yield call(AuthService.checkUsername, payload);
        const { data } = response;

        if (data) {
          yield put({ type: 'checkUsernameExistence', payload: { email: data.username, exist: true } });
          yield put({
            type: 'updateProgressStatus',
            payload: { activeKey: SignUpSteps.Password, progressStatus: SignUpProgress.Password },
          });
        }
      } catch (error) {
        const {
          response: {
            data: { status },
          },
        } = error;
        if (status === 404) {
          yield put({
            type: 'checkUsernameExistence',
            payload: {
              email: payload.username,
              exist: false,
            },
          });
          yield put({
            type: 'updateProgressStatus',
            payload: { activeKey: SignUpSteps.Name, progressStatus: SignUpProgress.Name },
          });
        } else {
          throw error;
        }
      }
    },

    *activateAccount({ payload }: Action, { call, put }: Effects) {
      const { userId, code, username, password } = payload;
      try {
        yield put({ type: 'setAccountActiveStatus', payload: { message: '' } });

        const response = yield call(AuthService.verifyEmail, userId, code);
        const { data } = response;

        if (data) {
          const { status } = data;

          yield put({
            type: 'updateProgressStatus',
            payload: { activeKey: SignUpSteps.Completed, progressStatus: SignUpProgress.Completed },
          });
          yield put({ type: 'setAccountActiveStatus', payload: { status } });
          yield put({ type: 'global/login', payload: { username, password } });
        }
      } catch (error) {
        const {
          response: {
            data: { status, message },
          },
        } = error;

        if (status === 400) {
          yield put({
            type: 'setAccountActiveStatus',
            payload: { message },
          });
        } else {
          throw error;
        }
      }
    },

    *resendVerificationMessage({ payload }: Action, { call, put }: Effects) {
      const { email } = payload;
      yield put({ type: 'setAccountActiveStatus', payload: { message: '' } });
      yield put({ type: 'showResendCodeModal', payload: { showModal: true } });
      try {
        yield call(AuthService.resendVerificationCode, email);
        yield put({ type: 'showResendCodeModal', payload: { showModal: false } });
      } catch (error) {
        const {
          response: {
            data: { status, message },
          },
        } = error;

        if (status === 404 || 422) {
          yield put({
            type: 'setAccountActiveStatus',
            payload: { message },
          });
        } else {
          throw error;
        }
        yield put({ type: 'showResendCodeModal', payload: { showModal: false } });
      }
    },

    *saveName(action: Action, { put }: Effects) {
      const { payload } = action;
      yield put({ type: 'storeNewUsername', payload });
      yield put({
        type: 'updateProgressStatus',
        payload: { activeKey: SignUpSteps.Password, progressStatus: SignUpProgress.Password },
      });
    },

    *cancelUsernameCheck(action: Action, { put }: Effects) {
      yield put({ type: 'setDefault' });
    },
  },

  reducers: {
    checkUsernameExistence(state: ApplyAuthState, { payload }: Action): ApplyAuthState {
      const { email, exist, message = '' } = payload;
      return { ...state, email, exist, message, loading: false };
    },

    getAccountActiveStatus(state: ApplyAuthState, { payload }: Action): ApplyAuthState {
      const { status, userId } = payload;
      return { ...state, status, userId };
    },

    setAccountActiveStatus(state: ApplyAuthState, { payload }: Action): ApplyAuthState {
      const { status = 'non-verified', message = '' } = payload;
      return { ...state, status, message };
    },

    storeNewUsername(state: ApplyAuthState, { payload }: Action): ApplyAuthState {
      const { firstname, lastname = '' } = payload;
      return { ...state, firstname, lastname, loading: false };
    },

    checkUserInvalidPassword(state: ApplyAuthState, { payload }: Action): ApplyAuthState {
      const { message = '' } = payload;
      return { ...state, message, loading: false };
    },

    updateProgressStatus(state: ApplyAuthState, { payload }: Action): ApplyAuthState {
      const { activeKey, progressStatus } = payload;
      return { ...state, activeKey, progressStatus };
    },

    showResendCodeModal(state: ApplyAuthState, { payload }: Action): ApplyAuthState {
      const { showModal } = payload;
      return { ...state, showModal };
    },

    setDefault(state: ApplyAuthState): ApplyAuthState {
      return {
        ...state,
        firstname: '',
        lastname: '',
        email: '',
        exist: false,
        message: '',
        loading: false,
        userId: '',
        status: '',
        activeKey: '1',
        progressStatus: 0,
        showModal: false,
      };
    },
  },

  subscriptions: {},
};
