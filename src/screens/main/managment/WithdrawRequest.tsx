import { View, Text, StyleSheet, ImageBackground, StatusBar, ToastAndroid, TouchableOpacity, Dimensions, DeviceEventEmitter, FlatList, ListRenderItemInfo } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BlurView } from '@react-native-community/blur';
import { Style, align_self_center, bg_black, bg_white, border_radius_pill, flex_row, fw_700, ml_10, ml_15, ml_25, mt_20, mt_25, mt_5, my_10, my_20, p_10, p_20, px_20, py_15, py_20, w_100 } from '../../../stylesheets/primary-styles';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, BottomSheet, Button, Image, ListItem } from '@rneui/themed'
import { GraphQLService } from '../../../services/GraphQLService';
import { AdminService } from '../../../services/AdminService';
import { useNavigation } from '@react-navigation/native'

export default function WithdrawRequest() {
    const navigation = useNavigation()

    const [withdrawList, serWithdrawList] = useState<GraphQLService.Type.Withdraw[]>([])

    useEffect(() => {
        getList()

        const stack = StatusBar.pushStackEntry({
            backgroundColor: 'transparent'
        })

        DeviceEventEmitter.addListener('event.RequestViewer.onConfirmed', getList)

        return () => {
            StatusBar.popStackEntry(stack)
        }
    }, [])

    function getList() {
        AdminService.getPeningWithdraw(
            (list) => serWithdrawList(list),
            (error) => ToastAndroid.show('Cannot load withdraw, server error!', ToastAndroid.LONG)
        )
    }

    return (
        <ImageBackground
            style={styles.root}
            source={require('../../../resources/about_bg.jpg')}
        >
            <Shadow
                style={w_100}
                distance={8}
            >
                <BlurView
                    blurRadius={3}
                    overlayColor='transparent'
                >
                    <View style={[p_10, { paddingTop: StatusBar.currentHeight }, Style.backgroundColor('#979dac33')]}>
                        <Text style={[{ textAlign: 'center' }, Style.fontSize(18), fw_700, my_10]}>WITHDRAW REQUEST</Text>
                    </View>
                </BlurView>
            </Shadow>

            <FlatList
                data={withdrawList}
                renderItem={(props) => <FListItem {...props} />}
                contentContainerStyle={py_20}
            />

        </ImageBackground>
    )
}

// ----------------------------------

function FListItem(props: ListRenderItemInfo<GraphQLService.Type.Withdraw>) {
    const navigation = useNavigation()
    const item = props.item

    function onPress() {
        if (props.item)
            navigation.navigate('WithdrawRequestViewer' as never, {
                withdraw: item
            } as never)
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
        >
            <ListItem bottomDivider>
                <Avatar
                    rounded
                    source={{ uri: item.wallet.shipper.profilePictureUrl }}
                />
                <ListItem.Content>
                    <ListItem.Title style={[fw_700]}>{item.wallet.shipper.firstName + ' ' + item.wallet.shipper.lastName}</ListItem.Title>
                    <ListItem.Title style={[Style.textColor('#05668d'), fw_700]}>{item.amount} credits = {item.amount * 1000} VND</ListItem.Title>
                    <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </TouchableOpacity>
    )
}

// ----------------------------------

const styles = StyleSheet.create({
    root: {
        flex: 1,
    }
});