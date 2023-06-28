import { View, Text, StyleSheet, TouchableNativeFeedback, StatusBar, TextInput, FlatList, ScrollView, Modal, ToastAndroid, ListRenderItemInfo } from 'react-native'
import React from 'react'
import { Shadow } from 'react-native-shadow-2';
import { Style, align_items_center, align_self_center, bg_white, border_radius_pill, bottom_0, flex_1, flex_row, fs_large, fw_600, fw_bold, h_100, justify_center, left_0, m_15, mb_10, ml_10, ml_15, mr_10, mt_10, mt_15, mt_20, mt_5, mx_10, overflow_hidden, p_0, p_10, p_15, pb_0, pl_0, position_absolute, pr_0, pt_0, pt_15, px_10, px_15, py_5, w_100 } from '../../../stylesheets/primary-styles';
import { Button, FAB, Icon } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native'
import { AdminService } from '../../../services/AdminService';
import { GraphQLService } from '../../../services/GraphQLService';
import { PromotionService } from '../../../services/PromotionService';

export default function PromotionManager() {
    const navigation = useNavigation()
    const route = useRoute()
    const [modalVisible, setModalVisible] = React.useState(false)
    const [promoList, setPromoList] = React.useState<GraphQLService.Type.Promotion[]>([])
    const searchTerms = React.useRef('')
    const [onScroll, setOnScroll] = React.useState(false)

    React.useEffect(() => {
        getPromos()
    }, [])

    const getPromos = React.useCallback(() => {
        PromotionService.getPromotion(
            searchTerms.current,
            (list) => setPromoList(list),
            (error) => {
                console.log('>>>> error: ', { ...error })
                ToastAndroid.show('Cannot load Promotions: server error', ToastAndroid.LONG)
            }
        )
    }, [])

    const backColor = (route.params?.backColor) ? route.params.backColor : '#000'

    return (
        <View style={flex_1}>
            <Shadow
                style={w_100}
                containerStyle={mb_10}
            >
                <View style={styles.topBar}>
                    <TouchableNativeFeedback onPress={navigation.goBack} >
                        <View style={styles.topBarBack}>
                            <Icon name='chevron-back' type='ionicon' size={28} color={backColor} />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={[align_self_center, fw_bold, Style.fontSize(17), Style.textColor('#3f5168')]}>
                        PROMOTION MANAGER
                    </Text>
                </View>
            </Shadow>

            <View style={flex_1}>
                {/* -------- SEARCH BOX -------- */}
                <View style={[flex_row, mx_10, mt_15, mb_10, Style.backgroundColor('#dee2e6'), Style.height(45), border_radius_pill]}>
                    <TextInput
                        placeholder='Search for promotions'
                        style={[flex_1, ml_15, Style.fontSize(15)]}
                        cursorColor={backColor}
                        autoCapitalize='characters'
                        maxLength={10}
                        onChangeText={text => searchTerms.current = text}
                    />
                    <Button
                        buttonStyle={[border_radius_pill, Style.height(45)]}
                        color={backColor}
                        onPress={getPromos}
                    >
                        <Icon name='search' type='feather' color={'#fff'} />
                    </Button>
                </View>

                <FlatList
                    data={promoList}
                    renderItem={PromoCard}
                    onScrollBeginDrag={() => setOnScroll(true)}
                    onMomentumScrollEnd={() => setOnScroll(false)}
                    ListFooterComponent={() => <View style={Style.height(80)} />}
                />

            </View>

            <FAB
                title={(onScroll) ? '' : 'Add Promotion'}
                onPress={() => setModalVisible(true)}
                visible={true}
                placement='right'
                color={backColor}
                icon={{ name: 'pluscircle', type: 'antdesign', color: '#fff' }}
            />

            {
                (modalVisible) ?
                    <AdderModal
                        visible={modalVisible}
                        onCloseRequest={() => setModalVisible(false)}
                        backColor={backColor}
                    />
                    : null
            }

        </View>
    )
}

// -----------------------------------

