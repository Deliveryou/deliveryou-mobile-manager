import { View, Text, StyleSheet, ScrollView, StatusBar, TextInputProps, ToastAndroid, TextInput, FlatList, DeviceEventEmitter, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style, align_items_center, bg_black, bg_danger, bg_primary, border_radius_pill, flex_1, flex_row, fw_600, fw_700, fw_800, fw_bold, justify_center, m_10, m_20, mb_10, mb_15, mb_25, ml_10, ml_5, mr_10, mr_15, mr_5, mt_0, mt_10, mt_25, mt_5, mx_10, mx_20, my_10, my_15, overflow_hidden, p_10, p_5, pl_10, pl_15, px_10, px_5, py_10, py_5, text_white, w_100 } from '../../../stylesheets/primary-styles'
import { Shadow } from 'react-native-shadow-2'
import { BottomSheet, Button, Icon, ListItem, Slider } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { UserDashBoardType } from './UserDashBoard'
import { GraphQLService } from '../../../services/GraphQLService'
import { AdminService } from '../../../services/AdminService'
import PasswordPrompt from './PasswordPrompt'

type ChargeAdvisorRushHour = GraphQLService.Type.ChargeAdvisorRushHour

export default function ManagementTab() {
    const [userManExpanded, setUserManExpanded] = useState(true)
    const [shipperManExpanded, setShipperManExpanded] = useState(true)
    const [configExpanded, setConfigExpanded] = useState(false)
    const [promoExpanded, setPromoExpanded] = useState(true)
    const [proceedWithCaution, setProceedWithCaution] = useState(false)
    const navigation: any = useNavigation()

    const commissionRateCloseRequest = React.useRef<() => void>()

    useEffect(() => {
        const stack = StatusBar.pushStackEntry({
            barStyle: 'dark-content',
            backgroundColor: '#ffffffb5'
        })

        return () => {
            StatusBar.popStackEntry(stack)
        }
    }, [])

    StatusBar.setBarStyle('dark-content')

    function proceedConfig() {
        setProceedWithCaution(true)
        ToastAndroid.show('Configuration will be closed in 10 minutes', ToastAndroid.LONG)
        setTimeout(() => {
            commissionRateCloseRequest.current?.()
            setProceedWithCaution(false)
        }, 600000)
    }

    function openDashboardOfUsers() {
        navigation.navigate('UserDashBoard', {
            type: UserDashBoardType.REGULAR_USERS,
            backColor: '#4272d1',
        })
    }

    function openDashboardOfShippers() {
        navigation.navigate('UserDashBoard', {
            type: UserDashBoardType.SHIPPERS,
            backColor: '#eca42c',
        })
    }

    function openAddDriver() {
        navigation.navigate('AddDriver', {
            type: UserDashBoardType.SHIPPERS,
            backColor: '#eca42c'
        })
    }

    function openPromotionManager() {
        navigation.navigate('PromotionManager', {
            backColor: '#006d77'
        })
    }

    function openWithdrawRequest() {
        navigation.navigate('WithdrawRequest', {
            backColor: '#f25c54'
        })
    }

    function openRating() {
        navigation.navigate('DriverRatingViewer', {
            backColor: '#eca42c'
        })
    }

    function openLogger() {
        navigation.navigate('SystemLogger', {
            backColor: '#9b5de5'
        })
    }




    return (
        <View style={styles.rootContainer}>
            <ScrollView style={styles.scrollContainer}>
                {/* ------------ USER ---------------- */}
                <Shadow
                    containerStyle={[mx_20, my_15]}
                    style={[w_100]}
                    distance={10}
                    startColor='#d9d9d9'
                >
                    <View style={[Style.borderRadius(10), overflow_hidden]}>
                        <ListItem.Accordion
                            content={
                                <View style={[flex_1, flex_row, align_items_center]}>
                                    <Icon name='people' type='ionicon' color={'#4272d1'} />
                                    <Text style={[ml_10, Style.fontSize(15), fw_bold, Style.textColor('#081c46')]}>Manage Users</Text>
                                </View>
                            }
                            isExpanded={userManExpanded}
                            onPress={() => setUserManExpanded(!userManExpanded)}
                        >
                            <View style={styles.itemContent}>
                                <View style={[flex_row, align_items_center, m_10, Style.backgroundColor('#3f71de'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <Text style={[flex_1, Style.fontSize(15), text_white]}>User dashboard</Text>
                                    <Button
                                        title={'Open'}
                                        containerStyle={Style.borderRadius(12)}
                                        buttonStyle={[Style.height(38)]}
                                        titleStyle={Style.textColor('#3f71de')}
                                        color={'#fff'}
                                        onPress={openDashboardOfUsers}
                                    />
                                </View>
                            </View>
                        </ListItem.Accordion>
                    </View>
                </Shadow>
                {/* ------------ SHIPPER ---------------- */}
                <Shadow
                    containerStyle={[mx_20, my_15]}
                    style={[w_100]}
                    distance={10}
                    startColor='#d9d9d9'
                >
                    <View style={[Style.borderRadius(10), overflow_hidden]}>
                        <ListItem.Accordion
                            content={
                                <View style={[flex_1, flex_row, align_items_center]}>
                                    <Icon containerStyle={{ left: -3 }} name='motorbike' type='material-community' color={'#eda52c'} size={30} />
                                    <Text style={[ml_5, Style.fontSize(15), fw_bold, Style.textColor('#081c46')]}>Manage Shippers</Text>
                                </View>
                            }
                            isExpanded={shipperManExpanded}
                            onPress={() => setShipperManExpanded(!shipperManExpanded)}
                        >
                            <View style={styles.itemContent}>
                                <View style={[flex_row, align_items_center, m_10, Style.backgroundColor('#3f71de'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <Text style={[flex_1, Style.fontSize(15), text_white]}>Add new driver</Text>
                                    <Button
                                        title={'Open'}
                                        containerStyle={Style.borderRadius(12)}
                                        buttonStyle={[Style.height(38)]}
                                        titleStyle={Style.textColor('#3f71de')}
                                        color={'#fff'}
                                        onPress={openAddDriver}
                                    />
                                </View>
                                <View style={[flex_row, align_items_center, m_10, mt_0, Style.backgroundColor('#3f71de'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <Text style={[flex_1, Style.fontSize(15), text_white]}>Shipper dashboard</Text>
                                    <Button
                                        title={'Open'}
                                        containerStyle={Style.borderRadius(12)}
                                        buttonStyle={[Style.height(38)]}
                                        titleStyle={Style.textColor('#3f71de')}
                                        color={'#fff'}
                                        onPress={openDashboardOfShippers}
                                    />
                                </View>
                                <View style={[flex_row, align_items_center, m_10, mt_0, Style.backgroundColor('#3f71de'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <Text style={[flex_1, Style.fontSize(15), text_white]}>View Ratings</Text>
                                    <Button
                                        title={'Open'}
                                        containerStyle={Style.borderRadius(12)}
                                        buttonStyle={[Style.height(38)]}
                                        titleStyle={Style.textColor('#3f71de')}
                                        color={'#fff'}
                                        onPress={openRating}
                                    />
                                </View>
                            </View>
                        </ListItem.Accordion>
                    </View>
                </Shadow>
                {/* ------------ SERVER ---------------- */}
                <Shadow
                    containerStyle={[mx_20, my_15]}
                    style={[w_100]}
                    distance={10}
                    startColor='#d9d9d9'
                >
                    <View style={[Style.borderRadius(10), overflow_hidden]}>
                        <ListItem.Accordion
                            content={
                                <View style={[flex_1, flex_row, align_items_center]}>
                                    <Icon name='gears' type='font-awesome' color={'#ce7473'} />
                                    <Text style={[ml_10, Style.fontSize(15), fw_bold, Style.textColor('#081c46')]}>Server Configuration</Text>
                                </View>
                            }
                            isExpanded={configExpanded}
                            onPress={() => setConfigExpanded(!configExpanded)}
                        >
                            <View style={styles.itemContent}>
                                <View style={[align_items_center, m_10, Style.backgroundColor('#ff0054'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <View style={[flex_row, align_items_center]}>
                                        <Icon name='warning' type='entypo' color={'#ffbd00'} size={18} />
                                        <Text style={[ml_10, Style.fontSize(15), text_white, fw_bold]}>Be careful with any changes!</Text>
                                    </View>
                                    {
                                        (!proceedWithCaution) ?
                                            <Button
                                                title={'PROCEED WITH CAUTION'}
                                                containerStyle={[mt_10, Style.borderRadius(10)]}
                                                color={'#f0e6ef'}
                                                titleStyle={[Style.textColor('#ff0054')]}
                                                onPress={proceedConfig}
                                            /> : null
                                    }
                                </View>
                                {
                                    (proceedWithCaution) ?
                                        <>
                                            <ServerConfigContent />
                                            <CommissionRate
                                                onGlobalAbort={commissionRateCloseRequest}
                                            />
                                        </>
                                        : null
                                }
                            </View>
                        </ListItem.Accordion>
                    </View>
                </Shadow>
                {/* ------------ PROMO ---------------- */}
                <Shadow
                    containerStyle={[mx_20, my_15]}
                    style={[w_100]}
                    distance={10}
                    startColor='#d9d9d9'
                >
                    <View style={[Style.borderRadius(10), overflow_hidden]}>
                        <ListItem.Accordion
                            content={
                                <View style={[flex_1, flex_row, align_items_center]}>
                                    <Icon name='burst-sale' type='foundation' color={'#006d77'} size={32} />
                                    <Text style={[ml_10, Style.fontSize(15), fw_bold, Style.textColor('#081c46')]}>Promotion</Text>
                                </View>
                            }
                            isExpanded={promoExpanded}
                            onPress={() => setPromoExpanded(!promoExpanded)}
                        >
                            <View style={styles.itemContent}>
                                <View style={[flex_row, align_items_center, m_10, Style.backgroundColor('#3f71de'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <Text style={[flex_1, Style.fontSize(15), text_white]}>Promotion manager</Text>
                                    <Button
                                        title={'Open'}
                                        containerStyle={Style.borderRadius(12)}
                                        buttonStyle={[Style.height(38)]}
                                        titleStyle={Style.textColor('#3f71de')}
                                        color={'#fff'}
                                        onPress={openPromotionManager}
                                    />
                                </View>
                            </View>
                        </ListItem.Accordion>
                    </View>
                </Shadow>

                {/* ------------ WIDTHDRAW ---------------- */}
                <Shadow
                    containerStyle={[mx_20, my_15]}
                    style={[w_100]}
                    distance={10}
                    startColor='#d9d9d9'
                >
                    <View style={[Style.borderRadius(10), overflow_hidden]}>
                        <ListItem.Accordion
                            content={
                                <View style={[flex_1, flex_row, align_items_center]}>
                                    <Icon name='bank' type='material-community' color={'#f25c54'} size={25} />
                                    <Text style={[ml_10, Style.fontSize(15), fw_bold, Style.textColor('#081c46')]}>Withdraw Requests</Text>
                                </View>
                            }
                            isExpanded={promoExpanded}
                            onPress={() => setPromoExpanded(!promoExpanded)}
                        >
                            <View style={styles.itemContent}>
                                <View style={[flex_row, align_items_center, m_10, Style.backgroundColor('#3f71de'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <Text style={[flex_1, Style.fontSize(15), text_white]}>View Requests</Text>
                                    <Button
                                        title={'Open'}
                                        containerStyle={Style.borderRadius(12)}
                                        buttonStyle={[Style.height(38)]}
                                        titleStyle={Style.textColor('#3f71de')}
                                        color={'#fff'}
                                        onPress={openWithdrawRequest}
                                    />
                                </View>
                            </View>
                        </ListItem.Accordion>
                    </View>
                </Shadow>

                {/* ------------ LOG ---------------- */}
                <Shadow
                    containerStyle={[mx_20, my_15]}
                    style={[w_100]}
                    distance={10}
                    startColor='#d9d9d9'
                >
                    <View style={[Style.borderRadius(10), overflow_hidden]}>
                        <ListItem.Accordion
                            content={
                                <View style={[flex_1, flex_row, align_items_center]}>
                                    <Icon name='history' type='fontisto' color={'#9b5de5'} size={22.5} />
                                    <Text style={[ml_10, Style.fontSize(15), fw_bold, Style.textColor('#081c46')]}>System Logger</Text>
                                </View>
                            }
                            isExpanded={promoExpanded}
                            onPress={() => setPromoExpanded(!promoExpanded)}
                        >
                            <View style={styles.itemContent}>
                                <View style={[flex_row, align_items_center, m_10, Style.backgroundColor('#3f71de'), Style.borderRadius(14), Style.padding(8), pl_15]}>
                                    <Text style={[flex_1, Style.fontSize(15), text_white]}>Open Logger</Text>
                                    <Button
                                        title={'Open'}
                                        containerStyle={Style.borderRadius(12)}
                                        buttonStyle={[Style.height(38)]}
                                        titleStyle={Style.textColor('#3f71de')}
                                        color={'#fff'}
                                        onPress={openLogger}
                                    />
                                </View>
                            </View>
                        </ListItem.Accordion>
                    </View>
                </Shadow>

                <View style={Style.height(100)} />
            </ScrollView>
        </View>
    )
}

// ------------------------------------------

function CommissionRate(props: {
    onGlobalAbort: React.MutableRefObject<(() => void) | undefined>
}) {

    const [systemRate, setSystemRate] = useState(20)
    const [passDialogVisible, setPassDialogVisible] = useState(false)

    const width = 100

    useEffect(() => {
        props.onGlobalAbort.current = () => setPassDialogVisible(false)
    })

    function onSlide(value: number) {
        value = (value < 0) ? 0 : ((value > 100) ? 100 : value)
        setSystemRate(value)
    }

    function changeCommissionRate() {
        AdminService.changeCommissionrate(
            systemRate,
            () => ToastAndroid.show('Commission rate has been changed!', ToastAndroid.LONG),
            () => ToastAndroid.show('Commission rate has NOT been changed!', ToastAndroid.LONG)
        )
    }

    return (
        <>
            <Text style={[Style.fontSize(16), fw_700, ml_10, my_10, Style.textColor('#284b63')]}>Commission Rate</Text>
            <View style={[flex_row, ml_10]}>
                <View style={[Style.backgroundColor('#d9d9d9'), p_10, Style.borderRadius(10)]}>
                    <View style={flex_row}>
                        <Text style={[Style.fontSize(15), fw_600, { width }]}>System rate:</Text>
                        <Text style={[Style.fontSize(16), fw_800, Style.textColor("#197278")]}>{systemRate} %</Text>
                    </View>
                    <View style={[flex_row, mt_5]}>
                        <Text style={[Style.fontSize(15), fw_600, { width }]}>Shipper rate:</Text>
                        <Text style={[Style.fontSize(16), fw_800, Style.textColor("#6a4c93")]}>{100 - systemRate} %</Text>
                    </View>
                </View>
            </View>
            <View style={[mr_10, px_10, py_10]}>
                <Slider
                    value={100}
                    onValueChange={onSlide}
                    maximumValue={90}
                    minimumValue={10}
                    step={1}
                    allowTouchTrack
                    trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                    thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                    thumbProps={{
                        children: (
                            <Icon
                                name="heartbeat"
                                type="font-awesome"
                                size={20}
                                reverse
                                containerStyle={{ bottom: 20, right: 20 }}
                            />
                        ),
                    }}
                />
            </View>
            <Button
                containerStyle={[mb_25, mr_10, mt_25]}
                title={"Change Commission Rate"}
                buttonStyle={[border_radius_pill]}
                titleStyle={Style.textColor('#0077b6')}
                color={'#0077b633'}
                onPress={() => setPassDialogVisible(true)}
            />
            <PasswordPrompt
                visible={passDialogVisible}
                onCloseRequest={() => setPassDialogVisible(false)}
                onSuccess={changeCommissionRate}
            />
        </>
    )
}

// ------------------------------------------

function ServerConfigContent() {
    const titleWidth = 160

    const firstKMValue = React.useRef<string>('')
    const firstKMPriceValue = React.useRef<string>('')
    const otherKMPriceValue = React.useRef<string>('')
    const platformFeeValue = React.useRef<string>('')

    const [config, setConfig] = React.useState<GraphQLService.Type.ChargeAdvisorConfig>()
    const [changesDetected, setChangesDetected] = useState(false)
    const [emptyChanges, setEmptyChanges] = useState(false)

    const [currentFocus, setCurrentFocus] = useState(-1)
    const [currentErrors, setCurrentErrors] = useState<number[]>([])

    React.useEffect(() => {
        if (config) {
            firstKMValue.current = config.firstKm + ''
            firstKMPriceValue.current = config.firstKmPrice + ''
            otherKMPriceValue.current = config.pricePerEveryOtherKm + ''
            platformFeeValue.current = config.platformFee + ''
        }
    }, [config])

    function getConfig() {
        AdminService.getChargeAdvisorConfig(
            (config) => setConfig(config),
            (error) => ToastAndroid.show('', ToastAndroid.LONG)
        )
    }

    function detectChanges() {

        if (!config) {
            setChangesDetected(false)
            console.log('config is null')
            return
        }

        let detected = false
        if (firstKMValue.current !== config.firstKm + '') {
            detected = true
            console.log('>>>>>>>>>>>> detected: ', detected)
        } else if (firstKMPriceValue.current !== config.firstKmPrice + '') {
            detected = true
            console.log('>>>>>>>>>>>> detected: ', detected)
        } else if (otherKMPriceValue.current !== config.pricePerEveryOtherKm + '') {
            detected = true
            console.log('>>>>>>>>>>>> detected: ', detected)
        } else if (platformFeeValue.current !== config.platformFee + '') {
            detected = true
            console.log('>>>>>>>>>>>> detected: ', detected)
        }

        setChangesDetected(detected)
        console.log('>>>>>>>>>>>> detected res: ', firstKMValue.current, config.firstKm)
    }

    React.useEffect(() => {
        getConfig()
    }, [])

    function reset() {

    }

    function getFocusedBtmBorderClr(index: number) {
        return (index == currentFocus) ? { borderBottomColor: '#ff0054' } : {}
    }

    function getErrorBtmColor(index: number) {
        if (currentErrors.includes(index))
            return { borderBottomColor: '#ff0054' }
        return {}
    }

    return (
        <View>
            {
                (config) ?
                    <>
                        <Text style={[Style.fontSize(16), fw_700, ml_10, my_10, Style.textColor('#284b63')]}>Delivery Price Advisor</Text>
                        <View style={pl_15}>
                            <View style={[flex_row, align_items_center, mb_10, mx_10]}>
                                <Text style={[Style.fontSize(15), fw_bold, Style.width(titleWidth)]}>First kilometers:</Text>
                                <TextInput
                                    onChangeText={(text) => {
                                        firstKMValue.current = text
                                        detectChanges(text)
                                    }}
                                    defaultValue={`${config.firstKm}`}
                                    keyboardType='number-pad'
                                    onFocus={() => setCurrentFocus(0)}
                                    onBlur={() => setCurrentFocus(-1)}
                                    style={[styles.inputStyle, getFocusedBtmBorderClr(0)]}
                                />
                            </View>
                            <View style={[flex_row, align_items_center, mb_10, mx_10]}>
                                <Text style={[Style.fontSize(15), fw_bold, Style.width(titleWidth)]}>Price per first KMs:</Text>
                                <Input onTyped={(text) => { detectChanges(text); firstKMPriceValue.current = text }} defaultValue={`${config.firstKmPrice}`} keyboardType='number-pad' placeholder='12500 VND' />
                            </View>
                            <View style={[flex_row, align_items_center, mb_10, mx_10]}>
                                <Text style={[Style.fontSize(15), fw_bold, Style.width(titleWidth)]}>Every other 1KM price:</Text>
                                <Input onTyped={(text) => { detectChanges(text); otherKMPriceValue.current = text }} defaultValue={`${config.pricePerEveryOtherKm}`} keyboardType='number-pad' placeholder='4300 VND' />
                            </View>
                            <View style={[flex_row, align_items_center, mb_10, mx_10]}>
                                <Text style={[Style.fontSize(15), fw_bold, Style.width(titleWidth)]}>Platform fee:</Text>
                                <Input onTyped={(text) => { detectChanges(text); platformFeeValue.current = text }} defaultValue={`${config.platformFee}`} keyboardType='number-pad' placeholder='2000 VND' />
                            </View>
                            {
                                (changesDetected) ?
                                    <>
                                        <Button onPress={reset} color={'#dfecff'} titleStyle={[Style.textColor('#0a83ff'), fw_bold]} containerStyle={[ml_10, mr_10, my_10]} buttonStyle={border_radius_pill} title={'Reset To Previous Values'} />
                                        {
                                            (!emptyChanges) ?
                                                <Button color={'#e5e5ea'} titleStyle={[Style.textColor('#f28d00'), fw_bold]} containerStyle={[ml_10, mr_10, my_10]} buttonStyle={border_radius_pill} title={'Commit Changes'} />
                                                : null
                                        }
                                    </>
                                    : null
                            }
                        </View>
                    </>
                    :
                    <View style={[mx_10, mt_10, mb_15, align_items_center]}>
                        <Text style={[Style.fontSize(16), Style.textColor('#ff0054'), fw_bold]}>Cannot contact server!</Text>
                        <Button containerStyle={mt_10} buttonStyle={border_radius_pill} title={"Try Again"} onPress={getConfig} />
                    </View>
            }
        </View>
    )
}

// ---------------------------------------

function Input(props: TextInputProps & { inputRef?: React.MutableRefObject<any>, onTyped?: (text: string) => void }) {
    const [btmBorderClr, setBtmBorderClr] = React.useState('#cccccc')
    const [error, setError] = React.useState(false)
    const value = React.useRef<string>('')
    const iref = React.useRef<TextInput>(null)

    React.useEffect(() => {
        if (props.inputRef) {
            props.inputRef.current = {} as { [key: string]: any }
            props.inputRef.current.error = () => setError(true)
            props.inputRef.current.getValue = () => {
                return value.current
            }
            props.inputRef.current.clear = () => iref.current?.clear()
            props.inputRef.current.setValue = (_value: string) => {
                iref.current?.setNativeProps({})
            }
        }
    }, [])

    React.useEffect(() => {
        if (error === true)
            setBtmBorderClr('#ff0054')
    }, [error])

    function blurOrFoucus(value: 'blur' | 'focus') {
        if (value === 'focus') {
            setBtmBorderClr('#3f71de')
            setError(false)
            return
        }

        setBtmBorderClr('#cccccc')
    }

    return (
        <TextInput
            onChangeText={(text) => {
                value.current = text
                props.onTyped?.(text)
            }}
            {...props}
            style={[styles.inputStyle, { borderBottomColor: btmBorderClr }]}
            onFocus={() => blurOrFoucus('focus')}
            onBlur={() => blurOrFoucus('blur')}
            ref={iref}
        />
    )
}

// ------------------------------------------

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },

    scrollContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight + 10,
    },

    itemContent: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 15
    },

    inputStyle: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingVertical: 5,
        fontSize: 15
    },

    btmSheet: {

    }
});