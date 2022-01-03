import { useNavigation } from "@react-navigation/core";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableHighlight, View } from "react-native";
import { Text as PaperText } from "react-native-paper";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import Toast from "react-native-root-toast";
import { useDispatch, useSelector } from "react-redux";
import { postDataAPI } from "../api";
import { theme as themeCore } from "../core/theme";
import { addConversation } from "../redux/actions/conversationsAction";
import { postCurrentConversation } from "../redux/actions/currentConversation";
import { callExtension } from "../redux/actions/extensionAction";
import { getMessagesByConversationId } from "../redux/actions/messagesAction";
import {
  acceptRequestAddFriend,
  cancelRequestAddFriend,
  requestAddFriend,
  unfriend,
} from "../redux/actions/userAction";
import BubbleMultiAvatar from "./BubbleMultiAvatar";

const ResultUserBySearchUser = ({ friend }) => {
  const { user, token } = useSelector((state) => state.auth);
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const color = theme.colors.primary;
  const currTheme = useTheme();
  const { socket } = useSelector((state) => state);

  const toast = (notify) => {
    Toast.show(notify, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      containerStyle: {
        backgroundColor: "#fff",
        borderRadius: 200,
        marginBottom: 30,
        paddingHorizontal: 20,
        shadowColor: "#e6e6e6",
        shadowOpacity: 0.5,
      },
      textStyle: {
        color: "#000",
      },
    });
  };

  const [status, setStatus] = useState(
    friend.friends.includes(user._id)
      ? "Hủy kết bạn"
      : friend.friendsQueue.includes(user._id)
      ? "Hủy yêu cầu"
      : user.friendsQueue.filter((u) => u._id === friend._id)[0]?.username !==
        undefined
      ? "Chấp nhận"
      : "kết bạn"
  );

  const handleDeleteFriend = () => {
    Alert.alert("Thông báo", "Bạn muốn xóa bạn bè ?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          dispatch(unfriend(friend._id, user, token, socket));
          setStatus("kết bạn");
          toast("Đã Hủy kết bạn");
        },
      },
    ]);
  };

  const acceptAddFriend = () => {
    dispatch(acceptRequestAddFriend(friend._id, user, token, socket));
    setStatus("Hủy kết bạn");
    toast("Hai bạn đã trở thành bạn bè");
  };

  const openChatRoom = async () => {
    const dataExtenstion = {
      name: "",
      isActive: false,
    };
    dispatch(callExtension(dataExtenstion));
    try {
      const { data } = await postDataAPI(
        `conversations/friend/${friend._id}`,
        { userId: user._id },
        token
      );
      if (data.length === 0) {
        const data = {
          label: null,
          array: [friend, user],
          createdBy: user._id,
        };
        dispatch(addConversation(data, token, socket, user));
      } else {
        dispatch(postCurrentConversation(data));
      }

      await dispatch(getMessagesByConversationId(data._id, token));
      navigation.navigate("ChatScreen", {
        member: [friend],
        chatRoom: data,
        label: friend.username,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendRequestAddFriend = () => {
    dispatch(requestAddFriend(friend._id, user, token, socket));
    toast("Đã gửi yêu cầu");
    setStatus("Hủy yêu cầu");
  };

  const handleCancelRequestAddFriend = () => {
    Alert.alert("Thông báo", "Hủy yêu cầu kết bạn  ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          const data = { userId: user._id };
          dispatch(cancelRequestAddFriend(friend._id, data, token));
          toast("Đã hủy yêu cầu");
          setStatus("kết bạn");
        },
      },
    ]);
  };

  return (
    <View>
      {user._id === friend._id ? (
        <View style={styles.container}>
          <BubbleMultiAvatar otherUsers={[friend]} />

          <View style={styles.chatContent}>
            <PaperText style={[styles.userName]}>{friend.username}</PaperText>
          </View>
        </View>
      ) : (
        <TouchableHighlight
          underlayColor={currTheme.dark ? "#333" : "#e6e6e6"}
          onPress={() => {
            status === "Hủy kết bạn" && openChatRoom();
          }}
        >
          <View style={styles.container}>
            <BubbleMultiAvatar otherUsers={[friend]} />

            <View style={styles.chatContent}>
              <PaperText style={[styles.userName]}>{friend.username}</PaperText>
            </View>
            <View style={styles.actionContainer}>
              <TouchableHighlight
                activeOpacity={0.7}
                underlayColor={themeCore.colors.secondary}
                onPress={() => {
                  status === "Hủy kết bạn"
                    ? handleDeleteFriend()
                    : status === "Hủy yêu cầu"
                    ? handleCancelRequestAddFriend()
                    : status === "Chấp nhận"
                    ? acceptAddFriend()
                    : handleSendRequestAddFriend();
                }}
                style={[
                  styles.buttonCancel,
                  themeCore.dark
                    ? { backgroundColor: themeCore.colors.secondary }
                    : { backgroundColor: themeCore.colors.primary },
                ]}
              >
                <PaperText
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(1.8),
                  }}
                >
                  {status}
                </PaperText>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 9,
  },
  chatContent: {
    flex: 1,
    marginHorizontal: responsiveHeight(1),
    flexDirection: "column",
    justifyContent: "center",
  },
  userName: {
    marginVertical: responsiveHeight(0.5),
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
  },

  actionContainer: {
    flexDirection: "row",
    marginRight: responsiveHeight(0.5),
    alignItems: "center",
  },
  button: {
    backgroundColor: "#DDDDDD",

    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCancel: {
    padding: 9,
    backgroundColor: "#DDDDDD",
    borderRadius: 99,
    overflow: "hidden",
    paddingHorizontal: 15,
  },
});

export default ResultUserBySearchUser;