function PromoCard(props: ListRenderItemInfo<GraphQLService.Type.Promotion>) {
    const promotion = props.item

    return (
        <Shadow
            style={[w_100, Style.borderRadius(10), overflow_hidden]}
            containerStyle={m_15}
            distance={8}
        >
            <TouchableNativeFeedback>
                <View>
                    <View style={[flex_row, pt_15]}>
                        <View style={[flex_row, align_items_center, Style.backgroundColor('#fca311'), px_15, py_5, Style.borderRadius(100, ['top-right', 'bottom-right'])]}>
                            <Icon name='burst-sale' type='foundation' size={32} color={'white'} />
                            <Text style={[ml_10, Style.fontSize(18), fw_600, Style.textColor('#403d39')]}>{promotion.promoCode}</Text>
                        </View>
                    </View>
                    <View style={p_15}>
                        <View>
                            <Text>Description:</Text>
                            <View style={[Style.backgroundColor('#e5e5e5'), Style.padding(8), Style.borderRadius(8), mt_5]}>
                                <Text numberOfLines={10} style={[Style.fontSize(15), Style.textColor('#403d39')]}>{promotion.description}</Text>
                            </View>
                        </View>
                        <View style={mt_10}>
                            <Text>Discount percentage:</Text>
                            <View style={[Style.backgroundColor('#e5e5e5'), Style.padding(8), Style.borderRadius(8), mt_5]}>
                                <Text numberOfLines={10} style={[Style.fontSize(15), Style.textColor('#219ebc'), fw_600]}>{promotion.discountPercentage * 100} %</Text>
                            </View>
                        </View>
                        <View style={mt_10}>
                            <Text>Applicable price:</Text>
                            <View style={[Style.backgroundColor('#e5e5e5'), Style.padding(8), Style.borderRadius(8), mt_5]}>
                                <Text numberOfLines={10} style={[Style.fontSize(15), Style.textColor('#219ebc'), fw_600]}>{promotion.applicablePrice} VND</Text>
                            </View>
                        </View>
                        <View style={mt_10}>
                            <Text>Maximum discount amount:</Text>
                            <View style={[Style.backgroundColor('#e5e5e5'), Style.padding(8), Style.borderRadius(8), mt_5]}>
                                <Text numberOfLines={10} style={[Style.fontSize(15), Style.textColor('#219ebc'), fw_600]}>{promotion.maximumDiscountAmount} VND</Text>
                            </View>
                        </View>
                        <View style={mt_10}>
                            <Text>Expire date:</Text>
                            <View style={[Style.backgroundColor('#e5e5e5'), Style.padding(8), Style.borderRadius(8), mt_5]}>
                                <Text numberOfLines={10} style={[Style.fontSize(15), Style.textColor('#219ebc'), fw_600]}>{(promotion.expireDate) ? new Date(promotion.expireDate).toUTCString() : null}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </Shadow>
    )
}

// -----------------------------------

function promoCodeCreator() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
        let index = Math.floor(Math.random() * chars.length);
        result += chars[index];
    }
    return result;
}

