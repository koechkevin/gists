import { MessageDeleteModal } from '@aurora_app/ui-library';
import { List } from 'antd';
import React, { createRef, FC, useState } from 'react';

import { UserProfile } from '../../../models/user';
import { Channel, Message } from '../../../pages/Messages/models/typed';
import { formatMessage } from '../../../utils';
import { ReplyMessageItem } from '../components';
import { initialMessage } from '../models/channel';

import styles from '../containers/MessageList.module.scss';

interface Props {
  anchor?: any;
  channels?: Channel[];
  messages?: Message[];
  profile: UserProfile;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  updateMessage: (messageId?: string) => (text: string) => void;
}

export const ReplyMessageList: FC<Props> = (props) => {
  const { anchor, messages, profile, setEditable, unsetEditable, updateMessage, deleteMessage } = props;
  const [id, setId] = useState('');
  const [message, setMessage] = useState<Message>(initialMessage);
  const [modalShown, setModalShown] = useState('');

  const setRemovable = (message: Message): void => {
    message && message.id && setId(message.id);
    message && setMessage(message);
    setModalShown('delete');
  };

  const setShareable = (message: Message): void => {
    // todo
  };

  const refs: Message = messages
    ? messages.reduce((acc, { id }) => {
        id && (acc[id] = createRef());
        return acc;
      }, initialMessage)
    : initialMessage;

  return (
    <>
      <List
        split={false}
        dataSource={formatMessage(messages, profile)}
        className={styles.messageList}
        renderItem={(item: Message) => {
          return (
            <div
              key={item.id}
              className={item.id === anchor ? styles.highlighted : ''}
              ref={item && refs && item.id ? refs[item.id] : ''}
            >
              <ReplyMessageItem
                message={item}
                profile={profile}
                setEditable={setEditable}
                setShareable={setShareable}
                setRemovable={setRemovable}
                updateMessage={updateMessage}
                unsetEditable={unsetEditable}
              />
            </div>
          );
        }}
      />
      <MessageDeleteModal
        message={message}
        visible={modalShown === 'delete'}
        onOk={() => {
          deleteMessage(id);
          setModalShown('');
        }}
        onCancel={() => setModalShown('')}
      />
    </>
  );
};

export default ReplyMessageList;
