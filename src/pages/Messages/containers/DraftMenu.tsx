import { ChannelMenu } from '@aurora_app/ui-library';
import { ChatStatus } from '@aurora_app/ui-library/lib/utils';
import { faPencil } from '@fortawesome/pro-light-svg-icons';
import { faCircle as faCircleOutline } from '@fortawesome/pro-regular-svg-icons';
import { faCircle, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'dva';
import { matchPath } from 'dva/router';
import React, { FC } from 'react';

import { Routes } from '../../../routes';
import { ChannelTypes, ChatColors } from '../../../utils/constants';
import { dmUsers } from '../../../utils/utils';
import { Channel } from '../models/typed';

interface Props {
  channels: Channel[];
  channel: Channel;
  profile: any;
}

const DraftMenu: FC<Props> = (props) => {
  const { channels, channel, profile } = props;
  const { pathname } = window.location;
  const match = matchPath(pathname, {
    path: `${Routes.Candidate}/:id`,
  });
  const companyId: string = match ? (match.params as any).id : null;

  /* if online and currently open chat, return onlineDisplay property,
   * else return offlineDisplay property if currently open but offline
   * by default display defaultDisplay property
   * the property can be icon height, width or icon type
   */
  const changeIcon = (
    room: Channel,
    onlineDisplay: IconDefinition | number,
    offlineDisplay: IconDefinition | number,
    defaultDisplay: IconDefinition | number,
  ): IconDefinition | number => {
    const user = dmUsers(room.members, profile);
    if (typeof user === 'number' && room.id !== channel.id) {
      return defaultDisplay;
    } else {
      const icon =
        room.id === channel.id &&
        dmUsers(room.members, profile) &&
        dmUsers(room.members, profile).chatStatus === ChatStatus.online
          ? onlineDisplay
          : room.id === channel.id && dmUsers(room.members, profile)
          ? offlineDisplay
          : defaultDisplay;
      return icon;
    }
  };

  const filteredChannels = channels
    .filter((msgRoom: Channel) => {
      const drafted = msgRoom.isDrafted && msgRoom.companyId === companyId;
      const botDraft = msgRoom.type === ChannelTypes.SelfMessage && msgRoom.isDrafted;
      const selfMsgDraft = msgRoom.type === ChannelTypes.ChatBotMessage && msgRoom.isDrafted;

      return drafted || botDraft || selfMsgDraft;
    })
    .map((room: Channel) => ({
      ...room,
      name: room.name ? room.name : room.currentUser,
      icon: changeIcon(room, faCircle, faCircleOutline, faPencil),
      isMyAccount: room.type === ChannelTypes.SelfMessage ? true : false,
      iconColor:
        room.id === channel.id &&
        dmUsers(room.members, profile) &&
        dmUsers(room.members, profile).chatStatus === ChatStatus.online
          ? ChatColors.OnlineGreen
          : null,
      lock: false,
      path: `/app/candidate/${companyId}/channel/${room.id}`,
      tooltip: room.name && room.name.split(',').length > 1 ? room.name : '',
      iconHeight: changeIcon(room, 11, 11, 16),
      iconWidth: changeIcon(room, 11, 11, 16),
      count:
        dmUsers(room.members, profile) && typeof dmUsers(room.members, profile) === 'number' && room.id === channel.id
          ? dmUsers(room.members, profile)
          : undefined,
    }));

  const updatedChannelList = filteredChannels.map((item) => ({
    ...item,
    iconColor:
      channel && item.isMyAccount && item.id === channel.id
        ? ChatColors.OnlineGreen
        : item.type === ChannelTypes.ChatBotMessage && item.id === channel.id
        ? ChatColors.ChatBotBlue
        : item.iconColor,
    icon:
      (channel && item.isMyAccount && item.id === channel.id) ||
      (item.type === ChannelTypes.ChatBotMessage && item.id === channel.id)
        ? faCircle
        : item.icon,
    iconHeight: channel && item.isMyAccount && item.id === channel.id ? 9 : item.iconHeight,
    iconWidth: channel && item.isMyAccount && item.id === channel.id ? 0 : item.iconWidth,
    tooltip: item.isMyAccount ? item.currentUser + ' (me)' : item.tooltip,
    name: item.isMyAccount ? 'Notes (me)' : item.name,
  }));

  const list: any[] = [...updatedChannelList];

  if (!list.length) {
    return null;
  }

  return <ChannelMenu list={list} title="Drafts" style={{ backgroundColor: '#282828' }} key={2} />;
};

const mapStateToProps = ({ channel, global }: any) => ({
  channels: channel.channels,
  channel: channel.channel,
  profile: global.profile,
});

export default connect(mapStateToProps)(DraftMenu);
