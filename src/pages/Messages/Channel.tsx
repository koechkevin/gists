import { FileUploadModal, MessageInput } from '@aurora_app/ui-library';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/pro-light-svg-icons';
import { RcFile } from 'antd/lib/upload';
import { connect } from 'dva';
import { debounce, isEmpty } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useMeasure, useMedia } from 'react-use';

import { Dispatch } from '../../models/dispatch';
import { UserProfile } from '../../models/user';
import { getUnreadMessageIds } from '../../utils/dataFormat';
import { dmUsers, getColorValue, getIconType, setChatHeaderTitle } from '../../utils/utils';
import { MessageList } from './containers';
import Replies from './containers/Replies';
import { Channel as ChannelTyped, Message, User } from './models/typed';

import { ChatColors } from '../../utils/constants';
import styles from './Channel.module.scss';

let timeout: any;

interface Props {
  match: any;
  auth: any;
  location: any;
  message: Message;
  channel: ChannelTyped;
  profile: UserProfile;
  showFileUploadModal: boolean;
  subscribe: () => void;
  unsubscribe: () => void;
  resetChannel: () => void;
  selectThread: (roomId: string) => void;
  onCollapse: (collapsed: boolean) => void;
  markMessagesAsRead: (messageIds: string[]) => void;
  sendMessage: (text: string, cb: () => void) => void;
  saveDraft: (channelId: string, text: string) => void;
  toShowModal: (modal: string, visible: boolean) => void;
  setMessage: (channelId: string) => (msgId: string) => void;
  updateTypingStatus: (isTyping: boolean, roomId: string) => void;
  updateRowHeight: (id: string, height: number, idx: number) => void;
  updateDraft: (channelId: string, text: string, draftId: string) => void;
  deleteDraft: (channelId: string, text: string, draftId: string) => void;
  sendMessageWithFile: (roomId: string, file: RcFile, text: string, threadId?: string) => void;
  handlePageTitle: (
    title?: string,
    statusIcon?: IconDefinition,
    iconColor?: string,
    jobPosition?: string,
    isManyUsers?: boolean,
  ) => void;
}

const Channel: FC<Props> = (props) => {
  const {
    match,
    message,
    channel,
    profile,
    location,
    subscribe,
    saveDraft,
    toShowModal,
    updateDraft,
    unsubscribe,
    sendMessage,
    resetChannel,
    deleteDraft,
    setMessage,
    onCollapse,
    selectThread,
    handlePageTitle,
    markMessagesAsRead,
    updateTypingStatus,
    showFileUploadModal,
    sendMessageWithFile,
  } = props;
  const { id } = match.params;
  const { messages, members, type } = channel;
  const icon: IconDefinition = getIconType(members, profile, type);
  const title: string = setChatHeaderTitle(members, profile);
  const iconColor: string = getColorValue(members, profile, type);
  const signature: string = dmUsers(members, profile) && dmUsers(members, profile).signature;
  const isManyUsers: boolean | undefined = members && members.length > 2;

  const isMobile = useMedia('(max-width: 575px)');
  const [file, setFile] = useState<RcFile>();
  const [messageId, setMessageId] = useState<string>();
  const [ref, { width, height }] = useMeasure();
  const [newText, setNewText] = useState(channel.draft);
  const existingDraftId = useRef(channel.draftId);
  const draftText = useRef(newText);
  const roomId = useRef(channel.id);

  const roomMembers = members
    ? members.map((member) => {
        if (member.id === profile.profileId) {
          return {
            ...member,
            icon: faCircle,
            iconColor: ChatColors.OnlineGreen,
          };
        }

        return {
          ...member,
          icon: getIconType([member], profile, type),
          iconColor: getColorValue([member], profile, type),
        };
      })
    : [];

  useEffect(() => {
    isMobile && onCollapse(false);
  }, [isMobile, onCollapse, location]);

  useEffect(() => {
    handlePageTitle(title ? title : 'Notes', icon, iconColor, signature, isManyUsers);
  }, [handlePageTitle, title, icon, iconColor, signature, isManyUsers]);

  useEffect(() => {
    draftText.current = '';
    existingDraftId.current = channel.draftId;
    roomId.current = channel.id;
  }, [channel.id, channel.draftId]);

  const clearDraft = useCallback(() => {
    setNewText('');
    draftText.current = '';
    existingDraftId.current = '';
    roomId.current = '';
  }, [setNewText]);

  const saveDraftMsg = useCallback(
    (channelId: any, text: any, draftId: any) => {
      if (text && !draftId && channelId) {
        saveDraft(channelId, text);
        clearDraft();
      } else if (text && draftId && channelId) {
        updateDraft(channelId, text, draftId);
        clearDraft();
      }
    },
    [saveDraft, updateDraft, clearDraft],
  );
  const activeUser = channel?.members?.find((member: User) => member.id === profile.profileId);
  const debounceAction = debounce((text: string) => onChangeActions(text, activeUser), 100);

  const onChangeActions = useCallback(
    (text: any, activeUser?: User) => {
      if (roomId.current && !text && existingDraftId.current) {
        deleteDraft(roomId.current, text, existingDraftId.current);
        existingDraftId.current = '';
      }
      setNewText(text);
      draftText.current = text;

      // if not already typing, update to typing
      if (activeUser && !activeUser.isTyping) {
        updateTypingStatus(true, roomId.current);
      }

      // when user stops typing for 1 second, update as not typing
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateTypingStatus(false, roomId.current);
      }, 1000);
    },
    [updateTypingStatus, deleteDraft, setNewText],
  );

  useEffect(() => {
    if (id) {
      subscribe();
      selectThread(id);
    }

    return () => unsubscribe();
  }, [subscribe, selectThread, unsubscribe, id]);

  useEffect(() => {
    if (roomId.current && draftText.current) {
      saveDraftMsg(roomId.current, draftText.current, existingDraftId.current);
    }
  }, [saveDraftMsg, id]);

  useEffect(() => {
    const allUnread = getUnreadMessageIds(messages, profile);

    if (id && allUnread.length) {
      markMessagesAsRead(allUnread);
    }
  }, [messages, id, markMessagesAsRead, profile]);

  // save any draft message when unmount happens e.g clicking a job application
  useEffect(() => {
    return () => {
      if (roomId.current && draftText.current) {
        saveDraftMsg(roomId.current, draftText.current, existingDraftId.current);
        resetChannel();
      }
    };
  }, [resetChannel, saveDraftMsg]);

  const handleUpload = (file: RcFile, messageId?: string, text?: string) => {
    setFile(file);
    setMessageId(messageId);
    toShowModal('showFileUploadModal', true);

    if (text) {
      onChangeActions(text, activeUser);
    }
  };

  const handleSubmit = (text: string): void => {
    if (file) {
      sendMessageWithFile(id, file, text, messageId);
    }

    clearDraft();
    toShowModal('showFileUploadModal', false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.chat}>
        <div className={styles.chatContent} ref={ref}>
          <MessageList threadId={channel.id} listHeight={height} listWidth={width} startThread={setMessage(id)} />
        </div>
        <div className={styles.inputWrapper}>
          {!isEmpty(channel) && (
            <MessageInput
              hintShown
              key={channel.id}
              text={channel.draft}
              onUpload={handleUpload}
              suggestions={roomMembers}
              onChange={(text: string) => debounceAction(text)}
              onEnter={(text: string) =>
                sendMessage(text, () => {
                  debounceAction.cancel();
                  clearDraft();
                })
              }
            />
          )}
        </div>
      </div>
      {message && message.id && <Replies channel={channel} match={match} handleUpload={handleUpload} />}
      <FileUploadModal
        file={file}
        text={newText}
        onOk={handleSubmit}
        visible={showFileUploadModal}
        onCancel={() => toShowModal('showFileUploadModal', false)}
      />
    </div>
  );
};

