import { notification } from 'antd';

import { ApplicationForm, JobApplication } from '../pages/Application/models/interfaces';
import { codeMessage, cookieKeys, ErrorType, FormSectionTypes, StepName } from './constants';
import { getCookie } from './cookies';
import { FinishedStep } from './interfaces';

/**
 * @description Formats error messages to the aurora user friendly error message standard
 * @param {string} attribute
 * @param {string} type
 * @param {number|string} compareValueAttribute
 * @returns {string}
 */
export const formatErrorMessage = (
  attribute: string,
  type: string,
  compareValueAttribute?: number | string,
): string => {
  switch (type) {
    case ErrorType.MAX_LENGTH:
      return `${attribute} should have ${compareValueAttribute} characters maximum, please try again.`;
    case ErrorType.REQUIRED:
      return `${attribute} cannot be blank, please try again.`;
    case ErrorType.REGEX:
      return `Something went wrong with your request. Please try again.`;
    case ErrorType.DATE:
      return `Something went wrong with the date format. Please try again.`;
    case ErrorType.EQUAL:
      return `${attribute} must be ${compareValueAttribute}.`;
    case ErrorType.NOT_EQUAL:
      return `${attribute} must not be ${compareValueAttribute}`;
    case ErrorType.GREATER_THAN:
      return `${attribute} should be greater than ${compareValueAttribute}}.`;
    case ErrorType.GREATER_THAN_OR_EQUAL_TO:
      return `${attribute} should be greater than or equal to ${compareValueAttribute}`;
    case ErrorType.LESS_THAN:
      return `${attribute} should be less than ${compareValueAttribute}`;
    case ErrorType.LESS_THAN_OR_EQUAL_TO:
      return `${attribute} should be less than or equal to ${compareValueAttribute}`;
    case ErrorType.INVALID:
      return `Something went wrong with ${attribute}.  Please try again.`;
    case ErrorType.BOOLEAN:
      return `Please try selecting ${attribute} again.`;
    default:
      return '';
  }
};

/**
 * @description Checks if all the required steps for a form have been filled
 * @param {JobApplication} application
 * @param {ApplicationForm} applicationForm
 * @returns {boolean}
 */
export const isValidApplication = (application: JobApplication, applicationForm: ApplicationForm): boolean => {
  const formStepNames: string[] = Object.keys(StepName);
  const formKeys: string[] = applicationForm
    ? Object.keys(applicationForm).filter((formKey: string) => formStepNames.includes(formKey))
    : [];
  const validSteps: string[] = application?.steps ? application.steps.map((step: FinishedStep) => step.name) : [];
  const invalidSteps: string[] = formKeys.filter(
    (formKey: string) =>
      applicationForm[formKey].stepType === FormSectionTypes.REQUIRED && !validSteps.includes(formKey),
  );

  return invalidSteps.length === 0;
};

/**
 * Global error handler function
 * @param error
 * @param dispatch
 */
export const errorHandle = (error: any, dispatch: any) => {
  const { response } = error;

  if (response) {
    const { status, data } = response;
    const errorText = codeMessage[status] ? codeMessage[status] : data.error;

    if (status === 401) {
      const userToken = getCookie(cookieKeys.USER_TOKEN_KEY);
      const profileId = getCookie(cookieKeys.SELECTED_PROFILE_ID);

      if (userToken) {
        if (profileId) {
          dispatch({
            type: 'global/selectProfile',
            payload: {
              profileId,
              token: userToken,
            },
          });
          return;
        }
        dispatch({ type: 'global/fetchMyProfiles', payload: userToken });
      } else {
        notification.error({ message: errorText });
        dispatch({ type: 'global/logout' });
      }

      return;
    }

    if (status === 422) {
      const errorMessage = data[0].message;

      notification.error({
        message: `Request Error ${status}`,
        description: errorMessage,
      });

      return;
    }

    notification.error({
      message: `Request Error ${status}`,
      description: errorText,
    });
  } else {
    notification.error({
      message: `Request Error`,
      description: 'Network error, please try again!',
    });
  }
};

export default errorHandle;
