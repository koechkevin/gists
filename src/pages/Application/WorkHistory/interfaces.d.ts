export interface Position {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  title: string;
  experience: string;
  stillWorking: boolean;
  addressCountry: string;
}

export interface StatePosition extends Position {
  index: number;
}

export interface Company {
  positions: Position[];
  companyName: string;
}

export interface StateCompany extends Company {
  index: number;
  positions: StatePosition[];
}

export type VoidFunc = (value: any) => void;
export type ParamVoidFunc = (pos: number) => VoidFunc;
export type ParamVoidFunction = (pos: number) => void;

export interface State {
  companies: StateCompany[];
  checkStillWorking?: boolean;
  save?: boolean;
}
