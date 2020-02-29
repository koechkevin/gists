import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { AccomplishmentCategories, FormSectionTypes } from '../../../utils/constants';
import { ApplicationController, ApplicationHeader } from '../components';
import {
  Accomplishment,
  ApplicationForm,
  JobApplication,
  Params,
  Publication as PublicationInterface,
  Speaking as SpeakingInterface,
} from '../models/interfaces';
import { AchievementHonor, AssociationOrganization, LicenceCertification, Publication, Speaking } from './components';

interface State {
  licenceCertification: Accomplishment[];
  associationOrganization: Accomplishment[];
  achievementHonor: Accomplishment[];
  publication: PublicationInterface[];
  speaking: SpeakingInterface[];
  validForm?: boolean;
}

interface Props extends FormComponentProps, RouteComponentProps<Params> {
  application: JobApplication;
  applicationForm: ApplicationForm;
  updateApplication: (applicationId: string, application: any) => void;
}

export const FormContent: FC<Props> = (props) => {
  const { form, match, application, updateApplication, applicationForm } = props;
  const { getFieldsError } = form;
  const { id } = match.params;
  const [update, setUpdateApplication] = useState<boolean>(false);
  const [errors, setErrors] = useState<object>({});

  const categories: State = {
    licenceCertification: [{ name: '' }],
    associationOrganization: [{ name: '' }],
    achievementHonor: [{ name: '' }],
    publication: [{ title: '', journalOrSerialName: '', issue: '' }],
    speaking: [{ event: '', type: '', description: '' }],
  };

  const [state, setState] = useState<State>({
    ...categories,
    validForm: false,
  });

  const isRequired = useCallback(
    (inputField: string): boolean => {
      const [fieldName, index] = inputField.split('_');
      const fields = state[fieldName];
      const field = fields[index];
      const emptyFields = Object.keys(field).filter((fieldKey) => field[fieldKey].trim() !== '');

      return emptyFields.length !== 0;
    },
    [state],
  );

  const handleUpdateApplication = useCallback(() => {
    const { licenceCertification, associationOrganization, achievementHonor, publication, speaking } = state;
    const data = {
      licenceCertification: [...licenceCertification],
      associationOrganization: [...associationOrganization],
      achievementHonor: [...achievementHonor],
      publication: [...publication],
      speaking: [...speaking],
    };

    Object.keys(data).forEach((accomplishmentKey: string) => {
      data[accomplishmentKey].map((accomplishment: Accomplishment, index: number) => {
        if (!isRequired(`${accomplishmentKey}_${index}`)) {
          data[accomplishmentKey].splice(index, 1);
        }
        return false;
      });
    });

    const { applicationId } = application;
    updateApplication(applicationId, {
      resume: { accomplishments: { ...data } },
    });
  }, [application, isRequired, state, updateApplication]);

  const onBlur = (field: string = ''): boolean | void => {
    if (field) {
      if (isRequired(field)) {
        const validForm = Object.values(getFieldsError()).every((error) => error === undefined);
        if (validForm) {
          return handleUpdateApplication();
        }
      }
    }
    return handleUpdateApplication();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const [fieldKey, name, index] = e.target.name.split('_');
    const fieldDetails = state[fieldKey].map((item: any, count: number) =>
      count === parseInt(index, 10) ? { ...item, [name]: e.target.value } : item,
    );

    setState({ ...state, [fieldKey]: [...fieldDetails] });
  };

  const addField = (key: string) => {
    setState((state: State) => {
      if (state[key].length < 30) {
        return { ...state, [key]: [...state[key], categories[key][0]] };
      }
      return state;
    });
  };

  useEffect(() => {
    const {
      resume: { accomplishments },
    } = application;

    if (accomplishments) {
      const {
        licenceCertification,
        achievementHonor,
        associationOrganization,
        publication,
        speaking,
      } = accomplishments;

      setState((state: State) => ({
        ...state,
        licenceCertification:
          licenceCertification && licenceCertification.length >= state.licenceCertification.length
            ? licenceCertification
            : state.licenceCertification,
        associationOrganization:
          associationOrganization && associationOrganization.length >= state.associationOrganization.length
            ? associationOrganization
            : state.associationOrganization,
        achievementHonor:
          achievementHonor && achievementHonor.length >= state.achievementHonor.length
            ? achievementHonor
            : state.achievementHonor,
        publication: publication && publication.length >= state.publication.length ? publication : state.publication,
        speaking: speaking && speaking.length >= state.speaking.length ? speaking : state.speaking,
      }));
    }
  }, [application]);

  useEffect(() => {
    if (update) {
      handleUpdateApplication();
      setUpdateApplication(false);
    }
  }, [update, handleUpdateApplication]);

  const deleteSection = (index: number, category: string): void => {
    if (state[category].length === 1) {
      setState((state: State) => ({ ...state, [category]: categories[category] }));
    } else {
      setState((state: State) => ({
        ...state,
        [category]: state[category].filter((value: any, categoryIndex: number) => categoryIndex !== index),
      }));
    }

    setUpdateApplication(true);
  };

  const getActiveButtonStatus = (accomplishments?: any[], type?: string): boolean => {
    if (accomplishments) {
      switch (type) {
        case AccomplishmentCategories.PUBLICATION:
          for (const accomplishment of accomplishments) {
            if (
              !accomplishment.title.trim() ||
              !accomplishment.issue.trim() ||
              !accomplishment.journalOrSerialName.trim()
            ) {
              return false;
            }
          }
          break;
        case AccomplishmentCategories.SPEAKING:
          for (const accomplishment of accomplishments) {
            if (!accomplishment.type.trim() || !accomplishment.event.trim() || !accomplishment.description.trim()) {
              return false;
            }
          }
          break;
        default:
          for (const accomplishment of accomplishments) {
            if (!accomplishment.name.trim()) {
              return false;
            }
          }
      }
    }

    return true;
  };

  const determineRenderDeleteIcons = (accomplishments?: any[]): boolean => {
    let shouldRender: boolean = accomplishments?.length ? accomplishments?.length > 1 : false;

    if (accomplishments?.length === 1) {
      for (const key of Object.keys(accomplishments[0])) {
        if (accomplishments[0][key].trim()) {
          shouldRender = true;
          break;
        }
      }
    }

    return shouldRender;
  };

  const getErrors = (error: object): void => {
    setErrors((errors) => ({ ...errors, ...error }));
  };

  const getCardLevelFilledStatus = (
    cardName: 'publication' | 'speaking',
    stepFieldsTypes: any,
    accomplishments: any,
  ): boolean => {
    const publicationFields: string[] = ['title', 'issue', 'journalOrSerialName'];
    const speakingFields: string[] = ['description', 'event', 'type'];
    const fields: string[] = cardName === 'publication' ? publicationFields : speakingFields;

    if (stepFieldsTypes[cardName] === FormSectionTypes.REQUIRED) {
      if (accomplishments[cardName]) {
        for (const item of accomplishments[cardName]) {
          if (!(item[fields[0]] && item[fields[1]] && item[fields[2]])) {
            return true;
          }
        }
      } else {
        return true;
      }
    }

    return false;
  };

  const disableNextButton = (): boolean => {
    let disabled: boolean = applicationForm?.accomplishments.stepType === FormSectionTypes.REQUIRED;
    const {
      resume: { accomplishments },
    } = application;
    if (applicationForm && application && accomplishments) {
      const {
        accomplishments: { stepFieldsTypes },
      } = applicationForm;
      const fields: string[] = ['achievementHonor', 'associationOrganization', 'licenceCertification'];

      for (const field in fields) {
        if (stepFieldsTypes[field] === FormSectionTypes.REQUIRED) {
          if (!accomplishments[field]) {
            return true;
          }
        }
      }

      if (getCardLevelFilledStatus('publication', stepFieldsTypes, accomplishments)) {
        return true;
      }

      if (getCardLevelFilledStatus('speaking', stepFieldsTypes, accomplishments)) {
        return true;
      }
    }

    const keys: string[] = Object.keys(errors);
    disabled = keys.filter((key: string) => (errors[key] ? true : false)).length > 0;

    return disabled;
  };

  return (
    <>
      <ApplicationHeader title="Accomplishments" match={match} />
      <Row key={id}>
        <Form hideRequiredMark>
          <LicenceCertification
            onBlur={onBlur}
            addField={addField}
            deleteField={deleteSection}
            handleInputChange={handleInputChange}
            getActiveButtonStatus={getActiveButtonStatus}
            licenceCertification={state.licenceCertification}
            determineRenderDeleteIcons={determineRenderDeleteIcons}
            applicationForm={applicationForm}
            getErrors={getErrors}
          />
          <AssociationOrganization
            onBlur={onBlur}
            addField={addField}
            deleteField={deleteSection}
            handleInputChange={handleInputChange}
            getActiveButtonStatus={getActiveButtonStatus}
            associationOrganization={state.associationOrganization}
            determineRenderDeleteIcons={determineRenderDeleteIcons}
            applicationForm={applicationForm}
            getErrors={getErrors}
          />
          <AchievementHonor
            onBlur={onBlur}
            addField={addField}
            deleteField={deleteSection}
            handleInputChange={handleInputChange}
            achievementHonor={state.achievementHonor}
            getActiveButtonStatus={getActiveButtonStatus}
            determineRenderDeleteIcons={determineRenderDeleteIcons}
            applicationForm={applicationForm}
            getErrors={getErrors}
          />
          <Publication
            onBlur={onBlur}
            addField={addField}
            deleteSection={deleteSection}
            publications={state.publication}
            handleInputChange={handleInputChange}
            getActiveButtonStatus={getActiveButtonStatus}
            determineRenderDeleteIcons={determineRenderDeleteIcons}
            applicationForm={applicationForm}
            getErrors={getErrors}
          />
          <Speaking
            onBlur={onBlur}
            addField={addField}
            speakings={state.speaking}
            deleteSection={deleteSection}
            handleInputChange={handleInputChange}
            getActiveButtonStatus={getActiveButtonStatus}
            determineRenderDeleteIcons={determineRenderDeleteIcons}
            applicationForm={applicationForm}
            getErrors={getErrors}
          />
        </Form>
      </Row>
      <ApplicationController match={match} disableNext={disableNextButton()} />
    </>
  );
};

const mapStateToProps = ({ application: { application, applicationForm } }: any) => ({
  application,
  applicationForm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application },
    });
  },
});

const Accomplishments = Form.create<Props>()(FormContent);

export default connect(mapStateToProps, mapDispatchToProps)(Accomplishments);
