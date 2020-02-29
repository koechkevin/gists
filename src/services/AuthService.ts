import { BasicAuth } from '../models/user';
import { RegisterAuth } from '../pages/ApplyAuth/models/interfaces';
import { ApiUrl } from './ApiConfig';
import { GET_API, POST_API, PUT_API } from './AxiosInstance';

export class AuthService {
  public static loginAccount(params: BasicAuth): Promise<any> {
    return POST_API(ApiUrl.AUTH_LOGIN, params);
  }

  public static signUpAccount(params: RegisterAuth): Promise<any> {
    return POST_API(ApiUrl.AUTH_SIGNUP, params);
  }

  public static checkUsername(params: BasicAuth): Promise<any> {
    return GET_API(ApiUrl.CHECK_USERNAME, params);
  }

  public static selectProfile(id: string, token: string): Promise<any> {
    return POST_API(
      ApiUrl.AUTH_SELECT_PROFILE,
      { profile_id: id },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  public static verifyEmail(userId: string, code: number): Promise<any> {
    return PUT_API(`${ApiUrl.AUTH_VERIFY_EMAIL}/${userId}`, { verification_code: code }, {});
  }

  public static resendVerificationCode(email: string): Promise<any> {
    return PUT_API(`${ApiUrl.AUTH_RESEND_VERIFY_CODE}`, { username: email }, {});
  }

  public static forgotPassword(email: string): Promise<any> {
    return POST_API(ApiUrl.AUTH_FORGOT_PASSWORD, { email });
  }

  public static fillNewPassword(data: any, authKey: string): Promise<any> {
    return PUT_API(`${ApiUrl.AUTH_FILL_PASSWORD}${authKey}`, data);
  }
}
