import { Button } from '@aurora_app/ui-library';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { ReactNode, useEffect, useState } from 'react';

import { ConfirmModal } from '../../../components';
import { Dispatch } from '../../../models/dispatch';
import { Profile } from '../../../models/user';
import { APPLICATION_STATUS } from '../../../utils/constants';
import { filterQuestions, mapAnswersToQuestions } from '../../../utils/utils';
import StepBanner from '../components/StepBanner';
import { Answer, JobApplication, Params, Question } from '../models/interfaces';
import ReviewForm from './ReviewForm';

import styles from './ReviewAndSubmit.module.scss';

interface Props extends RouteComponentProps<Params> {
  profile: Profile;
  showModal: boolean;
  responses: Answer[];
  questions: Question[];
  confirmLoading: boolean;
  application: JobApplication;
  setShowModal: (showModal: boolean) => void;
  withdrawApplication: (applicationId: string, companyId: string) => void;
  updateApplication: (applicationId: string, application: any) => void;
}

const ReviewAndSubmit: React.FC<Props> = (props) => {
  const {
    match,
    profile,
    questions,
    responses,
    showModal,
    application,
    setShowModal,
    confirmLoading,
    updateApplication,
    withdrawApplication,
  } = props;
  const submitted = application.status === APPLICATION_STATUS.SUBMITTED;
  const [showBanner, setShowBanner] = useState<boolean>(submitted);
  const [textQuestions, setTextQuestions] = useState<Question[]>(
    mapAnswersToQuestions(filterQuestions(questions, 'text'), responses),
  );
  const [booleanQuestions, setBooleanQuestions] = useState<Question[]>(
    mapAnswersToQuestions(filterQuestions(questions, 'boolean'), responses),
  );

  useEffect(() => {
    setTextQuestions(mapAnswersToQuestions(filterQuestions(questions, 'text'), responses));
    setBooleanQuestions(mapAnswersToQuestions(filterQuestions(questions, 'boolean'), responses));
  }, [questions, responses, setTextQuestions, setBooleanQuestions]);

  const submit = () => {
    updateApplication(application.applicationId, {
      applicationId: application.applicationId,
      status: APPLICATION_STATUS.SUBMITTED,
    });
  };

  useEffect(() => {
    setShowBanner(submitted);
  }, [setShowBanner, submitted]);

  const setCustomizedText = (): ReactNode => (
    <Row className={styles.customizedText}>
      <Col>It may take up to 2 weeks to hear back from the company.</Col>
      <Col>You’ll get notification about change of status for your application.</Col>
    </Row>
  );

  const withdraw = () => {
    const { id: applicationId, companyId } = match.params;
    withdrawApplication(applicationId, companyId);
  };

  return (
    <>
      {showBanner ? (
        <Row className={styles.banner}>
          <StepBanner
            customizedText={setCustomizedText()}
            title={`${profile.firstname}, your application has been sent.`}
          >
            <Row gutter={24}>
              <Col>
                <Button type="primary" onClick={() => setShowBanner(false)}>
                  View Application
                </Button>
              </Col>
              <Col style={{ marginTop: '24px' }}>
                <Button type="link" onClick={() => setShowModal(true)} className={styles.withdrawText}>
                  Withdraw application
                </Button>
              </Col>
            </Row>
          </StepBanner>
        </Row>
      ) : (
        <ReviewForm
          match={match}
          application={application}
          submitApplication={submit}
          questions={{ booleanQuestions, textQuestions }}
        />
      )}
      <ConfirmModal
        okText="Withdraw"
        onOk={withdraw}
        visible={showModal}
        title="Withdraw Job Application"
        onCancel={() => setShowModal(false)}
        confirmLoading={confirmLoading}
        okButtonProps={{ type: 'danger', style: { minWidth: 107 } }}
      >
        Are you sure you want to withdraw your application?
      </ConfirmModal>
    </>
  );
};

const mapStateToProps = ({ global, common, application, loading }: any) => ({
  application: application.application,
  questions: application.questions,
  responses: application.responses,
  profile: global.profile.profile,
  showModal: common.withdrawApplicationModal,
  confirmLoading: loading.effects['application/withdrawApplication'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application },
    });
  },

  setShowModal: (showModal: boolean) => {
    dispatch({ type: 'common/showOrHideModal', modal: 'withdrawApplicationModal', payload: showModal });
  },

  withdrawApplication: (applicationId: string, companyId: string) => {
    dispatch({ type: 'application/withdrawApplication', payload: { applicationId, companyId } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewAndSubmit);
