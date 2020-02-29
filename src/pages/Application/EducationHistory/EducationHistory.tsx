import { Row } from 'antd';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useMedia } from 'react-use';

import { Dispatch } from '../../../models/dispatch';
import { EducationFields, EmptyEducation, StepName } from '../../../utils/constants';
import { getIntegerMonth, updateEducationHistory } from '../../../utils/utils';
import { ApplicationController, ApplicationHeader, EmptyStepCard } from '../components';
import { ApplicationEducation, EducationHistory as Education, JobApplication, Params } from '../models/interfaces';
import { VoidFunc } from '../WorkHistory/interfaces';

import styles from './EducationHistory.module.scss';
import EducationHistoryForm from './EducationHistoryForm';

interface Props extends RouteComponentProps<Params> {
  application: JobApplication;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

interface State {
  educationHistory: Education[];
}

const EducationHistory: React.FC<Props> = (props) => {
  const { match, application, updateApplication } = props;
  const {
    applicationId,
    resume: { educationHistory },
  } = application;
  const isEmptyEducationHistory: boolean = educationHistory ? !(educationHistory.length > 1) : true;
  const [updateDates, setDatesUpdate] = useState<boolean>(false);
  const [state, setState] = useState<State>({
    educationHistory: updateEducationHistory(educationHistory),
  });
  const [checkValid, setCheckValid] = useState<boolean>(false);
  const [isValid, setValid] = useState<boolean>(false);
  const [fieldsFilled, setFieldsFilled] = useState<boolean>(false);
  const [showEmptyCard, setShowEmptyCard] = useState<boolean>(isEmptyEducationHistory);
  const [focusOnSchoolName, setSchoolNameFocus] = useState<boolean>(false);
  const isMobile: boolean = useMedia('(max-width:575px)');

  const updateHistoryFromStore = useCallback((educationHistory?: Education[]) => {
    setState((state: State) => ({
      ...state,
      educationHistory: updateEducationHistory(educationHistory),
    }));
  }, []);

  const getEducationHistory = (educationHistory: Education[]): ApplicationEducation[] =>
    educationHistory.map((education: Education) => {
      const { index, ...requiredProps } = education;

      return requiredProps;
    });

  const handleApplicationUpdate = useCallback(() => {
    updateApplication(application.applicationId, StepName.educationHistory, {
      applicationId: application.applicationId,
      resume: {
        educationHistory: getEducationHistory(state.educationHistory),
      },
    });
  }, [updateApplication, application.applicationId, state.educationHistory]);

  useEffect(() => {
    const {
      resume: { educationHistory },
    } = application;
    updateHistoryFromStore(educationHistory);

    if (educationHistory?.length) {
      setShowEmptyCard(false);
    } else {
      setShowEmptyCard(true);
      setSchoolNameFocus(false);
    }
  }, [updateHistoryFromStore, application]);

  useEffect(() => {
    if (updateDates) {
      handleApplicationUpdate();
      setDatesUpdate(false);
    }
  }, [handleApplicationUpdate, setDatesUpdate, updateDates]);

  useEffect(() => {
    let filled: boolean = true;

    if (state.educationHistory.length) {
      for (const education of state.educationHistory) {
        if (!education.degreeName || !education.schoolName) {
          filled = false;
          setFieldsFilled(false);
          break;
        }
      }
    }

    if (filled) {
      setFieldsFilled(true);
    }
  }, [state.educationHistory]);

  useEffect(() => {
    if (isValid) {
      setSchoolNameFocus(true);
      setState((state: State) => ({
        ...state,
        educationHistory: [
          ...state.educationHistory,
          {
            ...EmptyEducation,
            index: state.educationHistory.length,
          },
        ],
      }));
    }
  }, [isValid]);

  useEffect(() => {
    if (!checkValid) {
      setValid(false);
    }
  }, [checkValid]);

  const isDefaultCard = (education: Education): boolean =>
    !education.schoolName &&
    !education.degreeName &&
    !education.startMonth &&
    !education.endMonth &&
    !education.startYear &&
    !education.endYear &&
    state.educationHistory.length === 1;

  const updateStateEducationHistory = (index: number, value: string | number | boolean, field: string): void => {
    let currentHistory: Education = state.educationHistory.filter((history: Education) => history.index === index)[0];

    if (field === EducationFields.stillStudying && typeof value === 'boolean') {
      currentHistory = currentHistory && {
        ...currentHistory,
        [field]: value,
        endMonth: '',
        endYear: '',
      };
    } else {
      currentHistory = currentHistory && {
        ...currentHistory,
        [field]: value,
      };
    }

    setState((state: State) => ({
      ...state,
      educationHistory: [
        ...state.educationHistory.filter((history: Education) => history.index !== index),
        currentHistory,
      ],
    }));
  };

  const programInputOnChange = (index: number): ((e: ChangeEvent<HTMLInputElement>) => void) => (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateStateEducationHistory(index, e.target.value, EducationFields.degreeName);
  };

  const schoolInputOnChange = (index: number): ((e: ChangeEvent<HTMLInputElement>) => void) => (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateStateEducationHistory(index, e.target.value, EducationFields.schoolName);
  };

  const deleteEducation = (index: number): (() => void) => (): void => {
    const educationHistory: Education = state.educationHistory.filter(
      (history: Education) => history.index === index,
    )[0];
    const isDefault: boolean = isDefaultCard(educationHistory);

    if (!isDefault) {
      const params = {
        applicationId: application.applicationId,
        resume: {
          educationHistory: getEducationHistory(
            state.educationHistory.filter((history: Education) => history.index !== index),
          ),
        },
      };

      updateApplication(application.applicationId, StepName.educationHistory, params);

      if (state.educationHistory.length === 1) {
        setSchoolNameFocus(true);
        setState((state: State) => ({
          ...state,
          educationHistory: [EmptyEducation],
        }));
      }
    } else {
      setShowEmptyCard(true);
      setSchoolNameFocus(false);
    }
  };

  const addEducation = (): void => {
    if (!state.educationHistory.length) {
      setSchoolNameFocus(true);
      setState((state: State) => ({
        ...state,
        educationHistory: [...state.educationHistory, { ...EmptyEducation }],
      }));
    } else {
      setCheckValid(true);
    }
  };

  const handleDateUpdate = (index: number, value: string, field: string): void => {
    updateStateEducationHistory(index, value, field);
    setDatesUpdate(true);
  };

  const startDateMonthChange = (index: number) => (value: string): void => {
    handleDateUpdate(index, getIntegerMonth(value), EducationFields.startMonth);
  };

  const startDateYearChange = (index: number) => (value: string): void => {
    handleDateUpdate(index, value, EducationFields.startYear);
  };

  const endDateMonthChange = (index: number) => (value: string): void => {
    handleDateUpdate(index, getIntegerMonth(value), EducationFields.endMonth);
  };

  const handleStillStudyingCheckBox = (index: number): VoidFunc => (e: ChangeEvent<HTMLInputElement>): void => {
    updateStateEducationHistory(index, e.target.checked, EducationFields.stillStudying);
    setDatesUpdate(true);
  };

  const endDateYearChange = (index: number) => (value: string): void => {
    handleDateUpdate(index, value, EducationFields.endYear);
  };

  return (
    <>
      {(!showEmptyCard || isMobile) && (
        <ApplicationHeader
          match={match}
          title="Education"
          onClick={addEducation}
          hideButton={showEmptyCard}
          disabled={!fieldsFilled}
        />
      )}
      {showEmptyCard ? (
        <EmptyStepCard
          match={match}
          title="Education"
          text="Please share your education history"
          onClick={() => {
            setSchoolNameFocus(true);
            setShowEmptyCard(false);
          }}
        />
      ) : (
        <>
          <Row className={styles.educationHistory}>
            <Row className={styles.content} type="flex">
              {state.educationHistory &&
                state.educationHistory &&
                state.educationHistory.length > 0 &&
                state.educationHistory
                  .sort((history1: Education, history2: Education) => (history1.index > history2.index ? 1 : -1))
                  .map((history: Education, index: number) => (
                    <EducationHistoryForm
                      key={`${index}${applicationId}`}
                      educationHistory={history}
                      submitData={handleApplicationUpdate}
                      programInputOnChange={programInputOnChange(index)}
                      schoolInputOnChange={schoolInputOnChange(index)}
                      deleteEducation={deleteEducation(index)}
                      startDateMonthChange={startDateMonthChange(index)}
                      startDateYearChange={startDateYearChange(index)}
                      endDateMonthChange={endDateMonthChange(index)}
                      endDateYearChange={endDateYearChange(index)}
                      setValidity={(value: boolean) => setValid(value)}
                      checkValid={checkValid}
                      stopValidityCheck={() => setCheckValid(false)}
                      handleStillStudyingCheckBox={handleStillStudyingCheckBox(index)}
                      focusName={index === state.educationHistory.length - 1 && focusOnSchoolName}
                    />
                  ))}
            </Row>
          </Row>
          <ApplicationController match={match} disableNext={!fieldsFilled} style={{ marginTop: '8px' }} />
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ application: { application, applicationSteps } }) => ({
  application,
  applicationSteps,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) =>
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EducationHistory);
