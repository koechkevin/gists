import { SocketEvents, SocketService } from '../services';
import { Action, Effects } from './dispatch';

const socketInstance = SocketService.Instance;

interface CommonState {
  socketError: any;
  [extraProps: string]: any;
}

const initState: CommonState = {
  socketError: null,
};

export default {
  namespace: 'common',

  state: initState,

  effects: {
    *connectSocket({ payload }: Action, { call, put }: Effects) {
      yield call(socketInstance.reconnect);
      yield put({ type: 'subscribeOnline' });
      yield put({ type: 'subscribeError' });
      yield put({ type: 'channel/subscribeDraftCreateBroadcast' });
      yield put({ type: 'channel/subscribeUpdateDraftBroadcast' });
      yield put({ type: 'channel/subscribeDeleteDraftBroadcast' });
    },

    *disconnectSocket({ payload }: Action, { call }: Effects) {
      yield call(socketInstance.disconnect);
    },

    *subscribeOnline(action: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.Online);

        while (true) {
          const data = yield take(socketChannel);

          yield put({ type: 'global/setOnlineUsersIds', payload: data });
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeError(action: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.Error);

        while (true) {
          const data = yield take(socketChannel);

          if (data) {
            const { payload } = data;
            yield put({ type: 'loadSocketError', payload });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *unsubscribe({ payload }: Action, { call }: Effects) {
      yield call(socketInstance.onUnsubscribe, SocketEvents.Online);
      yield call(socketInstance.onUnsubscribe, SocketEvents.Error);
    },
  },

  reducers: {
    loadSocketError(state: CommonState, { payload }: Action): CommonState {
      return { ...state, socketError: payload };
    },

    showOrHideModal(state: CommonState, { modal, payload }: Action): CommonState {
      return { ...state, [modal]: payload };
    },
  },
};
