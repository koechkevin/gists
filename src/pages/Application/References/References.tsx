import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useMedia } from 'react-use';

import { Dispatch } from '../../../models/dispatch';
import { StepName } from '../../../utils/constants';
import { ApplicationController, ApplicationHeader, EmptyStepCard } from '../components';
import { Params, Reference, Step } from '../models/interfaces';
import ReferenceForm from './ReferenceForm';

interface Props extends FormComponentProps, RouteComponentProps<Params> {
  loading: boolean;
  application: any;
  isFormValid: boolean;
  references: Reference[];
  applicationSteps: Step[];
  showEmptyStepCard: boolean;
  addReferenceFormClicked: boolean;
  setShowCard: (value: boolean) => void;
  setIsFormValid: (valid: boolean) => void;
  saveReference: (references: Reference[]) => void;
  updateAddReferenceFormClicked: (payload: boolean) => void;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const References: FC<Props> = (props) => {
  const {
    match,
    references,
    application,
    isFormValid,
    setShowCard,
    saveReference,
    setIsFormValid,
    applicationSteps,
    updateApplication,
    showEmptyStepCard,
    addReferenceFormClicked,
    updateAddReferenceFormClicked,
  } = props;
  const { id: applicationId } = match.params;
  const [addFormClicked, setAddFormClicked] = useState(false);
  const isMobile: boolean = useMedia('(max-width: 1024px)');

  const validReferences: Reference[] = references.filter((each) => !each.isDeleted);

  const addReferenceForm = () => {
    if (validReferences.length === 0 || (isFormValid && validReferences.length < 5)) {
      saveReference([...references, { number: references.length }]);
      setIsFormValid(false);
    } else {
      updateAddReferenceFormClicked(true);
    }
  };

  useEffect(() => {
    updateAddReferenceFormClicked(false);
  }, [updateAddReferenceFormClicked]);

  useEffect(() => {
    setAddFormClicked(addReferenceFormClicked);
  }, [setAddFormClicked, addReferenceFormClicked]);

  useEffect(() => {
    setShowCard(!validReferences.length);
    return () => setShowCard(false);
  }, [setShowCard, validReferences.length]);

  const update = useCallback(() => {
    const updatedApplication = {
      ...application,
      resume: { references: references.filter((each) => !each.isDeleted) },
    };

    updateApplication(applicationId, StepName.references, updatedApplication);
  }, [applicationId, application, references, updateApplication]);

  return (
    <>
      {(!showEmptyStepCard || isMobile) && (
        <ApplicationHeader
          match={match}
          title="References"
          onClick={addReferenceForm}
          hideButton={showEmptyStepCard}
          disabled={!isFormValid}
        />
      )}
      {showEmptyStepCard && (
        <EmptyStepCard
          match={match}
          title="References"
          steps={applicationSteps}
          onClick={addReferenceForm}
          text="Some recruiters like to hear about you from other people, share people who really know you."
        />
      )}
      {!showEmptyStepCard && (
        <>
          <div key={applicationId}>
            {references &&
              references.map((reference: Reference, index: number) =>
                reference.isDeleted ? null : (
                  <ReferenceForm
                    key={index}
                    update={update}
                    match={match}
                    referee={reference}
                    number={reference.number}
                    setIsFormValid={setIsFormValid}
                    addFormClicked={addFormClicked}
                    saveReference={saveReference}
                  />
                ),
              )}
          </div>
          <ApplicationController match={match} disableNext={!isFormValid} />
        </>
      )}
    </>
  );
};

const mapStateToProps = ({
  application: {
    references,
    application,
    applicationSteps,
    isReferenceFormValid,
    addReferenceFormClicked,
    showEmptyStepCard,
  },
}: any) => ({
  references,
  application,
  applicationSteps,
  isFormValid: isReferenceFormValid,
  addReferenceFormClicked,
  showEmptyStepCard,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveReference: (references: Reference[]) => {
    dispatch({ type: 'application/storeReferences', payload: references });
  },

  setIsFormValid: (isFormValid: boolean) => dispatch({ type: 'application/setIsReferenceValid', payload: isFormValid }),

  updateApplication: (applicationId: string, stepName: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    });
  },

  updateAddReferenceFormClicked: (payload: boolean) =>
    dispatch({ type: 'application/updateAddReferenceFormClicked', payload }),

  setShowCard: (payload: boolean) =>
    dispatch({
      type: 'application/showEmptyCard',
      payload,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(References);
