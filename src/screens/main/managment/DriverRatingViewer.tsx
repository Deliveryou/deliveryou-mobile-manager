import { View, Text, StyleSheet, TouchableNativeFeedback, DeviceEventEmitter, StatusBar, Modal, ScrollView, FlatList, ListRenderItemInfo, ToastAndroid, TouchableOpacity } from 'react-native'
import React from 'react'
import { Shadow } from 'react-native-shadow-2';
import { Style, align_items_center, align_self_center, bg_white, border_radius_pill, flex_1, flex_row, fw_600, fw_700, fw_bold, justify_center, mb_10, mr_10, mr_5, mt_10, mt_5, my_10, p_10, p_20, text_black, w_100 } from '../../../stylesheets/primary-styles';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Avatar, Button, CheckBox, Icon, ListItem } from '@rneui/themed';
import { GraphQLService } from '../../../services/GraphQLService';
import { AdminService } from '../../../services/AdminService';

export default function DriverRatingViewer() {
    const navigation = useNavigation()
    const route = useRoute()

    const [ratingList, setRatingList] = React.useState<GraphQLService.Type.Rating[]>([])
    const [modalRating, setModalRating] = React.useState<GraphQLService.Type.Rating>()

    React.useEffect(() => {
        AdminService.getRatingList(
            (list) => setRatingList(list),
            (error) => ToastAndroid.show("Server error, cannot fetch data!", ToastAndroid.LONG)
        )

        DeviceEventEmitter.addListener('event.RatingViewer.self.onItemPress', (item: GraphQLService.Type.Rating) => {
            setModalRating(item)
        })
    }, [])

    const backColor = (route.params?.backColor) ? route.params.backColor : 'black'

    return (
        <View>
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
                        RATINGS VIEWER
                    </Text>
                </View>
            </Shadow>

            <FlatList
                data={ratingList}
                renderItem={(props) => <FListItem {...props} />}
            />
            {
                (modalRating) ?
                    <Modal
                        transparent
                        animationType='slide'
                    >
                        <View style={[flex_1, Style.backgroundColor('#ffe8d633'), align_items_center, justify_center]}>
                            <Shadow>
                                <View style={[bg_white, Style.borderRadius(10), p_20, Style.width(300)]}>
                                    <View style={[align_items_center, justify_center]}>
                                        <Avatar
                                            source={{ uri: modalRating.deliveryPackage.shipper?.profilePictureUrl }}
                                            rounded
                                            size={80}
                                        />
                                        <Text style={[Style.fontSize(17), fw_700, mt_5]}>{modalRating.deliveryPackage.shipper?.firstName + ' ' + modalRating.deliveryPackage.shipper?.lastName}</Text>
                                    </View>

                                    <Text style={[Style.backgroundColor('#d3d3d3a3'), my_10, p_10, Style.borderRadius(10)]}>{modalRating.content}</Text>

                                    <Button
                                        onPress={() => setModalRating(undefined)}
                                        title={'CLOSE'}
                                        buttonStyle={[border_radius_pill]}
                                        containerStyle={mt_10}
                                    />
                                </View>
                            </Shadow>
                        </View>
                    </Modal>
                    : null
            }
        </View>
    )
}

// --------------------------------------

function FListItem(props: ListRenderItemInfo<GraphQLService.Type.Rating>) {

    const item = props.item

    const [_refresh, setRefresh] = React.useState(0)

    const refresh = () => setRefresh(value => value + 1)

    const name = React.useMemo(() => {
        return item.deliveryPackage.shipper?.firstName + ' ' + item.deliveryPackage.shipper?.lastName
    }, [props.item])

    function toggleCheckbox() {
        AdminService.markRating(
            item.id,
            !item.marked,
            () => {
                item.marked = !item.marked
                if (item.marked)
                    ToastAndroid.show("Marked this rating!", ToastAndroid.LONG)
                else
                    ToastAndroid.show("Unmarked this rating!", ToastAndroid.LONG)
                refresh()
            },
            () => ToastAndroid.show("Error occured, try again!", ToastAndroid.LONG)
        )
    }

    return (
        <TouchableOpacity
            onPress={() => DeviceEventEmitter.emit('event.RatingViewer.self.onItemPress', item)}
            activeOpacity={0.6}
        >
            <ListItem bottomDivider>
                <Avatar
                    rounded
                    source={{ uri: item.deliveryPackage.shipper?.profilePictureUrl }}
                    size={50}
                />
                <ListItem.Content>
                    <ListItem.Title style={[Style.fontSize(17), fw_700]}>{name}</ListItem.Title>
                    <View style={[justify_center, flex_row]}>
                        <Text style={[Style.fontSize(16), fw_700, mr_5]}>{item.deliveryPackage.shipper?.averageRating}</Text>
                        <Icon name='star' type='font-awesome' size={20} color={'#eca42c'} />
                    </View>
                </ListItem.Content>
                <CheckBox
                    checked={item.marked}
                    onPress={toggleCheckbox}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="red"
                />
            </ListItem>
        </TouchableOpacity>
    )
}


// --------------------------------------

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