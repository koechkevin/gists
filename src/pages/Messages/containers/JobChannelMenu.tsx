import { ChannelMenu as DefaultChannelMenu } from '@aurora_app/ui-library';
import { ChannelItem } from '@aurora_app/ui-library/lib/Menu';
import { connect } from 'dva';
import filter from 'lodash/filter';
import React from 'react';

import { Dispatch } from '../../../models/dispatch';
import { CHANNEL_TYPES } from '../../../utils/constants';
import { Channel } from '../models/typed';

interface Props {
  channels: Channel[];
  dispatch: Dispatch;
  remove: (item: ChannelItem) => void;
}

const ChannelMenu: React.FC<Props> = (props) => {
  const { channels, remove } = props;
  const list: Channel[] = channels
    ? filter(channels, (ch: Channel) => ch.type === CHANNEL_TYPES.JOB_APPLY).map((channel: Channel) => ({
        ...channel,
        lock: false,
        path: `/app/candidate/channel/${channel.id}`,
      }))
    : [];

  return <DefaultChannelMenu title="Channels" list={list} removable onRemove={remove} />;
};

const mapStateToProps = ({ channel }) => ({ ...channel });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  remove(item: ChannelItem) {
    dispatch({
      type: 'channel/removeChannel',
      payload: { id: item.id },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelMenu);
