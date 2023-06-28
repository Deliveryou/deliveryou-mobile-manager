import { View, Text, StyleSheet, ScrollView, StatusBar, ToastAndroid, FlatList, ListRenderItemInfo, Dimensions, TextInput, DeviceEventEmitter, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style, align_items_center, align_items_end, align_items_start, flex_1, flex_row, flex_row_reverse, fw_600, fw_bold, justify_center, mb_10, mb_5, ml_10, ml_15, mr_10, mr_20, mt_10, mt_20, mt_5, mx_20, overflow_hidden, p_15, position_absolute, px_10, px_20, py_10, py_5, text_white, p_10, px_25, fw_700, px_15, p_5, mx_10, mb_20, p_20, m_15, w_100, my_10, mt_25, border_radius_pill, ml_20, ml_5, p_0 } from '../../../stylesheets/primary-styles';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Button, Dialog, Image, ListItem } from '@rneui/themed';
import { GraphQLService } from '../../../services/GraphQLService';
import { AdminService } from '../../../services/AdminService'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function WalletDeposit() {
    const navigation = useNavigation()
    const route = useRoute()
    const [wallet, setWallet] = useState<GraphQLService.Type.Wallet>()

    const [amount, setAmount] = React.useState(0)
    const [amountError, setAmountError] = useState('*Required')
    const [photo, setPhoto] = useState<string>()

    const [loadingVisible, setLoadingVisible] = useState(false)

    function onIniParamError() {
        navigation.goBack()
        ToastAndroid.show('Error has occured!', ToastAndroid.LONG)
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

        return () => {
            StatusBar.popStackEntry(sbstack)
        }

    }, [])

    useEffect(() => {
        DeviceEventEmitter.addListener('event.ProfileEditor.onPhotoChosen', (photoPath: string) => {
            setPhoto(photoPath)
        })
    }, [])

    function launchCamera() {
        navigation.navigate("CameraScreen" as never)
    }

    function onAmountType(text: string) {

        if (text.trim() === '') {
            setAmountError('*Required')
            return
        }

        const value = Number(text)

        if (isNaN(value)) {
            setAmountError('Not a number!')
            return
        }


        if (value % 1 !== 0) {
            setAmountError('Must be whole number!')
            return
        }

        if (value < 10000) {
            setAmountError('The minimum amount is 10.000 VND')
            return
        }

        setAmount(Math.floor(value / 1000))
        setAmountError('')

    }

    function deposit() {
        Alert.alert(
            "This action is irreversable!",
            "Are you sure to continue?",
            [
                { text: 'CANCEL' },
                { text: 'CONTINUE', onPress: doDeposit }
            ]
        )
    }

    function doDeposit() {
        if (photo !== undefined && wallet !== undefined) {
            setLoadingVisible(true)
            AdminService.deposit(
                {
                    photoUrl: photo,
                    amount,
                    walletId: wallet?.id
                },
                () => {
                    setLoadingVisible(false)
                    ToastAndroid.show('The amount has been deposited!', ToastAndroid.LONG)
                    DeviceEventEmitter.emit('event.WalletDeposit.onDeposited')
                    navigation.goBack()
                },
                (error) => {
                    setLoadingVisible(false)
                    ToastAndroid.show('Server refused request, check again!', ToastAndroid.LONG)
                }
            )
        } else
            ToastAndroid.show('Invalid params, check again!', ToastAndroid.LONG)
    }

    const aspectRatio = Dimensions.get('screen').width / Dimensions.get('screen').height

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
                Deposit Manager
            </Text>

            <ScrollView style={flex_1}>
                <Shadow
                    containerStyle={[my_10, mx_20]}
                    style={w_100}
                >
                    <View style={[p_20, Style.borderRadius(10)]}>
                        <Text style={[ml_10, Style.fontSize(16), mb_5, fw_bold]}>Available credits:</Text>
                        <Text style={[ml_10, Style.fontSize(15), Style.textColor('#0496ff'), mb_20, fw_700]}>{wallet?.credit} credits = {wallet?.credit * 1000} VND</Text>

                        <Text style={[ml_10, Style.fontSize(16), mb_10, fw_bold]}>1. Enter the amount (VND):</Text>
                        <TextInput
                            placeholder='100000 VND'
                            style={[Style.backgroundColor('#dfe7fd'), px_20, border_radius_pill, Style.fontSize(16)]}
                            keyboardType='number-pad'
                            onChangeText={onAmountType}
                        />
                        <Text style={[ml_20, mt_5, Style.textColor('#b23a48')]}>{amountError}</Text>

                        <View style={[Style.backgroundColor('#979dac33'), Style.borderRadius(10), p_5, mt_10]}>
                            <Text style={[ml_10, Style.fontSize(16), mt_5, fw_bold]}>You are adding:</Text>
                            <Text style={[ml_10, Style.fontSize(15), Style.textColor('#0496ff'), mt_5, fw_700]}>{amount} credits</Text>
                        </View>

                        <Text style={[ml_10, Style.fontSize(16), mb_5, mt_20, fw_bold]}>2. Upload a proof:</Text>
                        {
                            (!photo) ?
                                <Text style={[ml_20, Style.textColor('#b23a48'), mb_10]}>*Required</Text>
                                : null
                        }

                        <Button
                            title={'Choose Photo'}
                            buttonStyle={[Style.borderRadius(100)]}
                            titleStyle={[Style.textColor('#274c77')]}
                            icon={{ name: 'image', type: 'evil-icon', color: '#274c77' }}
                            color={'#0496ff33'}
                            onPress={launchCamera}
                        />

                        {
                            (photo) ?
                                <Image
                                    source={{ uri: photo }}
                                    style={[w_100, { aspectRatio }]}
                                    containerStyle={[mt_20, Style.borderRadius(10)]}
                                />
                                : null
                        }

                        <Button
                            title={'DEPOSIT'}
                            buttonStyle={[Style.borderRadius(100)]}
                            containerStyle={mt_20}
                            titleStyle={[Style.textColor('#bb4430'), ml_5]}
                            icon={{ name: 'bank-plus', type: 'material-community', color: '#bb4430', size: 22 }}
                            color={'#bb443033'}
                            disabled={amountError !== '' || photo === undefined}
                            onPress={deposit}
                        />

                    </View>
                </Shadow>
            </ScrollView>
            <Dialog isVisible={loadingVisible}>
                <Dialog.Loading />
            </Dialog>
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