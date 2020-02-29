import { ChatStatus } from '@aurora_app/ui-library/lib/utils';
import { find, includes, random } from 'lodash';

import { FileModel } from '../models/file';
import { UserProfile } from '../models/user';
import { Channel, Message } from '../pages/Messages/models/typed';

export const membersConvert = (profileIds: string[], profiles: any[]) => {
  const ret: any[] = [];
  profileIds.forEach((id) => {
    const randomNum = random(0, 10);
    const user = find(profiles, ({ profile }) => profile && profile.profileId === id);

    if (user) {
      ret.push({
        id: user.profile.profileId,
        name:
          user.profile.firstname && user.profile.lastname
            ? `${user.profile.firstname} ${user.profile.lastname}`
            : `${user.profile.name}`,
        avatar: null,
        avatarColor: user.avatarColor,
        status: user.status,
        chatStatus: user.chatStatus,
        inCall: random(0, 10) > 7 ? true : false,
        isRobot: false,
        productId: user.productId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isDeleted: user.isDeleted,
        specialists:
          randomNum > 7
            ? ['functional programming', 'technical knowledge', 'unit test']
            : randomNum > 4
            ? ['engineering', 'technical knowledge', 'systems integration']
            : ['engineering', 'technical knowledge'],
        position:
          randomNum > 7 ? 'Full-Stack Developer' : randomNum > 4 ? 'Accounts Receivable' : 'Accounts Specialist',
      });
    }
  });
  return ret;
};

export const createdByConverter = (profileId: string, profiles: any[]) => {
  let ret: any = { id: '', name: 'Unknown' };
  const user = find(profiles, ({ profile }) => profile.profileId === profileId);

  if (user) {
    ret = {
      id: user.profile.profileId,
      name:
        user.profile.firstname && user.profile.lastname
          ? `${user.profile.firstname} ${user.profile.lastname}`
          : `${user.profile.name}`,
      avatar: null,
      status: user.status,
      avatarColor: user.avatarColor,
      chatStatus: user.chatStatus,
      inCall: random(0, 10) > 7 ? true : false,
      isRobot: false,
      productId: user.productId,
      createdAt: user.createdAt,
      updatedAt: user.updateAt,
      isDeleted: user.isDeleted,
      role: user.role,
    };
  }
  return ret;
};

interface ThreadInformation {
  count: number;
  authors: any[];
  lastMessageAt: Date;
}

interface Msg {
  id: string;
  roomId: string;
  message: string;
  file?: FileModel;
  forwarding?: Msg;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  read?: string[];
  updatedMessage?: Date;
  isDeleted?: boolean;
  threadInformation?: ThreadInformation;
}

export const msgConverter = (msg: Msg, profiles: any[]): Message => {
  return {
    id: msg.id,
    threadId: msg.roomId,
    type: 'Normal',
    file: msg.file,
    text: msg.message,
    forwarding: msg.forwarding ? msgConverter(msg.forwarding, profiles) : null,
    createdAt: msg.createdAt || new Date(),
    updatedAt: msg.updatedAt || new Date(),
    replies: [],
    author: createdByConverter(msg.createdBy, profiles),
    editable: false,
    isModified: Boolean(msg.updatedMessage),
    isDeleted: msg && msg.isDeleted,
    read: msg.read,
    threadInfo: msg.threadInformation
      ? {
          count: msg.threadInformation.count,
          authors: msg.threadInformation.authors.map((id: string) => createdByConverter(id, profiles)),
          lastMessageAt: msg.threadInformation.lastMessageAt,
        }
      : null,
  };
};

export const statusAssign = (onlineIds: string[], profiles: any[]) => {
  return profiles.map((element) => ({
    ...element,
    chatStatus: onlineIds.includes(element.profileId) ? ChatStatus.online : ChatStatus.offline,
  }));
};

export const threadStatusAssign = (onlineIds: string[], channel: Channel) => {
  return {
    ...channel,
    members:
      channel && channel.members
        ? channel.members.map((member) => ({
            ...member,
            chatStatus: onlineIds.includes(member.id) ? ChatStatus.online : ChatStatus.offline,
          }))
        : [],
  };
};

export const assignTypingStatus = (payload: any, channel: Channel) => {
  return {
    ...channel,
    members:
      channel && channel.members
        ? channel.members.map((member) => ({
            ...member,
            isTyping:
              member.id === payload.profileId && channel.id === payload.roomId ? payload.isTyping : member.isTyping,
          }))
        : [],
  };
};

/**
 * @description Returns Ids of all unread messages in chatroom
 * @param {messages} messages messages in chatroom
 * @param {profile} profile current user profile
 * @returns {string[]} IDs of all unread messages from the list
 */
export const getUnreadMessageIds = (messages?: Message[], profile?: UserProfile): string[] => {
  if (!messages) {
    return [];
  }

  const allUnreadIds = messages
    .filter((message) => !includes(message.read, profile?.profileId))
    .map((msg: Message) => msg.id);
  return allUnreadIds;
};
