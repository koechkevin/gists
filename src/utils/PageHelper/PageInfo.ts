export class PageInfo {
  public constructor(page: number, sort: string) {
    this.page = page;
    this.sort = sort;
  }
  // which page to fetch
  private page = 1;

  public getPage = () => this.page;

  // current page
  private currentPage = 1;

  public getCurrentPage = () => this.currentPage;

  // page size
  private perPage = 30;

  public getPerPage = () => this.perPage;

  // total count of the records
  private totalCount = 0;

  // touch count of the pages
  private pageCount = 0;

  public getPageCount = () => this.pageCount;

  private filters = {};

  private sort: string = '';

  public getSort = () => this.sort;

  public sortBy = (sort: string) => {
    this.sort = sort;
  }

  public jumpPage(page: number = this.page, perPage: number = this.perPage): PageInfo {
    if ((page && page <= Math.ceil(this.pageCount)) || page === 1) {
      this.page = page;
      if (perPage) {
        this.perPage = perPage;
      }
    }
    return this;
  }
}
