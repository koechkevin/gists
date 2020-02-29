import { differenceInMinutes, isSameDay, isToday } from 'date-fns';
import { find, includes } from 'lodash';

import { UserProfile } from '../models/user';
import { Phone } from '../pages/Application/models/interfaces';
import { initialMessage } from '../pages/Messages/models/channel';
import { Message } from '../pages/Messages/models/typed.d';

/**
 * @description Formats phone number into a string for rendering
 * @param {Phone} phone
 * @returns {string}
 */
export const formatPhone = (phone?: Phone): string => {
  if (phone) {
    return phone.code && phone.number ? `${phone.code} ${phone.number}` : `${phone.number}`;
  }

  return '';
};

const formatMessage = (messages?: Message[], profile?: UserProfile) => {
  return messages && messages.length
    ? messages.map((msg: Message, idx: number) => {
        let divided = true;
        let unReadMessage = false;
        const lastMsg: Message = idx > 0 ? messages[idx - 1] : initialMessage;
        const lastMsgAuthor = lastMsg ? lastMsg.author : { id: null };
        const withTheSameAuthor = msg.author && lastMsgAuthor && msg.author.id === lastMsgAuthor.id;
        const isRepliesEmpty = !msg.threadInfo;
        const isLastMsgRepliesEmpty = !lastMsg.threadInfo;
        const isNotForwarded = !msg.forwarding;
        const isNotLastMsgForwarded = !lastMsg.forwarding;

        if (idx !== 0) {
          const createdAt = msg && msg.createdAt;
          const lastCreatedAt = lastMsg && lastMsg.createdAt;

          if (createdAt && lastCreatedAt) {
            const atSameDay = isSameDay(new Date(createdAt), new Date(lastCreatedAt));
            const today = isToday(new Date(createdAt)) && isToday(new Date(lastCreatedAt));
            const largeThan15Mins = today && differenceInMinutes(new Date(createdAt), new Date(lastCreatedAt)) > 15;
            divided = !atSameDay || largeThan15Mins;
          }
        }

        // get the id of first unread message
        const unReadMessageId = find(messages, (message) => !includes(message.read, profile?.profileId))?.id;
        if (msg.id === unReadMessageId) {
          unReadMessage = true;
        }

        const repeated =
          idx !== 0 &&
          withTheSameAuthor &&
          isRepliesEmpty &&
          isLastMsgRepliesEmpty &&
          isNotForwarded &&
          isNotLastMsgForwarded &&
          !divided
            ? true
            : false;
        return { ...msg, repeated, divided, unReadMessage };
      })
    : [];
};

export default formatMessage;
