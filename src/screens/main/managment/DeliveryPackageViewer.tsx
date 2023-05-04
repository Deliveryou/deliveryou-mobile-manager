import { View, Text, TouchableNativeFeedback, StyleSheet, StatusBar, Dimensions, ScrollView, DeviceEventEmitter, ToastAndroid, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Style, align_items_center, align_items_start, align_self_center, align_self_flex_end, align_self_flex_start, bg_black, bg_primary, border_radius_pill, flex_1, flex_row, fw_bold, justify_center, m_10, mb_10, mb_5, ml_10, ml_15, ml_20, ml_25, mr_10, mr_20, mr_5, mt_15, mt_5, mx_10, my_10, my_5, overflow_hidden, p_10, p_5, px_10, px_20, px_5, py_10, text_white, w_100 } from '../../../stylesheets/primary-styles'
import { Shadow } from 'react-native-shadow-2'
import { Avatar, BottomSheet, Icon, Image } from '@rneui/themed'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GraphQLService } from '../../../services/GraphQLService'
import { PackageService } from '../../../services/PackageService'

type User = GraphQLService.Type.User
type DeliveryPackage = GraphQLService.Type.DeliveryPackage

const data: DeliveryPackage[] = [
    {
        "id": 1,
        "user": {
            "id": 1,
            "firstName": "Andie",
            "lastName": "W",
            "phone": "0858594852",
            "citizenId": undefined,
            "profilePictureUrl": "https://randomuser.me/api/portraits/men/32.jpg",
            //"matchingReferences": undefined,
            "dateOfBirth": [2001, 2, 2].join('-'),
            "deleted": false
        },
        "shipper": undefined,
        "photoUrl": "https://res.cloudinary.com/de26tcplz/image/upload/v1681781467/deliveryou_mobile/qe3rhbjac59mbwbha3ep.jpg",
        "promotion": undefined,
        "price": 42196.73,
        "senderAddress": {
            "id": 0,
            "latitude": 10.818138513526865,
            "longitude": 106.67616907540786,
            "displayName": "Hẻm 463 Nguyễn Văn Công, Ward 3, Ho Chi Minh City, 71409, Vietnam",
            "country": "Vietnam",
            "countryCode": "vn"
        },
        "recipientAddress": {
            "id": 0,
            "latitude": 10.7748184,
            "longitude": 106.6992492,
            "displayName": "Nhà Hàng Nướng Barbecue Garden, 135, Nam Kỳ Khởi Nghĩa, Ben Thanh Ward, Ho Chi Minh City, 00084, Vietnam",
            "country": "Vietnam",
            "countryCode": "vn"
        },
        "recipientName": "Common W",
        "recipientPhone": "0858067677",
        "note": "hi there",
        "packageType": {
            "id": 1,
            "name": "Food"
        },
        "creationDate": new Date(1681781469.113797200).toISOString(),
        "status": {
            "id": 3,
            "name": "PENDING"
        }
    }
]

//-----------------------------------

function ListHeaderItem(props: {
    user: User,
    userType: 'shipper' | 'user'
    backColor: string,
    total?: number
}) {

    return (
        <Shadow style={[w_100, Style.borderRadius(10)]} containerStyle={m_10}>
            <View style={[py_10, px_20, flex_row]}>
                <View style={[Style.backgroundColor('#ffb5a7'), border_radius_pill, p_5, mr_20]}>
                    <Avatar
                        source={{ uri: props.user?.profilePictureUrl }}
                        rounded
                        size={80}
                    />
                </View>
                <View style={[Style.backgroundColor('#d9d9d9'), Style.dimen('90%', 2), align_self_center]} />
                <View style={[flex_1, justify_center, ml_20]}>
                    <View style={flex_row}>
                        <Text style={[Style.fontSize(18), fw_bold, Style.textColor('#463f3a'), mr_10, mb_5]}>
                            {props.user?.firstName + ' ' + props.user?.lastName}
                        </Text>
                        <View style={[Style.backgroundColor(`${props.backColor}40`), border_radius_pill, px_10]}>
                            {
                                (props.userType === 'shipper') ?
                                    <Icon name='motorbike' type='material-community' color={'#eda52c'} size={25} />
                                    :
                                    <Icon name='people' type='ion-icon' color={'#4272d1'} />
                            }
                        </View>
                    </View>
                    <Text style={[Style.fontSize(15), Style.textColor('#8a817c'), mb_5]}>{props.user?.phone}</Text>
                    <View style={flex_row}>
                        <Text style={[Style.fontSize(14), fw_bold, mr_10]}>Total packages:</Text>
                        <Text style={[fw_bold, Style.textColor(props.backColor), Style.fontSize(15)]}>{(props.total) ? props.total : 0}</Text>
                    </View>
                </View>
            </View>
        </Shadow>
    )
}

//-----------------------------------

