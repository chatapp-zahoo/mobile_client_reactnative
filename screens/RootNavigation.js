import { useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { useSelector } from "react-redux";
import ChatLeftHeader from "../components/ChatScreenHeader/ChatLeftHeader";
import ChatRightHeader from "../components/ChatScreenHeader/ChatRightHeader";
import AccountSettingScreen from "./AccountSettingScreen";
import AddFriendToGroup from "./AddFriendToGroup";

import ImageFullScreen from "./ChatMediaScreen/ImageFullScreen";
import ChatRoomOptionScreen from "./ChatRoomOptionScreen";
import ChatScreen from "./ChatScreen";
import ChooseFileSending from "./ChooseFileSending";
import ChooseFriendAddToGreoupScreen from "./ChooseFriendAddToGreoupScreen";
import EditProfileUserScreen from "./EditProfileUserScreen";
import InviteAddFriend from "./InviteAddFriend";
import LoginScreen from "./LoginScreen";
import MainTab from "./MainTab";
import MediaTab from "./MediaTab";
import MemberScreen from "./MemberScreen";
import ProfileSettingScreen from "./ProfileSettingScreen";
import ProfileUserScreen from "./ProfileUserScreen";
import RegisterScreen from "./RegisterScreen";
import SearchScreen from "./SearchScreen";
import ChangeNumberSetting from "./SecuritySetting/ChangeNumberSetting";
import ChangePasswordSetting from "./SecuritySetting/ChangePasswordSetting";

const Stack = createStackNavigator();

const RootNavigation = () => {
  const theme = useTheme();

  const { user } = useSelector((state) => state.auth);
  const conversation = useSelector(
    (state) => state.currentConversationsReducer.data
  );
  let label = "";

  useEffect(() => {
    if (conversation) {
      label = conversation?.label
        ? conversation?.label
        : conversation?.member.find((itemUser) => itemUser._id != user._id)
            .username;
    }
  }, [conversation]);

  return (
    <Stack.Navigator initialRouteName="MainTab">
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name="MainTab"
        component={MainTab}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Thông tin cá nhân",
        })}
        name="ProfileUserScreen"
        component={ProfileUserScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Cài đặt tài khoản",
        })}
        name="AccountSettingScreen"
        component={AccountSettingScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Thay đổi thông tin cá nhân",
        })}
        name="ProfileSettingScreen"
        component={ProfileSettingScreen}
      />

      <Stack.Screen
        options={({ route }) => ({
          // title: route.params.label,
          title: label,
          headerTitleStyle: {
            fontWeight: "600",
            maxWidth: Dimensions.get("window").width * 0.36,
            overflow: "hidden",
          },
          // headerLeft: () => <ChatLeftHeader otherUsers={route.params.member} />,
          headerLeft: () => (
            <ChatLeftHeader
              member={conversation?.member}
              isGroup={conversation?.label != undefined}
            />
          ),
          headerLeftContainerStyle: {
            backgroundColor: "transparent",
          },
          headerRight: () => <ChatRightHeader />,
          headerRightContainerStyle: {
            backgroundColor: "transparent",
          },
        })}
        name="ChatScreen"
        component={ChatScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Tùy chọn",
        })}
        name="ChatRoomOptionScreen"
        component={ChatRoomOptionScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Cài đặt tài khoản",
        })}
        name="EditProfileUserScreen"
        component={EditProfileUserScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Kho lưu trữ",
        })}
        name="MediaTab"
        component={MediaTab}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name="LoginScreen"
        component={LoginScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name="RegisterScreen"
        component={RegisterScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name="ChooseFileSending"
        component={ChooseFileSending}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
          title: "Tạo nhóm",
          headerTitleStyle: {
            textAlign: "center",
          },
        })}
        name="AddFriendToGroup"
        component={AddFriendToGroup}
      />

      <Stack.Screen
        options={({ navigation, route }) => ({
          title: "Lời mới kết bạn",
        })}
        name="InviteAddFriend"
        component={InviteAddFriend}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tìm kiếm",
          headerTitleStyle: {
            textAlign: "center",
          },
          headerTitleAlign: "center",
        })}
        name="SearchScreen"
        component={SearchScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Thành viên nhóm",
          headerShown: true,
        })}
        name="MemberScreen"
        component={MemberScreen}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Ảnh",
          headerShown: true,
        })}
        name="ImageFullScreen"
        component={ImageFullScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          title: "Thay đổi số điện thoại",
          headerShown: true,
        })}
        name="ChangeNumberSetting"
        component={ChangeNumberSetting}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          title: "Thay đổi mật khẩu",
          headerShown: true,
        })}
        name="ChangePasswordSetting"
        component={ChangePasswordSetting}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
          title: "Thêm thành viên vào nhóm",
          headerTitleStyle: {
            textAlign: "center",
          },
          headerTitleAlign: "center",
        })}
        name="ChooseFriendAddToGreoupScreen"
        component={ChooseFriendAddToGreoupScreen}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
