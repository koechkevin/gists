import {
  DateDivisionLine,
  MessageEditableItem,
  MessageItem,
  MessageTextualItem,
  NewMessageDivider,
} from '@aurora_app/ui-library';
import { uniqBy } from 'lodash';
import React, { FC } from 'react';

import { FileModel } from '../../../../models/file';
import { UserProfile } from '../../../../models/user';
import { MessagePermissionType } from '../../../../utils/constants';
import { Message, MessageRender } from '../../models/typed';
import HoverMenu from './HoverMenu';
import PrivateMessageItem from './PrivateMessageItem';

interface Props {
  message: MessageRender;
  profile: UserProfile;
  onDownload: (file: FileModel) => void;
  startThread: (messageId: string) => void;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  setRemovable: (message: Message) => void;
  setShareable: (message: Message) => void;
  onCancel: (message: Message, file: FileModel) => void;
  updateMessage: (messageId: string) => (text: string) => void;
}

export const MessageItemRender: FC<Props> = (props) => {
  const {
    message,
    profile,
    onCancel,
    onDownload,
    startThread,
    setEditable,
    unsetEditable,
    setRemovable,
    setShareable,
    updateMessage,
  } = props;
  const { threadInfo, repeated, divided, createdAt, type, editable, unReadMessage } = message;

  if (threadInfo && threadInfo.authors) {
    threadInfo.authors = uniqBy(threadInfo.authors, (author: any) => author.id);
  }

  let timeLine = <span />;
  let unreadLine = <span />;

  if (divided) {
    timeLine = <DateDivisionLine dateTime={new Date(createdAt)} />;
  }

  if (unReadMessage) {
    unreadLine = <NewMessageDivider />;
  }

  let component: any = null;

  if (type === MessagePermissionType.PRIVATE) {
    component = <PrivateMessageItem {...message} />;
  }

  if (editable) {
    component = <MessageEditableItem cancel={unsetEditable} save={updateMessage(message.id)} {...message} />;
  } else {
    if (repeated) {
      component = (
        <MessageTextualItem
          menuShown={true}
          onDownload={onDownload}
          onCancel={(file: FileModel) => onCancel(message, file)}
          poppedMenu={
            <HoverMenu
              message={message}
              profile={profile}
              startThread={startThread}
              setEditable={setEditable}
              setRemovable={setRemovable}
              setShareable={setShareable}
            />
          }
          {...message}
        />
      );
    } else {
      component = (
        <MessageItem
          menuShown={true}
          onDownload={onDownload}
          startThread={startThread}
          onCancel={(file: FileModel) => onCancel(message, file)}
          poppedMenu={
            <HoverMenu
              message={message}
              profile={profile}
              startThread={startThread}
              setEditable={setEditable}
              setRemovable={setRemovable}
              setShareable={setShareable}
            />
          }
          {...message}
        />
      );
    }
  }

  return (
    <>
      {unreadLine}
      {timeLine}
      {component}
    </>
  );
};

export default MessageItemRender;
