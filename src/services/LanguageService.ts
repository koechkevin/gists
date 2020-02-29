import { ApiUrl } from './ApiConfig';
import { GET_API } from './AxiosInstance';

export class LanguageService {
  public static fetchLanguages(params?: object): Promise<any> {
    return GET_API(ApiUrl.GET_LANGUAGES, params);
  }
}
