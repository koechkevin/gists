import { routerRedux } from 'dva/router';
import humps from 'humps';
import { get, uniqBy } from 'lodash';

import { Action, Effects } from '../../../models/dispatch';
import { Routes } from '../../../routes';
import { JobService, LanguageService } from '../../../services';
import { StepName } from '../../../utils/constants';
import {
  createStepsPath,
  getApplicationSteps,
  getEmptyApplication,
  getFileExtension,
  getStepsByFinishedSteps,
} from '../../../utils/utils';
import { formatWorkHistoryData } from '../../../utils/workHistory';
import { Answer, ApplicationState, FinishedStep, JobApplication, Step } from './interfaces';

const initialState: ApplicationState = {
  references: [],
  isReferenceFormValid: true,
  militaryHistory: [],
  questions: [],
  responses: [],
  application: {},
  applications: [],
  applicationSteps: [],
  savedNow: false,
  coverLetter: null,
  addReferenceFormClicked: true,
  securityClearance: [],
  disableNext: true,
  resume: null,
  languages: [],
  applicationStatus: '',
  isSaving: false,
  queryParams: {
    expand: 'job',
  },
  applicationForm: null,
  showEmptyStepCard: false,
  validationErrors: [],
  statusHistories: [],
};

export default {
  namespace: 'application',

  state: initialState,

  effects: {
    *fetchApplicationForm({ payload }: Action, { call, put, select }: any) {
      try {
        const { queryParams } = yield select(({ application }: any): ApplicationState => application);
        const response = yield call(JobService.fetchJobApplication, payload, queryParams);
        let { data } = response;

        if (data) {
          data = humps.camelizeKeys(data);

          const { formId, steps, resume, applicationId, status } = data;
          const formResponse = yield call(JobService.fetchApplicationForm, formId);
          const formData: any = humps.camelizeKeys(formResponse.data);
          let stateReferences = [];
          if (resume?.references && resume.references.length) {
            stateReferences = resume.references;
          }
          const {
            data: { items: histories },
          } = yield call(JobService.fetchApplicationStatusHistory, applicationId);

          yield put({ type: 'storeApplication', payload: data });
          yield put({ type: 'storeFormData', payload: formData });
          yield put({ type: 'storeSecurityClearance', payload: resume && resume.securityClearance });
          yield put({
            type: 'storeReferences',
            payload: stateReferences.map((referee: any, index: number) => ({ ...referee, number: index })),
          });
          yield put({ type: 'storeStatusHistory', payload: humps.camelizeKeys(histories) });

          yield put.resolve({ type: 'fetchQuestions', payload: formId });

          const { questions } = yield select(({ application }: any): ApplicationState => application);
          const hasQuestions = questions.length > 0;
          let formSteps = getApplicationSteps(formData, steps, status);

          formSteps = formSteps.filter((step: Step) => (!hasQuestions ? step.stepName !== StepName.questions : true));

          yield put({ type: 'storeApplicationSteps', payload: formSteps });
        }
      } catch (error) {
        throw error;
      }
    },

    *fetchApplications(action: Action, { call, put }: Effects) {
      try {
        const response = yield call(JobService.fetchJobApplications, { expand: 'job' });
        const { data } = response;

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);
          yield put({ type: 'storeApplications', payload: data.items });
        }
      } catch (error) {
        throw error;
      }
    },

    *fetchQuestions({ payload }: Action, { put, call }: Effects) {
      try {
        const response = yield call(JobService.fetchApplicationQuestions, payload);
        const { data } = response;

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);
          yield put({ type: 'storeQuestions', payload: data.items });
        }
      } catch (error) {
        throw error;
      }
    },

    *updateApplication({ payload }: Action, { put, call }: Effects) {
      try {
        const { application, applicationId, stepName } = payload;
        const stepData = { step: stepName ? application[stepName] : application, stepName };

        yield put({ type: 'storeApplicationStep', payload: stepData });
        yield put({ type: 'storeSavedNow', payload: false });

        const applicationData =
          stepName === StepName.workHistory
            ? {
                ...application,
                resume: {
                  [StepName.workHistory]: formatWorkHistoryData(application.resume[StepName.workHistory]),
                },
              }
            : application;
        const params = humps.decamelizeKeys(applicationData);
        const response = yield call(JobService.updateJobApplication, applicationId, params);
        yield put({ type: 'common/showOrHideModal', modal: 'submitApplicationModal', payload: false });
        yield put({ type: 'common/showOrHideModal', modal: 'coverLetterModal', payload: false });

        const { data } = response;
        const historyRes = yield call(JobService.fetchApplicationStatusHistory, applicationId);

        if (data) {
          yield put({ type: 'storeApplication', payload: humps.camelizeKeys(data) });
          yield put({ type: 'updateAddReferenceFormClicked', payload: false });
          yield put({ type: 'storeSavedNow', payload: true });
          yield put({ type: 'setValidationErrors', payload: [] });
        }

        if (historyRes && historyRes.data && historyRes.data.items) {
          yield put({ type: 'storeStatusHistory', payload: humps.camelizeKeys(historyRes.data.items) });
        }
      } catch (error) {
        const { response } = error;

        if (response && response.status === 422) {
          yield put({ type: 'setValidationErrors', payload: response.data });
        } else {
          throw error;
        }
      }
    },

    *updateApplicationSteps({ payload }: Action, { put, call, select }: Effects) {
      try {
        const { currentStep, steps: finishedSteps } = payload;

        if (!currentStep) {
          throw new Error('Payload missing currentStep param');
        }

        if (!finishedSteps) {
          throw new Error('Payload missing steps param');
        }

        const stepsData = finishedSteps.map((item: FinishedStep) => ({ name: humps.decamelize(item.name) }));
        const { application, applicationSteps } = yield select(({ application }: any) => application);
        const { applicationId, companyId, status } = application;
        const index = applicationSteps.findIndex((item: Step) => item.stepName === currentStep);
        const response = yield call(JobService.updateJobApplication, application.applicationId, {
          steps: uniqBy(stepsData, 'name'),
        });
        const { data } = response;

        if (data) {
          const steps = getStepsByFinishedSteps(applicationSteps, finishedSteps, currentStep, status);

          yield put({ type: 'storeApplicationSteps', payload: steps });
          yield put({ type: 'storeApplication', payload: humps.camelizeKeys(data) });

          if (index < applicationSteps.length) {
            const nextStep = applicationSteps[index + 1].stepName;
            yield put(routerRedux.push(createStepsPath(nextStep, companyId, applicationId)));
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *postQuestionResponse({ payload }: Action, { put, call, select }: any) {
      try {
        yield put({ type: 'storeSavedNow', payload: false });
        const params = humps.decamelizeKeys(payload);
        const { responses } = yield select(({ application }: any): ApplicationState => application);
        const response = yield call(JobService.postQuestionResponse, params);
        const { data } = response;

        if (data) {
          yield put({ type: 'storeSavedNow', payload: true });
          yield put({ type: 'storeQuestionResponse', payload: [...responses, humps.camelizeKeys(data)] });

          const { application } = yield select(({ application }: any) => application);

          yield put.resolve({
            type: 'updateApplication',
            payload: { applicationId: application.applicationId, application: { ...application } },
          });
        }
      } catch (error) {
        throw error;
      }
    },

    *fetchQuestionsResponses({ payload }: Action, { put, call }: Effects) {
      try {
        const { applicationId } = payload;
        const response = yield call(JobService.fetchQuestionResponses, applicationId);

        yield put({ type: 'storeQuestionResponse', payload: humps.camelizeKeys(response.data.items) });
      } catch (error) {
        throw error;
      }
    },

    *updateQuestionResponse({ payload }: Action, { put, call, select, resolve }: any) {
      try {
        yield put({ type: 'storeSavedNow', payload: false });

        const { responseId, params } = payload;
        const response = yield call(JobService.putQuestionResponse, responseId, humps.decamelizeKeys(params));
        const { data } = response;

        if (data) {
          yield put({ type: 'storeQuestionResponseUpdate', payload: humps.camelizeKeys(data) });

          const { application } = yield select(({ application }: any) => application);

          yield put.resolve({
            type: 'updateApplication',
            payload: { applicationId: application.applicationId, application: { ...application } },
          });

          yield put({ type: 'storeSavedNow', payload: true });
        }
      } catch (error) {
        throw error;
      }
    },

    *fetchApplicationFile({ payload }: Action, { put, call }: Effects) {
      try {
        const { applicationId, fields } = payload;

        if (!applicationId) {
          throw new Error('Payload missing applicationId param');
        }

        if (!fields) {
          throw new Error('Payload missing fields param');
        }

        const fieldParam: string = humps.decamelize(fields);
        const params = {
          expand: humps.decamelize(fieldParam),
        };
        const response = yield call(JobService.fetchJobApplication, applicationId, params);
        const data: any = humps.camelizeKeys(response.data);
        let file = get(data, fields);

        if (data && file) {
          file = {
            ...file,
            type: getFileExtension(file.filename),
          };
          yield put({ type: 'fileUpload/loadFileList', payload: [file] });
        }
      } catch (error) {
        throw error;
      }
    },

    *uploadFile({ payload }: Action, { put, select, takeEvery }: any) {
      try {
        const { file, field } = payload;

        if (!file) {
          throw new Error('Payload missing file object');
        }

        if (!field) {
          throw new Error('Payload missing field name');
        }

        yield put({ type: 'fileUpload/uploadFile', payload: file });
        yield takeEvery('fileUpload/uploadStatus', function* upload(action: Action) {
          const { payload: file } = action;

          if (file.status !== 'done') {
            return;
          }

          const { application } = yield select(({ application }: any) => application);

          if (file) {
            if (field === 'resumeFileId') {
              yield put.resolve({
                type: 'updateApplication',
                payload: {
                  applicationId: application.applicationId,
                  application: {
                    resume: { [field]: file.fileId },
                  },
                },
              });
            } else {
              yield put.resolve({
                type: 'updateApplication',
                payload: { applicationId: application.applicationId, application: { [field]: file.fileId } },
              });
            }
            yield put({ type: 'uploadFile/@@end' });
          }
        });
      } catch (error) {
        throw error;
      }
    },

    *removeFile({ payload }: Action, { put }: any) {
      try {
        const { file, params } = payload;

        if (!file) {
          throw new Error('Payload missing file object');
        }

        if (!params) {
          throw new Error('Payload missing params');
        }

        yield put.resolve({ type: 'updateApplication', payload: params });

        if (file) {
          yield put({ type: 'fileUpload/clearFileList' });
        }
      } catch (error) {
        throw error;
      }
    },

    *importResume({ payload }: Action, { put, call, select, take }: Effects) {
      try {
        const { file } = payload;

        if (!file) {
          throw new Error('Payload missing file object');
        }

        yield put({ type: 'uploadFile', payload: { file, field: 'resumeFileId' } });
        yield take('uploadFile/@@end');

        const { application, applicationSteps } = yield select(({ application }: any) => application);
        const params = { resumeFileId: application.resume.resumeFileId };
        const response = yield call(JobService.parseResume, humps.decamelizeKeys(params));

        if (response.data) {
          const resume = {
            ...params,
            ...response.data,
            filename: file.name,
          };
          const data = humps.camelizeKeys(resume);
          const finishedSteps = [{ name: StepName.resume }];
          const steps = getStepsByFinishedSteps(applicationSteps, finishedSteps, StepName.resume);

          yield put({ type: 'storeResume', payload: data });
          yield put({ type: 'storeApplicationSteps', payload: steps });
        }
      } catch (error) {
        throw error;
      }
    },

    *removeResume({ payload }: Action, { put }: any) {
      try {
        yield put.resolve({ type: 'removeFile', payload });
        yield put.resolve({ type: 'resetApplication' });
        yield put({ type: 'common/showOrHideModal', modal: 'showConfirmModal', payload: false });
      } catch (error) {
        throw error;
      }
    },

    *resetApplication({ payload }: Action, { put, select }: Effects) {
      try {
        const { application, applicationSteps } = yield select(({ application }: any) => application);
        const finishedSteps = [{ name: StepName.resume }];
        const steps = getStepsByFinishedSteps(applicationSteps, finishedSteps, StepName.resume);

        yield put({
          type: 'updateApplication',
          payload: {
            applicationId: application.applicationId,
            application: getEmptyApplication(),
          },
        });
        yield put({ type: 'storeApplicationSteps', payload: steps });
      } catch (error) {
        throw error;
      }
    },

    *fetchLanguages(action: Action, { put, call }: Effects) {
      try {
        const { data } = yield call(LanguageService.fetchLanguages);
        yield put({ type: 'setLanguageList', payload: data });
      } catch (error) {
        throw error;
      }
    },

    *removeApplication({ payload }: Action, { put, call, select }: Effects) {
      try {
        const { companyId, applicationId } = payload;
        const { applications } = yield select(({ application }: any) => application);

        if (!companyId) {
          throw new Error('Payload missing companyId');
        }

        if (!applicationId) {
          throw new Error('Payload missing applicationId');
        }

        yield call(JobService.deleteApplication, applicationId);

        const data = applications.filter((application: JobApplication) => application.applicationId !== applicationId);

        yield put({ type: 'storeApplication', payload: {} });
        yield put({ type: 'storeApplications', payload: data });
        yield put({ type: 'common/showOrHideModal', modal: 'showRemoveApplicationModal', payload: false });
        yield put(routerRedux.push(`${Routes.Candidate}/${companyId}/application`));
      } catch (error) {
        throw error;
      }
    },

    *withdrawApplication({ payload }: Action, { put, call, select }: Effects) {
      try {
        const { applicationId, companyId } = payload;
        const { applications } = yield select(({ application }: any) => application);
        const remainingApplications: JobApplication[] = applications.filter(
          (application: JobApplication) => application.applicationId !== applicationId,
        );

        yield call(JobService.withdrawApplication, applicationId);

        yield put({ type: 'common/showOrHideModal', modal: 'withdrawApplicationModal', payload: false });
        yield put({ type: 'storeApplication', payload: {} });
        yield put({ type: 'storeApplications', payload: remainingApplications });
        yield put(routerRedux.push(`${Routes.Candidate}/${companyId}/application`));
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    storeReferences(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, references: payload };
    },

    storeResume(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, resume: payload };
    },

    storeSecurityClearance(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, securityClearance: payload };
    },

    storeApplications(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, applications: payload };
    },

    storeApplicationSteps(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, applicationSteps: payload };
    },

    storeApplicationStep(state: ApplicationState, { payload }: Action): ApplicationState {
      const { stepName, step } = payload;

      return {
        ...state,
        isReferenceFormValid: true,
        application: stepName ? { ...state.application, [stepName]: step } : { ...state.application, ...step },
      };
    },

    storeApplication(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, application: payload, isReferenceFormValid: true };
    },

    setIsReferenceValid(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, isReferenceFormValid: payload };
    },

    storeQuestionResponse(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, responses: payload };
    },

    storeQuestionResponseUpdate(state: ApplicationState, { payload }: Action): ApplicationState {
      return {
        ...state,
        responses: [
          ...state.responses.filter((response: Answer) => response.questionId !== payload.questionId),
          payload,
        ],
      };
    },

    storeSavedNow(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, savedNow: payload };
    },

    updateAddReferenceFormClicked(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, addReferenceFormClicked: payload };
    },

    storeQuestions(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, questions: payload };
    },

    setDisableNext(state: ApplicationState, { payload: disableNext }: Action): ApplicationState {
      return { ...state, disableNext };
    },

    setLanguageList(state: ApplicationState, { payload }: Action): ApplicationState {
      const otherLanguage = payload.find((language: any) => language.name === 'Other');
      const language = payload.filter((language: any) => language.name !== 'Other');
      const languages = [...language.sort((a: any, b: any) => (a.name > b.name ? 1 : -1)), otherLanguage];

      return { ...state, languages };
    },

    updateApplicationStatus(state: ApplicationState, { payload }: Action): ApplicationState {
      return { ...state, applicationStatus: payload };
    },

    storeFormData: (state: ApplicationState, { payload }: Action): ApplicationState => ({
      ...state,
      applicationForm: payload,
    }),

    showEmptyCard: (state: ApplicationState, { payload }: Action): ApplicationState => ({
      ...state,
      showEmptyStepCard: payload,
    }),

    storeStatusHistory: (state: ApplicationState, { payload }: Action): ApplicationState => ({
      ...state,
      statusHistories: payload,
    }),

    setValidationErrors: (state: ApplicationState, { payload }: Action): ApplicationState => ({
      ...state,
      validationErrors: payload,
    }),
  },
};
// tslint:disable-next-line: max-file-line-count
