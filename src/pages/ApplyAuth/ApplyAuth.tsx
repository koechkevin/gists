import { Row, Tabs } from 'antd';
import { connect } from 'dva';
import { Redirect, RouteComponentProps } from 'dva/router';
import { isEqual } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

import { Auth, UserProfile } from '../../models/user';
import { SignUpProgress, SignUpSteps } from '../../utils/constants';
import { Email, Header, Name, Password, VerifyEmail } from './components';
import { ApplyAuthState } from './models/interfaces';

import styles from './ApplyAuth.module.scss';

const { TabPane } = Tabs;

interface ProgressState {
  passValue: string;
  activeKey: SignUpSteps;
  progressStatus: SignUpProgress;
}

interface Props extends RouteComponentProps {
  app: any;
  auth: Auth;
  loading: boolean;
  profile: UserProfile;
  applyAuth: ApplyAuthState;
}

export const ApplyAuth: FC<Props> = (props) => {
  const { auth, profile, history, loading, applyAuth } = props;
  const [state, setState] = useState<ProgressState>({
    activeKey: SignUpSteps.Email,
    progressStatus: 0,
    passValue: '',
  });

  useEffect(() => {
    setState((state: ProgressState) => ({
      ...state,
      activeKey: SignUpSteps.Email,
      progressStatus: SignUpProgress.Email,
    }));
  }, []);

  useEffect(() => {
    setState((state: ProgressState) => ({
      ...state,
      activeKey: applyAuth.activeKey as SignUpSteps,
      progressStatus: applyAuth.progressStatus,
    }));
  }, [applyAuth.activeKey, applyAuth.progressStatus, loading]);

  const checkIfNameExist = (currentKey: number) => {
    if (isEqual(currentKey, 3) && !applyAuth.firstname) {
      setState((state: ProgressState) => ({
        ...state,
        activeKey: (currentKey - 2).toString() as SignUpSteps,
        progressStatus: state.progressStatus + SignUpProgress.goToPrevious - SignUpProgress.Name,
      }));
    } else {
      setState((state: ProgressState) => ({
        ...state,
        activeKey: (currentKey - 1).toString() as SignUpSteps,
        progressStatus: state.progressStatus + SignUpProgress.goToPrevious,
      }));
    }
  };

  const goToPrevious = () => {
    const currentKey = parseInt(state.activeKey, 10);

    if (currentKey > 1) {
      checkIfNameExist(currentKey);
    } else {
      history.goBack();
    }
  };

  const updatePassValue = (passValue: string) => {
    setState((state: ProgressState) => ({ ...state, passValue }));
  };

  if (auth.isAuthenticated && profile.profileId && isEqual(applyAuth.status, 'active')) {
    return <Redirect push to={'/app/candidate'} />;
  }

  return (
    <Row type="flex" justify="center" className={styles.content}>
      <Tabs
        activeKey={state.activeKey}
        renderTabBar={() => (
          <Header
            progressStatus={state.progressStatus}
            title={'Sr. UI Designer at Airbus in New York'}
            goBack={goToPrevious}
          />
        )}
        className={styles.tabsSection}
        animated={{ tabPane: false, inkBar: true }}
        destroyInactiveTabPane
      >
        <TabPane tab="Tab 1" key="1">
          <Email />
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <Name />
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          <Password setPassValue={updatePassValue} />
        </TabPane>
        <TabPane tab="Tab 4" key="4">
          <VerifyEmail passValue={state.passValue} />
        </TabPane>
      </Tabs>
    </Row>
  );
};

const mapStateToProps = ({ global, applyAuth, loading }) => ({
  loading,
  applyAuth,
  auth: global.auth,
  profile: global.profile,
});

export default connect(mapStateToProps)(ApplyAuth);
