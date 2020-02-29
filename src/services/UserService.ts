import { ApiUrl } from './ApiConfig';
import { GET_API, PUT_API } from './AxiosInstance';

export class UserService {
  public static fetchUserProfiles(params?: string): Promise<any> {
    return GET_API(ApiUrl.USER_PROFILE, params);
  }

  public static fetchUserMyProfiles(token: string, params?: string): Promise<any> {
    return GET_API(ApiUrl.USER_MY_PROFILE, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public static fetchUserProfile(id: string, params: string): Promise<any> {
    return GET_API(`${ApiUrl.USER_PROFILE}/${id}`, params);
  }

  public static fetchActivityLog(params: string): Promise<any> {
    return GET_API(`${ApiUrl.USER_ACTIVITY_LOG}`, params);
  }

  public static updateMyProfile = (id: string, data: any): Promise<any> => PUT_API(`${ApiUrl.MY_PROFILE}/${id}`, data);
  public static changePassword = (id: string, data: any): Promise<any> =>
    PUT_API(`${ApiUrl.USER_PROFILE}/${id}/change-password`, data)
}
