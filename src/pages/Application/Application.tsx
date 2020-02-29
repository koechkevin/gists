import { Layout, Row } from 'antd';
import { connect } from 'dva';
import { matchPath, RouteComponentProps, Switch } from 'dva/router';
import React, { FC, useEffect } from 'react';
import { useMedia } from 'react-use';

import { ConfirmModal } from '../../components';
import { Dispatch } from '../../models/dispatch';
import { RouteConfig, Routes, RouteWithSubRoutes } from '../../routes';
import { StepName } from '../../utils/constants';
import { JobApplication } from '../Application/models/interfaces';
import { ApplicationSideBar } from './components';
import { Params, Step } from './models/interfaces';

import styles from './Application.module.scss';

interface Props extends RouteComponentProps<Params> {
  app: any;
  loading: boolean;
  routes: RouteConfig[];
  showRemoveModal: boolean;
  application: JobApplication;
  applicationSteps: Step[];
  confirmLoading: boolean;
  fetchLanguages: () => void;
  onCollapse: (collapsed: boolean) => void;
  setSavedNow: (savedNow: boolean) => void;
  updateHeaderTitle: (title: string) => void;
  getResponses: (applicationId: string) => void;
  updateApplicationStatus: (status: string) => void;
  fetchApplicationForm: (applicationId: string) => void;
  toShowModal: (modal: string, visible: boolean) => void;
  removeApplication: (companyId: string, applicationId: string) => void;
}

const Application: FC<Props> = (props) => {
  const {
    app,
    match,
    routes,
    history,
    loading,
    location,
    onCollapse,
    toShowModal,
    application,
    setSavedNow,
    getResponses,
    fetchLanguages,
    applicationSteps,
    showRemoveModal,
    updateHeaderTitle,
    removeApplication,
    fetchApplicationForm,
    updateApplicationStatus,
    confirmLoading,
  } = props;
  const { id, companyId } = match.params;
  const { status, job } = application;
  const isMobile = useMedia('(max-width: 768px)');
  const matchStep = matchPath<Params>(location.pathname, {
    path: `${Routes.Application}/:step?`,
    exact: true,
    strict: false,
  });
  const { step } = (matchStep?.params && matchStep?.params) || {};

  useEffect(() => {
    isMobile && onCollapse(false);
  }, [location, isMobile, onCollapse]);

  useEffect(() => {
    fetchApplicationForm(id);
    getResponses(id);
  }, [fetchApplicationForm, id, getResponses]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  useEffect(() => {
    if (job) {
      updateHeaderTitle(job.jobTitle);
    }

    updateApplicationStatus(status);

    return () => {
      updateHeaderTitle('Application');
      updateApplicationStatus('');
    };
  }, [updateHeaderTitle, updateApplicationStatus, status, job]);

  useEffect(() => {
    setSavedNow(true);
  }, [setSavedNow]);

  return (
    <>
      <Layout.Content className={styles.content}>
        {isMobile && !step ? (
          <ApplicationSideBar
            match={match}
            history={history}
            loading={loading}
            currentStep={step}
            steps={applicationSteps}
          />
        ) : (
          <>
            {!isMobile && step !== StepName.reviewAndSubmit && (
              <ApplicationSideBar
                match={match}
                history={history}
                loading={loading}
                currentStep={step}
                steps={applicationSteps}
              />
            )}
            <Row className={styles.main}>
              <Switch>
                {routes &&
                  routes.map((route: RouteConfig) => <RouteWithSubRoutes key={route.path} app={app} {...route} />)}
              </Switch>
            </Row>
          </>
        )}
      </Layout.Content>
      <ConfirmModal
        centered={false}
        okText="Delete"
        visible={showRemoveModal}
        title="Delete Application"
        confirmLoading={confirmLoading}
        okButtonProps={{ type: 'danger', style: { minWidth: 83 } }}
        onOk={() => removeApplication(companyId, id)}
        onCancel={() => toShowModal('showRemoveApplicationModal', false)}
      >
        This action cannot be reverted, do you want to continue anyway?
      </ConfirmModal>
    </>
  );
};

const mapStateToProps = ({ application, loading, common }: any) => ({
  application: application.application,
  applicationSteps: application.applicationSteps,
  showRemoveModal: common.showRemoveApplicationModal,
  loading: loading.effects['application/fetchApplicationForm'] || loading.effects['application/fetchQuestions'],
  confirmLoading: loading.effects['application/removeApplication'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCollapse: (collapsed: boolean) => {
    dispatch({
      type: 'global/changeMenuCollapsed',
      payload: collapsed,
    });
  },

  fetchApplicationForm: (applicationId: string) => {
    dispatch({
      type: 'application/fetchApplicationForm',
      payload: applicationId,
    });
  },

  fetchLanguages: () => {
    dispatch({ type: 'application/fetchLanguages' });
  },

  getResponses: (applicationId: string) => {
    dispatch({ type: 'application/fetchQuestionsResponses', payload: { applicationId } });
  },

  removeApplication: (companyId: string, applicationId: string) => {
    dispatch({ type: 'application/removeApplication', payload: { companyId, applicationId } });
  },

  updateHeaderTitle: (title: string) => {
    dispatch({ type: 'global/changeHeaderTitle', payload: { title } });
  },

  updateApplicationStatus: (status: string) => {
    dispatch({ type: 'application/updateApplicationStatus', payload: status });
  },

  setSavedNow: (savedNow: boolean) => {
    dispatch({ type: 'application/storeSavedNow', payload: savedNow });
  },

  toShowModal: (modal: string, visible: boolean) => {
    dispatch({
      type: 'common/showOrHideModal',
      modal,
      payload: visible,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
