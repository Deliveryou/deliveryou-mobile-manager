import { View, Text, StyleSheet, ScrollView, StatusBar, ToastAndroid, FlatList, ListRenderItemInfo, Modal, DeviceEventEmitter } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style, align_items_center, align_items_end, align_items_start, flex_1, flex_row, flex_row_reverse, fw_600, fw_bold, justify_center, mb_10, mb_5, ml_10, ml_15, mr_10, mr_20, mt_10, mt_20, mt_5, mx_20, overflow_hidden, p_15, position_absolute, px_10, px_20, py_10, py_5, text_white, p_10, px_25, fw_700, px_15, p_5, mx_10, mb_20, bg_transparent, bg_white, bg_black, mt_25 } from '../../../stylesheets/primary-styles';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Button, Image, ListItem } from '@rneui/themed';
import { GraphQLService } from '../../../services/GraphQLService';
import { AdminService } from '../../../services/AdminService'
import { useNavigation, useRoute } from '@react-navigation/native'

function HistoryListItem(props: ListRenderItemInfo<GraphQLService.Type.TransactionHistory>) {
    const item = props.item

    const iconBgColor = (item.amount < 0) ? '#fb8b24' : '#227c9d'
    const iconName = (item.amount < 0) ? 'bank-minus' : 'bank-plus'

    return (
        <ListItem bottomDivider containerStyle={[px_25, mb_10]}>
            <Avatar
                rounded
                icon={{ name: iconName, type: 'material-community', size: 24 }}
                containerStyle={Style.backgroundColor(iconBgColor)}
                size={35}
            />
            <ListItem.Content>
                <ListItem.Title style={[Style.textColor('#bc4749'), fw_700]}>Made by: {item.user.firstName + ' ' + item.user.lastName + ` (ID: ${item.user.id})`}</ListItem.Title>
                <ListItem.Title style={[Style.textColor('#463f3a'), fw_700]}>{item.creationTime}</ListItem.Title>
                <ListItem.Subtitle style={[Style.textColor('#463f3a')]}>{item.content}</ListItem.Subtitle>
                {
                    (item.photoUrl) ?
                        <Button
                            title='View Photo'
                            containerStyle={[mt_10]}
                            buttonStyle={[Style.borderRadius(100)]}
                            color={'#227c9c44'}
                            titleStyle={[Style.textColor('#227c9c')]}
                            onPress={() => DeviceEventEmitter.emit('event.WalletHistory.onViewPhoto', item.photoUrl)}
                        />
                        : null
                }
            </ListItem.Content>
            <ListItem.Title style={[Style.textColor(iconBgColor), fw_bold, Style.fontSize(18)]}>{item.amount}</ListItem.Title>
        </ListItem>
    )
}

export default function WalletHistory() {
    const navigation = useNavigation()
    const route = useRoute()
    const [wallet, setWallet] = useState<GraphQLService.Type.Wallet>()
    const [transactionList, setTransactionList] = useState<GraphQLService.Type.TransactionHistory[]>([])
    const [previewPhoto, setPreviewPhoto] = useState<string>()

    function onIniParamError() {
        navigation.goBack()
        ToastAndroid.show('Cannot view history!', ToastAndroid.LONG)
    }

    useEffect(() => {
        const sbstack = StatusBar.pushStackEntry({
            backgroundColor: '#e9ecef'
        })

        const wallet: GraphQLService.Type.Wallet | undefined = route.params?.wallet

        if (!wallet) {
            onIniParamError()
            return
        }

        setWallet(wallet)

        DeviceEventEmitter.addListener('event.WalletHistory.onViewPhoto', (url: string) => {
            setPreviewPhoto(url)
        })

        return () => {
            StatusBar.popStackEntry(sbstack)
        }

    }, [])

    useEffect(() => {
        if (wallet) {
            AdminService.getHistory(
                wallet.id,
                (list) => {
                    setTransactionList(list)
                },
                (error) => ToastAndroid.show('Cannot load history: server timeout', ToastAndroid.LONG)
            )
        }
    }, [wallet])



    return (
        <View style={styles.root}>
            <View style={[py_10, px_15]}>
                <Shadow startColor='#ced4dacc' distance={8}>
                    <View style={[flex_row, align_items_center, Style.borderRadius(100), p_5]}>
                        <Avatar
                            source={(wallet?.shipper?.profilePictureUrl) ? { uri: wallet.shipper.profilePictureUrl } : undefined}
                            icon={{ name: 'person-circle-outline', type: 'ionicon', size: 35 }}
                            size={50}
                            rounded
                            containerStyle={Style.backgroundColor('#6c757d')}
                        />
                        {
                            (wallet?.shipper) ?
                                <Text style={[mx_10, Style.fontSize(15), fw_bold, Style.textColor('#403d39')]}>{wallet.shipper.firstName + ' ' + wallet.shipper.lastName}'s Wallet</Text>
                                : null
                        }
                    </View>
                </Shadow>
            </View>

            <Text style={[Style.fontSize(20), fw_600, mt_10, mb_20, , mx_20, Style.textColor('#463f3a')]}>
                Transaction history
            </Text>

            <FlatList
                style={flex_1}
                data={transactionList}
                renderItem={(props) => <HistoryListItem {...props} />}
            />

            <Modal
                visible={previewPhoto !== undefined}
                transparent
            >
                <View style={[flex_1, Style.backgroundColor('#e3d5ca55'), align_items_center, justify_center]}>
                    <Shadow>
                        <View style={[bg_white, Style.dimen(600, 300), Style.borderRadius(10)]}>
                            <Image
                                source={{ uri: previewPhoto }}
                                style={[Style.dimen(600, 300)]}
                                containerStyle={[Style.borderRadius(12), Style.border('#fff', 6, 'solid')]}
                            />
                        </View>
                    </Shadow>
                    <Button
                        containerStyle={[mt_25]}
                        title={'Close'}
                        buttonStyle={[Style.borderRadius(100), px_20]}
                        onPress={() => setPreviewPhoto(undefined)}
                    />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#e9ecef'
    }
});