import { Button } from '@aurora_app/ui-library';
import { connect } from 'dva';
import React, { FC, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { FormSectionTypes, StepName } from '../../../utils/constants';
import { ApplicationForm, FinishedStep, JobApplication, MatchParams } from '../models/interfaces';
import HeaderButton from './HeaderButton';
import StepBanner from './StepBanner';

import styles from './EmptyStepCard.module.scss';

interface DevProps {
  application: JobApplication;
  applicationForm: ApplicationForm;
  updateApplicationSteps: (currentStep: string, steps: FinishedStep[]) => void;
}

interface Props extends DevProps {
  text: string;
  title: string;
  match: MatchParams;
  onClick?: () => void;
}

const EmptyStepCard: FC<Props> = (props) => {
  const { onClick, title, text, match, application, updateApplicationSteps, applicationForm } = props;
  const [required, setRequired] = useState<boolean>(true);
  const { step } = match.params;
  const { steps } = application;

  useEffect(() => {
    if (step && applicationForm) {
      setRequired(
        applicationForm[step === StepName.education ? StepName.educationHistory : step].stepType !==
          FormSectionTypes.OPTIONAL,
      );
    }
  }, [applicationForm, step]);

  const updateSteps = (): void => {
    if (step) {
      const stepsData = steps ? [...steps, { name: step }] : [{ name: step }];
      updateApplicationSteps(step, stepsData);
    }
  };

  return (
    <StepBanner className={styles.emptyCard} title={title} text={text}>
      <HeaderButton step={step} onClick={onClick ? onClick : () => null} disabled={false} />
      <br />
      {!required && (
        <Button onClick={updateSteps} type="link" className={styles.skip}>
          Skip
        </Button>
      )}
    </StepBanner>
  );
};

const mapStateToProps = ({ application: { application, applicationForm } }: any) => ({
  application,
  applicationForm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplicationSteps: (currentStep: string, steps: FinishedStep[]) => {
    dispatch({
      type: 'application/updateApplicationSteps',
      payload: { currentStep, steps },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EmptyStepCard);
