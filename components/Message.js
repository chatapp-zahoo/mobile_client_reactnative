import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import React, { useCallback } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Text as PaperText, useTheme } from 'react-native-paper';
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useSelector } from 'react-redux';
import ProgressiveImage from './ProgressiveImage';
import Times from './util/Times';

const Message = ({ message, isGroup }) => {

    const theme = useTheme();
    const messages = useSelector(state => state.messages.data);
    const { text, sender, createdAt, media, call } = message

    const conversations = useSelector(state => state.conversations.data);
    const { token, user } = useSelector(state => state.auth);



    const isMyMessage = message?.sender?._id === user._id;
    const userName = message?.sender?.username;

    const userImgUri = message?.sender?.profilePicture === '' ? 'https://sothis.es/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'
        : message?.sender?.profilePicture;

    const _handleOpenWithLinking = (url) => {
        Linking.openURL(url)
    };

    const OpenURLButton = ({ url, children, type }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url, type]);

        return <TouchableOpacity title={children} onPress={handlePress} >
            <Text style={[
                styles.message,
                theme.dark ? styles.darkMessage : styles.lightMessage,
                { color: 'blue' }
            ]}>
                {url.split("/")[3] + '.' + type.split("/")[1]}
            </Text>
        </TouchableOpacity>
    };

    if (isMyMessage) {
        return (
            <View style={{ flexDirection: 'column' }}>
                <View
                    style={[
                        isMyMessage ? styles.myContainer : styles.container,
                        { marginBottom: 5 }
                    ]}
                >
                    {text !== '' &&
                        <View style={styles.messageWrapper}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.message,
                                    theme.dark ? styles.myDarkMessage : styles.myLightMessage
                                ]}>
                                    {message.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {
                        media?.map((item, index) => (
                            <View style={styles.messageWrapper} key={index}>

                                {
                                    item.type.includes("video") &&

                                    <Video
                                        style={styles.imageMessage}
                                        source={{
                                            uri: item.url
                                        }}
                                        useNativeControls
                                        resizeMode="contain"
                                        isLooping

                                    />
                                }
                                {
                                    item.type.includes("image") &&
                                    <ProgressiveImage
                                        defaultImageSource={require('../assets/waitmessage.jpg')}
                                        source={{ uri: item.url }}
                                        style={styles.imageMessage}
                                        resizeMode="cover"
                                    />

                                    // <Image style={styles.imageMessage} source={{
                                    //     uri: item.url,
                                    // }} />
                                }

                                {
                                    item.type.includes("application") &&
                                    <OpenURLButton url={item.url} type={item.type} />
                                }

                            </View>

                        ))}

                    {
                        call && <View style={styles.messageWrapper}>

                            <View style={[
                                styles.message,
                                theme.dark ? styles.myDarkMessage : styles.myLightMessage
                            ]}>
                                <Text
                                    style={[
                                        // styles.message,
                                        theme.dark ? styles.myDarkMessage : styles.myLightMessage
                                    ]}
                                >
                                    <Ionicons name="call" size={24} color="black" style={[theme.dark ? styles.myDarkMessage : styles.myLightMessage]} />
                                    Cuộc gọi thoại
                                </Text>
                                <Text style={[styles.time,]}>
                                    <Times total={call.times} style={theme.dark ? styles.myDarkMessage : styles.myLightMessage} />
                                </Text>
                            </View>

                        </View>
                    }


                    {/* {!messageAfter ? //them dieu kien da seen
                    <Image source={{ uri: '' + userImgUri }} style={styles.smallAvatar} /> :
                    <View style={styles.smallAvatar} />
                } */}
                    <View style={styles.smallAvatar} />
                </View>

                {/* <View
                    style={[
                        isMyMessage ? styles.container : styles.myContainer,
                        { marginBottom: 5 }
                    ]}
                >

                </View> */}
            </View>
        )
    }
    else {
        return (
            <View style={[styles.container, { marginBottom: 5 }]}>
                <Image source={{ uri: '' + userImgUri }} style={[styles.avatar, {borderWidth: 0.2, borderColor: theme.dark? "#ddd" : "#000"}]} />

                {text?.length > 0 &&
                    <View style={styles.messageWrapper}>
                        {isGroup && <PaperText style={{marginHorizontal: 14, marginTop: 4, marginBottom: 2, fontSize: responsiveFontSize(1.8)}}>{userName}</PaperText> }
                        <Text style={[
                            styles.message,
                            theme.dark ? styles.darkMessage : styles.lightMessage
                        ]}>
                            {text}
                        </Text>
                    </View>
                }
                {
                    call &&
                    <View style={styles.messageWrapper}>

                        <View style={[
                            styles.message,
                            theme.dark ? styles.darkMessage : styles.lightMessage
                        ]}>
                            <Text style={[theme.dark ? styles.darkMessage : styles.lightMessage]}>
                                <Ionicons name="call" size={24} color="black" style={[theme.dark ? styles.darkMessage : styles.lightMessage]} />
                                Cuộc gọi thoại
                            </Text>
                            <Text style={[styles.time,]}>
                                <Times total={call.times} style={theme.dark ? styles.darkMessage : styles.lightMessage} />
                            </Text>
                        </View>
                    </View>
                }
                {
                    media?.map((item, index) => (
                        <View style={styles.messageWrapper} key={index}>
                            {
                                item.type.includes("video") &&

                                <Video
                                    style={styles.imageMessage}
                                    source={{
                                        uri: item.url,
                                    }}
                                    useNativeControls
                                    resizeMode="contain"
                                    isLooping

                                />

                            }
                            {
                                item.type.includes("image") &&
                                <ProgressiveImage
                                    defaultImageSource={require('../assets/waitmessage.jpg')}
                                    source={{ uri: item.url }}
                                    style={styles.imageMessage}
                                    resizeMode="cover"
                                />


                            }

                            {
                                item.type.includes("application") &&

                                <OpenURLButton url={item.url} />

                            }

                        </View>
                    ))
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        maxWidth: '100%',
        margin: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 10,
    },
    myContainer: {
        maxWidth: '100%',
        margin: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    messageWrapper: {
        maxWidth: '70%',
    },
    message: {
        backgroundColor: '#3a3b3c',
        color: '#fff',
        padding: 8,
        borderRadius: 20,
        paddingHorizontal: 18,
        fontSize: responsiveFontSize(1.9),
    },
    imageMessage: {
        width: 250,
        height: 250,
        borderRadius: 10
    },
    myLightMessage: {
        backgroundColor: '#64868E',
        color: '#fff'
    },
    myDarkMessage: {
        backgroundColor: '#64868E',
        color: '#fff',
    },
    lightMessage: {
        backgroundColor: '#e6e6e6',
        color: '#000',
    },
    darkMessage: {
        backgroundColor: '#3a3b3c',
        color: '#fff',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginRight: 10,
        borderWidth: 0.2,
    },
    smallAvatar: {
        width: 15,
        height: 15,
        borderRadius: 50,
        marginHorizontal: 3,
    },
    messageHeader: {
        borderBottomLeftRadius: 5,
    },
    messageCenter: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    messageFooter: {
        borderTopLeftRadius: 5,
    },
    myMessageHeader: {
        borderBottomRightRadius: 5,
    },
    myMessageCenter: {
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
    myMessageFooter: {
        borderTopRightRadius: 5,
    },
    time: {
        paddingTop: 10
    }
})
export default Message
