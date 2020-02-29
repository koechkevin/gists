import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';

export interface Error {
  message: string;
  field: string;
}

export interface ChatHeaderDetails {
  statusIcon: IconDefinition;
  iconColor: string;
  jobPosition: string;
  isManyUsers: boolean;
}
