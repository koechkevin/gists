import { FileModel } from '../../../models/file';

export interface TypedSteps {
  id: number;
  name: string;
}

export interface QuestionTyped {
  id: number;
  question: string;
  required: boolean;
  type: string;
}

export interface Qualification {
  id: string;
  name: string;
  type: string;
}

export interface Team {
  type: string;
  about: string;
}

export interface Job {
  id?: number;
  name?: string;
  role: string;
  description: string;
  compensation: string;
  qualifications: [Qualification];
  responsibilities?: T[string];
  requirements?: T[string];
  availability: string;
  location: string;
  steps: TypedSteps[];
  step: TypedSteps;
  otherSteps: T[string];
  questions: T[QuestionTyped];
  alumni?: number;
  comment?: string;
  projectLength?: string;
  level?: string;
  skills?: T[string];
  schedule?: string;
}

export interface Company {
  id?: number;
  name?: string;
  industry: string;
  location: string;
  logo: string;
  website: string;
  size: string;
  availability: string;
  about: string;
  team: Team;
  jobs: [TypedJobList];
  company_header_image: string;
}

export type Jobs = Company[];

// Channel type enum
export enum ChannelType {
  JobApply = 'job-apply',
  Channel = 'channel',
  DirectMessage = 'direct-message',
}

export interface Thread {
  id: string;
  name?: string;
  type?: string;
  messages?: Message[];
  message?: Message;
  members?: User[];
  draft?: string;
  draftId?: string;
  isDrafted?: boolean;
  createdBy?: string; // user id
  createdAt?: Date;
  updatedAt?: Date;
  draftThreadId?: string;
  status?: string;
}

export interface Channel extends Thread {
  desc?: string;
  starred?: boolean;
  locked?: boolean;
  author?: User;
  currentUser?: string;
  companyId?: string;
}

export interface DirectMessageChannel extends Channel {
  recruiter: User;
}

export type Channels = Channel[];

export interface Draft {
  createdBy?: string;
  id?: string;
  message?: string;
  roomId?: string;
  threadId?: string; // the id of message being replied on (messageId)
}

export enum CandidateTag {
  draft = 'Draft',
  temp = 'Temp',
  new = 'New',
  topMatch = 'Top Match',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isRobot: boolean;
  inCall?: boolean;
  productId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: number;
  chatStatus?: string;
  isTyping?: boolean;
  role?: string;
}

export interface Candidate extends User {
  tag: CandidateTag;
  position?: string;
  addr?: string;
  specialists: string[];
  completed: boolean;
  via?: string;
  viaDate?: string;
}

export type Candidates = Candidate[];

export interface Pipeline {
  name: string;
  count: number;
  candidates: Candidates;
}

export interface Message {
  id: string;
  threadId?: string; // room_id
  forwarding?: Message | null;
  type?: string;
  author?: User;
  text?: string;
  file?: FileModel;
  replies?: Message[];
  editable?: boolean;
  threadInfo?: {
    count: number;
    authors: User[];
    lastMessageAt: Date;
  } | null;
  updatedAt: Date;
  createdAt: Date;
  isModified?: boolean;
  draftId?: string;
  draftText?: string;
  isDeleted?: boolean;
  unReadMessage?: boolean;
  read?: string[];
}

export interface MessageRender extends Message {
  repeated: boolean;
  divided: boolean;
}
