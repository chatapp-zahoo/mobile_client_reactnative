import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

import FilePickerExt from "../components/ChatExtension/FilePickerExt";
import ImagePickerExt from "../components/ChatExtension/ImagePickerExt";
import ChatInput from "../components/ChatInput";
import Message from "../components/Message";
import { getMessagesByConversationId } from "../redux/actions/messagesAction";
import EmojiPicker from "rn-emoji-keyboard";

const ChatScreen = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsloading] = useState(false);
  const [currentLength, setCurrentLength] = useState(0);
  const [updateLength, setUpdateLength] = useState(1);

  const { user, token } = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.messages.data);
  const conversation = useSelector(
    (state) => state.currentConversationsReducer.data
  );
  const [showEmoji, setShowEmoji] = useState(false);
  const [messagesEmoji, setmessagesEmoji] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (conversation) {
      setIsloading(true);
      dispatch(
        getMessagesByConversationId(conversation._id, token, page, {
          setIsloading: setIsloading(false),
          setUpdateLength: setUpdateLength,
        })
      );
    }
  }, [dispatch, token, conversation, page, isLoading]);

  const { name, isActive } = useSelector((state) => state.extensions);
  let renderMessages = [];

  if (messages != undefined) {
    renderMessages = messages.slice();
  }

  const handleLoadMore = async () => {
    setIsloading(true);
    if (currentLength != updateLength) {
      setPage(page + 1);

      setCurrentLength(updateLength);
    }
  };

  const renderLoading = () => {
    return isLoading ? (
      <View style={{ marginVertical: 10 }}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesComponent}>
        <View>
          <FlatList
            inverted
            data={renderMessages.reverse()}
            renderItem={({ item, index }) => {
              return (
                <Message
                  message={item}
                  isGroup={conversation?.label != undefined}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            updateCellsBatchingPeriod={2}
          />
        </View>

        <View style={{ flex: 10000 }}></View>
      </View>
      <ChatInput
        conversationId={conversation?._id}
        user={user}
        messagesEmoji={messagesEmoji}
        setShowEmoji={setShowEmoji}
        showEmoji={showEmoji}
      />

      <EmojiPicker
        onEmojiSelected={(emoji) => setmessagesEmoji(emoji.emoji)}
        open={showEmoji}
        onClose={() => setShowEmoji(false)}
      />

      {renderExtension(name, isActive)}
    </View>
  );
};

// da thay doi
const renderExtension = (name, isActive) => {
  switch (name) {
    case "OPEN_IMAGE":
      if (isActive) return <ImagePickerExt />;

    case "OPEN_FILE":
      if (isActive) return <FilePickerExt />;
  }
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  messagesComponent: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  emojis: {
    position: "absolute",
    height: 300,
    width: "100%",
  },
});
export default ChatScreen;
