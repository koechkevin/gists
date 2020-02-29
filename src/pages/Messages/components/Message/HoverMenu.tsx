import { HoverMenu as Menu, MoreActionsMenu, StartThreadMenu } from '@aurora_app/ui-library';
import { faPencil, faTrash } from '@fortawesome/pro-regular-svg-icons';
import React, { FC } from 'react';

import { formatMsgMenu } from '../../../../utils/utils';

import { UserProfile } from '../../../../models/user';
import { Message } from '../../models/typed';

interface Props {
  message: Message;
  profile: UserProfile;
  startThread: (messageId: string) => void;
  setEditable: (message: Message) => void;
  setRemovable: (message: Message) => void;
  setShareable: (message: Message) => void;
}

export const HoverMenu: FC<Props> = (props) => {
  const { message, profile, startThread, setEditable, setRemovable } = props;
  const menu = formatMsgMenu(profile, setEditable, faTrash, setRemovable, faPencil, message);

  return (
    <Menu
      startThreadMenu={<StartThreadMenu messageId={message.id} startThread={startThread} />}
      actionMenu={<MoreActionsMenu message={message} menu={menu} isResponsive={true} />}
    />
  );
};

export default HoverMenu;
