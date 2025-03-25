export const ADD_CONVERSATION_HISTORY = 'ADD_CONVERSATION_HISTORY';

export const addConversationHistory = (conversations) => ({
  type: ADD_CONVERSATION_HISTORY,
  payload: conversations,
});
