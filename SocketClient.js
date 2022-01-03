import { useNavigation } from "@react-navigation/core";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/actions/authAction";
import { GLOBALTYPES } from "./redux/actionType";

const SocketClient = () => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const audioRef = useRef();
  const navigation = useNavigation();
  const conversation = useSelector(
    (state) => state.currentConversationsReducer.data
  );

  const schedulePushNotification = async (body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ZAHOO",
        body: body,
      },
      trigger: { seconds: 2 },
    });
  };

  // joinUser
  useEffect(() => {
    socket.emit("joinUser", auth.user);
  }, [socket, auth.user]);

  // Message
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      if (conversation?._id == msg.data.conversation) {
        dispatch({ type: GLOBALTYPES.ADD_MESSAGE, payload: msg.data });
      }
      dispatch({ type: GLOBALTYPES.UPDATE_LAST_MESSAGE, payload: msg.msg });

      if (msg.data.media.length > 0) {
        schedulePushNotification(
          `${msg.data.sender.username}: đã gửi một file `
        );
      } else {
        schedulePushNotification(
          `${msg.data.sender.username}: ${msg.data.text} `
        );
      }
    });
    return () => socket.off("addMessageToClient");
  }, [socket, dispatch, conversation]);

  // request addfriend
  useEffect(() => {
    socket.on("requestAddFriendToClient", (data) => {
      schedulePushNotification(
        `${data.sender.username} đã gửi lời mời kết bạn`
      );
      dispatch({
        type: GLOBALTYPES.UPDATE_FRIENDS_QUEUE,
        payload: data.sender,
      });
    });
    return () => socket.off("requestAddFriendToClient");
  }, [socket, dispatch]);

  // accept addfriend
  useEffect(() => {
    socket.on("acceptAddFriendToClient", (data) => {
      schedulePushNotification(
        `${data.sender.username} đã chấp nhận lời mời kết bạn`
      );
      dispatch({ type: GLOBALTYPES.UPDATE_FRIENDS, payload: data.sender });
    });
    return () => socket.off("acceptAddFriendToClient");
  }, [socket, dispatch]);

  // change group name
  useEffect(() => {
    socket.on("changeGroupNameToClient", (data) => {
      dispatch({
        type: GLOBALTYPES.CHANGE_GROUP_NAME_OF_CONVERSATION_IN_LIST_CONVERSATION,
        payload: {
          conversationId: data.conversationId,
          newLabel: data.newLabel,
        },
      });
    });
    return () => socket.off("changeGroupNameToClient");
  }, [socket, dispatch]);

  // delete friend
  useEffect(() => {
    socket.on("deleteFriendToClient", (data) => {
      dispatch({
        type: GLOBALTYPES.UPDATE_DELETE_FRIENDS,
        payload: data.sender,
      });
    });
    return () => socket.off("deleteFriendToClient");
  }, [socket, dispatch]);

  // kick member to client
  useEffect(() => {
    socket.on("kickMemberToClient", (data) => {
      const { memberID } = data;
      if (auth.user._id == memberID) {
        dispatch({ type: GLOBALTYPES.KICK_MEMBER_TO_SOCKET, payload: data });

        if (conversation?._id === data.conversation._id) {
          navigation.navigate("Chat");
        }
      } else {
        dispatch({
          type: GLOBALTYPES.UPDATE_KICK_MEMBER_TO_CLIENT,
          payload: data,
        });
      }
    });
    return () => socket.off("kickMemberToClient");
  }, [socket, dispatch, conversation]);

  // out group
  useEffect(() => {
    socket.on("outGroupToClient", (data) => {
      dispatch({ type: GLOBALTYPES.OUT_GROUP_TO_CLIENT, payload: data });
    });
    return () => socket.off("outGroupToClient");
  }, [socket, dispatch]);

  // delete group
  useEffect(() => {
    socket.on("deleteGroupToClient", (data) => {
      schedulePushNotification(
        `Nhóm hội thoại ${data.conversation.label} đã được trưởng nhóm giải tán`
      );
      dispatch({ type: GLOBALTYPES.DELETE_GROUP_TO_CLIENT, payload: data });
      if (conversation?._id === data.conversation._id) {
        navigation.navigate("Chat");
      }
    });
    return () => socket.off("deleteGroupToClient");
  }, [socket, dispatch, conversation]);

  // add frieng to group
  useEffect(() => {
    socket.on("addFriendToGroupToClient", (data) => {
      dispatch({ type: GLOBALTYPES.ADD_MEMBER_GROUP_TO_CLIENT, payload: data });
    });
    return () => socket.off("addFriendToGroupToClient");
  }, [socket, dispatch]);

  //active user
  useEffect(() => {
    socket.on("activeUserToClient", (data) => {
      dispatch(logout());
    });
    return () => socket.off("activeUserToClient");
  }, [socket, dispatch]);

  // add conversation
  useEffect(() => {
    socket.on("addConversationtoclient", (data) => {
      dispatch({ type: GLOBALTYPES.ADD_CONVERSATION_TO_CLIENT, payload: data });
    });
    return () => socket.off("addConversationtoclient");
  }, [socket, dispatch]);

  return <></>;
};

export default SocketClient;
