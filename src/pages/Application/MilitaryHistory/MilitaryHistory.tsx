import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { FC } from 'react';

import { ApplicationController, ApplicationHeader } from '../components';
import { Params } from '../models/interfaces';
import MilitaryHistoryForm from './MilitaryHistoryForm';

interface Props extends RouteComponentProps<Params> {
  disableNext: boolean;
}

const MilitaryHistory: FC<Props> = (props) => {
  const { match, disableNext } = props;
  const { id } = match.params;

  return (
    <>
      <ApplicationHeader title="Military history" match={match} />
      <MilitaryHistoryForm applicationId={id} />
      <ApplicationController match={match} disableNext={disableNext} />
    </>
  );
};

const mapStateToProps = ({ application: { disableNext } }) => ({ disableNext });

export default connect(mapStateToProps)(MilitaryHistory);
