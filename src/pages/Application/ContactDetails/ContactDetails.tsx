import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { FC, useEffect, useState } from 'react';

import { ContactInformationFields, FormSectionTypes } from '../../../utils/constants';
import { isEmptyForm } from '../../../utils/utils';
import { ApplicationController, ApplicationHeader } from '../components';
import { ApplicationForm, ContactInfo, JobApplication } from '../models/interfaces';
import ContactDetailsForm from './ContactDetailsForm';

interface MatchParams {
  id: string;
  companyId: string;
  history: any;
}

interface Props extends RouteComponentProps<MatchParams> {
  application: JobApplication;
  applicationForm: ApplicationForm;
}

const ContactDetails: FC<Props> = (props) => {
  const { match, application, applicationForm } = props;
  const { id: applicationId } = match.params;
  const [disabled, disableNexButton] = useState<boolean>(true);

  const requiredFieldsInvalid = (contactInformation: ContactInfo, stepFieldsTypes: object): boolean => {
    let invalid: boolean = false;

    Object.keys(contactInformation).forEach((key: string) => {
      if (stepFieldsTypes[key] === FormSectionTypes.REQUIRED) {
        if (!contactInformation[key]) {
          invalid = true;
        }

        if (key === ContactInformationFields.phone || key === ContactInformationFields.mobilePhone) {
          const phone = contactInformation[key];
          if (!phone?.number || !phone?.code) {
            invalid = true;
          }
        }
      }
    });

    return invalid;
  };

  useEffect(() => {
    if (application?.resume.contactInformation && applicationForm?.contactInformation) {
      const {
        resume: { contactInformation },
      } = application;
      const { contactInformation: contactInfoForm } = applicationForm;
      const { stepFieldsTypes } = contactInfoForm;
      let invalid: boolean = false;

      if (contactInfoForm.stepType === FormSectionTypes.REQUIRED) {
        invalid = requiredFieldsInvalid(contactInformation, stepFieldsTypes);
        disableNexButton(invalid);
      } else {
        if (!isEmptyForm(contactInfoForm)) {
          invalid = requiredFieldsInvalid(contactInformation, stepFieldsTypes);
          disableNexButton(invalid);
        } else {
          disableNexButton(false);
        }
      }
    }
  }, [application, applicationForm]);

  const disableNext = (value: boolean): void => disableNexButton(value);

  return (
    <>
      <ApplicationHeader match={match} title="Contact Information" />
      <ContactDetailsForm applicationId={applicationId} disabledNextButton={disableNext} />
      <ApplicationController match={match} disableNext={disabled} />
    </>
  );
};

const mapStateToProps = ({ application: { application, applicationForm } }) => ({
  application,
  applicationForm,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);
