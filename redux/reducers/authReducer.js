import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from './../actionType'

const initialState = {}

const authReducer = (state = initialState, action) => {
    const dispatch = useDispatch;
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return action.payload;
        case GLOBALTYPES.UPDATE_USER_INFOR:
            return {
                ...state,user: {...state.user,
                     profilePicture: action.payload.newProfilePicture,
                     username: action.payload.newUsername,
                     gender: action.payload.newGender,
                }
             };

        default:
            return state;
    }
}


export default authReducer