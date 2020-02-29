import humps from 'humps';
import { filter, find, findIndex, includes, reduce, reverse } from 'lodash';

import { notification } from 'antd';
import { Action, Effects } from '../../../models/dispatch';
import { Routes } from '../../../routes';
import { ChannelService, SocketEvents, SocketService } from '../../../services';
import { assignTypingStatus, membersConvert, msgConverter, threadStatusAssign } from '../../../utils/dataFormat';
import { PageHelper } from '../../../utils/PageHelper';
import { getCurrentUser, updateThreadInfo } from '../../../utils/utils';

import { PageInfo } from '../../../utils/PageHelper';
import { Channel, Channels, Draft, Message, User } from './typed';

const {
  fetchChannel,
  fetchChannels,
  fetchMessages,
  fetchReplies,
  fetchDraftMessages,
  createDraftMessages,
  MarkMessageAsReceived,
  updateDraftMessages,
  deleteDraftMessages,
} = ChannelService;

export interface ChannelState {
  drafts: Draft[];
  channel: Channel;
  channels: Channels;
  message: Message;
  pageInfo: PageInfo;
  repliedMessageIdx: number;
  replyDeletedMessageIdx: number;
  editableMessageIdx: number;
  rowHeights: any[];
  vListHeight: number;
}

const socketInstance = SocketService.Instance;

