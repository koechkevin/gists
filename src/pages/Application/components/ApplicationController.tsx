import { Button, Icon } from '@aurora_app/ui-library';
import { timestampFormat } from '@aurora_app/ui-library/lib/utils';
import { faSync } from '@fortawesome/pro-regular-svg-icons';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import React, { CSSProperties } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { FinishedStep, JobApplication, MatchParams } from '../models/interfaces';

import styles from './ApplicationController.module.scss';

interface DvaProps {
  loading: boolean;
  isSaving: boolean;
  savedNow: boolean;
  application: JobApplication;
  updateApplicationSteps: (currentStep: string, steps: FinishedStep[]) => void;
}

interface Props extends DvaProps {
  match: MatchParams;
  style?: CSSProperties;
  disableNext?: boolean;
}

const ApplicationController: React.FC<Props> = (props) => {
  const { style, match, isSaving, loading, savedNow, disableNext, application, updateApplicationSteps } = props;
  const { step } = match.params;
  const { steps } = application;

  const saveData = (): void => {
    if (step) {
      let stepsData: FinishedStep[];

      if (steps) {
        stepsData = [...steps, { name: step }];
      } else {
        stepsData = [{ name: step }];
      }

      updateApplicationSteps(step, stepsData);
    }
  };

  return (
    <Row type="flex" align="middle" justify="space-between" className={styles.applicationController} style={style}>
      <Row type="flex" gutter={8}>
        <Col>{(isSaving || savedNow) && <Icon icon={faSync} spin={isSaving} style={{ color: '#979797' }} />}</Col>
        <Col>
          {savedNow && application?.updatedAt
            ? `Saved ${timestampFormat(new Date(application.updatedAt)).toLowerCase()}`
            : isSaving
            ? 'Saving...'
            : ''}
        </Col>
      </Row>
      <Button type="primary" disabled={!!disableNext} onClick={saveData} loading={loading} style={{ minWidth: 106 }}>
        Next step
      </Button>
    </Row>
  );
};

const mapStateToProps = ({ application, loading }: any) => ({
  savedNow: application.savedNow,
  application: application.application,
  loading: loading.effects['application/updateApplicationSteps'],
  isSaving:
    loading.effects['application/updateApplication'] ||
    loading.effects['application/postQuestionResponse'] ||
    loading.effects['application/updateQuestionResponse'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplicationSteps: (currentStep: string, steps: FinishedStep[]) => {
    dispatch({
      type: 'application/updateApplicationSteps',
      payload: { currentStep, steps },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationController);
