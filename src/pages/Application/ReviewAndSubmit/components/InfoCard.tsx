import { Button } from '@aurora_app/ui-library';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import React from 'react';

import { ConfirmModal } from '../../../../components';
import { Dispatch } from '../../../../models/dispatch';
import { Profile } from '../../../../models/user';
import { APPLICATION_STATUS, StepName } from '../../../../utils/constants';
import { isValidApplication } from '../../../../utils/errorHandle';
import { HeaderButton } from '../../components';
import { ApplicationForm, JobApplication } from '../../models/interfaces';

import styles from './InfoCard.module.scss';

interface DvaProps {
  profile: Profile;
  confirmLoading: boolean;
  showConfirmModal: boolean;
  applicationForm: ApplicationForm;
  toShowModal: (modal: string, visible: boolean) => void;
}

interface Props extends DvaProps {
  application: JobApplication;
  onSubmit: () => void;
}

const InfoCard: React.FC<Props> = (props) => {
  const { profile, onSubmit, application, confirmLoading, showConfirmModal, applicationForm, toShowModal } = props;
  const validApplication = isValidApplication(application, applicationForm);
  const submitted = application.status === APPLICATION_STATUS.SUBMITTED;
  const withdrawn = application.status === APPLICATION_STATUS.WITHDRAWN;
  const disabled = !application.status || submitted || withdrawn || !validApplication;

  return (
    <>
      <Row className={styles.infoCard} align="middle" type="flex">
        <Col>
          <Row type="flex" className={styles.infoTitle}>
            {submitted ? `${profile.firstname}, your application has been sent.` : `Great job ${profile.firstname}!`}
          </Row>
          <Row className={styles.infoContent}>
            {submitted ? (
              <Col>
                It may take up to 2 weeks to hear back from the company.
                <br />
                You’ll get notification about change of status for your application.
              </Col>
            ) : (
              <Col>You are almost done. Review all your items before applying</Col>
            )}
          </Row>
        </Col>
        <Col className={styles.sendButton}>
          {application.status !== APPLICATION_STATUS.SUBMITTED &&
          application.status !== APPLICATION_STATUS.WITHDRAWN ? (
            <HeaderButton
              disabled={disabled}
              step={StepName.reviewAndSubmit}
              onClick={() => toShowModal('submitApplicationModal', true)}
            />
          ) : (
            submitted && (
              <Button type="primary" onClick={() => toShowModal('withdrawApplicationModal', true)}>
                Withdraw Application
              </Button>
            )
          )}
        </Col>
      </Row>
      <ConfirmModal
        title="Job Application"
        okText="Yes, Submit"
        onOk={onSubmit}
        visible={showConfirmModal}
        onCancel={() => toShowModal('submitApplicationModal', false)}
        okButtonProps={{
          style: { minWidth: 121 },
          loading: confirmLoading,
        }}
      >
        Submit your Job Application?
      </ConfirmModal>
    </>
  );
};

const mapStateToProps = ({ global, common, loading, application }) => ({
  profile: global.profile?.profile,
  showConfirmModal: common.submitApplicationModal,
  applicationForm: application.applicationForm,
  confirmLoading: loading.effects['application/updateApplication'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toShowModal: (modal: string, visible: boolean) => {
    dispatch({ type: 'common/showOrHideModal', modal, payload: visible });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard);