export const initialChannel = { id: '', messages: [] };
export const initialMessage = {
  id: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialState: ChannelState = {
  drafts: [],
  channels: [],
  channel: initialChannel,
  message: initialMessage,
  pageInfo: PageHelper.create(),
  repliedMessageIdx: -1,
  replyDeletedMessageIdx: -1,
  editableMessageIdx: -1,
  rowHeights: [],
  vListHeight: 0,
};

export default {
  namespace: 'channel',

  state: initialState,

  effects: {
    *subscribe({ payload }: Action, { call, put }: Effects) {
      yield put({ type: 'common/subscribeOnline' });
      yield put({ type: 'subscribeSendBroadcast' });
      yield put({ type: 'subscribeUpdateBroadcast' });
      yield put({ type: 'subscribeNewMessages' });
      yield put({ type: 'subscribeUpdateError' });
      yield put({ type: 'subscribeDeleteMessageBroadCast' });
      yield put({ type: 'subscribeDeleteMessageError' });
      yield put({ type: 'subscribeTypingBroadcast' });
      yield put({ type: 'subscribeDraftCreateBroadcast' });
      yield put({ type: 'subscribeUpdateDraftBroadcast' });
      yield put({ type: 'subscribeDeleteDraftBroadcast' });
    },

    *unsubscribe({ payload }: Action, { call }: Effects) {
      yield call(socketInstance.onUnsubscribe, SocketEvents.SendRepSuccess);
      yield call(socketInstance.onUnsubscribe, SocketEvents.SendBroadcast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.NewMessagesBroadCast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.DeletedBroadcast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.Online);
      yield call(socketInstance.onUnsubscribe, SocketEvents.Error);
      yield call(socketInstance.onUnsubscribe, SocketEvents.DraftCreateBroadcast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.UpdateDraftsBroadcast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.DeleteDraftsBroadcast);
    },

    *fetchChannels(action: Action, { call, put, take, select }: any) {
      let channels = [];
      const { data } = yield call(fetchChannels);

      let { profiles, profile: userProfile } = yield select((state: any) => state.global);

      /** load profiles when access chat-room directly */
      if (profiles.length === 0) {
        yield put.resolve({ type: 'global/fetchProfiles' });

        profiles = yield select(({ global }: any) => global.profiles);
        userProfile = yield select(({ global }: any) => global.profile);
      }

      if (data && data.items && Array.isArray(data.items)) {
        data.items = humps.camelizeKeys(data.items);

        channels = data.items
          .map((thread: any) => ({
            ...thread,
            members: membersConvert(thread.members, profiles),
          }))
          .map((thread: any) => ({
            ...thread,
            name: thread.members
              .filter((current: any) => current.id !== userProfile.profile?.profileId)
              .map((member: User) => member.name)
              .join(', '),
            messages: [],
            draft: '',
            currentUser: getCurrentUser(userProfile),
          }));
      }

      yield put({ type: 'fetchChannelsSuccess', payload: { channels } });
      yield put({ type: 'fetchDrafts' });
    },

    *fetchDrafts(action: Action, { call, put, all, select }: Effects) {
      const { data } = yield call(fetchDraftMessages);

      if (data && Array.isArray(data.items)) {
        data.items = humps.camelizeKeys(data.items);

        yield all(
          data.items
            .filter((draft: Draft) => !draft.threadId)
            .map((draft: any) =>
              put({
                type: 'setChannels',
                payload: {
                  data: {
                    id: draft.roomId,
                    draft: !draft.threadId && draft.message ? draft.message : '',
                    threadDraft: draft.threadId && draft.message,
                    draftId: !draft.threadId && draft.id ? draft.id : '',
                    draftThreadId: draft.threadId,
                  },
                },
              }),
            ),
        );
        yield put({ type: 'setDraftsSuccess', payload: data.items });
        yield put({ type: 'draftsGroup' });
      }
      const onlineUsers = yield select((state: any) => state.global.onlineUsers);

      yield put({ type: 'global/setProfileStatus', payload: onlineUsers });
      yield put({ type: 'setChannelsStatus', payload: onlineUsers });
      yield put({ type: 'subscribeNewMessages' });
    },

    *createDraftMessages({ payload }: Action, { call, put, select }: Effects) {
      const { id, message, draftThreadId } = payload;

      let { data } = yield call(createDraftMessages, id, { message, thread_id: draftThreadId });

      if (data) {
        data = humps.camelizeKeys(data);

        if (!draftThreadId) {
          yield put({
            type: 'setChannels',
            payload: {
              data: {
                id,
                draft: data && !data.threadId ? message : '',
                draftId: data.id,
                draftThreadId: data && data.threadId,
              },
            },
          });
        }

        yield put({ type: 'setDrafts', payload: data });
        yield put({ type: 'draftsGroup' });
      }
    },

    *updateDraftMessages({ payload }: Action, { call, put, select }: Effects) {
      const { id, draftId, message, draftThreadId } = payload;

      const { data } = yield call(updateDraftMessages, id, draftId, { message });

      if (data) {
        data.items = humps.camelizeKeys(data);

        const channels = yield select((state: any) => state.channel.channels);
        const channel = find(channels, (ch) => ch.id === id);
        const draft = data.items.message;

        if (!draftThreadId) {
          yield put({
            type: 'setChannels',
            payload: { data: { ...channel, id, draft, draftId } },
          });
        }

        yield put({ type: 'draftsGroup' });
        yield put({ type: 'updateDraftsAfterUpdate', payload: data.items });
      }
    },

    *deleteDraftMessages({ payload }: Action, { call, put, select }: Effects) {
      const { id, draftId, draftThreadId } = payload;

      yield call(deleteDraftMessages, id, draftId);

      const channels = yield select((state: any) => state.channel.channels);
      const channel = find(channels, (ch) => ch.id === id);

      if (!draftThreadId) {
        yield put({
          type: 'setChannel',
          payload: { data: { ...channel, id, draft: '', draftId: '', isDrafted: false } },
        });
      }

      yield put({ type: 'updateDraftsAfterDelete', payload: draftId });

      if (draftThreadId) {
        yield put({
          type: 'updateMessageDraft',
          payload: { data: { draftText: '', draftId: '' } },
        });
      }

      yield put({ type: 'draftsGroup' });
    },

    *fetchMessages({ payload: { id, pageInfo } }: Action, { call, put, select }: Effects) {
      const profiles = yield select((state: any) => state.global.profiles);

      /** load messages */
      const { data, pagination } = yield call(fetchMessages, id, {
        pageInfo: PageHelper.requestFormat(pageInfo),
      });

      const channel = yield select((state: any) => state.channel.channel);

      /** push messages */
      const messages: Message[] = channel ? channel.messages : [];
      const messageIds: string[] = messages.map(({ id }: Message) => id);
      const temp: Message[] = [];

      if (data && Array.isArray(data.items)) {
        data.items = humps.camelizeKeys(data.items);
        data.items.map((item: any) => {
          const message = msgConverter(item, profiles);
          if (!includes(messageIds, message.id)) {
            temp.push(message);
          }
          return item;
        });

        yield put({
          type: 'setPageInfo',
          payload: { pageInfo: Object.assign(pageInfo, pagination) },
        });
      }

      /** set messages */
      yield put({
        type: 'setChannel',
        payload: { data: { ...channel, messages: reverse(temp).concat(messages) } },
      });
    },

    *selectChannel({ payload: { id } }: Action, { put, take, select }: any) {
      let channels = yield select((state: any) => state.channel.channels);

      /** load channels when access chat-room directly */
      if (channels.length === 0) {
        yield put.resolve({ type: 'fetchChannels' });
        yield put.resolve({ type: 'fetchDrafts' });

        channels = yield select((state: any) => state.channel.channels);
      }

      const channel = find(channels, (ch) => ch.id === id);

      yield put({
        type: 'fetchMessages',
        payload: { id, pageInfo: PageHelper.create() },
      });

      const message = yield select((state: any) => state.channel.message);
      const drafts = yield select((state: any) => state.channel.drafts);

      yield put({
        type: 'initState',
        payload: { channel: { ...channel, messages: [] }, channels, message, drafts },
      });
    },

    *single(action: Action, { call, put }: any) {
      try {
        const { payload } = action;
        const res = yield call(fetchChannel, payload);
        yield put({ type: 'setChannel', payload: res });
      } catch (err) {
        throw err;
      }
    },

    *sendMessageWithFile({ payload }: Action, { put, select, takeEvery }: any) {
      try {
        const { roomId, text, file: fileData, threadId } = payload;
        const uuid = socketInstance.getUuid();
        const { profiles, profile } = yield select(({ global }: any) => global);
        const message = {
          id: uuid,
          roomId,
          message: text,
          file: fileData,
          read: [profile.profileId],
          createdBy: profile.profileId,
        };

        const composed = msgConverter(message, profiles);

        if (threadId) {
          yield put({
            type: 'appendReply',
            payload: { roomId, parentId: threadId, reply: composed },
          });
        } else {
          yield put({ type: 'appendMessage', payload: { roomId, message: composed } });
        }

        yield put({ type: 'fileUpload/uploadFile', payload: fileData });
        yield takeEvery('fileUpload/uploadStatus', function* upload(action: Action) {
          const { payload: file } = action;
          const data = { ...composed, file };

          if (!threadId) {
            yield put({ type: 'updateMessage', payload: { messageId: uuid, updates: data } });

            if (file.status === 'error') {
              yield put({ type: 'afterMessageDeleting', payload: data });
            }

            if (file.status !== 'done') {
              return;
            }

            yield put({ type: 'socketSendMessage', payload: { text, fileId: file.fileId } });
          } else {
            yield put({ type: 'updateReply', payload: { messageId: uuid, updates: data } });

            if (file.status === 'error') {
              yield put({ type: 'afterReplyDeleting', payload: data });
            }

            if (file.status !== 'done') {
              return;
            }

            yield put({ type: 'sendReply', payload: { text, fileId: file.fileId } });
          }
        });
      } catch (error) {
        throw error;
      }
    },

    *socketSendMessage({ payload }: Action, { put, call, select }: Effects) {
      const { text, fileId } = payload;
      const channel = yield select((state: any) => state.channel.channel);
      let data: any = {
        fileId,
        message: text,
        roomId: channel.id,
      };
      data = humps.decamelizeKeys(data);

      socketInstance.message(data);

      /** clear draft */
      yield put({
        type: 'setChannel',
        payload: { data: { ...channel, draft: '', draftId: '', isDrafted: false } },
      });

      yield put({ type: 'draftsGroup' });

      if (channel.draftId) {
        yield call(deleteDraftMessages, channel.id, channel.draftId);
      }
    },

    updateTypingStatus({ payload }: Action) {
      socketInstance.typing({
        room_id: payload.roomId,
        is_typing: payload.isTyping,
      });
    },

    *subscribeTypingBroadcast(action: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.TypingBroadCast);

        while (true) {
          const data = yield take(socketChannel);
          const { payload } = data;

          if (data) {
            yield put({ type: 'setTypingStatus', payload });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *sendReply({ payload }: Action, { put, select, call }: Effects) {
      const { text, fileId } = payload;
      const { channel, message } = yield select(({ channel }: any) => channel);

      if (!message) {
        return;
      }

      socketInstance.message({
        room_id: channel.id,
        thread_id: message.id,
        file_id: fileId,
        message: text,
      });

      yield put({
        type: 'updateMessageDraft',
        payload: { data: { ...message, draftText: '', draftId: '' } },
      });

      if (message.draftId) {
        yield call(ChannelService.deleteDraftMessages, message.threadId, message.draftId);
        yield put({ type: 'updateDraftsAfterDelete', payload: message.draftId });
      }

      yield put({ type: 'draftsGroup' });
    },

    socketUpdateMessage({ payload }: Action, { put }: Effects) {
      socketInstance.updateMessage({
        message_id: payload.id,
        message: payload.text,
      });
    },

    socketDeleteMessage({ payload }: Action) {
      const { id } = payload;
      socketInstance.deleteMessage({ message_id: id });
    },

    *markMessagesAsRead({ payload }: Action, { call }: Effects) {
      try {
        yield call(ChannelService.markMessagesAsRead, payload, true);
      } catch (error) {
        throw error;
      }
    },

    *fetchReplies(action: Action, { put, call, select }: Effects) {
      const message = yield select((state: any) => state.channel.message);

      if (!message) {
        return;
      }

      const profiles = yield select((state: any) => state.global.profiles);
      const { data } = yield call(fetchReplies, message.id);

      if (!data) {
        return;
      }

      data.items = humps.camelizeKeys(data.items);
      const replies = data.items.map((item: any) => msgConverter(item, profiles));

      yield put({
        type: 'fetchRepliesSuccess',
        payload: { parentId: message.id, replies },
      });
    },

    /** socket broadcast listener */
    *subscribeSendBroadcast({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.SendBroadcast);

        while (true) {
          const { payload } = yield take(socketChannel);

          if (payload) {
            yield put({ type: 'afterMessageSending', payload });
            yield call(MarkMessageAsReceived, payload.id, true);
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeNewMessages({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.NewMessagesBroadCast);

        while (true) {
          const { payload } = yield take(socketChannel);

          if (payload) {
            const { roomId, newMessagesCount } = payload;

            yield put({
              type: 'setChannels',
              payload: { data: { id: roomId, newMessagesCount } },
            });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *afterMessageSending({ payload }: Action, { put, select }: Effects) {
      try {
        const { roomId, threadId } = payload;
        const { profiles } = yield select(({ global }: any) => global);
        const composed = msgConverter(payload, profiles);

        if (payload.file) {
          // if the payload has fileId, don't need to call `afterMessageSending` action
          return;
        }

        if (!threadId) {
          yield put({ type: 'appendMessage', payload: { roomId, message: composed } });
        } else {
          yield put({
            type: 'appendReply',
            payload: { roomId, parentId: threadId, reply: composed },
          });
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeUpdateBroadcast({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.UpdateBroadcast);

        while (true) {
          const data = yield take(socketChannel);

          if (data) {
            const { payload } = data;
            yield put({ type: 'afterMessageUpdating', payload });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeUpdateError({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.updateError);

        while (true) {
          const data = yield take(socketChannel);
          notification.open({ message: data.error, type: 'error' });
        }
      } catch (error) {
        throw error;
      }
    },

    *afterMessageUpdating({ payload }: Action, { put, select }: Effects) {
      const { id, updatedAt, message, threadId } = payload;

      if (threadId) {
        yield put({
          type: 'updateReply',
          payload: {
            messageId: id,
            updates: { text: message, updatedAt, isModified: true },
          },
        });
      } else {
        yield put({
          type: 'updateMessage',
          payload: {
            messageId: id,
            updates: { text: message, updatedAt, isModified: true },
          },
        });
      }
    },

    *subscribeDeleteMessageBroadCast({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.DeletedBroadcast);

        while (true) {
          const { payload } = yield take(socketChannel);

          if (payload) {
            if (!payload.threadId) {
              if (payload.threadInformation) {
                yield put({
                  type: 'updateMessage',
                  payload: { messageId: payload.id, updates: { isDeleted: true } },
                });
              } else {
                yield put({ type: 'afterMessageDeleting', payload });
              }
            } else {
              yield put({ type: 'afterReplyDeleting', payload });
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeDeleteMessageError({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.DeleteError);

        while (true) {
          const data = yield take(socketChannel);
          notification.open({ message: data.error, type: 'error' });
        }
      } catch (error) {
        throw error;
      }
    },

    *cancelUpload({ payload }: Action, { put }: Effects) {
      try {
        yield put({ type: 'fileUpload/cancelUpload' });
      } catch (error) {
        throw error;
      }
    },

    *subscribeDraftCreateBroadcast({ payload }: Action, { call, take, put, select }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.DraftCreateBroadcast);

        while (true) {
          const { payload } = yield take(socketChannel);
          const openChannel: Channel = yield select((state: any) => state.channel.channel);

          if (payload) {
            if (!payload.threadId) {
              yield put({
                type: 'setChannels',
                payload: {
                  data: {
                    id: payload.roomId,
                    draft: payload.message,
                    draftId: payload.id,
                    draftThreadId: payload.threadId,
                  },
                },
              });
            }

            if (!payload.threadId && openChannel.id === payload.roomId) {
              yield put({
                type: 'setChannel',
                payload: {
                  data: {
                    id: payload.roomId,
                    draft: payload.message,
                    draftId: payload.id,
                    draftThreadId: payload.threadId,
                  },
                },
              });
            }
            yield put({
              type: 'setDrafts',
              payload,
            });

            yield put({ type: 'draftsGroup' });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeUpdateDraftBroadcast(action: Action, { call, take, put, select }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.UpdateDraftsBroadcast);

        while (true) {
          const { payload } = yield take(socketChannel);
          const openChannel: Channel = yield select((state: any) => state.channel.channel);
          if (payload) {
            if (!payload.threadId) {
              yield put({
                type: 'setChannels',
                payload: {
                  data: {
                    id: payload.roomId,
                    draft: payload.message,
                    draftId: payload.id,
                    draftThreadId: payload.threadId,
                  },
                },
              });
            }

            if (!payload.threadId && openChannel.id === payload.roomId) {
              yield put({
                type: 'setChannel',
                payload: {
                  data: {
                    id: payload.roomId,
                    draft: payload.message,
                    draftId: payload.id,
                    draftThreadId: payload.threadId,
                  },
                },
              });
            }
          }
          yield put({ type: 'draftsGroup' });
          yield put({ type: 'updateDraftsAfterUpdate', payload });
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeDeleteDraftBroadcast(action: Action, { call, take, put, select }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.DeleteDraftsBroadcast);

        while (true) {
          const { payload } = yield take(socketChannel);
          const openChannel: Channel = yield select((state: any) => state.channel.channel);

          if (payload) {
            if (!payload.threadId) {
              yield put({
                type: 'setChannels',
                payload: { data: { id: payload.roomId, draft: '', draftId: '', isDrafted: false } },
              });
            }

            if (!payload.threadId && openChannel.id === payload.roomId) {
              yield put({
                type: 'setChannel',
                payload: {
                  data: {
                    id: payload.roomId,
                    draft: '',
                    draftId: '',
                    isDrafted: false,
                  },
                },
              });
            }
          }
          yield put({
            type: 'updateDraftsAfterDelete',
            payload: payload.id,
          });

          if (payload.threadId) {
            yield put({
              type: 'updateMessageDraft',
              payload: { data: { draftText: '', draftId: '' } },
            });
          }

          yield put({ type: 'draftsGroup' });
        }
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    fetchChannelsSuccess(state: ChannelState, { payload: { channels } }: Action): ChannelState {
      return { ...state, channels };
    },

    setChannel(state: ChannelState, { payload: { data } }: Action): ChannelState {
      return {
        ...state,
        channels: state.channels.map((ch: Channel) => (ch.id !== data.id ? ch : { ...ch, ...data })),
        channel: { ...state.channel, ...data },
      };
    },

    updateMessageDraft(state: ChannelState, { payload: { data } }: Action): ChannelState {
      return { ...state, message: { ...state.message, ...data } };
    },

    resetChannel(state: ChannelState): ChannelState {
      return { ...state, channel: initialChannel, message: initialMessage };
    },

    resetMessage(state: ChannelState): ChannelState {
      return { ...state, message: initialMessage };
    },

    setChannels(state: ChannelState, { payload: { data } }: Action): ChannelState {
      return {
        ...state,
        channels: state.channels.map((ch: Channel) => (ch.id !== data.id ? ch : { ...ch, ...data })),
      };
    },

    setDraftsSuccess(state: ChannelState, { payload }: Action): ChannelState {
      return { ...state, drafts: payload };
    },

    setDrafts(state: ChannelState, { payload }: Action): ChannelState {
      return { ...state, drafts: [...state.drafts, payload] };
    },

    updateDraftsAfterDelete(state: ChannelState, { payload }: Action): ChannelState {
      return { ...state, drafts: filter(state.drafts, (draft) => draft.id !== payload) };
    },

    updateDraftsAfterUpdate(state: ChannelState, { payload }: Action): ChannelState {
      return {
        ...state,
        drafts: state.drafts
          ? state.drafts.map((draft: Draft) => {
              return draft.id !== payload.id ? draft : { ...draft, ...payload };
            })
          : [],
      };
    },

    removeChannel(state: ChannelState, { payload: { id } }: Action) {
      return {
        ...state,
        channel: {},
        channels: filter(state.channels, (channel) => channel.id !== id),
      };
    },

    setMessage(state: ChannelState, { payload: { channelId, messageId } }: Action): ChannelState {
      const channel: Channel | undefined =
        state.channel || find(state.channels, (channel: Channel) => channel.id === channelId);
      const { drafts } = state;
      let message: any = null;
      let draft: Draft | undefined;

      if (channel) {
        message = find(channel.messages, (msg) => msg.id === messageId);
      }

      if (message) {
        draft = find(drafts, (draft) => draft.threadId === messageId);
      }

      return {
        ...state,
        message: message
          ? {
              ...message,
              draftId: draft && draft.threadId && draft.id,
              draftText: draft && draft.threadId && draft.message,
            }
          : null,
      };
    },

    setReplyEditable(state: ChannelState, { payload: { messageId } }: Action): ChannelState {
      return {
        ...state,
        message: {
          id: state.message?.id,
          ...state.message,
          replies: state.message?.replies
            ? state.message.replies.map((reply: Message) => ({ ...reply, editable: reply.id === messageId }))
            : [],
        },
      };
    },

    updateReply(state: ChannelState, { payload: { messageId, updates } }: Action): ChannelState {
      const updatedUpdates = { ...updates, editable: false };

      return {
        ...state,
        message: {
          ...state.message,
          replies:
            state.message && state.message.replies
              ? state.message.replies.map((reply: Message) => {
                  return reply.id !== messageId ? reply : { ...reply, ...updatedUpdates };
                })
              : [],
        },
      };
    },

    appendMessage(state: ChannelState, { payload: { roomId, message } }: Action) {
      const channel: Channel | null = state.channel || null;
      const messages = channel && channel.messages ? channel.messages : [];

      return {
        ...state,
        channel: !channel
          ? null
          : channel.id !== roomId
          ? channel
          : {
              ...state.channel,
              messages: [...messages, message],
            },
      };
    },

    updateMessage(state: ChannelState, { payload: { messageId, updates } }: Action): ChannelState {
      const updatedUpdates = { ...updates, editable: false };

      return {
        ...state,
        editableMessageIdx: -1,
        message: state.message
          ? state.message.id !== messageId
            ? state.message
            : { ...state.message, ...updatedUpdates }
          : null,
        channel: {
          ...state.channel,
          messages:
            state.channel && state.channel.messages
              ? state.channel.messages.map((message: Message) => {
                  return message.id !== messageId ? message : { ...message, ...updatedUpdates };
                })
              : [],
        },
      };
    },

    setMessageEditable(state: ChannelState, { payload: { messageId } }: Action): ChannelState {
      const idx = findIndex(state.channel.messages, (message: Message) => message.id === messageId);
      return {
        ...state,
        editableMessageIdx: idx,
        message: state.message ? { ...state.message, editable: state.message.id === messageId } : initialMessage,
        channel: {
          ...state.channel,
          messages:
            state.channel && state.channel.messages
              ? state.channel.messages.map((message: Message) => ({ ...message, editable: message.id === messageId }))
              : [],
        },
      };
    },

    fetchRepliesSuccess(state: ChannelState, { payload: { parentId, replies } }: Action): ChannelState {
      const channel = state.channel || initialMessage;
      const messages = (state.channel && state.channel.messages) || [];
      const message = state.message || initialMessage;
      const updatedReplies = replies.map((reply: any) => ({ ...reply, parentId }));

      return {
        ...state,
        message: message.id !== parentId ? message : { ...message, replies: updatedReplies },
        channel: {
          ...channel,
          messages: messages.map((message) => {
            return message.id !== parentId ? message : { ...message, replies: updatedReplies };
          }),
        },
      };
    },

    afterMessageDeleting(state: ChannelState, { payload: { id } }: Action): ChannelState {
      const rowHeights = state.rowHeights.filter((row: any) => row.id !== id);
      const channel = state.channel;

      return {
        ...state,
        rowHeights,
        vListHeight: reduce(rowHeights, (sum, row: any) => sum + row.height, 0),
        channel: {
          ...channel,
          messages: channel && channel.messages ? filter(state.channel.messages, (msg) => msg.id !== id) : [],
        },
      };
    },

    afterReplyDeleting(state: ChannelState, { payload: { id, createdBy, threadId } }: any): ChannelState {
      const authorMessagesCount: number | undefined = state.message?.replies
        ?.map((reply: any) => reply.author.id)
        .filter((id: string) => id === createdBy).length;

      const idx: number = findIndex(state.channel.messages, (message: Message) => message.id === threadId);

      return {
        ...state,
        replyDeletedMessageIdx: idx,
        message: {
          ...state.message,
          replies: state.message?.replies ? state.message.replies.filter((reply: Message) => reply.id !== id) : [],
        },
        channel: {
          ...state.channel,
          messages:
            state.channel && state.channel.messages
              ? state.channel.messages.map((message: any) => {
                  return message.id !== threadId
                    ? message
                    : {
                        ...message,
                        replies: state.message?.replies
                          ? state.message.replies.filter((reply: Message) => reply.id !== id)
                          : [],
                        threadInfo: updateThreadInfo(message, authorMessagesCount, createdBy),
                      };
                })
              : [],
        },
      };
    },

    appendReply(state: ChannelState, { payload: { roomId, parentId, reply } }: Action): ChannelState {
      const channel = state.channel;
      const message = (state.message && state.message) || initialMessage;
      const messages = (channel && channel.messages) || [];
      const replies = (state.message && state.message.replies) || [];
      const updatedReply = { ...reply, parentId };
      const idx = findIndex(state.channel.messages, (message: Message) => message.id === parentId);

      return {
        ...state,
        repliedMessageIdx: idx,
        message: message.id !== parentId ? message : { ...message, replies: [...replies, updatedReply] },
        channel:
          channel.id !== roomId
            ? channel
            : {
                ...state.channel,
                messages: messages.map((message: Message) => {
                  if (message.id === parentId) {
                    return {
                      ...message,
                      replies: [...replies, updatedReply],
                      threadInfo: {
                        count: message.threadInfo ? message.threadInfo.count + 1 : 1,
                        authors: message.threadInfo ? [...message.threadInfo.authors, reply.author] : [reply.author],
                        lastMessageAt: new Date(),
                      },
                    };
                  }

                  return message;
                }),
              },
      };
    },

    draftsGroup(state: ChannelState, { payload }: Action): ChannelState {
      return {
        ...state,
        channels: state.channels.map((ch: Channel) => ({ ...ch, isDrafted: Boolean(ch.draft) })),
      };
    },

    setChannelsStatus(state: ChannelState, { payload }: Action): ChannelState {
      if (!(payload && payload.length)) {
        return state;
      }

      return {
        ...state,
        channels: state.channels.map((channel) => threadStatusAssign(payload, channel)),
        channel: threadStatusAssign(payload, state.channel),
      };
    },

    setPageInfo(state: ChannelState, { payload: { pageInfo } }: Action): ChannelState {
      return { ...state, pageInfo };
    },

    setTypingStatus(state: ChannelState, { payload }: Action): ChannelState {
      return {
        ...state,
        channels: state.channels.map((channel) => assignTypingStatus(payload, channel)),
        channel: assignTypingStatus(payload, state.channel),
      };
    },

    setRowHeights(state: ChannelState, { payload: { rowHeights } }: Action): ChannelState {
      return {
        ...state,
        rowHeights,
        vListHeight: reduce(rowHeights, (sum, row: any) => sum + row.height, 0),
      };
    },

    addRowHeight(state: ChannelState, { payload: { id, height } }: Action): ChannelState {
      const rowHeights = state.rowHeights;
      rowHeights.push({ id, height });

      return {
        ...state,
        rowHeights,
        vListHeight: reduce(rowHeights, (sum, row: any) => sum + row.height, 0),
      };
    },

    initState(state: ChannelState, { payload }: Action): ChannelState {
      return { ...initialState, ...payload };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ pathname }: Location) => {
        if (!(pathname.indexOf(Routes.Login) === -1)) {
          dispatch({ type: 'initState' });
        }
      });
    },
  },
  // tslint:disable-next-line:max-file-line-count
};
