import { BaseMenu } from '@aurora_app/ui-library';
import { getFlatMenuKeys } from '@aurora_app/ui-library/lib/utils';
import { connect } from 'dva';
import { matchPath } from 'dva/router';
import { find } from 'lodash';
import React, { FC } from 'react';

import { ChannelTypes } from '../../../../src/utils/constants';
import { Dispatch } from '../../../models/dispatch';
import { Routes } from '../../../routes/Routes';
import { getColorValue, getIconType, setCountValue } from '../../../utils/utils';
import { DirectMessageChannel } from '../models/typed';

import styles from './DirectMessageMenu.module.scss';

interface Props {
  match: any;
  profile: any;
  location: any;
  dispatch: Dispatch;
  channels: DirectMessageChannel[];
  onCollapse: () => void;
}

const DirectMessageMenu: FC<Props> = (props) => {
  const { channels, profile, location } = props;

  const { pathname } = location;
  const match = matchPath(pathname, {
    path: `${Routes.Candidate}/:id?`,
  });
  const companyId = match ? (match.params as any).id : null;

  const list = channels
    .filter((channel: DirectMessageChannel) => {
      const notDrafted = !channel.isDrafted;
      const dmsAndSelfs =
        (channel.type === ChannelTypes.DirectMessage && channel.companyId === companyId) ||
        channel.type === ChannelTypes.SelfMessage ||
        channel.type === ChannelTypes.ChatBotMessage;
      return notDrafted && dmsAndSelfs;
    })
    .map((dmChannel: DirectMessageChannel) => ({
      ...dmChannel,
      name: dmChannel.name,
      lock: false,
      path: `/app/candidate/${companyId}/channel/${dmChannel.id}`,
      isMyAccount: dmChannel.type === ChannelTypes.SelfMessage,
      iconHeight: 11,
      iconWidth: 11,
      icon: getIconType(dmChannel.members, profile, dmChannel.type),
      iconColor: getColorValue(dmChannel.members, profile, dmChannel.type),
      tooltip: dmChannel.name && dmChannel.name.split(',').length > 1 ? dmChannel.name : '',
      count: setCountValue(dmChannel.members, profile),
    }));

  const initialList = list.map((item) => ({
    ...item,
    tooltip: item.isMyAccount ? item.currentUser + ' (me)' : item.tooltip,
    name: item.isMyAccount ? 'Notes (me)' : item.name,
  }));

  const botMsg = find(initialList, (item) => item.type === ChannelTypes.ChatBotMessage);
  const selfMsg = find(initialList, (item) => item.type === ChannelTypes.SelfMessage);

  const otherMessages = initialList.filter(
    (item) => item.type !== ChannelTypes.ChatBotMessage && item.type !== ChannelTypes.SelfMessage,
  );

  let updatedList: any = [];

  if (initialList.length) {
    if (botMsg) {
      updatedList.push(botMsg);
    }
    if (selfMsg) {
      updatedList.push(selfMsg);
    }
    updatedList = [...updatedList, ...otherMessages];
  }

  const menu = [
    {
      name: 'Direct Messages',
      path: '/app/candidate',
      routes: updatedList,
    },
  ];

  const flatMenuKeys = getFlatMenuKeys(menu);
  const defaultOpenKeys = ['/app/candidate'];

  return (
    <BaseMenu
      menu={menu}
      location={location}
      className={styles.baseMenu}
      flatMenuKeys={flatMenuKeys}
      defaultOpenKeys={defaultOpenKeys}
    />
  );
};

const mapStateToProps = ({ channel, global }) => ({ ...channel, ...global });

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DirectMessageMenu);