function AdderModal(props: {
    visible: boolean
    onCloseRequest: () => void
    backColor: string
}) {
    const [promoCode, setPromoCode] = React.useState('')
    const discription = React.useRef('')
    const discountPercentage = React.useRef('')
    const maxDiscount = React.useRef('')
    const applicablePrice = React.useRef('')
    const expireDate = React.useRef('')
    const [codeError, setCodeError] = React.useState(false)

    function createPromoCode(count: number = 0) {
        const code = promoCodeCreator()

        console.log('>>>>>>>>>>.. code: ', code)
        AdminService.canUsePromoCode(
            code,
            () => {
                setCodeError(false)
                setPromoCode(code)
            },
            (error) => {
                if (count < 10)
                    createPromoCode(count++)
                else {
                    setCodeError(true)
                    ToastAndroid.show('Cannot create promo code', ToastAndroid.LONG)
                }
            }
        )
    }

    function verify() {
        const obj: { [key: string]: any } = {}

        // promo
        if (promoCode === '') {
            ToastAndroid.show('Invalid promo code!', ToastAndroid.LONG)
            return
        } else
            obj.promoCode = promoCode

        // discription
        if (discription.current.trim() === '') {
            ToastAndroid.show('Discription cannot be empty!', ToastAndroid.LONG)
            return
        } else
            obj.description = discription.current

        // discountPercentage
        if (discountPercentage.current.trim() === '') {
            ToastAndroid.show('Discount percentage cannot be empty!', ToastAndroid.LONG)
            return
        } else {
            const percentage: number = Number(discountPercentage.current.trim())
            if (!isNaN(percentage)) {
                if (percentage < 0 || percentage > 1)
                    ToastAndroid.show('Invalid percentage value!', ToastAndroid.LONG)
                else
                    obj.discountPercentage = percentage.toFixed(2)
            } else
                ToastAndroid.show('Invalid percentage value!', ToastAndroid.LONG)
        }

        // maxDiscount
        const maxDisVal: number = Number(maxDiscount.current)
        if (isNaN(maxDisVal) || maxDisVal < 1000) {
            ToastAndroid.show('Invalid max discount amount!', ToastAndroid.LONG)
            return
        } else
            obj.maximumDiscountAmount = maxDisVal

        // applicablePrice
        const appPriceVal: number = Number(applicablePrice.current)
        if (isNaN(appPriceVal)) {
            ToastAndroid.show('Invalid applicable price!', ToastAndroid.LONG)
            return
        } else
            obj.applicablePrice = (appPriceVal < 0) ? -appPriceVal : appPriceVal;

        // expireDate
        const milis = Date.parse(expireDate.current.trim())
        if (isNaN(milis)) {
            ToastAndroid.show('Invalid expiration date!', ToastAndroid.LONG)
            return
        } else {
            const date = new Date(milis)
            obj.expireDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        }

        return obj

    }

    function addPromo() {
        const obj = verify()

        if (obj) {
            AdminService.addPromotion(
                obj,
                (id) => {
                    ToastAndroid.show('Added new promotion!', ToastAndroid.LONG)
                    props.onCloseRequest()
                },
                (error) => ToastAndroid.show('Cannot add promotion!', ToastAndroid.LONG)
            )
        }
    }

    function onPromoTyped(text: string) {
        const code = text.trim()

        if (code === '' || code.length !== 10) {
            setCodeError(true)
            return
        }

        AdminService.canUsePromoCode(
            code,
            () => {
                setCodeError(false)
                setPromoCode(code)
            },
            (error) => {
                setCodeError(true)
                ToastAndroid.show('This promo code is already in use!', ToastAndroid.LONG)
            }
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <View style={[w_100, h_100, Style.backgroundColor('#d8dad380'), justify_center]}>
                <Shadow
                    containerStyle={[align_self_center]}
                    startColor='#7169691a'
                >
                    <View style={[Style.borderRadius(10), Style.width(350), bg_white, p_15]}>
                        <ScrollView>
                            <View style={flex_row}>
                                <TextInput
                                    style={[flex_1, Style.fontSize(18), fw_bold, Style.textColor('#555b6e')]}
                                    autoCapitalize='characters'
                                    placeholder='Promotion code'
                                    defaultValue={promoCode}
                                    onChangeText={onPromoTyped}
                                />
                                <Button
                                    icon={{ name: 'reload', type: 'material-community', color: '#fff', size: 25 }}
                                    buttonStyle={[Style.dimen(45, 45), Style.borderRadius(100), pl_0, pt_0, pb_0, pr_0]}
                                    onLongPress={() => ToastAndroid.show('Use random code', ToastAndroid.LONG)}
                                    color={props.backColor}
                                    onPress={() => createPromoCode()}
                                />
                            </View>

                            {
                                (codeError) ?
                                    <Text style={Style.textColor('#ff0a54')}>Cannot use this code</Text>
                                    :
                                    null
                            }

                            <View style={[Style.borderRadius(8), Style.backgroundColor('#dce1de'), mt_10]}>
                                <TextInput
                                    placeholder='Discription'
                                    style={[px_10]}
                                    multiline
                                    numberOfLines={5}
                                    onChangeText={text => discription.current = text}
                                />
                            </View>

                            <View style={[Style.borderRadius(8), Style.backgroundColor('#dce1de'), mt_10]}>
                                <TextInput
                                    placeholder='Discount percentage'
                                    style={[px_10]}
                                    onChangeText={text => discountPercentage.current = text}
                                />
                            </View>
                            <View style={[Style.borderRadius(8), Style.backgroundColor('#dce1de'), mt_10]}>
                                <TextInput
                                    placeholder='Maximum discount amount'
                                    style={[px_10]}
                                    onChangeText={text => maxDiscount.current = text}
                                />
                            </View>
                            <View style={[Style.borderRadius(8), Style.backgroundColor('#dce1de'), mt_10]}>
                                <TextInput
                                    placeholder='Applicable price'
                                    style={[px_10]}
                                    onChangeText={text => applicablePrice.current = text}
                                />
                            </View>
                            <View style={[Style.borderRadius(8), Style.backgroundColor('#dce1de'), mt_10]}>
                                <TextInput
                                    placeholder='Expire date'
                                    style={[px_10]}
                                    onChangeText={text => expireDate.current = text}
                                />
                            </View>

                            <View style={[flex_row, mt_20]}>
                                <Button
                                    containerStyle={[flex_1, mr_10]}
                                    title={'CLOSE'}
                                    buttonStyle={[Style.borderRadius(100)]}
                                    titleStyle={[Style.textColor('#0074d9')]}
                                    color={'#0074d933'}
                                    onPress={() => props.onCloseRequest()}
                                />
                                <Button
                                    containerStyle={flex_1}
                                    title={'ADD'}
                                    buttonStyle={[Style.borderRadius(100)]}
                                    titleStyle={[Style.textColor('#0074d9')]}
                                    color={'#0074d933'}
                                    onPress={addPromo}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </Shadow>
            </View>
        </Modal>
    )
}

// -----------------------------------

const styles = StyleSheet.create({
    topBar: {
        paddingTop: StatusBar.currentHeight + 10,
        paddingBottom: 10,
    },

    topBarBack: {
        position: 'absolute',
        marginTop: StatusBar.currentHeight + 7,
        marginLeft: 10,
    },
});