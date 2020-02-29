import { InputCard, TextArea } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { get } from 'lodash';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ErrorType, FormSectionTypes, StepName } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { FinishedStep } from '../../../utils/interfaces';
import { ApplicationController, ApplicationHeader } from '../components';
import { ApplicationForm, JobApplication, Params } from '../models/interfaces';

import styles from './Overview.module.scss';

interface State {
  objective?: string;
  overview?: string;
}

enum FieldNames {
  overview = 'overview',
  objective = 'objective',
}

interface Props extends FormComponentProps, RouteComponentProps<Params> {
  application: JobApplication;
  applicationForm: ApplicationForm;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const Overview: FC<Props> = (props) => {
  const { form, match, application, updateApplication, applicationForm } = props;
  const { id: applicationId } = match.params;
  const [state, setState] = useState<State | undefined>(get(application, 'resume.overview'));
  const [clearOverviewLabel, setClearOverviewLabel] = useState<boolean>(false);
  const [clearObjectiveLabel, setClearObjectiveLabel] = useState<boolean>(false);
  const [nextButtonDisabled, disableNextButton] = useState<boolean>(true);
  const { getFieldDecorator, setFieldsValue, getFieldError, validateFields } = form;
  const maxObjectiveLength: number = 250;
  const maxOverviewLength: number = 750;

  useEffect(() => {
    if (get(application, 'resume.overview')) {
      const {
        resume: { overview },
      } = application;
      setState((state: State | undefined) => ({ ...state, ...overview }));

      if (overview && !overview.objective) {
        setClearObjectiveLabel(false);
      } else {
        setClearObjectiveLabel(true);
      }
      if (overview && !overview.overview) {
        setClearOverviewLabel(false);
      } else {
        setClearOverviewLabel(true);
      }
    } else {
      setState((state: State | undefined) => ({ ...state, objective: '', overview: '' }));
      setClearObjectiveLabel(false);
      setClearOverviewLabel(false);
    }
  }, [application]);

  useEffect(() => {
    if (applicationForm && application) {
      const { steps } = application;

      if (
        steps?.filter((step: FinishedStep) => step.name === StepName.overview).length ||
        applicationForm.overview.stepType === FormSectionTypes.OPTIONAL
      ) {
        disableNextButton(false);
      }
    }
  }, [applicationForm, application]);

  useEffect(() => {
    setFieldsValue({ [FieldNames.overview]: state?.overview, [FieldNames.objective]: state?.objective });
  }, [state, setFieldsValue]);

  const onBlur = (): void => {
    validateFields((errors, values) => {
      if (!errors) {
        updateApplication(applicationId, 'overview', { resume: { overview: values } });
        disableNextButton(false);
      } else {
        disableNextButton(true);
      }
    });
  };

  const handleOnChange = (clearFieldsLabel: any) => (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      clearFieldsLabel(false);
    } else {
      clearFieldsLabel(true);
    }
  };

  return (
    <>
      <ApplicationHeader match={match} title="Overview" />
      <Form hideRequiredMark key={applicationId}>
        <Row className={styles.overview} type="flex" key={applicationId}>
          <Col>
            <InputCard title="Objective" className={styles.inputCard}>
              <>
                {getFieldDecorator(FieldNames.objective, {
                  initialValue: state?.objective,
                  rules: [
                    {
                      max: maxObjectiveLength,
                      message: formatErrorMessage('Objective', ErrorType.MAX_LENGTH, maxObjectiveLength),
                    },
                    {
                      required: applicationForm?.overview.stepFieldsTypes.objective === FormSectionTypes.REQUIRED,
                      message: formatErrorMessage('Objective', ErrorType.REQUIRED),
                    },
                  ],
                })(
                  <TextArea
                    label={!clearObjectiveLabel ? 'Brief Objective' : ''}
                    onChange={handleOnChange(setClearObjectiveLabel)}
                    onBlur={onBlur}
                    validateStatus={getFieldError(FieldNames.objective) ? 'error' : ''}
                    autoSize
                    style={{ marginBottom: '0px' }}
                  />,
                )}
              </>
              <Row type="flex" className={styles.overviewSection}>
                <Col className={styles.title}>Overview</Col>
                <Col>
                  <>
                    {getFieldDecorator(FieldNames.overview, {
                      initialValue: state?.overview,
                      rules: [
                        {
                          max: maxOverviewLength,
                          message: formatErrorMessage('Overview', ErrorType.MAX_LENGTH, maxOverviewLength),
                        },
                        {
                          required: applicationForm?.overview.stepFieldsTypes.overview === FormSectionTypes.REQUIRED,
                          message: formatErrorMessage('Overview', ErrorType.REQUIRED),
                        },
                      ],
                    })(
                      <TextArea
                        label={!clearOverviewLabel ? 'Enter a short overview of your career and goals' : ''}
                        onBlur={onBlur}
                        onChange={handleOnChange(setClearOverviewLabel)}
                        validateStatus={getFieldError(FieldNames.overview) ? 'error' : ''}
                        autoSize
                      />,
                    )}
                  </>
                </Col>
              </Row>
            </InputCard>
          </Col>
        </Row>
        <ApplicationController match={match} disableNext={nextButtonDisabled} />
      </Form>
    </>
  );
};

const mapStateToProps = ({ application: { application, applicationForm } }) => ({ application, applicationForm });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(Overview));
