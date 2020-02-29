import { Icon, MessageInput, MessageItem } from '@aurora_app/ui-library';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { Layout, Row } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { connect } from 'dva';
import { debounce, find } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useOrientation } from 'react-use';

import { Dispatch } from '../../../models/dispatch';
import { UserProfile } from '../../../models/user';
import { ChatColors } from '../../../utils/constants';
import { getColorValue, getIconType } from '../../../utils/utils';
import { ReplyMessageList } from '../../Messages';
import { DirectMessageChannel, Draft, Message, User } from '../models/typed';
import styles from './Replies.module.scss';

let timeout: any;

interface Props {
  match: any;
  message: Message;
  profile: UserProfile;
  drafts: Draft[];
  channel: DirectMessageChannel;
  fetchReplies: () => void;
  closeReply: () => void;
  resetMessage: () => void;
  send: (text: string) => void;
  modalShow: (modalName: string) => void;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  updateReply: () => (messageId: string) => (text: string) => void;
  updateTypingStatus: (isTyping: boolean, roomId: string) => void;
  handleUpload: (file: RcFile, threadId?: string, text?: string) => void;
  saveDraft: (threadId: string, text: string, draftThreadId: string) => void;
  deleteDraft: (threadId: string, text: string, draftId: string, draftThreadId: string) => void;
  updateDraft: (threadId: string, text: string, draftId: string, draftThreadId: string) => void;
}

const Replies: React.FC<Props> = (props) => {
  const {
    send,
    channel,
    message,
    profile,
    drafts,
    closeReply,
    saveDraft,
    updateDraft,
    deleteDraft,
    fetchReplies,
    resetMessage,
    deleteMessage,
    setEditable,
    unsetEditable,
    updateReply,
    handleUpload,
    updateTypingStatus,
  } = props;
  const replies = message.replies || [];
  const lastUpdatedAt = replies.length > 0 ? replies[replies.length - 1].updatedAt : 0;

  const myRef = useRef<any>(null);
  const checkSave = useRef(true);
  const orientation = useOrientation();
  const messageId = useRef(message.id);
  const draftText = useRef(message.draftText);
  const messageThreadId = useRef(message.threadId);
  const messageDraftId = useRef(message.draftId);
  const [clearId, setClearId] = useState(false);

  const activeUser = channel?.members?.find((member: User) => member.id === profile.profileId);
  const debounceAction = debounce(
    (text: string) =>
      onChangeActions(messageThreadId.current, text, messageDraftId.current, messageId.current, activeUser),
    100,
  );

  const sendMessage = (text: string) => {
    send(text);
    checkSave.current = false;
    debounceAction.cancel();
    messageDraftId.current = '';
  };

  const clearDraft = useCallback(() => {
    messageThreadId.current = '';
    messageDraftId.current = '';
    messageId.current = '';
    draftText.current = '';
  }, []);

  const saveDraftMsg = useCallback(
    (channelId: any, text: any, draftId: any, draftThreadId: any) => {
      if (text && !draftId && draftThreadId) {
        saveDraft(channelId, text, draftThreadId);
        clearDraft();
      } else if (text && draftId && channelId && draftThreadId) {
        updateDraft(channelId, text, draftId, draftThreadId);
        clearDraft();
      }
    },
    [saveDraft, updateDraft, clearDraft],
  );

  useEffect(() => {
    const draft: Draft | undefined = find(drafts, (draft) => draft.threadId === message.id);
    messageDraftId.current = draft?.id;
    draftText.current = '';
  }, [drafts, message.id]);

  useEffect(() => {
    if (draftText.current) {
      saveDraftMsg(messageThreadId.current, draftText.current, messageDraftId.current, messageId.current);
    }

    messageThreadId.current = message.threadId;
    messageDraftId.current = message.draftId;
    messageId.current = message.id;
  }, [saveDraftMsg, message.id]);

  // save any draft message when unmount happens e.g clicking a job application
  useEffect(() => {
    return () => {
      if (checkSave.current) {
        saveDraftMsg(messageThreadId.current, draftText.current, messageDraftId.current, messageId.current);
        resetMessage();
      }
    };
  }, [resetMessage, saveDraftMsg]);

  const onChangeActions = useCallback(
    (threadId: any, text: any, draftId: any, draftThreadId: any, activeUser?: User) => {
      if (threadId && !text && draftId && draftThreadId) {
        deleteDraft(threadId, text, draftId, draftThreadId);
        setClearId(true);
      }
      draftText.current = text;
      checkSave.current = true;

      // if not already typing, update to typing
      if (activeUser && !activeUser.isTyping) {
        updateTypingStatus(true, threadId);
      }

      // when user stops typing for 1 second, update as not typing
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateTypingStatus(false, threadId);
      }, 1000);
    },
    [updateTypingStatus, deleteDraft],
  );

  const scrollToBottom = () => {
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    if (clearId) {
      messageDraftId.current = '';
    }
  }, [deleteDraft, clearId]);

  const roomMembers =
    channel.members &&
    channel.members.map((member) => {
      if (member.id === profile.profileId) {
        return {
          ...member,
          icon: faCircle,
          iconColor: ChatColors.OnlineGreen,
        };
      }
      return {
        ...member,
        icon: getIconType([member], profile, channel.type),
        iconColor: getColorValue([member], profile, channel.type),
      };
    });

  useEffect(() => {
    if (replies.length) {
      setTimeout(scrollToBottom, 500);
    }
  }, [lastUpdatedAt, orientation]);

  useEffect(() => {
    if (message.id) {
      fetchReplies();
    }
  }, [fetchReplies, message.id]);

  useEffect(() => {
    if (message.id) {
      message.replies = [];
    }
  }, [message.id]);

  return (
    <Layout.Content className={styles.root}>
      <Row className={styles.header}>
        <Icon icon={faChevronLeft} onClick={closeReply} className={styles.back} />
        <h1>Thread</h1>
        <Icon icon={faTimes} hover onClick={closeReply} className={styles.remove} />
      </Row>
      <Row className={styles.body}>
        {message && (
          <MessageItem
            id={message.id}
            file={message.file}
            text={message.text}
            threadInfo={null}
            PopoverMenu={<div />}
            startThread={() => null}
            parentId={message.id}
            author={message.author}
            updatedAt={message.updatedAt}
            createdAt={message.createdAt}
            isDeleted={message.isDeleted}
          />
        )}
        {message && (
          <ReplyMessageList
            messages={replies}
            profile={profile}
            setEditable={setEditable}
            unsetEditable={unsetEditable}
            updateMessage={updateReply}
            deleteMessage={deleteMessage}
          />
        )}
        <div ref={myRef} />
      </Row>
      {channel && myRef && (
        <Row className={styles.footer}>
          <MessageInput
            key={message.id}
            hintShown={true}
            text={message.draftText}
            suggestions={roomMembers}
            onEnter={(text: string) => sendMessage(text)}
            onChange={(text: string) => debounceAction(text)}
            onUpload={(file: RcFile) => handleUpload(file, message.id, message.draftText)}
          />
        </Row>
      )}
    </Layout.Content>
  );
};

