import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../../core/theme";
import { GLOBALTYPES } from "../../redux/actionType";

const ChatRightHeader = () => {
  const color = theme.colors.primary;

  const navigation = useNavigation();

  const conversation = useSelector(
    (state) => state.currentConversationsReducer.data
  );

  const dispatch = useDispatch();
  const { call, socket, peer, auth } = useSelector((state) => state);

  let member = conversation?.member;
  const friends = member.filter((e) => e._id !== auth.user._id);
  const friendsCount = friends.length;
  // Call
  const caller = ({ video }) => {
    const { _id, profilePicture, username } = friends[0];

    const msg = {
      sender: auth.user._id,
      recipient: _id,
      profilePicture,
      username,
      video,
    };
    dispatch({ type: GLOBALTYPES.CALL, payload: msg });
  };

  const openStorage = () => {
    navigation.navigate("ChatRoomOptionScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={theme.colors.secondary}
        onPress={openStorage}
        style={styles.button}
      >
        <Ionicons
          name="menu-sharp"
          size={28}
          color={color}
          style={styles.backIcon}
        />
      </TouchableHighlight>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginRight: responsiveHeight(0.3),
  },
  button: {
    width: responsiveHeight(5.4),
    height: responsiveHeight(5.4),
    marginRight: responsiveHeight(0.9),
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    // margin: 6,
  },
});
export default ChatRightHeader;
