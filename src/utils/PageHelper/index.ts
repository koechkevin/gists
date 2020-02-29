import { PageInfo } from './PageInfo';

export class PageHelper {
  public static create = (page: number = 1, sort: string = '-created_at') => {
    const pageInfo = new PageInfo(page, sort);
    return pageInfo;
  }

  public static requestFormat = (pageInfo: PageInfo) => {
    return {
      'page': pageInfo.getPage(),
      'per-page': pageInfo.getPerPage(),
      'sort': pageInfo.getSort(),
    };
  }
}

export { PageInfo };