const mapStateToProps = ({ channel, global }: any) => ({
  ...channel,
  profile: global.profile,
  drafts: channel.drafts,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchReplies() {
    dispatch({ type: `channel/fetchReplies` });
  },

  closeReply() {
    dispatch({ type: `channel/resetMessage` });
  },

  resetMessage() {
    dispatch({ type: 'channel/resetMessage', payload: {} });
  },

  saveDraft: (threadId: string, text: string, draftThreadId: string) => {
    dispatch({
      type: 'channel/createDraftMessages',
      payload: { id: threadId, message: text, draftThreadId },
    });
  },

  updateDraft: (threadId: string, text: string, draftId: string, draftThreadId: string) => {
    dispatch({
      type: 'channel/updateDraftMessages',
      payload: { id: threadId, draftId, message: text, draftThreadId },
    });
  },

  deleteDraft(threadId: string, text: string, draftId: string, draftThreadId: string) {
    dispatch({ type: 'channel/draftsGroup' });
    dispatch({
      type: 'channel/deleteDraftMessages',
      payload: { id: threadId, draftId, draftThreadId },
    });
  },

  send(text: string) {
    dispatch({ type: `channel/sendReply`, payload: { text } });
  },

  updateTypingStatus: (isTyping: boolean, roomId: string) => {
    dispatch({ type: 'channel/updateTypingStatus', payload: { isTyping, roomId } });
  },

  deleteMessage: (messageId: string) => {
    dispatch({ type: 'channel/socketDeleteMessage', payload: { id: messageId } });
  },

  setEditable(message: Message) {
    dispatch({ type: 'channel/setReplyEditable', payload: { messageId: message.id } });
  },

  unsetEditable(messageId: string) {
    dispatch({
      type: 'channel/updateReply',
      payload: { messageId, updates: { editable: false } },
    });
  },

  updateReply: (messageId: string) => {
    return (text: string) => {
      dispatch({
        type: 'channel/socketUpdateMessage',
        payload: {
          id: messageId,
          text,
          isReply: true,
        },
      });
    };
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Replies);
