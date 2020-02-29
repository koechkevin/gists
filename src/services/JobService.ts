import { ApiUrl } from './ApiConfig';
import { DELETE_API, GET_API, POST_API, PUT_API } from './AxiosInstance';

export class JobService {
  public static fetchJobs(params?: object): Promise<any> {
    return GET_API(ApiUrl.JOBS_ALL, params);
  }

  public static fetchJobDetails(id: string, params?: object): Promise<any> {
    return GET_API(`${ApiUrl.JOBS_ALL}/${id}`, params);
  }

  public static fetchCompanies(params?: object): Promise<any> {
    return GET_API(ApiUrl.COMPANIES_ALL, params);
  }

  public static fetchCompanyDetails(payload: { id: number }): Promise<any> {
    return GET_API(`${ApiUrl.COMPANIES_ALL}/${payload.id}`);
  }

  public static updateJobApplication(id: string, params: object): Promise<any> {
    return PUT_API(`${ApiUrl.APPLICATIONS}/${id}`, params);
  }

  public static fetchJobApplications(params?: object): Promise<any> {
    return GET_API(ApiUrl.APPLICATIONS, params);
  }

  public static fetchJobApplication(applicationId: string, params?: object): Promise<any> {
    return GET_API(`${ApiUrl.APPLICATIONS}/${applicationId}`, params);
  }

  public static fetchApplicationForms(jobId?: string, params?: object): Promise<any> {
    return GET_API(ApiUrl.APPLICATION_FORMS, {
      'filters[job_id]': jobId,
      ...params,
    });
  }

  public static fetchApplicationForm(formId: string, params: object): Promise<any> {
    return GET_API(`${ApiUrl.APPLICATION_FORMS}/${formId}`, params);
  }

  public static fetchApplicationQuestions(formId?: string, params?: object): Promise<any> {
    return GET_API(ApiUrl.APPLICATION_QUESTIONS, {
      'filters[form_id]': formId,
      ...params,
    });
  }

  public static fetchQuestionResponses(applicationId?: string, params?: object): Promise<any> {
    return GET_API(ApiUrl.APPLICATION_QUESTION_RESPONSES, {
      'filters[application_id]': applicationId,
      ...params,
    });
  }

  public static postQuestionResponse(params: object): Promise<any> {
    return POST_API(`${ApiUrl.APPLICATION_QUESTION_RESPONSES}`, params);
  }

  public static putQuestionResponse(responseId: string, params: any): Promise<any> {
    return PUT_API(`${ApiUrl.APPLICATION_QUESTION_RESPONSES}/${responseId}`, params);
  }

  public static deleteApplication(applicationId: string): Promise<any> {
    return DELETE_API(`${ApiUrl.APPLICATIONS}/${applicationId}`);
  }

  public static withdrawApplication(applicationId: string, params?: object): Promise<any> {
    return DELETE_API(`${ApiUrl.APPLICATIONS}/${applicationId}/withdraw`);
  }

  public static createResume(params?: object): Promise<any> {
    return POST_API(ApiUrl.RESUME, params);
  }

  public static parseResume(params?: object): Promise<any> {
    return POST_API(ApiUrl.RESUME_PARSE, params);
  }

  public static fetchApplicationStatusHistory(applicationId?: string, params?: object): Promise<any> {
    return GET_API(ApiUrl.APPLICATION__STATUS_HISTORY, {
      'filters[application_id]': applicationId,
      ...params,
    });
  }
}
