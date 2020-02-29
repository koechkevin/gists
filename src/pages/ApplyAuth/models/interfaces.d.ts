export interface ApplyAuthState extends FullName {
  exist: boolean;
  email: string;
  loading: boolean;
  message: string;
  userId: string;
  status: string;
  activeKey: string;
  progressStatus: number;
  showModal: boolean;
}

export interface FullName {
  firstname: string;
  lastname: string;
}

export interface RegisterAuth extends FullName {
  username: string;
  password: string;
}

export interface ActivateAccount {
  userId: string;
  code: number;
  username: string;
  password: string;
}

export interface NextTab {
  activeKey: string;
  progressStatus: number;
}