const mapStateToProps = ({ channel, common, global }: any) => ({
  auth: global.auth,
  profile: global.profile,
  showFileUploadModal: common.showFileUploadModal,
  ...channel,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  subscribe() {
    dispatch({ type: 'channel/subscribe' });
  },

  unsubscribe() {
    dispatch({ type: 'channel/unsubscribe' });
  },

  onCollapse: (collapsed: boolean) => {
    dispatch({ type: 'global/changeMenuCollapsed', payload: collapsed });
  },

  selectThread(id: string) {
    dispatch({ type: 'channel/selectChannel', payload: { id } });
  },

  resetChannel() {
    dispatch({ type: 'channel/resetChannel', payload: {} });
  },

  markMessagesAsRead(messageIds: string[]) {
    dispatch({ type: 'channel/markMessagesAsRead', payload: messageIds });
  },

  sendMessage(text: number, cb: () => void) {
    dispatch({ type: 'channel/socketSendMessage', payload: { text } }).then(cb);
  },

  sendMessageWithFile(roomId: string, file: RcFile, text: string, threadId?: string) {
    dispatch({
      type: 'channel/sendMessageWithFile',
      payload: { roomId, file, text, threadId },
    });
  },

  setMessage(channelId: string) {
    return (messageId: string) => {
      dispatch({ type: 'channel/setMessage', payload: { channelId, messageId } });
    };
  },

  saveDraft(channelId: string, text: string) {
    dispatch({ type: 'channel/setChannels', payload: { data: { id: channelId, draft: text } } });
    dispatch({ type: 'channel/createDraftMessages', payload: { id: channelId, message: text } });
  },

  toShowModal(modal: string, visible: boolean) {
    dispatch({ type: 'common/showOrHideModal', modal, payload: visible });
  },

  updateDraft(channelId: string, text: string, draftId: string) {
    dispatch({
      type: 'channel/updateDraftMessages',
      payload: { id: channelId, draftId, message: text },
    });
  },

  deleteDraft(channelId: string, text: string, draftId: string) {
    dispatch({ type: 'channel/draftsGroup' });
    dispatch({
      type: 'channel/deleteDraftMessages',
      payload: { id: channelId, draftId },
    });
  },

  updateTypingStatus: (isTyping: boolean, roomId: string) => {
    dispatch({ type: 'channel/updateTypingStatus', payload: { isTyping, roomId } });
  },

  handlePageTitle(
    title: string,
    statusIcon: IconDefinition,
    iconColor: string,
    jobPosition: string,
    isManyUsers: boolean,
  ) {
    dispatch({
      type: 'global/changeHeaderTitle',
      payload: {
        title,
        statusIcon,
        iconColor,
        jobPosition,
        isManyUsers,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
