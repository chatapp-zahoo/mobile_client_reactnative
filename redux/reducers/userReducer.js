import { GLOBALTYPES } from "../actionType";

const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_FRIENDS_USER:
      return {
        data: action.payload,
      };

    case GLOBALTYPES.ACCEPT_REQUEST_ADD_FRIEND:
      return {
        data: [action.payload.data, ...state.data],
      };

    case GLOBALTYPES.UPDATE_FRIENDS:
      return {
        data: [action.payload, ...state.data],
      };
    case GLOBALTYPES.UPDATE_DELETE_FRIENDS:
      return { ...state,
        data: state.data.filter(user => user._id !== action.payload._id)
      };
    case GLOBALTYPES.UNFRIEND:

      return { ...state,
        data: state.data.filter(user => user._id !== action.payload.data)
      };
    default:
      return state;
  }
};

export default userReducer;
