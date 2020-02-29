import { DELETE_CHAT_API, GET_CHAT_API, POST_CHAT_API, PUT_CHAT_API } from './AxiosInstance';

import { ApiUrl } from './ApiConfig';

import { PageInfo } from '../utils/PageHelper';

export class ChannelService {
  public static fetchChannels(): Promise<any> {
    return GET_CHAT_API(`${ApiUrl.CHANNEL}?per-page=300`);
  }

  public static fetchChannel(payload: { id: number }): Promise<any> {
    return GET_CHAT_API(`/channels/${payload.id}`);
  }

  public static fetchMessages(id: string, params: { pageInfo: PageInfo }): Promise<any> {
    const { pageInfo } = params;
    return GET_CHAT_API(`${ApiUrl.CHANNEL}/${id}/messages`, pageInfo);
  }

  public static MarkMessageAsReceived(messageId: string, receipt: boolean): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.MESSAGE}/receipt`, { receipt, messages: [messageId] });
  }

  public static markMessagesAsRead(messageIds: string[], read: boolean): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.MESSAGE}/read`, { read, messages: messageIds });
  }

  public static fetchReplies(parentId: string): Promise<any> {
    return GET_CHAT_API(`${ApiUrl.THREAD}/${parentId}/messages?per-page=300`);
  }

  public static fetchDraftMessages(id: string, params: any): Promise<any> {
    return GET_CHAT_API(`${ApiUrl.DRAFTS}`, params, {});
  }

  public static createDraftMessages(id: string, params: any): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.CHANNEL}/${id}/drafts/`, params, {});
  }

  public static updateDraftMessages(roomId: string, draftId: string, params: any): Promise<any> {
    return PUT_CHAT_API(`${ApiUrl.CHANNEL}/${roomId}/drafts/${draftId}`, params, {});
  }

  public static deleteDraftMessages(roomId: string, draftId: string): Promise<any> {
    return DELETE_CHAT_API(`${ApiUrl.CHANNEL}/${roomId}/drafts/${draftId}`, {});
  }
}
