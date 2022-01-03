import { GLOBALTYPES } from "./../actionType";

const initialState = {};

const conversationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_CONVERSATIONS_SUCCESS:
      return action.payload;
      
    case GLOBALTYPES.ADD_CONVERSATION:
      return {
        data: [action.payload, ...state.data],
      };
      
    case GLOBALTYPES.UPDATE_CONVERSATION: {
      const msg = action.payload;
      const convers = [...state.data];

      const index = convers.findIndex((el) => el._id === msg.conversation);
      
      if (index !== -1) {
        convers[index] = {
          ...convers[index],
          lastMessage: msg,
        };
      }
      const conver= convers[index]

      return {
        data: [conver, ...state.data.filter(c=> c._id!==msg.conversation )]
      };
    }
    case GLOBALTYPES.UPDATE_LABEL_CURRENTCONVERSATION:
      const convers = [...state.data];
      const index = convers.findIndex((el) => el._id === action.payload._id);
      if (index !== -1) {
        convers[index] = {
          ...convers[index],
          label: action.payload.label,
        };
      }
      return {
        ...state,
        data: [...convers],
      };

    case GLOBALTYPES.CHANGE_GROUP_NAME_OF_CONVERSATION_IN_LIST_CONVERSATION: {
      const { conversationId, newLabel } = action.payload;
      const convers = [...state.data];
      const index = convers.findIndex((el) => el._id === conversationId);
      if (index !== -1) {
        convers[index] = {
          ...convers[index],
          label: newLabel,
        };
      }
      return {
        ...state,
        data: [...convers],
      };
    }
    case GLOBALTYPES.KICK_MEMBER_TO_SOCKET:
      return {
        data: state.data.filter(conversation=>conversation._id !== action.payload.conversation._id ),
      };

    case GLOBALTYPES.OUT_GROUP:{
      return {...state,
        data: state.data.filter(c => c._id !== action.payload._id)}
    }
      


   case GLOBALTYPES.OUT_GROUP_TO_CLIENT:{
          const{conversation,memberID} =action.payload          
          const convers = [...state.data] 
          const index = convers.findIndex((el) => el._id === conversation._id)
          
          if(index !== -1){
              convers[index] = {
                  ...convers[index],
                  member:convers[index].member.filter(m=> m._id !== memberID)
              }
          }
          return {...state,
              data:[...convers]}
      }

      case GLOBALTYPES.DELETE_GROUP:{
        return {...state,
          data: state.data.filter(c => c._id !== action.payload._id)}
      }


      case GLOBALTYPES.DELETE_GROUP_TO_CLIENT:{
        
        return {...state,
            data: state.data.filter(c=> c._id !== action.payload.conversation._id)}
    }

    case GLOBALTYPES.UPDATE_CURRENT_CONVERSATION_ADD_MEMBER:{
      const {conversation, member} = action.payload
      // process here
 
      // const newMember = state.data.member.concat(member)
      const convers = [...state.data] 
      const index = convers.findIndex((el) => el._id === conversation._id)
      if(index !== -1){
          convers[index] = {
              ...convers[index],
              member: convers[index].member.concat(member)
          }
      }
      return {
           ...state,
          data:[...convers]
      }
  }
  
  case GLOBALTYPES.ADD_MEMBER_GROUP_TO_CLIENT:{
    let {conversation, member} = action.payload
    const convers = [...state.data] 

    if(convers.filter((el) => el._id === conversation._id).length >0 )
    {
      const  index = convers.findIndex((el) => el._id === conversation._id)
      if(index !==-1){
        convers[index] = {
            ...convers[index],
            member:convers[index].member.concat(member)
          }
      }
        return {
            ...state,
           data:[...convers]
       }
    }

    else {
      conversation.member.concat(member)
        return {
          data: [conversation, ...state.data]
        }
    }
    
}
case GLOBALTYPES.UPDATE_KICK_MEMBER_TO_CLIENT:{
  const{conversation,memberID} =action.payload          
  const convers = [...state.data] 
  const index = convers.findIndex((el) => el._id === conversation._id)
  
  if(index !== -1){
      convers[index] = {
          ...convers[index],
          member:convers[index].member.filter(m=> m._id !== memberID)
      }
  }
  return {...state,
      data:[...convers]}
}

// ADD_CONVERSATION_TO_CLIENT

case GLOBALTYPES.ADD_CONVERSATION_TO_CLIENT:{

  const conversation = action.payload.conversation
      return {
        data: [conversation, ...state.data]
      }
}
// ADD_MESSAGE  
case GLOBALTYPES.ADD_MESSAGE_TO_CLIENT  : {

  const conversationId = action.payload.conversation;
  const convers = [...state.data];

  const index = convers.findIndex((el) => el._id === conversationId);
  
  const conver= convers[index]

  return {
    data: [conver, ...state.data.filter(c=> c._id!==conversationId )]
  };
}
// UPDATE_LAST_MESSAGE
case GLOBALTYPES.UPDATE_LAST_MESSAGE  : {
  const conversationId = action.payload.conversation;
  const convers = [...state.data];

  const index = convers.findIndex((el) => el._id === conversationId);
  
 

  const data={
    _id: action.payload._id,
    conversation: action.payload.conversation,
    text: action.payload.text,
    updatedAt: action.payload.updatedAt
  }

  if (index !== -1) {
    convers[index] = {
      ...convers[index],
      lastMessage: data,
    };
  }
  const conver= convers[index]
  return {
    data: [conver, ...state.data.filter(c=> c._id!==conversationId )]
  };
}
    default:
      return state;
  }
};



export default conversationsReducer;
