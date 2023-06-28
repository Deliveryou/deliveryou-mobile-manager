import { View, Text, StyleSheet, ToastAndroid, ScrollView, StatusBar, ImageBackground, TouchableOpacity, StyleProp, ViewStyle, TextStyle, DeviceEventEmitter } from 'react-native'
import React, { ReactNode } from 'react'
import { GraphQLService } from '../../../services/GraphQLService';
import { AdminService } from '../../../services/AdminService';
import { UserService } from '../../../services/UserService';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Style, align_items_center, align_items_end, align_items_start, flex_1, flex_row, flex_row_reverse, fw_600, fw_bold, justify_center, mb_10, mb_5, ml_10, ml_15, mr_10, mr_20, mt_10, mt_20, mt_5, mx_20, overflow_hidden, p_15, position_absolute, px_10, px_20, py_10, py_5, text_white, p_10 } from '../../../stylesheets/primary-styles';
import { Avatar, Icon, Image } from '@rneui/themed';

export default function Wallet() {
    const route = useRoute()
    const navigation = useNavigation()

    const [wallet, setWallet] = React.useState<GraphQLService.Type.Wallet>()

    function onIniParamError() {
        navigation.goBack()
        ToastAndroid.show('Cannot load wallet of this driver!', ToastAndroid.LONG)
    }

    React.useEffect(() => {
        getWallet()

        DeviceEventEmitter.addListener('event.WalletDeposit.onDeposited', getWallet)
    }, [])

    function getWallet() {
        const id: number | undefined = route.params?.shipperId

        if (!id) {
            onIniParamError()
            return
        }

        AdminService.getWallet(
            id,
            (wallet) => setWallet(wallet),
            (error) => onIniParamError()
        )
    }

    function openWalletHistory() {
        navigation.navigate('WalletHistory' as never, {
            wallet
        } as never)
    }

    function openWalletDeposit() {
        navigation.navigate('WalletDeposit' as never, {
            wallet
        } as never)
    }
    const cardSize = Style.dimen(200, 350)
    const buttonSize = Style.dimen(60, 60)

    return (
        <ImageBackground
            style={styles.root}
            source={require('../../../resources/about_bg.jpg')}
        >
            <ScrollView style={flex_1}>
                {/* ---------- CARD ------------ */}
                <View style={[align_items_center, justify_center, px_10, { marginTop: 80 }]}>
                    <Image
                        source={require('../../../resources/elements/gradient-card.jpg')}
                        style={cardSize}
                        containerStyle={[Style.borderRadius(10), overflow_hidden, cardSize]}
                    />
                    <View style={[position_absolute, cardSize, p_15]}>
                        <View style={flex_row}>
                            <Avatar
                                source={(wallet?.shipper.profilePictureUrl) ? { uri: wallet.shipper.profilePictureUrl } : undefined}
                                rounded
                                size={45}
                            />
                            <Text style={[Style.textColor('#503981'), Style.fontSize(16), ml_15]}>
                                {
                                    (wallet?.shipper) ? (wallet.shipper.firstName + ' ' + wallet.shipper.lastName) : '[ Wallet owner ]'
                                }
                            </Text>
                        </View>
                        <View style={[flex_row, { marginTop: 40 }]}>
                            <Text style={[Style.fontSize(40), fw_bold, Style.textColor('#4d3a7b')]}>{(wallet) ? wallet.credit : 0}</Text>
                            <Text style={[mt_10, ml_10, Style.fontSize(15), fw_bold, Style.textColor('#4d3a7b')]}>credits</Text>
                        </View>
                        <View style={[flex_1, flex_row_reverse, align_items_end]}>
                            <Icon
                                name='ios-grid'
                                type='ionicon'
                                color={'#f3722c'}
                                containerStyle={[Style.backgroundColor('#ede7e3'), py_5, px_10, Style.borderRadius(10)]}
                            />
                        </View>
                    </View>
                </View>

                {
                    (wallet) ?
                        <FunctionalButton
                            containerStyle={[mx_20, mt_20, mb_10]}
                            buttonStyle={[align_items_start]}
                        >
                            <Text style={[mr_10, Style.fontSize(15), fw_600, text_white, mb_5]}>Exchange Rate:</Text>
                            <Text style={[Style.fontSize(15), text_white, flex_1]}>{wallet.credit} credits = {wallet.credit * 1000} VND</Text>
                        </FunctionalButton>
                        : null
                }

                <View style={[flex_row, px_20, py_10]}>
                    <FunctionalButton
                        title='History'
                        containerStyle={mr_20}
                        buttonStyle={buttonSize}
                        onPress={openWalletHistory}
                    >
                        <Icon name='history' type='material-community' color={'#fff'} />
                    </FunctionalButton>
                    <FunctionalButton
                        title='Deposit'
                        containerStyle={mr_20}
                        buttonStyle={buttonSize}
                        onPress={openWalletDeposit}
                    >
                        <Icon name='bank-plus' type='material-community' color={'#fff'} />
                    </FunctionalButton>
                </View>

            </ScrollView>
        </ImageBackground>
    )
}

// ------------------------------------

function FunctionalButton(props: {
    containerStyle?: StyleProp<ViewStyle>
    buttonStyle?: StyleProp<ViewStyle>
    titleContainerStyle?: StyleProp<ViewStyle>
    titleStyle?: StyleProp<TextStyle>
    title?: string
    onPress?: () => void
    children?: ReactNode
}) {
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={props.onPress}>
            <View style={[props.containerStyle]}>
                <View style={[Style.backgroundColor('#4d3a7b'), Style.borderRadius(8), align_items_center, justify_center, p_10, props.buttonStyle]}>
                    {props.children}
                </View>
                {
                    (props.title && props.title.trim() !== '') ?
                        <View style={[align_items_center, mt_5, props.titleContainerStyle]}>
                            <Text style={[props.titleStyle]}>{props.title}</Text>
                        </View>
                        : null
                }
            </View>
        </TouchableOpacity>
    )
}

// --------------------------------------------

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: StatusBar.currentHeight
    }
});