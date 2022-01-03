import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Alert, StyleSheet, TouchableHighlight, View } from "react-native";
import { Text as PaperText } from "react-native-paper";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import Toast from "react-native-root-toast";
import { useDispatch, useSelector } from "react-redux";
import { postDataAPI } from "../api";
import { theme } from "../core/theme";
import { addConversation } from "../redux/actions/conversationsAction";
import { postCurrentConversation } from "../redux/actions/currentConversation";
import { callExtension } from "../redux/actions/extensionAction";
import { getMessagesByConversationId } from "../redux/actions/messagesAction";
import { unfriend } from "../redux/actions/userAction";
import BubbleMultiAvatar from "./BubbleMultiAvatar";

const FriendItem = ({ friend }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const color = theme.colors.primary;
  const currTheme = useTheme();

  const isOwnUser = friend._id == user._id;

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

          toast("Đã Hủy kết bạn");
        },
      },
    ]);
  };

  const openChatRoom = async () => {
    if (!isOwnUser) {
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

        const listMember = [];

        if (data.length === 0) {
          const data = {
            array: [friend, user],
            createdBy: user._id,
          };
          dispatch(addConversation(data, token, socket, user));
        } else {
          await dispatch(postCurrentConversation(data));
        }

        await dispatch(getMessagesByConversationId(data._id, token));
        navigation.navigate("ChatScreen", {
          // member: [friend], chatRoom: data, label: friend.username
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigation.navigate("ProfileUserScreen");
    }
  };

  return (
    <TouchableHighlight
      underlayColor={currTheme.dark ? "#333" : "#e6e6e6"}
      onPress={openChatRoom}
    >
      <View style={styles.container}>
        <BubbleMultiAvatar otherUsers={[friend]} />

        <View style={styles.chatContent}>
          <PaperText style={[styles.userName]}>{friend.username}</PaperText>
        </View>

        <View style={styles.actionContainer}>
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor={theme.colors.secondary}
            onPress={openChatRoom}
            style={styles.button}
          >
            <MaterialIcons
              name="message"
              size={24}
              color={color}
              style={styles.backIcon}
            />
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor={theme.colors.secondary}
            onPress={handleDeleteFriend}
            style={styles.button}
          >
            <MaterialIcons
              name="cancel"
              size={24}
              color="red"
              style={styles.backIcon}
            />
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // marginHorizontal: responsiveHeight(1.2),
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
    marginRight: responsiveHeight(0.3),
    alignItems: "center",
  },
  button: {
    width: responsiveHeight(5.4),
    height: responsiveHeight(5.4),
    marginRight: responsiveHeight(0.9),
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendItem;
