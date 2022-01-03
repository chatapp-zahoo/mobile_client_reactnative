import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import MemberItem from '../components/MemberItem'


const MemberScreen = () => {

    

    const conversation = useSelector(
        (state) => state.currentConversationsReducer.data
      );


   const member= conversation.member

    return (
        <View style={styles.container}>
            <FlatList
                data={member}
                renderItem={({ item }) =>
                    <MemberItem friend={item}  />
                }
                keyExtractor={(item, index) => index.toString()}
            />

        {/* <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} handle={handleKickMember}  /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20
    },
    listChat: {
        marginBottom: 50
    }
})


export default MemberScreen
