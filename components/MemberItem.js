import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, TouchableHighlight, View } from 'react-native';
import { Text as PaperText } from 'react-native-paper';
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../core/theme';
import { kickMember } from '../redux/actions/currentConversation';
import BubbleMultiAvatar from './BubbleMultiAvatar';

const MemberItem = ({ friend }) => {

    const { user, token } = useSelector(state => state.auth);
    const { socket } = useSelector(state => state);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const color = theme.colors.primary;
    const currTheme = useTheme();
    const conversation = useSelector(
        (state) => state.currentConversationsReducer.data
      );

    const isOwnUser = friend._id == user._id;
    
    const [modalVisible, setModalVisible] = useState(false);
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

    const handleKickMember = () => {
        dispatch(kickMember(user,friend._id, conversation,token,socket))
        toast(`Bạn đã xóa thành viên ${friend.username} ra khỏi nhóm`)
    }


    return (
        <View
            underlayColor={currTheme.dark ? "#333" : '#e6e6e6'}
         
        >
            <View style={styles.container}>

                <BubbleMultiAvatar otherUsers={[friend]} />

                <View style={styles.chatContent}>
                    <PaperText style={[styles.userName]}>
                        {friend.username}
                    </PaperText>
                </View>

                <View style={styles.actionContainer}>

                    {conversation.createdBy?._id === user._id && user._id !== friend._id &&
                    <TouchableHighlight
                    activeOpacity={0.7}
                    underlayColor={theme.colors.secondary}
                    onPress={()=>setModalVisible(!modalVisible)}
                    style={styles.button}
                >
                    <AntDesign name="deleteuser" size={24} color={color} style={styles.backIcon} />

                </TouchableHighlight>
                    }
                    
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <PaperText style={styles.modalText}>Bạn có muốn xóa {friend.username} ra khỏi nhóm hay không ! </PaperText>

                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <Pressable
                        style={[styles.button1, styles.buttonClose]}
                        onPress={() => {
                        setModalVisible(false);
                        }}
                    >
                        <PaperText style={styles.textStyle}>Hủy</PaperText>
                    </Pressable>

                    <Pressable
                        style={[styles.button1, styles.buttonClose]}
                        onPress={() => {
                    
                        setModalVisible(false);
                        handleKickMember()
                        
                        }}
                    >
                        <PaperText style={styles.textStyle}>Đồng ý</PaperText>
                    </Pressable>
                    </View>
                </View>
                </View>
            </Modal>

           
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // marginHorizontal: responsiveHeight(1.2),
        padding: 9
    },
    chatContent: {
        flex: 1,
        marginHorizontal: responsiveHeight(1),
        flexDirection: 'column',
        justifyContent: 'center',
    },
    userName: {
        marginVertical: responsiveHeight(0.5),
        fontSize: responsiveFontSize(2),
        fontWeight: '700'
    },

    actionContainer: {
        flexDirection: 'row',
        marginRight: responsiveHeight(0.3),
        alignItems: 'center'
    },
    button: {
        width: responsiveHeight(5.4),
        height: responsiveHeight(5.4),
        marginRight: responsiveHeight(0.9),
        borderRadius: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
      button1: {
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
        
      },
      modalText: {
        textAlign: "center",

        marginBottom:15,
        color:'red'
      }
})

export default MemberItem
