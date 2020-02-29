import { ErrorBoundary } from '@aurora_app/ui-library';
import { Layout } from 'antd';
import { connect } from 'dva';
import { Redirect, RouteComponentProps, routerRedux } from 'dva/router';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';

import styles from './App.module.scss';

import { Header, SideMenu } from './components';
import { Common } from './models';
import { Company, CompanyMenu } from './models/company';
import { Dispatch } from './models/dispatch';
import { Auth } from './models/user';
import { ApplicationModel } from './pages/Application';
import { Params } from './pages/Application/models/interfaces';
import { ChannelModel } from './pages/Messages';
import { AppRoutes, Routes } from './routes';
import { registerModel } from './utils';

const { Content } = Layout;

interface InternalProps extends RouteComponentProps<Params> {
  app: any;
  auth: Auth;
  collapsed: boolean;
  companies: Company[];
  onlineUsers: string[];
  headerTitle: string;
  applicationStatus: string;
  connect: () => void;
  fetchJobs: () => void;
  disconnect: () => void;
  fetchProfiles: () => void;
  fetchCompanies: () => void;
  fetchChannels: () => void;
  fetchApplications: () => void;
  redirectTo: (companyId?: string) => void;
  onCollapse: (collapsed: boolean) => void;
  setProfileStatus: (onlineUsers: string[]) => void;
  setChannelsStatus: (onlineUsers: string[]) => void;
}

const App: React.FC<InternalProps> = (props) => {
  const {
    app,
    auth,
    match,
    connect,
    location,
    collapsed,
    companies,
    fetchJobs,
    redirectTo,
    onCollapse,
    headerTitle,
    disconnect,
    fetchProfiles,
    onlineUsers,
    setProfileStatus,
    setChannelsStatus,
    fetchCompanies,
    applicationStatus,
    fetchApplications,
    fetchChannels,
  } = props;
  const { companyId } = match.params;
  const [title, setTitle] = useState<string>('Application');
  const [stateApplicationStatus, setApplicationStatus] = useState<string>('');
  const currentCompany = companies.find((item: Company) => item.companyId === companyId);

  registerModel(app, Common);
  registerModel(app, ChannelModel);
  registerModel(app, ApplicationModel);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchJobs();
      fetchApplications();
    }
  }, [app, auth.isAuthenticated, fetchApplications, fetchJobs]);

  const companiesMenu = companies.map((company: Company) => {
    const allCompanies: CompanyMenu = {
      name: company.name || '',
      icon: company.signedLogo?.thumbnails[0].signedUrl,
      path: `${Routes.Candidate}/${company.companyId}`,
      avatarColor: company.avatarColor,
    };
    return allCompanies;
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchProfiles();
      fetchCompanies();
      fetchChannels();
    }
  }, [app, auth.isAuthenticated, fetchProfiles, fetchCompanies, fetchChannels]);

  useEffect(() => {
    setTitle(headerTitle);
  }, [headerTitle, setTitle]);

  useEffect(() => {
    setApplicationStatus(applicationStatus);
  }, [applicationStatus, setApplicationStatus]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      connect();
    }

    return () => disconnect();
  }, [connect, disconnect, auth.isAuthenticated]);

  useEffect(() => {
    setProfileStatus(onlineUsers);
    setChannelsStatus(onlineUsers);
  }, [onlineUsers, setProfileStatus, setChannelsStatus]);

  if (!companyId && companies.length) {
    return <Redirect to={`${Routes.Candidate}/${companies[0].companyId}`} />;
  }

  return (
    <Layout className={styles.app}>
      <SideMenu
        match={match}
        location={location}
        collapsed={collapsed}
        companyId={companyId}
        companies={companies}
        handleCollapse={onCollapse}
        companiesMenu={companiesMenu}
        currentCompany={currentCompany}
        name={get(currentCompany, 'name')}
        onSelect={(selected: Company) => redirectTo(selected.companyId)}
      />
      <Layout>
        <Header
          title={title}
          location={location}
          onCollapse={() => onCollapse(!collapsed)}
          applicationStatus={stateApplicationStatus}
        />
        <ErrorBoundary>
          <Content className={styles.content}>
            <AppRoutes app={app} auth={auth} />
          </Content>
        </ErrorBoundary>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = ({ global, application }: any) => {
  return {
    auth: global.auth,
    profile: global.profile,
    collapsed: global.collapsed,
    headerTitle: global.headerTitle,
    companies: global.companies,
    onlineUsers: global.onlineUsers,
    applicationStatus: application ? application.applicationStatus : '',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  connect: () => {
    dispatch({ type: 'common/connectSocket' });
  },

  disconnect: () => {
    dispatch({ type: 'common/disconnectSocket' });
  },

  fetchProfiles: () => {
    dispatch({ type: 'global/fetchProfiles' });
  },

  fetchCompanies: () => {
    dispatch({ type: 'global/fetchCompanies' });
  },

  fetchJobs: () => {
    dispatch({ type: 'job/fetchJobs' });
  },

  fetchApplications: () => {
    dispatch({ type: 'application/fetchApplications' });
  },

  fetchChannels() {
    dispatch({
      type: 'channel/fetchChannels',
    });
  },

  redirectTo: (companyId: string) => {
    dispatch(routerRedux.push({ pathname: `${Routes.Candidate}/${companyId}` }));
  },

  onCollapse: (collapsed: boolean) => {
    dispatch({
      type: 'global/changeMenuCollapsed',
      payload: collapsed,
    });
  },

  setProfileStatus: (onlineUsers: string[]) => {
    dispatch({
      type: 'global/setProfileStatus',
      payload: onlineUsers,
    });
  },

  setChannelsStatus: (onlineUsers: string[]) => {
    dispatch({
      type: 'channel/setChannelsStatus',
      payload: onlineUsers,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
