import { HoverMenu, MessageEditableItem, MessageItem, MoreActionsMenu } from '@aurora_app/ui-library';
import { faPencil, faTrash } from '@fortawesome/pro-regular-svg-icons';
import React, { FC } from 'react';

import { UserProfile } from '../../../models/user';
import { Message } from '../../../pages/Messages/models/typed';
import { formatMsgMenu } from '../../../utils/utils';

interface HoverMenuProps {
  message: Message;
  profile: UserProfile;
  setEditable: (message: Message) => void;
  setRemovable: (message: Message) => void;
  setShareable: (message: Message) => void;
}

const HoverMenuRender: FC<HoverMenuProps> = (props) => {
  const { message, profile, setEditable, setRemovable } = props;
  const menu = formatMsgMenu(profile, setEditable, faTrash, setRemovable, faPencil, message);

  return <HoverMenu actionMenu={<MoreActionsMenu message={message} menu={menu} isResponsive={true} />} />;
};

interface MessageItem {
  message: any;
  profile: UserProfile;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  setRemovable: (message: Message) => void;
  setShareable: (message: Message) => void;
  updateMessage: (messageId?: string) => (text: string) => void;
}

const ReplyMessageItem: FC<MessageItem> = (props) => {
  const { message, profile, setEditable, unsetEditable, setRemovable, setShareable, updateMessage } = props;
  const { editable } = message;

  let component: React.ReactNode = <span />;

  if (editable) {
    component = <MessageEditableItem cancel={unsetEditable} save={updateMessage(message.id)} {...message} />;
  } else {
    component = (
      <MessageItem
        menuShown={true}
        poppedMenu={
          <HoverMenuRender
            message={message}
            profile={profile}
            setEditable={setEditable}
            setRemovable={setRemovable}
            setShareable={setShareable}
          />
        }
        {...message}
      />
    );
  }

  return <>{component}</>;
};

export default ReplyMessageItem;
