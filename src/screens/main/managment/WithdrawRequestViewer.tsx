import { View, Text, StyleSheet, ImageBackground, StatusBar, ToastAndroid, TouchableOpacity, Dimensions, DeviceEventEmitter, FlatList, ListRenderItemInfo, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BlurView } from '@react-native-community/blur';
import { Style, align_self_center, bg_black, bg_white, border_radius_pill, flex_1, flex_row, fw_700, ml_10, ml_15, ml_25, mt_15, mt_20, mt_25, mt_5, my_10, my_20, p_10, p_20, p_25, px_20, py_15, py_20, w_100 } from '../../../stylesheets/primary-styles';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, BottomSheet, Button, Image, ListItem } from '@rneui/themed'
import { GraphQLService } from '../../../services/GraphQLService';
import { AdminService } from '../../../services/AdminService';
import { useNavigation, useRoute } from '@react-navigation/native'

export default function WithdrawRequestViewer() {
    const navigation = useNavigation()
    const route = useRoute()

    const [withdraw, setWithdraw] = useState<GraphQLService.Type.Withdraw>()
    const [photo, setPhoto] = useState<string>()

    useEffect(() => {
        const withdraw: GraphQLService.Type.Withdraw | undefined = route.params?.withdraw

        if (withdraw === undefined) {
            navigation.goBack()
            ToastAndroid.show('Cannot view this request!', ToastAndroid.LONG)
            return
        }

        setWithdraw(withdraw)

    }, [])

    useEffect(() => {
        DeviceEventEmitter.addListener('event.ProfileEditor.onPhotoChosen', (photoPath: string) => {
            setPhoto(photoPath)
        })
    }, [])

    function launchCamera() {
        navigation.navigate("CameraScreen" as never)
    }

    function confirmWithdraw() {
        Alert.alert(
            "This action is irreversable!",
            "Are you sure to continue?",
            [
                { text: "CANCEL" },
                { text: "CONTINUE", onPress: doConfirmWithdraw }
            ]
        )
    }

    function doConfirmWithdraw() {
        if (withdraw) {
            AdminService.confirmWithdraw(
                withdraw.id,
                () => {
                    ToastAndroid.show('The withdraw has been confirmd!', ToastAndroid.LONG)
                    navigation.goBack()
                    DeviceEventEmitter.emit('event.RequestViewer.onConfirmed')
                },
                (error) => {
                    console.log('--------- error: ', { ...error })
                    ToastAndroid.show('Error occured!', ToastAndroid.LONG)
                }
            )
        }
    }

    const aspectRatio = Dimensions.get('screen').width / Dimensions.get('screen').height

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
                        <Text style={[{ textAlign: 'center' }, Style.fontSize(18), fw_700, my_10]}>WITHDRAW REQUEST VIEWER</Text>
                    </View>
                </BlurView>
            </Shadow>

            <ScrollView style={flex_1} contentContainerStyle={p_25}>
                <View style={flex_row}>
                    <Avatar
                        rounded
                        source={{ uri: withdraw?.wallet.shipper.profilePictureUrl }}
                        size={60}
                    />
                    <View style={ml_25}>
                        <Text style={[Style.fontSize(19), fw_700]}>{withdraw?.wallet.shipper.firstName + ' ' + withdraw?.wallet.shipper.lastName}</Text>
                        <View style={[flex_row]}>
                            <Text style={Style.fontSize(15)}>Requested credits:</Text>
                            <Text style={[ml_10, fw_700, Style.fontSize(17), Style.textColor('#05668d')]}>{withdraw?.amount}</Text>
                        </View>
                    </View>
                </View>

                <View style={[Style.dimen(1, '85%'), Style.backgroundColor('#bee1e6'), my_20, align_self_center, border_radius_pill]} />

                <Text style={[Style.fontSize(15), fw_700]}>Amount to withdraw:</Text>
                <Text style={[ml_10, fw_700, Style.fontSize(15), Style.textColor('#05668d')]}>{withdraw?.amount * 1000} VND</Text>


                <Text style={[Style.fontSize(15), fw_700, mt_20]}>Upload proof:</Text>
                <View style={flex_row}>
                    <Button
                        containerStyle={[mt_5]}
                        title={'Choose Photo'}
                        buttonStyle={[Style.borderRadius(100), px_20]}
                        titleStyle={[Style.textColor('#05668d')]}
                        icon={{ name: 'add-photo-alternate', type: 'material-icon', color: '#05668d' }}
                        color={'#05668d33'}
                        onPress={launchCamera}
                    />
                </View>

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
                    containerStyle={[mt_15]}
                    title={'Confirm Withdraw'}
                    buttonStyle={[Style.borderRadius(100), px_20]}
                    titleStyle={[Style.textColor('#ff006e')]}
                    icon={{ name: 'add-photo-alternate', type: 'material-icon', color: '#ff006e' }}
                    color={'#ff006e33'}
                    disabled={(photo === undefined)}
                    onPress={confirmWithdraw}
                />

            </ScrollView>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    }
});