import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { DrawerItem } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions, Modal,
  Pressable, StyleSheet, Text, TextInput, TouchableHighlight, View
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  Dialog,
  Drawer,
  Paragraph,
  Portal,
  RadioButton,
  Text as PaperText, Title
} from "react-native-paper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Toast from "react-native-root-toast";
import { useDispatch, useSelector } from "react-redux";
import BubbleMultiAvatar from "../components/BubbleMultiAvatar";
import { deleteGroup, outGroup, updateLabelCurrentConversation } from "../redux/actions/currentConversation";
import { unfriend } from "../redux/actions/userAction";


const ChatRoomOptionScreen = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { auth, socket } = useSelector((state) => state);

  const conversation = useSelector(
    (state) => state.currentConversationsReducer.data
  );

 
  const isDarkTheme = useSelector((state) => state.theme);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const [nameGroup, setnameGroup] = useState(conversation?.label);
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [modalNameGroup, setModalNameGroup] = useState(conversation?.label)
  const [modalVisible, setModalVisible] = useState(false);

  const hideDialog = () => setIsDialogVisible(false);
  const [valueTurnOffNofication, setValueTurnOffNofication] =
    React.useState("");

    const toast =(notify)=>{
      Toast.show(notify, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        containerStyle: {
          backgroundColor: '#fdf',
          borderRadius: 200,
          marginBottom: 30,
          paddingHorizontal: 20,
          shadowColor: "#e6e6e6",
          shadowOpacity: 0.5,
        },
        textStyle: {
          color: '#000',
        }
      })
    }

  const handleChangeNameGroupChat = (newName) => {
    if(newName.length > 4){
      const data = {
        newLabel: newName,
      };
      dispatch(
        updateLabelCurrentConversation(data, conversation._id, auth, socket)
      );
      toast('c???p nh???t th??nh c??ng')
    }else {
      toast('T??n nh??m kh??ng h???p l???')
    }
    
  };

  // unfriend
  const handleDeleteFriend = (id) => {

    Alert.alert("Th??ng b??o", "B???n mu???n x??a b???n b?? ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch(unfriend(id, user, token, socket))
          toast("???? x??a b???n b??")
          
        },
      },
    ]);
    
  }

  // out group chat
  const handleOutGroupChat = () => {

    Alert.alert("Th??ng b??o", "B???n mu???n r???i kh???i nh??m ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch(outGroup(user, conversation, token, socket))
          toast("???? r???i kh???i nh??m")
          
          navigation.navigate('Chat')
              },
      },
    ]);
    

  }

  
  // delete group chat
  const handleDeleteGroupChat = () => {

    Alert.alert("Th??ng b??o", "B???n c?? ch???c mu???n gi???i t??n nh??m ch??? ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
                dispatch(deleteGroup(user, conversation, token, socket))
          Toast.show("Nh??m c???a b???n ???? ???????c gi???i t??n", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            containerStyle: {
              backgroundColor: '#fff',
              borderRadius: 200,
              marginBottom: 30,
              paddingHorizontal: 20,
              shadowColor: "#e6e6e6",
              shadowOpacity: 0.5,
            },
            textStyle: {
              color: '#000',
            }
          })
          navigation.navigate('Chat')
        },
      },
    ]);
    
    
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.seperateWrapper}>
          <View style={styles.userInfo}>
            <BubbleMultiAvatar
              otherUsers={conversation?.member}
              styleFormat={{ width: 80, height: 80 }}
              isGroup={conversation?.label != undefined}
            />
            {conversation?.label !== undefined ? (
              <View style={styles.nameGroup}>
                <Text
                  style={[styles.textNameGroup, { color: isDarkTheme ? "#fff" : "#000" },]}
                  onPress={() => setModalVisible(true)}
                  numberOfLines={1}
                >
                  {nameGroup}
                </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(true)}>
                  <AntDesign name="edit" size={30} color={theme.dark ? "#fff" : theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <Title style={styles.userName}>{conversation?.member.find(itemUser => itemUser._id != user._id).username}</Title>
            )}
          </View>
        </View>
        <View style={styles.seperateWrapper}>
          <Drawer.Section title="L??u tr???">
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome name="folder-open-o" size={size} color={color} />
              )}
              label="Kho l??u tr????"
              labelStyle={styles.drawerItemLabel}
              style={styles.drawerItem}
              onPress={() => {
                navigation.navigate("MediaTab");
              }}
            />
          </Drawer.Section>
          {conversation?.label !== undefined && (
            <Drawer.Section title="Nho??m">

             
                <DrawerItem
                  icon={({ color, size }) => (
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={size}
                      color={color}
                    />
                  )}
                  label={`Th??m tha??nh vi??n`}
                  labelStyle={styles.drawerItemLabel}
                  style={styles.drawerItem}
                  onPress={() => {
                    navigation.navigate("ChooseFriendAddToGreoupScreen", {
                      member: conversation?.member,
                    });
                  }}
                />

              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons
                    name="account-group"
                    size={size}
                    color={color}
                  />
                )}
                label={`Tha??nh vi??n (${conversation?.member.length} tha??nh vi??n)`}
                labelStyle={styles.drawerItemLabel}
                style={styles.drawerItem}
                onPress={() => {
                  navigation.navigate("MemberScreen", {
                    member: conversation?.member,
                  });
                }}
              />

            </Drawer.Section>

          )}

          {conversation?.label === undefined ? (
            <Drawer.Section title="Quy????n ri??ng t??">
                {user.friends.filter(u=>u._id ===  conversation?.member?.filter(m=> m._id !== user._id)[0]._id).length >0  &&
                 <DrawerItem
                 icon={({ color, size }) => (
                   <MaterialIcons name="block" size={size} color={color} />
                 )}
                 label={`X??a b???n b?? ${conversation?.member.filter(member => member._id !== user._id)[0].username} `} //${otherUsers[0].username}
                 labelStyle={styles.drawerItemLabel}
                 style={styles.drawerItem}
                 onPress={(id) => {
 
                   handleDeleteFriend(conversation?.member.filter(member => member._id !== user._id)[0]._id)
                 }}
               />
                }
             
            </Drawer.Section>


          ) : (
            <Drawer.Section title="Quy????n ri??ng t??">

              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialIcons name="block" size={size} color={color} />
                )}
                label={`R????i kho??i nho??m`}
                labelStyle={styles.drawerItemLabel}
                style={styles.drawerItem}
                onPress={handleOutGroupChat}
              />

              {conversation.createdBy?._id === user._id &&
                <DrawerItem
                  icon={({ color, size }) => (
                    <MaterialCommunityIcons name="delete-variant" size={size} color={color} />
                  )}
                  label={`Gi???i t??n nh??m`}
                  labelStyle={styles.drawerItemLabel}
                  style={styles.drawerItem}
                  onPress={handleDeleteGroupChat}
                />
              }
            </Drawer.Section>
          )}

          {/* dialog choose time turn off nofication */}
          <Portal>
            <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Paragraph style={styles.dialogCheckBoxTitle}>
                  T????t th??ng ba??o tro?? chuy????n?
                </Paragraph>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setValueTurnOffNofication(newValue)
                  }
                  value={valueTurnOffNofication}
                >
                  <RadioButton.Item
                    label="Second item"
                    value="second"
                    style={styles.dialogCheckBox}
                  />
                  <RadioButton.Item
                    label="First item"
                    value="first"
                    style={styles.dialogCheckBox}
                  />
                </RadioButton.Group>
              </Dialog.Content>
            </Dialog>
          </Portal>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>T??n nho??m</Text>
            <TextInput
              value={modalNameGroup}
              style={{
                borderBottomColor: "#ddd",
                borderBottomWidth: 1,
                marginVertical: 20,
                fontSize: responsiveFontSize(2)
             
              }}
              selectTextOnFocus={true}
              autoFocus={true}
              numberOfLines={1}
              onChangeText={(text) => setModalNameGroup(text)}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalNameGroup(nameGroup);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Hu??y</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setnameGroup(modalNameGroup);
                  setModalVisible(!modalVisible);
                  handleChangeNameGroupChat(modalNameGroup);
                  
                }}
              >
                <Text style={styles.textStyle}>C????p nh????t</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const QuickOptionItem = (actionFunction, optionIcon, label) => {
  const theme = useTheme();
  return (
    <TouchableHighlight
      onPress={actionFunction}
      underlayColor={theme.dark ? "#3d3c3e" : "#f2f2f2"}
      style={styles.optionItemContainer}
    >
      <View style={styles.optionItem}>
        <View style={styles.iconWrapper}>{optionIcon}</View>
        <PaperText style={styles.optionLabel} numberOfLines={2}>
          {label}
        </PaperText>
      </View>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "stretch",
    // backgroundColor: '#ccc'
  },
  seperateWrapper: {
    marginBottom: 6,
    paddingVertical: 6,
  },
  userInfo: {
    marginVertical: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  userName: {
    marginTop: 10,
  },
  quickOptions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  optionItemContainer: {
    width: 80,
    paddingVertical: 10,
  },
  optionItem: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconWrapper: {
    width: 37,
    height: 37,
    borderRadius: 37,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: {
    marginTop: 10,
    textAlign: "center",
    fontSize: responsiveFontSize(1.7),
  },
  drawerItem: {
    marginHorizontal: 20,
  },
  drawerItemLabel: {
    fontSize: responsiveFontSize(2),
  },
  dialogCheckBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  dialogCheckBoxTitle: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: "700",
    paddingBottom: 30,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.2,
  },
  nameGroup: {
    flexDirection: "row",
    maxWidth: "65%",
    justifyContent: "center",
  },
  textNameGroup: {
    fontSize: responsiveFontSize(3),
    paddingRight: 8
  },
  // =============================

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, 0.3)"
  },
  modalView: {
    width: Dimensions.get("window").width * 0.8,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: responsiveFontSize(1.8)
  },
  modalText: {
    textAlign: "center",
    fontSize: responsiveFontSize(2.5),
  }
});

export default ChatRoomOptionScreen;
