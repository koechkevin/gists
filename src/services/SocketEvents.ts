/**
 * Web Socket event names enum
 */
export enum SocketEvents {
  Error = 'error',
  Online = 'online',
  Typing = 'typing',
  TypingBroadCast = 'typing_broadcast',
  Send = 'message_send',
  Update = 'message_update',
  Delete = 'message_delete_response_success',
  SendRepSuccess = 'message_send_response_success',
  NewMessagesBroadCast = 'room_new_messages',
  SendBroadcast = 'message_send_broadcast',
  UpdateBroadcast = 'message_update_broadcast',
  updateError = 'message_update_response_error',
  DeletedBroadcast = 'message_delete_broadcast',
  DeleteError = 'message_delete_response_error',
  DraftCreateBroadcast = 'draft_create_broadcast',
  UpdateDraftsBroadcast = 'draft_update_broadcast',
  DeleteDraftsBroadcast = 'draft_delete_broadcast',
}

export enum SocketErrors {
  InvalidToken = 'invalid_token',
}

export default SocketEvents;
