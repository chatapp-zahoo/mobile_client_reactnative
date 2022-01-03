import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { refreshToken } from "./redux/actions/authAction";
import { getConversationsByUserId } from "./redux/actions/conversationsAction";
import { setLoadingScreen } from "./redux/actions/loadingAction";
import {
  getFriendsFromUser,
  getQueueFriendsFromUser,
} from "./redux/actions/userAction";
import { GLOBALTYPES } from "./redux/actionType";
import RootAuthenication from "./screens/RootAuthenication";
import RootNavigation from "./screens/RootNavigation";
import SocketClient from "./SocketClient";

const Root = () => {
  const [MESS_NOFICATION_COUNT, set_MESS_NOFICATION_COUNT] = React.useState(0);

  const initLoginProps = {
    isLoading: true,
    userToken: null,
  };

  const MyDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      text: "#000",
      // primary: "#64868E",
      primary: "#60a0af",
      secondary: "#98B4A6",
      background: "#ffffff",
      grayText: "#333",
      error: "#f53e2d",
    },
  };
  const MyDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,

      primary: "#60a0af",

      text: "#fff",
      grayText: "#ccc",
      error: "#f53e2d",
    },
  };

  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.theme);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(refreshToken());
    const socket = io("https://zahoo.xyz:5000", { jsonp: false });
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      try {
        dispatch(getConversationsByUserId(user._id, token));
        dispatch(getFriendsFromUser(user.friends));
        dispatch(getQueueFriendsFromUser(user.friendsQueue));
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch(setLoadingScreen(true));
      setTimeout(() => {
        dispatch(setLoadingScreen(false));
      }, 2000);
    }
  }, [token, user, dispatch]);

  const theme = isDarkTheme ? MyDarkTheme : MyDefaultTheme;
  const isLoading = useSelector((state) => state.alert.loading);

  const isLoadingScreen = useSelector((state) => state.LoadingScreen);

  if (isLoading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="gray" />
    </View>;
  }

  if (isLoadingScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./assets/logo.png")}
          style={{ width: 110, height: 110, marginBottom: 8 }}
        />
      </View>
    );
  }

  return (
    <RootSiblingParent>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {token && <SocketClient />}
          <StatusBar barStyle="light-content" />
          {token == null ? <RootAuthenication /> : <RootNavigation />}
        </NavigationContainer>
        <StatusBar style={isDarkTheme ? "light" : "dark"} />
      </PaperProvider>
    </RootSiblingParent>
  );
};

export default Root;
