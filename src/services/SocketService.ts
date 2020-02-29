import humps from 'humps';
import { eventChannel } from 'redux-saga';
import io from 'socket.io-client';
import UUID from 'uuidjs';

import { ServerEnv } from '../env';
import { cookieKeys } from '../utils/constants';
import { getCookie } from '../utils/cookies';
import { SocketEvents } from './SocketEvents';

const serverEnv = ServerEnv();

interface SocketConfig {
  query: { token: string };
  forceNew: boolean;
  transports: string[];
}

export class SocketService {
  private static socket: any;
  private static instance: SocketService;

  public static createConnection() {
    return io.connect(serverEnv.chatApiUrl, SocketService.config);
  }

  /**
   * SocketService Singleton Instance;
   */
  public static get Instance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public static get token(): string {
    const token = getCookie(cookieKeys.PROFILE_TOKEN_KEY);
    return token || '';
  }

  private static get config(): SocketConfig {
    return {
      transports: ['websocket'],
      forceNew: true,
      query: { token: SocketService.token },
    };
  }

  public onSubscribe(eventName: string) {
    return eventChannel((emit: (params?: any) => void) => {
      const handler = (data: any) => emit(humps.camelizeKeys(data));

      SocketService.socket.on(eventName, handler);

      return () => SocketService.socket.off(eventName, handler);
    });
  }

  public getUuid() {
    return UUID.genV4().toString();
  }

  public onUnsubscribe(eventName: string) {
    if (SocketService.socket) {
      SocketService.socket.off(eventName);
    }
  }

  public onTokenRefresh() {
    const newToken = SocketService.token;
    if (newToken) {
      SocketService.socket.io.opts.query = {
        token: newToken,
      };
      SocketService.socket.disconnect();
      SocketService.socket.connect();
    }
  }

  public message(payload: { room_id: string; thread_id?: string; file_id?: string; message: string }) {
    SocketService.socket.emit(SocketEvents.Send, {
      id: this.getUuid(),
      ...payload,
    });
  }

  public typing(payload: { room_id: string; is_typing?: boolean }) {
    SocketService.socket.emit(SocketEvents.Typing, {
      id: this.getUuid(),
      ...payload,
    });
  }

  public updateMessage(payload: { message_id: string; message: string }) {
    SocketService.socket.emit(SocketEvents.Update, {
      id: this.getUuid(),
      ...payload,
    });
  }

  public forwardMessage(payload: { room_id: string; message_id: string; message: string }) {
    SocketService.socket.emit('message_forward', {
      id: this.getUuid(),
      ...payload,
    });
  }

  public deleteMessage(payload: { message_id: string }) {
    SocketService.socket.emit('message_delete', {
      id: this.getUuid(),
      ...payload,
    });
  }

  public reconnect() {
    if ((!SocketService.socket || !SocketService.socket.connected) && SocketService.token !== '') {
      SocketService.socket = SocketService.createConnection();
    }
  }

  public disconnect() {
    if (SocketService.socket) {
      SocketService.socket.close();
    }
  }
}
