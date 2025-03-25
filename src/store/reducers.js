import { ADD_CONVERSATION_HISTORY } from './actions';

const initialState = { conversations: [] };

export const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONVERSATION_HISTORY:
      return { ...state, conversations: action.payload };
    default:
      return state;
  }
};
