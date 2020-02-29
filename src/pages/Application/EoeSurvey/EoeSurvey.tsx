import { InputCard, Loading, RadioButton } from '@aurora_app/ui-library';
import { Radio, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { FC, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { EoeSurveyConstants, FormSectionTypes, StepName } from '../../../utils/constants';
import { checkAllFieldsFilled } from '../../../utils/utils';
import { ApplicationController, ApplicationHeader } from '../components';
import { ApplicationForm, JobApplication, Params } from '../models/interfaces';

import styles from './EoeSurvey.module.scss';

interface Props extends FormComponentProps, RouteComponentProps<Params> {
  loading: boolean;
  application: JobApplication;
  applicationForm: ApplicationForm;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const EoeSurvey: FC<Props> = (props) => {
  const {
    match,
    loading,
    application,
    updateApplication,
    applicationForm,
    application: {
      resume: { eoeSurvey },
    },
  } = props;
  const { id } = match.params;
  const [survey, setSurveyValue] = useState({
    genderIdentification: null,
    veteranStatus: null,
    disabledStatus: null,
    raceDesignation: null,
    save: false,
  });
  const [nextButtonDisabled, disableNextButton] = useState<boolean>(false);
  const { save, ...restFields } = survey;
  const updatedApplication = {
    applicationId: application.applicationId,
    resume: {
      eoeSurvey: restFields,
    },
  };

  useEffect(() => {
    if (survey.save) {
      updateApplication(id, StepName.eoeSurvey, updatedApplication);
      setSurveyValue((s: any) => ({
        ...s,
        save: false,
      }));
    }
  }, [updateApplication, updatedApplication, id, survey]);

  useEffect(() => {
    setSurveyValue((s: any) => ({
      ...s,
      genderIdentification: eoeSurvey ? eoeSurvey.genderIdentification : null,
      veteranStatus: eoeSurvey ? eoeSurvey.veteranStatus : null,
      disabledStatus: eoeSurvey ? eoeSurvey.disabledStatus : null,
      raceDesignation: eoeSurvey ? eoeSurvey.raceDesignation : null,
    }));
  }, [eoeSurvey]);

  const optionChange = (e: any): void => {
    setSurveyValue({
      ...survey,
      save: true,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (applicationForm && eoeSurvey) {
      if (applicationForm.eoeSurvey.stepType === FormSectionTypes.REQUIRED) {
        disableNextButton(!checkAllFieldsFilled(true, eoeSurvey));
      }
    }
  }, [applicationForm, eoeSurvey]);

  return (
    <Row className={styles.container}>
      <ApplicationHeader match={match} title="Voluntary Equal Opportunity Self Identification Survey" />
      <Row className={styles.surveyPage}>
        {loading ? (
          <Loading />
        ) : (
          <Row>
            <InputCard className={styles.inputCard}>
              <p className={styles.introText}>
                Airbus Inc. is an equal employment opportunity employer. As required by law, we must record certain
                information to be in compliance with EEO and Affirmative Action requirements. <br /> <br />
                The information on this EEO Self Identification Form is being requested and will be used solely for
                equal employment opportunity/affirmative action record‐keeping and reporting purposes. Submission of
                this form by you is voluntary and confidential. Please be assured that you will not be subjected to any
                adverse treatment if you do not provide the information requested. In the event that you do provide the
                information requested, the information and this form will be processed and maintained separately from
                your personnel file and will not be provided to others.
                <br /> <br />
                If you have any questions regarding this survey, please contact the Human Resources Department.
              </p>
            </InputCard>
            <InputCard className={styles.inputCard}>
              <div className={styles.genderGroup}>
                <h5>Please check the appropriate Gender Identification:</h5>
                <Radio.Group value={survey.genderIdentification} onChange={optionChange}>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.male}
                    id={'genderIdentification'}
                    checked={survey.genderIdentification === EoeSurveyConstants.male ? true : false}
                  >
                    Male
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.female}
                    id={'genderIdentification'}
                    checked={survey.genderIdentification === EoeSurveyConstants.female ? true : false}
                  >
                    Female
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.noAnswer}
                    id={'genderIdentification'}
                    checked={survey.genderIdentification === EoeSurveyConstants.noAnswer ? true : false}
                  >
                    Choose Not To Answer
                  </RadioButton>
                </Radio.Group>
              </div>
              <div className={styles.veteranGroup}>
                <h5>If applicable, please select the appropriate veteran status below.</h5>
                <Radio.Group value={survey.veteranStatus} onChange={optionChange}>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.vietnam}
                    checked={survey.veteranStatus === EoeSurveyConstants.vietnam ? true : false}
                    id={'veteranStatus'}
                  >
                    Vietnam Era Veteran (Served between 8.5.64 - 5.7.75)
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.disabledVet}
                    id={'veteranStatus'}
                    checked={survey.veteranStatus === EoeSurveyConstants.disabledVet ? true : false}
                  >
                    Disabled Veteran (Receives 30% military disability)
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.newSeparatedVet}
                    id={'veteranStatus'}
                    checked={survey.veteranStatus === EoeSurveyConstants.newSeparatedVet ? true : false}
                  >
                    Newly Separated Vet (Released from active duty less than one year before today’s date.)
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.otherVet}
                    id={'veteranStatus'}
                    checked={survey.veteranStatus === EoeSurveyConstants.otherVet ? true : false}
                  >
                    Other Eligible Vet (Authorization of Campaign badge)
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.noAnswer}
                    id={'veteranStatus'}
                    checked={survey.veteranStatus === EoeSurveyConstants.noAnswer ? true : false}
                  >
                    Choose Not to Answer
                  </RadioButton>
                </Radio.Group>
              </div>
              <div className={styles.disabledGroup}>
                <h5>If applicable, please select below if you are disabled.</h5>
                <Radio.Group value={survey.disabledStatus} onChange={optionChange}>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.disabled}
                    id={'disabledStatus'}
                    checked={survey.disabledStatus === EoeSurveyConstants.disabled ? true : false}
                  >
                    Disabled: a person who has a physical, sensory, or mental impairment which “materially” (Minnesota)
                    or “substantially” (Federal) limits one or more major life activity or has a record of or is
                    regarded as having such an impairment. “Individual with a Disability” does not include an alcohol or
                    drug abuser whose current use of alcohol or drugs renders that individual a direct threat to
                    property or to the safety of others.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.noAnswer}
                    id={'disabledStatus'}
                    checked={survey.disabledStatus === EoeSurveyConstants.noAnswer ? true : false}
                  >
                    Choose Not to Answer
                  </RadioButton>
                </Radio.Group>
              </div>
              <div className={styles.raceGroup}>
                <h5>Please check the appropriate Race/Ethnicity designation:</h5>
                <Radio.Group value={survey.raceDesignation} onChange={optionChange}>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.hispanicLatino}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.hispanicLatino ? true : false}
                  >
                    Hispanic or Latino: A person of Cuban, Mexican, Puerto Rican, South or Central American, or other
                    Spanish culture or origin, regardless of race.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.white}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.white ? true : false}
                  >
                    White (Not Hispanic or Latino): A person having origins in any of the original peoples of Europe,
                    the Middle East, or North Africa.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.african}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.african ? true : false}
                  >
                    Black or African American (Not Hispanic or Latino): A person having origins in any of the black
                    racial groups of Africa.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.hawaiian}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.hawaiian ? true : false}
                  >
                    Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino): A person having origins in any
                    of the original peoples of Hawaii, Guam, Samoa, or other Pacific Islands.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.asian}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.asian ? true : false}
                  >
                    Asian (Not Hispanic or Latino): A person having origins in any of the original peoples of the Far
                    East, Southeast Asia, or the Indian subcontinent, including, for example, Cambodia, China, India,
                    Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.americanIndianAlaska}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.americanIndianAlaska ? true : false}
                  >
                    American Indian or Alaska Native (Not Hispanic or Latino): A person having origins in any of the
                    original peoples of North and South America (including Central America), and who maintains tribal
                    affiliation or community attachment.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.twoOrMore}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.twoOrMore ? true : false}
                  >
                    Two or More Races (Not Hispanic or Latino): All persons who identify with more than one of the above
                    five races.
                  </RadioButton>
                  <RadioButton
                    className={styles.radioButton}
                    value={EoeSurveyConstants.noAnswer}
                    id={'raceDesignation'}
                    checked={survey.raceDesignation === EoeSurveyConstants.noAnswer ? true : false}
                  >
                    Choose Not to Answer
                  </RadioButton>
                </Radio.Group>
              </div>
            </InputCard>
          </Row>
        )}
      </Row>
      <ApplicationController match={match} disableNext={nextButtonDisabled} />
    </Row>
  );
};

const mapStateToProps = ({ application: { application, loading, applicationForm } }: any) => ({
  application,
  loading,
  applicationForm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) =>
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EoeSurvey);
