import { ApiUrl } from './ApiConfig';
import { GET_API } from './AxiosInstance';

export class WorkspaceService {
  public static fetchWorkSpaces(params: object): Promise<any> {
    return GET_API(`${ApiUrl.GET_WORKSPACES}`, params);
  }
}
