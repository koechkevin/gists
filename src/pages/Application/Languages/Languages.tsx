import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { FC, useEffect, useState } from 'react';
import { useMedia } from 'react-use';

import { Dispatch } from '../../../models/dispatch';
import { StepName } from '../../../utils/constants';
import { isEmptyForm, validProficiency } from '../../../utils/utils';
import { ApplicationController, ApplicationHeader, EmptyStepCard } from '../components';
import application from '../models/application';
import { Language, Params } from '../models/interfaces';
import LanguageForm from './LanguageForm';

interface Props extends RouteComponentProps<Params> {
  languages: Language[];
  showEmptyStepCard: boolean;
  setShowCard: (value: boolean) => void;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const Languages: FC<Props> = (props) => {
  const { match, languages, updateApplication, showEmptyStepCard, setShowCard } = props;
  const { id } = match.params;

  const isMobile: boolean = useMedia('(max-width: 575px)');
  const [state, setState] = useState<Language[]>([]);

  useEffect(() => {
    if (languages && languages.length) {
      setState((stateLanguages): Language[] => {
        let hasEmptyLanguage: boolean = false;

        stateLanguages.forEach((language: Language): void => {
          if (isEmptyForm(language)) {
            hasEmptyLanguage = true;
          }
        });

        return hasEmptyLanguage ? [...languages, { language: '', proficiency: '' }] : languages;
      });
    } else {
      setState([]);
    }
  }, [languages]);

  useEffect(() => {
    if (!state.length) {
      setShowCard(true);
    }
    return () => setShowCard(false);
  }, [state, setShowCard]);

  const setLanguage = (index: number, newLanguage: Language): void => {
    const newLanguages = [...state];
    newLanguages[index] = newLanguage;
    setState(newLanguages);
  };

  const isFormValid = (): boolean => {
    let isValid = true;
    state.forEach((language: Language, index: number): void => {
      const { proficiency, language: lang } = language;

      if (!lang || !proficiency) {
        isValid = false;
      }
    });
    return isValid;
  };

  const onBlur = (): void => {
    if (isFormValid()) {
      const updatedLanguageList: Language[] = state.map(
        (language: Language): Language => ({
          ...language,
          proficiency: validProficiency(language.proficiency),
        }),
      );
      const newApplication = { ...application, resume: { languages: updatedLanguageList } };
      updateApplication(id, StepName.languages, newApplication);
    }
  };

  const onDelete = (index: number): void => {
    if (state.length === 1) {
      updateApplication(id, StepName.languages, { ...application, resume: { languages: [] } });
      return setLanguage(0, { language: '', proficiency: '' });
    }

    const newLanguages: Language[] = state.filter((language: Language, idx: number) => idx !== index);
    setState(newLanguages);
    updateApplication(id, StepName.languages, { ...application, resume: { languages: newLanguages } });
  };

  const onAddForm = (): void => {
    if (isFormValid() || !languages) {
      setLanguage(state.length, {
        language: '',
        proficiency: '',
      });
    }
  };

  const selectOnChange = (index: number, newFormValue: Language): void => {
    const newLanguages: Language[] = [...state];
    newLanguages[index] = newFormValue;
    updateApplication(id, StepName.languages, { ...application, resume: { languages: newLanguages } });
  };

  return (
    <>
      {(!showEmptyStepCard || isMobile) && (
        <ApplicationHeader
          match={match}
          onClick={onAddForm}
          title="Languages"
          hideButton={showEmptyStepCard}
          disabled={!isFormValid() || state.length >= 25}
        />
      )}
      {showEmptyStepCard && (
        <EmptyStepCard
          match={match}
          onClick={onAddForm}
          title="Languages"
          text="Please add your languages and proficiency."
        />
      )}
      {!showEmptyStepCard && (
        <>
          <div>
            {state.map((data: Language, index: number) => (
              <LanguageForm
                key={index}
                onBlur={onBlur}
                index={index}
                applicationId={id}
                languageData={data}
                onDelete={onDelete}
                setLanguage={setLanguage}
                selectOnChange={selectOnChange}
                languageList={state.map((language: Language) => language.language)}
              />
            ))}
          </div>
          <ApplicationController match={match} disableNext={!isFormValid()} />
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ application: { application, applicationSteps, showEmptyStepCard } }: any) => ({
  languages: application.resume.languages,
  showEmptyStepCard,
  applicationSteps,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) =>
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    }),

  setShowCard: (payload: boolean) =>
    dispatch({
      type: 'application/showEmptyCard',
      payload,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Languages);
