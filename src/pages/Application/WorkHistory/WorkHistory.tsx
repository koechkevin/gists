import { Row } from 'antd';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useMedia } from 'react-use';

import { Dispatch } from '../../../models/dispatch';
import { StepName, WorkHistoryFields } from '../../../utils/constants';
import {
  blankPosition,
  getEmploymentHistories,
  getPositionsHistory,
  getUnchangedCompanies,
  getUnchangedPositions,
  getUpdatedCompany,
  getUpdatedPosition,
  setEmptyCompany,
  updatePosition,
} from '../../../utils/workHistory';
import { ApplicationController, ApplicationHeader, EmptyStepCard } from '../components';
import { JobApplication, Params } from '../models/interfaces';
import { ParamVoidFunc, ParamVoidFunction, State, StateCompany, StatePosition, VoidFunc } from './interfaces';

import styles from './WorkHistory.module.scss';
import WorkHistoryForm from './WorkHistoryForm';

interface Props extends RouteComponentProps<Params> {
  application: JobApplication;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const WorkHistory: React.FC<Props> = (props) => {
  const { match, application, updateApplication } = props;
  const { resume: { workHistory } } = application;
  const isEmptyWorkHistory: boolean = workHistory?.length ? workHistory?.length < 1 : false;
  const { id: applicationId } = match.params;

  const [uniqueIndex, setUniqueIndex] = useState<number>(0);
  const [companiesFilled, setCompanyFilled] = useState<boolean>(false);
  const [checkCompany, setCheckCompany] = useState<boolean>(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState<boolean>(true);
  const [fetchWorkHistory, setFetchWorkHistory] = useState<boolean>(true);
  const [showEmptyCard, setShowEmptyCard] = useState<boolean>(isEmptyWorkHistory);
  const [state, setState] = useState<State>({
    save: false,
    companies: [],
  });
  const [focusCompanyName, setFocusCompanyName] = useState<boolean>(false);
  const [addButtonDisabled, disableAddButton] = useState<boolean>(false);
  const isMobile: boolean = useMedia('(max-width: 575px)');

  useEffect(() => {
    const { companies } = state;

    if (fetchWorkHistory && application) {
      getEmploymentHistories(application, setState, 0, setUniqueIndex, state);
      setFetchWorkHistory(false);
      setCheckCompany(false);
    }

    if (companies.length) {
      const companyNamesFilled: boolean =
        companies.filter((company: StateCompany) => (company.companyName ? true : false)).length === companies.length;
      disableAddButton(!companyNamesFilled);
    }
  }, [application, state, fetchWorkHistory]);

  useEffect(() => {
    setFetchWorkHistory(true);

    if (!application.resume.workHistory?.length) {
      setShowEmptyCard(true);
      setFocusCompanyName(false);
    } else {
      setShowEmptyCard(false);
    }
  }, [application]);

  useEffect(() => {
    if (companiesFilled) {
      setEmptyCompany(uniqueIndex, state, setState, setUniqueIndex);
      setCheckCompany(false);
      setCompanyFilled(false);
    }
  }, [companiesFilled, state, uniqueIndex]);

  useEffect(() => {
    if (checkCompany && !state.companies.length) {
      setEmptyCompany(uniqueIndex, state, setState, setUniqueIndex);
      setCheckCompany(false);
      setCompanyFilled(false);
    }
  }, [checkCompany, state, uniqueIndex]);

  useEffect(() => {
    if (state.companies.length) {
      for (const company of state.companies) {
        let filled: boolean = true;

        if (!company.companyName) {
          filled = false;
          setAllFieldsFilled(false);
          break;
        } else {
          for (const position of company.positions) {
            if (!position.title) {
              filled = false;
              setAllFieldsFilled(false);
              break;
            }
          }

          if (!filled) {
            break;
          }
        }

        setAllFieldsFilled(true);
      }
    } else {
      setAllFieldsFilled(true);
    }
  }, [state.companies]);

  const isFinalPositionCard = (position: StatePosition, company: StateCompany): boolean =>
    company.positions.length > 1 ||
    position.title ||
    position.experience ||
    position.addressCountry ||
    position.startMonth ||
    position.endMonth ||
    position.startYear ||
    position.endYear ||
    position.stillWorking === true
      ? false
      : true;

  const isFinalCard = (company: StateCompany): boolean => {
    let isFinal: boolean = state.companies.length === 1;

    if (company.companyName) {
      isFinal = false;
    } else {
      if (company.positions) {
        company.positions.forEach((position: StatePosition) => {
          if (!isFinalPositionCard(position, company)) {
            isFinal = false;
          }
        });
      }
    }

    return isFinal;
  };

  const checkCompanyFields = (value: boolean): void => setCompanyFilled(value);

  const addCompany = (): void => {
    setCheckCompany(true);
    setAllFieldsFilled(false);
    setFocusCompanyName(true);
  };

  const deleteHistory = (index: number): void => {
    const updatedCompany: StateCompany = getUpdatedCompany(state, index);
    const isFinal: boolean = isFinalCard(updatedCompany);
    const unchangedCompanies: StateCompany[] = getUnchangedCompanies(state, index);
    const { applicationId } = application;
    setFocusCompanyName(false);

    setCheckCompany(false);

    if (!isFinal) {
      if (state.companies.length === 1) {
        setEmptyCompany(uniqueIndex, state, setState, setUniqueIndex);
        setShowEmptyCard(true);
        setFocusCompanyName(false);
      } else {
        setState((state: State) => ({ ...state, companies: unchangedCompanies }));
      }

      const params = {
        applicationId,
        resume: { workHistory: getPositionsHistory({ companies: unchangedCompanies }) },
      };

      updateApplication(applicationId, StepName.workHistory, params);
      setFetchWorkHistory(true);
    } else {
      setShowEmptyCard(true);
      setFocusCompanyName(false);
    }
  };

  const addPosition = (index: number): void => {
    const updatedCompany: StateCompany = getUpdatedCompany(state, index);
    setAllFieldsFilled(false);

    setState({
      ...state,
      companies: [
        ...getUnchangedCompanies(state, index),
        {
          ...updatedCompany,
          positions: [...updatedCompany.positions, { ...blankPosition, index: uniqueIndex + 1, stillWorking: false }],
        },
      ],
    });

    setUniqueIndex(uniqueIndex + 1);
  };

  const deletePosition = (index: number): ParamVoidFunction => (positionIndex: number): void => {
    const updatedCompany: StateCompany = getUpdatedCompany(state, index);
    const updatedPosition: StatePosition = getUpdatedPosition(state, index, positionIndex);
    const isFinal: boolean = isFinalCard(updatedCompany) || isFinalPositionCard(updatedPosition, updatedCompany);
    const unchangedPositions: StatePosition[] = getUnchangedPositions(state, index, positionIndex);
    const unchangedCompanies: StateCompany[] = getUnchangedCompanies(state, index);
    const { applicationId } = application;

    setCheckCompany(false);

    if (!isFinal) {
      if (unchangedPositions.length > 1) {
        setState((s: State) => ({
          ...s,
          companies: [...unchangedCompanies, { ...updatedCompany, positions: unchangedPositions }],
        }));
      } else {
        setState((s: State) => ({
          ...s,
          companies: [
            ...unchangedCompanies,
            { ...updatedCompany, positions: [{ index: uniqueIndex, ...blankPosition }] },
          ].sort((companyA: StateCompany, companyB: StateCompany) => companyA.index - companyB.index),
        }));

        setUniqueIndex(uniqueIndex + 1);
      }

      const params = {
        applicationId,
        resume: {
          workHistory: getPositionsHistory({
            companies: [...unchangedCompanies, { ...updatedCompany, positions: unchangedPositions }].sort(
              (companyA: StateCompany, companyB: StateCompany) => companyA.index - companyB.index,
            ),
          }),
        },
      };

      updateApplication(applicationId, StepName.workHistory, params);
      setFetchWorkHistory(true);
    }
  };

  const handleCompanyNameChange = (index: number): VoidFunc => (e): void => {
    const updatedCompany: StateCompany = getUpdatedCompany(state, index);
    setCheckCompany(false);

    setState({
      ...state,
      companies: [...getUnchangedCompanies(state, index), { ...updatedCompany, companyName: e.target.value }],
    });
  };

  const handleLocationChange = (index: number): ParamVoidFunc => (positionIndex: number) => (e): void => {
    updatePosition(index, state, setState, WorkHistoryFields.LOCATION, positionIndex, e.target.value);
  };

  const handleTitleChange = (index: number): ParamVoidFunc => (positionIndex: number): VoidFunc => (e): void => {
    updatePosition(index, state, setState, WorkHistoryFields.TITLE, positionIndex, e.target.value);
  };

  const handleExperienceChange = (index: number): ParamVoidFunc => (positionIndex: number): VoidFunc => (e): void => {
    updatePosition(index, state, setState, WorkHistoryFields.EXPERIENCE, positionIndex, e.target.value);
  };

  const handleStillWorkingChange = (index: number): ParamVoidFunc => (positionIndex: number): VoidFunc => (e) => {
    updatePosition(index, state, setState, WorkHistoryFields.STILL_WORKING, positionIndex, e.target.checked, true);
  };

  const saveData = useCallback(() => {
    const { applicationId } = application;
    setCheckCompany(false);
    setState((s: State) => ({ ...s, save: false }));
    setFocusCompanyName(false);

    const params = {
      applicationId,
      resume: { workHistory: getPositionsHistory(state) },
    };

    updateApplication(applicationId, StepName.workHistory, params);
    setFetchWorkHistory(true);
    state.checkStillWorking && setState((state: State) => ({ ...state, checkStillWorking: false }));
  }, [setCheckCompany, setState, updateApplication, application, state]);

  useEffect(() => {
    if (state.checkStillWorking || state.save) {
      saveData();
    }
  }, [saveData, state.checkStillWorking, state.save]);

  const startDateMonthChange = (index: number): ParamVoidFunc => (positionIndex: number): VoidFunc => (value): void =>
    updatePosition(index, state, setState, WorkHistoryFields.START_MONTH, positionIndex, value, true);

  const startDateYearChange = (index: number): ParamVoidFunc => (positionIndex: number): VoidFunc => (value): void =>
    updatePosition(index, state, setState, WorkHistoryFields.START_YEAR, positionIndex, value, true);

  const endDateMonthChange = (index: number): ParamVoidFunc => (positionIndex: number): VoidFunc => (value): void =>
    updatePosition(index, state, setState, WorkHistoryFields.END_MONTH, positionIndex, value, true);

  const endDateYearChange = (index: number): ParamVoidFunc => (positionIndex: number): VoidFunc => (value) =>
    updatePosition(index, state, setState, WorkHistoryFields.END_YEAR, positionIndex, value, true);

  return (
    <>
      {(!showEmptyCard || isMobile) && (
        <ApplicationHeader
          match={match}
          onClick={addCompany}
          hideButton={showEmptyCard}
          title="Work History"
          disabled={addButtonDisabled}
        />
      )}
      {showEmptyCard ? (
        <EmptyStepCard
          match={match}
          title="Work History"
          onClick={() => {
            setShowEmptyCard(false);
            setFocusCompanyName(true);
          }}
          text="Work Experience is important but it's not always required"
        />
      ) : (
        <>
          <Row className={styles.workHistory}>
            <Row className={styles.content} type="flex">
              {state.companies
                .sort((companyA: StateCompany, companyB: StateCompany) => companyA.index - companyB.index)
                .map((company: StateCompany, index: number) => (
                  <WorkHistoryForm
                    key={`${company.index}${applicationId}`}
                    uniqueIndex={company.index}
                    companyTitle={company.companyName}
                    deleteHistory={() => deleteHistory(company.index)}
                    addPosition={() => addPosition(company.index)}
                    deletePosition={deletePosition(company.index)}
                    companyNameChange={handleCompanyNameChange(company.index)}
                    locationChange={handleLocationChange(company.index)}
                    titleChange={handleTitleChange(company.index)}
                    stillWorkingChange={handleStillWorkingChange(company.index)}
                    positions={company.positions}
                    experienceChange={handleExperienceChange(company.index)}
                    startDateMonthChange={startDateMonthChange(company.index)}
                    startDateYearChange={startDateYearChange(company.index)}
                    endDateMonthChange={endDateMonthChange(company.index)}
                    endDateYearChange={endDateYearChange(company.index)}
                    saveData={saveData}
                    checkCompanyFields={checkCompanyFields}
                    checkCompany={checkCompany}
                    focusName={index === state.companies.length - 1 && focusCompanyName}
                  />
                ))}
            </Row>
          </Row>
          <ApplicationController match={match} disableNext={!allFieldsFilled} />
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ application: { application, applicationSteps, applicationForm } }) => ({
  application,
  applicationForm,
  applicationSteps,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) =>
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkHistory);
