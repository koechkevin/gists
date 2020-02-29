import { ChatStatus } from '@aurora_app/ui-library/lib/utils';
import { faCircle as faCircleOutline } from '@fortawesome/pro-regular-svg-icons';
import { faCircle, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { differenceInMinutes } from 'date-fns';
import humps from 'humps';
import { upperFirst } from 'lodash';
import moment from 'moment';

import { UserProfile } from '../models/user';
import { Answer, ApplicationForm, EducationHistory, Question, Step } from '../pages/Application/models/interfaces';
import { Message, User } from '../pages/Messages/models/typed';
import { ChatColors, EmptyEducation, MonthNames, Months, StepName } from './constants';
import { ApplicationSteps, APPLICATION_STATUS } from './constants';
import { ChannelTypes } from './constants';
import { FinishedStep, MonthsAndYearsRange } from './interfaces';

/**
 * Check the array or object if is empty
 * @param {array | object} obj
 */
export function isEmpty(obj: any): boolean {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}

/**
 * @description Updates questions with their respective answers
 * @param {Question[]} questions
 * @param {Answer[]} answers
 * @returns {Question[]}
 */
export const mapAnswersToQuestions = (questions: Question[], answers: Answer[]): Question[] =>
  questions.map((question: Question) => ({
    ...question,
    answer: answers.filter((ans: Answer) => ans.questionId === question.questionId)[0],
  }));

/**
 * @description gets either open questions or closed questions depending on type
 * @param {Question[]} questions
 * @param {string} type
 * @returns {Question[]}
 */
export const filterQuestions = (questions: Question[], type: 'text' | 'boolean'): Question[] =>
  questions.filter((question: Question) => question.type === type);

/**
 * @description Checks if all required questions are answered
 * @param {Question[]} questions
 * @returns {Question[]}
 */
export const allRequiredQuestionsAnswered = (questions: Question[]): boolean => {
  const requiredQuestions: Question[] = questions.filter((question: Question) => question.required);

  for (const qn of requiredQuestions) {
    if (!qn.answer?.value) {
      return false;
    }
  }

  return true;
};

/**
 * @description Updates education history in the state in job application
 *
 * @param {EducationHistory} educationHistory
 * @returns {EducationHistory[]}
 */
export const updateEducationHistory = (educationHistory?: EducationHistory[]): EducationHistory[] =>
  educationHistory
    ? educationHistory.length
      ? educationHistory.map((history: EducationHistory, index: number) => ({
          ...history,
          index,
        }))
      : [{ ...EmptyEducation }]
    : [{ ...EmptyEducation }];

/**
 * @description Gets month name given a month in integer
 *
 * @param {string} month
 * @returns {string|undefined}
 */
export const getMonth = (month?: number | string): string => {
  for (const key in Months) {
    if (Months.hasOwnProperty(key)) {
      if (Months[key] === Number(month)) {
        return key;
      }
    }
  }

  return '';
};

/**
 * @description Gets a month in integer form given a month in string form
 * @param {string} month
 * @returns {string}
 */
export const getIntegerMonth = (month: string): string => {
  const monthString = month.toLowerCase();
  const numMonth = Months[upperFirst(monthString)] || '';

  if (parseInt(numMonth, 10) && parseInt(numMonth, 10) < 10) {
    return `0${numMonth}`;
  }

  return `${numMonth}`;
};

/**
 * @description Gets the percentage completed in the application process
 *
 * @param stagesCompleted
 * @param stagesCount
 *
 * @returns {number}
 */
export const getPercentageComplete = (stagesCompleted: number | undefined, stagesCount: number | undefined): number =>
  stagesCompleted && stagesCount
    ? stagesCompleted >= stagesCount
      ? 100
      : Math.round((stagesCompleted / stagesCount) * 100)
    : 0;

/**
 * @description Creates a route for the application steps dynamically
 * @param {string} stepName
 * @param {string} companyId
 * @param {string} applicationId
 * @returns {string}
 */
export const createStepsPath = (stepName?: string, companyId?: string, applicationId?: string): string =>
  `/app/candidate/${companyId}/application/${applicationId}/${stepName}`;

/**
 * @description return count if more than two people in chat, else return profile for the user
 * @param {array} members
 * @param {array} profile
 * @returns {profile{} | number}
 */
export const dmUsers = (members: any[] | undefined, profile: any): any => {
  if (!members) {
    return;
  }

  const dmUser = members.filter((member: any) => member.id !== profile.profileId).map((member: any) => member);

  if (dmUser.length > 1) {
    return dmUser.length;
  } else {
    return dmUser[0];
  }
};

/**
 * @description Returns a users profile
 * @param {UserProfile} userProfile
 * @returns {string}
 */
export const getCurrentUser = (userProfile: UserProfile): string | void => {
  if (userProfile && userProfile.profile) {
    const currentUser =
      userProfile.profile.firstname && userProfile.profile.lastname
        ? `${userProfile.profile.firstname} ${userProfile.profile.lastname}`
        : userProfile.profile.name;
    return currentUser;
  }
};

/**
 * @description Gets a formatted application steps
 * @param {ApplicationForm} form fields
 * @param {Step[]} steps
 * @param {string} stepNames
 * @returns {Step[]}
 */
export const getApplicationSteps = (form: ApplicationForm, steps: FinishedStep[], status?: string): Step[] => {
  if (!form) {
    return [];
  }

  const submitted = status === APPLICATION_STATUS.SUBMITTED;
  const applicationSteps = ApplicationSteps.filter((item: Step) => {
    return (
      Object.keys(form).includes(item.stepName) ||
      item.stepName === StepName.reviewAndSubmit ||
      item.stepName === StepName.education
    );
  });

  return applicationSteps.map((step: Step) => {
    const item = step.stepName === StepName.education ? form[StepName.educationHistory] : form[step.stepName];
    const finished = steps && steps.map((step: FinishedStep) => humps.camelize(step.name)).includes(step.stepName);

    if (submitted && step.stepName === StepName.reviewAndSubmit) {
      return {
        ...step,
        done: true,
        disabled: false,
        required: item && item.stepType === 'required',
      };
    }

    return {
      ...step,
      done: finished,
      required: item && item.stepType === 'required',
      // if step is resume, we shouldn't disable this page
      disabled: step.stepName === StepName.resume ? false : !finished,
    };
  });
};

/**
 * @description Gets finished steps from application data
 * @param {Step[]} application
 * @param {FinishedStep[]} steps
 * @returns {Step[]}
 */
export const getStepsByFinishedSteps = (
  steps: Step[],
  finishedSteps: FinishedStep[],
  currentStep: string,
  status?: string,
): Step[] => {
  const submitted = status === APPLICATION_STATUS.SUBMITTED;
  const index = steps.findIndex((item: Step) => item.stepName === currentStep);

  return steps.map((step: Step, stepIndex: number) => {
    const finished: boolean = finishedSteps
      .map((step: FinishedStep) => humps.camelize(step.name))
      .includes(step.stepName);

    // Make next step available
    if (stepIndex === index + 1) {
      return {
        ...step,
        done: finished,
        disabled: false,
      };
    }

    if (submitted && step.stepName === StepName.reviewAndSubmit) {
      return {
        ...step,
        done: true,
        disabled: false,
      };
    }

    return {
      ...step,
      done: finished,
      // if step is resume, we shouldn't disable this page
      disabled: step.stepName === StepName.resume ? false : !finished,
    };
  });
};

/**
 * @description Gets finished steps from application data
 * @param {JobApplication} application
 * @param {Step[]} steps
 * @returns {FinishedStep[]}
 */
export const getStepsFromApplication = (application: object, steps: Step[]): FinishedStep[] => {
  return Object.keys(application)
    .filter((key: string) => steps.map((item: Step) => item.stepName).includes(key) || key === StepName.education)
    .map((item: string) => ({ name: item }));
};

/**
 * @description Get a empty application steps
 * @returns {object}
 */
export const getEmptyApplication = (): object => {
  let empty: object = {
    steps: null,
    status: '',
    coverLetterText: null,
    coverLetterFileId: null,
    salaryExpectation: null,
    educationHistory: null,
  };

  ApplicationSteps.filter(
    (step: Step) =>
      step.stepName !== StepName.education &&
      step.stepName !== StepName.resume &&
      step.stepName !== StepName.questions &&
      step.stepName !== StepName.coverLetter &&
      step.stepName !== StepName.reviewAndSubmit,
  ).forEach((step: Step) => {
    empty = {
      ...empty,
      [step.stepName]: null,
    };
  });
  return empty;
};

/**
 * @description converts proficiency string to a valid proficiency
 * @param {string} proficiency
 * @returns {string} valid proficiency
 */
export const validProficiency = (proficiency: string): string => {
  switch (proficiency) {
    case 'Native or Bi-Lingual':
      return 'native-or-bi-lingual';
    default:
      return proficiency.toLowerCase();
  }
};

export const proficiencyToDisplay = (validProficiency: string): string => {
  switch (validProficiency) {
    case 'native-or-bi-lingual':
      return 'Native or Bi-Lingual';
    case 'fluent':
      return 'Fluent';
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'conversational':
      return 'Conversational';
    default:
      return validProficiency;
  }
};

/**
 * @description checks if at there is at least one field in the form that is filled
 * @param {object} form values
 * @returns {boolean}
 */
export const isEmptyForm = (values: any): boolean => {
  let isEmpty: boolean = true;

  Object.keys(values).forEach((key: string) => {
    if (values[key]) {
      isEmpty = false;
    }
  });

  return isEmpty;
};

/**
 * @description Checks if all fields in the form are filled
 * @param {boolean} initialActiveValue
 * @param getFieldsValue
 * @returns {boolean}
 */
export const checkAllFieldsFilled = (initialActiveValue: boolean, values: object): boolean => {
  let filled: boolean = initialActiveValue;
  const fieldKeys: string[] = Object.keys(values);

  for (const key of fieldKeys) {
    if (!values[key]) {
      filled = false;
      break;
    }
  }

  return filled;
};

/**
 * @description Gets the Months and Years difference when given start dates and end dates
 * @param {string} startMonth
 * @param {string} startYear
 * @param {string} endMonth
 * @param {string} endYear
 * @returns {MonthsAndYearsRange}
 */
export const monthsAndYearsDifference = (
  startMonth: string,
  startYear: string,
  endMonth?: string,
  endYear?: string,
): MonthsAndYearsRange => {
  const startDate: Date = new Date(parseInt(startYear, 10), parseInt(startMonth, 10));
  const endDate: Date = endMonth && endYear ? new Date(parseInt(endYear, 10), parseInt(endMonth, 10)) : new Date();

  const start: moment.Moment = moment(startDate);
  const end: moment.Moment = moment(endDate);

  let diffInYears: number = 0;
  let diffInMonths: number = end.diff(start, 'month') + 1;

  diffInYears = Math.floor(diffInMonths / 12);
  diffInMonths = diffInMonths % 12;

  return { diffInYears, diffInMonths };
};

/**
 * @description Returns rendered string given MonthsAndYears range object
 * @param {MonthsAndYearsRange} difference
 * @returns {string}
 */
export const getTimeRange = (difference: MonthsAndYearsRange): string => {
  const years: number = difference.diffInYears;
  const months: number = difference.diffInMonths;
  const yearText: string = years > 1 ? 'years' : 'year';
  const monthText: string = months > 1 ? 'months' : 'month';

  if (years > 0) {
    if (months > 0) {
      return `(${years} ${yearText} and ${months} ${monthText})`;
    } else {
      return `(${years} ${yearText})`;
    }
  } else if (months > 0) {
    return `(${months} ${monthText})`;
  } else {
    return '(1 month)';
  }
};

/**
 * @description Gets full month name given month number in string or number format
 * @param {string|number} month
 * @returns {string}
 */
export const getMonthName = (month?: string | number): string =>
  month ? MonthNames[parseInt(`${month}`, 10) - 1] : '';

/**
 * Get file extension from filename
 * @param {string} filename
 * @returns {string}
 */
export const getFileExtension = (filename: string): string => {
  if (!filename) {
    return '';
  }

  const index = filename.lastIndexOf('.');
  const length = filename.length;
  return filename.substring(index + 1, length);
};

/**
 * @description Generates application step number
 * @param {string} stepName
 * @returns {number}
 */
export const getApplicationStepNumber = (steps: Step[], stepName?: string): number =>
  steps.findIndex((step: Step) => step.stepName === stepName) + 1;

/**
 * @description returns menu for message item.
 * @param {UserProfile} profile
 * @param  setEditable
 * @param {IconDefinition} faTrash
 * @param setRemovable
 * @param item
 */
export const formatMsgMenu = (
  profile: UserProfile,
  setEditable: (message: Message) => void,
  faTrash: IconDefinition,
  setRemovable: (message: Message) => void,
  faPencil: IconDefinition,
  item: any,
): any => {
  let menu: any = [];
  const editMsg = {
    icon: faPencil,
    text: 'Edit Message',
    handler: setEditable,
  };
  const deleteMsg = {
    icon: faTrash,
    text: 'Delete Message',
    isDanger: true,
    handler: setRemovable,
  };

  const expired: boolean | undefined =
    item && item.createdAt && differenceInMinutes(new Date(), new Date(item.createdAt)) > 60;

  const isAuthor: boolean = profile?.profileId === item?.author.id;
  const isDeleted: boolean = item && item.isDeleted;

  if (isAuthor && !expired && !isDeleted) {
    menu = [...menu, deleteMsg, editMsg];
  }
  return menu;
};

/**
 * @description update threadInfo after a reply message has been deleted
 * @param {Message} message
 * @param {string} createdBy
 * @param {number | undefined} authorMessagesCount
 * @returns {object}
 */

export const updateThreadInfo = (
  message: Message,
  authorMessagesCount: number | undefined,
  createdBy: string,
): object | null => {
  if (message.threadInfo && message.threadInfo.count > 1) {
    return {
      ...message.threadInfo,
      count: message.threadInfo
        ? message.threadInfo.count && message.threadInfo.count > 1
          ? message.threadInfo.count - 1
          : 0
        : 0,
      authors:
        authorMessagesCount && authorMessagesCount < 2
          ? message.threadInfo?.authors.filter((author: User) => author.id !== createdBy)
          : message?.threadInfo?.authors,
      lastMessageAt: message.threadInfo?.lastMessageAt,
    };
  }
  return null;
};

/**
 * @description return string of users in chat separated by comma and a count if more than 3
 * @param {User[]} members
 * @param {UserProfile} profile
 * @returns {string}
 */

export const setChatHeaderTitle = (members: User[] | undefined, profile: UserProfile): string => {
  const dmUser: User[] = members
    ? members.filter((member: User) => member.id !== profile.profileId).map((member: User) => member)
    : [];
  const count: number = dmUser.length - 3;

  return dmUser.length > 3
    ? dmUser
        .map((user: any) => user.name)
        .slice(0, 3)
        .join(', ') + ` and +${count} more`
    : dmUser.map((user: any) => user.name).join(', ');
};

/**
 * @description returns icon
 * @param {UserProfile[]} members
 * @param {UserProfile[]} profile
 * @returns {IconDefinition} such as faCircle
 */
export const setIconType = (members: User[] | undefined, profile: UserProfile): IconDefinition => {
  const chatStatus: string = dmUsers(members, profile) && dmUsers(members, profile).chatStatus;
  return chatStatus === ChatStatus.online ? faCircle : faCircleOutline;
};

/**
 * @description returns icon
 * @param {User[]} members
 * @param {User[]} profile
 * @param {string} threadType
 * @returns {IconDefinition} such as faCircle
 */
export const getIconType = (members: User[] | undefined, profile: UserProfile, threadType?: string): IconDefinition => {
  const selfOrBotRoom: boolean = threadType === ChannelTypes.SelfMessage || threadType === ChannelTypes.ChatBotMessage;
  return selfOrBotRoom ? faCircle : setIconType(members, profile);
};

/**
 * @description returns color string
 * @param {User[]} members
 * @param {User[]} profile
 * @returns {string} such as #39c049
 */
export const setColorValue = (members: User[], profile: UserProfile): string => {
  const chatStatus: string = dmUsers(members, profile) && dmUsers(members, profile).chatStatus;
  return chatStatus === ChatStatus.online ? ChatColors.OnlineGreen : ChatColors.OfflineGray;
};

/**
 * @description returns color string
 * @param {User[]} members
 * @param {User[]} profile
 * @param {string} threadType
 * @returns {string} such as #39c049
 */
export const getColorValue = (members: any, profile: UserProfile, threadType?: string): string => {
  const selfRoom: boolean = threadType === ChannelTypes.SelfMessage;
  const botRoom: boolean = threadType === ChannelTypes.ChatBotMessage;

  if (selfRoom) {
    return ChatColors.OnlineGreen;
  } else if (botRoom) {
    return ChatColors.ChatBotBlue;
  } else {
    return setColorValue(members, profile);
  }
};

/**
 * @description returns number | undefined
 * @param {User[]} members
 * @param {User[]} profile
 * @returns {string} such as #39c049
 */
export const setCountValue = (members: User[] | undefined, profile: UserProfile): number | undefined =>
  dmUsers(members, profile) && typeof dmUsers(members, profile) === 'number' ? dmUsers(members, profile) : undefined;

// tslint:disable-next-line:max-file-line-count