export default function DeliveryPackageViewer() {
    const navigation = useNavigation()
    const route = useRoute()

    const [btmSheetPackageId, setBtmSheetPackageId] = React.useState(0)
    const [dataList, setDataList] = React.useState<DeliveryPackage[]>([])
    const dataMap = React.useMemo(createMapFromDataList, [dataList])

    const backColor = (route.params?.backColor) ? route.params.backColor : '#000'

    function createMapFromDataList() {
        const map = new Map<number, DeliveryPackage>()
        dataList?.forEach(deliveryPackage => map.set(deliveryPackage.id, deliveryPackage))
        return map
    }

    function failedRouteParams() {
        navigation.goBack()
        ToastAndroid.show('Cannot open packages viewer', ToastAndroid.LONG)
        return undefined
    }

    const user: User = React.useMemo(() => {
        if (route.params?.user)
            return route.params.user

        return failedRouteParams()
    }, [])

    const userType: 'shipper' | 'user' = React.useMemo(() => {
        if (route.params?.userType)
            return route.params.userType

        return failedRouteParams()
    }, [])

    function getPackageList() {
        PackageService.getAllDeliveryPackages(
            user.id,
            (packages) => {
                if (Array.isArray(packages)) {
                    setDataList(packages)
                    console.log('>>>>>>> packs: ', packages)
                }
            },
            (error) => {
                ToastAndroid.show('Cannot get packages: Error', ToastAndroid.LONG)
            }
        )
    }

    React.useEffect(() => {
        DeviceEventEmitter.addListener('event.local.DeliveryPackageViewer.onItemPress', (packageId: number | undefined) => {
            if (packageId)
                setBtmSheetPackageId(packageId)
        })
        getPackageList()
    }, [])

    return (
        <View style={flex_1}>
            {/* -------- TOP BAR -------- */}
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
                        DELIVERY PACKAGES
                    </Text>
                </View>
            </Shadow>
            {/* -------- LIST -------- */}
            <FlatList
                data={dataList}
                renderItem={(props) => <PackageListItem {...props} backColor={backColor} />}
                ListHeaderComponent={() => <ListHeaderItem user={user} userType={userType} backColor={backColor} total={dataList.length} />}
            />
            {/* ---------- BTM SHEET ----------- */}
            <BottomSheet
                modalProps={{}}
                isVisible={(btmSheetPackageId !== 0)}
                onBackdropPress={() => setBtmSheetPackageId(0)}
            >
                <BtmSheetContent
                    dataMap={dataMap}
                    packageId={btmSheetPackageId}
                />
            </BottomSheet>
        </View>
    )
}

// ----------------------------------------------

function PackageListItem({ item, index, backColor }) {
    const deliveryPackage: DeliveryPackage | undefined = item as DeliveryPackage

    const creationDate = React.useMemo(() => {
        if (item?.creationDate)
            return new Date(item.creationDate).toUTCString().replace(' GMT', '')
        return '[No Date Info]'
    }, [item?.creationDate])

    function onItemPressed() {
        DeviceEventEmitter.emit('event.local.DeliveryPackageViewer.onItemPress', deliveryPackage?.id)
    }

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={onItemPressed}>
            <View style={[flex_row, mx_10, my_5]}>
                <View style={[mr_5]}>
                    <View style={[Style.backgroundColor(backColor), border_radius_pill, Style.padding(2), mr_10]}>
                        <Avatar
                            rounded
                            icon={{ name: "delivery-dining", type: 'material-icon', size: 30 }}
                        />
                    </View>
                </View>
                <View style={flex_1}>
                    <Text style={[fw_bold, mb_5]} numberOfLines={2}>{deliveryPackage?.recipientAddress?.displayName}</Text>
                    <Text>{creationDate}</Text>
                </View>
                <View style={[justify_center, ml_15]}>
                    <Text style={[fw_bold, Style.fontSize(15), Style.textColor(backColor)]}>12000</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

// ----------------------------------------------

function BtmSheetContent(props: {
    dataMap: Map<number, DeliveryPackage>,
    packageId: number
}) {
    const dPackage = props.dataMap.get(props.packageId)
    const titleWidth = 120

    return (
        <ScrollView style={styles.btmSheetContainer}>
            <View style={[flex_row]}>
                <View style={[overflow_hidden, Style.border('#f4978e', 5, 'solid'), border_radius_pill, align_self_flex_start]}>
                    {
                        (dPackage?.user?.profilePictureUrl) ?
                            <Image
                                source={{ uri: dPackage.user.profilePictureUrl }}
                                style={[Style.dimen(50, 50), border_radius_pill]}
                            />
                            :
                            <Icon name='person-outline' type='material' size={48} style={Style.backgroundColor('#fcd5ce')} color='#f4978e' />
                    }
                </View>
                <View style={[ml_20, flex_1]}>
                    <Text style={[fw_bold, Style.fontSize(15), Style.textColor('#495057')]}>{dPackage?.user?.firstName + ' ' + dPackage?.user?.lastName}</Text>
                    <Text style={[Style.fontSize(15), Style.textColor('#227c9d')]}>{dPackage?.user?.phone}</Text>
                    <Text style={[Style.fontSize(15), mt_5]}>{dPackage?.senderAddress?.displayName}</Text>
                </View>
            </View>
            <Icon name='arrow-down' type='foundation' style={[align_items_start, { marginLeft: 23 }, mt_5]} color={'#f4978e'} />
            <View style={[flex_row, mt_5]}>
                <View style={[overflow_hidden, Style.border('#f4978e', 5, 'solid'), border_radius_pill, align_self_flex_start]}>
                    <Icon name='person-outline' type='material' size={48} style={Style.backgroundColor('#fcd5ce')} color='#f4978e' />
                </View>
                <View style={[ml_20, flex_1]}>
                    <Text style={[fw_bold, Style.fontSize(15), Style.textColor('#495057')]}>{dPackage?.recipientName}</Text>
                    <Text style={[Style.fontSize(15), Style.textColor('#227c9d')]}>{dPackage?.recipientPhone}</Text>
                    <Text style={[Style.fontSize(15), mt_5]}>{dPackage?.recipientAddress?.displayName}</Text>
                </View>
            </View>
            <View style={[Style.backgroundColor('#c2c2c2'), Style.dimen(1, '90%'), my_10, align_self_center]} />
            {
                (dPackage?.shipper) ?
                    <View style={[flex_row, mt_5]}>
                        <View style={[overflow_hidden, Style.border('#f4978e', 5, 'solid'), border_radius_pill, align_self_flex_start]}>
                            {
                                (dPackage?.shipper?.profilePictureUrl) ?
                                    <Image
                                        source={{ uri: dPackage.shipper.profilePictureUrl }}
                                        style={[Style.dimen(50, 50), border_radius_pill]}
                                    />
                                    :
                                    <Icon name='person-outline' type='material' size={48} style={Style.backgroundColor('#fcd5ce')} color='#f4978e' />
                            }
                        </View>
                        <View style={[ml_20, flex_1, justify_center]}>
                            <Text style={[fw_bold, Style.fontSize(15), Style.textColor('#495057')]}>{dPackage?.shipper?.firstName + ' ' + dPackage?.shipper?.lastName}</Text>
                            <Text style={[Style.fontSize(15), Style.textColor('#227c9d')]}>{dPackage?.shipper?.phone}</Text>
                        </View>
                    </View>
                    :
                    <View style={[flex_row]}>
                        <View style={[overflow_hidden, Style.border('#f4978e', 5, 'solid'), border_radius_pill, align_self_flex_start]}>
                            <Icon name='person-outline' type='material' size={48} style={Style.backgroundColor('#fcd5ce')} color='#f4978e' />
                        </View>
                        <View style={[ml_20, flex_1, justify_center]}>
                            <Text style={[fw_bold, Style.fontSize(15), Style.textColor('#495057')]}>[ No Asiggned Shipper]</Text>
                        </View>
                    </View>
            }
            <View style={[flex_row, mt_15, mb_5]}>
                <Text style={[fw_bold, Style.fontSize(15), Style.width(titleWidth)]}>Status:</Text>
                <View style={[Style.backgroundColor('#227c9d'), Style.padding(2), px_10, border_radius_pill]}>
                    <Text style={[fw_bold, text_white]}>{dPackage?.status?.name}</Text>
                </View>
            </View>
            <View style={[flex_row, mb_5]}>
                <Text style={[fw_bold, Style.fontSize(15), Style.width(titleWidth)]}>Package type:</Text>
                <View style={[Style.backgroundColor('#227c9d'), Style.padding(2), px_10, border_radius_pill]}>
                    <Text style={[fw_bold, text_white]}>{dPackage?.packageType?.name}</Text>
                </View>
            </View>
            <View style={[flex_row, mb_5]}>
                <Text style={[fw_bold, Style.fontSize(15), Style.width(titleWidth)]}>Promotions:</Text>
                {
                    (Array.isArray(dPackage?.promotion)) ?
                        dPackage?.promotion.map(promo => {
                            try {
                                const _promo = promo as GraphQLService.Type.Promotion
                                return (
                                    <View style={[Style.backgroundColor('#227c9d'), Style.padding(2), px_10, border_radius_pill]}>
                                        <Text style={[fw_bold, text_white]}>{_promo.promoCode}</Text>
                                    </View>
                                )
                            } catch (error) {
                                return null
                            }
                        })
                        :
                        null
                }
            </View>
            <View style={[flex_row]}>
                <Text style={[fw_bold, Style.fontSize(15), Style.width(titleWidth)]}>Price:</Text>
                <View style={[flex_1]}>
                    <Text style={[Style.fontSize(15)]}>{Math.floor(dPackage?.price)} (VND)</Text>
                </View>
            </View>
            <View style={[flex_row, mt_5]}>
                <Text style={[fw_bold, Style.fontSize(15), Style.width(titleWidth)]}>Note:</Text>
                <View style={[flex_1]}>
                    <Text style={[Style.fontSize(15)]}>{dPackage?.note}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

// ----------------------------------------------

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

    btmSheetContainer: {
        backgroundColor: '#fff',
        padding: 25,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        maxHeight: Dimensions.get('screen').height - 10 - StatusBar.currentHeight
    }
});