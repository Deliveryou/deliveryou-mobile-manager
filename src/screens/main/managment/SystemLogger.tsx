import { View, Text, StyleSheet, TouchableNativeFeedback, StatusBar, ScrollView, ToastAndroid, Modal, DeviceEventEmitter, FlatList, ListRenderItemInfo } from 'react-native'
import React, { useState } from 'react'
import { Style, align_items_center, align_self_center, bg_white, border_radius_pill, flex_1, flex_row, fw_600, fw_700, fw_bold, justify_center, m_10, mb_10, mb_20, ml_10, ml_15, mt_10, mt_15, mt_5, mx_15, my_10, p_10, p_20, p_25, px_20, py_10, py_5, text_white, w_100 } from '../../../stylesheets/primary-styles'
import { Shadow } from 'react-native-shadow-2'
import { Avatar, Button, Icon } from '@rneui/themed'
import { useNavigation, useRoute } from '@react-navigation/native'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { GraphQLService } from '../../../services/GraphQLService'
import { AdminService } from '../../../services/AdminService'

export default function SystemLogger() {
    const navigation = useNavigation()
    const route = useRoute()
    const [date, setDate] = useState(new Date(Date.now()))
    const [logList, setLogList] = useState<GraphQLService.Type.SystemLog[]>([])
    const [viewerLog, setViewerLog] = useState<GraphQLService.Type.SystemLog>()

    function chooseDate() {
        DateTimePickerAndroid.open({
            value: date,
            maximumDate: new Date(),
            onChange(event, date) {
                console.log('>>>>>>> date: ', date?.toISOString())
                if (date) {
                    setDate(date)
                    getLogList()
                }
            },
        })
    }

    function getLogList() {
        AdminService.getLogs(
            date,
            (list) => {
                console.log(">>>>>>>>>> list: ", list)
                if (list.length === 0) {
                    ToastAndroid.show('No log to show!', ToastAndroid.LONG)
                    return
                }
                setLogList(list)
                console.log(">>>>>>>>>> SET list: ", logList)
            },
            (error) => ToastAndroid.show('Cannot load logs, try again!', ToastAndroid.LONG)
        )
    }

    React.useEffect(() => {
        getLogList()

        DeviceEventEmitter.addListener('event.SystemLogger.internal.onItemPress', (log: GraphQLService.Type.SystemLog) => {
            setViewerLog(log)
        })
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
                        SYSTEM LOGGER
                    </Text>
                </View>
            </Shadow>

            <Shadow
                style={w_100}
                containerStyle={[mx_15, my_10]}
            >
                <View style={[p_20, Style.borderRadius(10)]}>
                    <View style={flex_row}>
                        <Icon name='calendar' type='antdesign' />
                        <View style={[flex_1, ml_10]}>
                            <Text style={[Style.fontSize(15), fw_600]}>Current log date:</Text>
                            <Text style={[Style.textColor('#8338ec'), fw_700]}>{date.toUTCString()}</Text>
                        </View>
                    </View>

                    <Button
                        title={"View Today Logs"}
                        containerStyle={[mt_15]}
                        color={'#e7c6ff55'}
                        buttonStyle={[Style.borderRadius(100)]}
                        titleStyle={[Style.textColor(backColor)]}
                        onPress={() => {
                            setDate(new Date(Date.now()))
                            getLogList()
                        }}
                    />

                    <Button
                        title={"View Logs In Other Dates"}
                        containerStyle={[mt_15]}
                        color={'#e7c6ff55'}
                        buttonStyle={[Style.borderRadius(100)]}
                        titleStyle={[Style.textColor(backColor)]}
                        onPress={chooseDate}
                    />
                </View>
            </Shadow>

            <FlatList
                data={logList}
                renderItem={LItem}
            />

            <Modal
                visible={viewerLog !== undefined}
                transparent
                animationType='slide'
            >
                <View style={[flex_1, Style.backgroundColor('#fffcf255'), align_items_center, justify_center]}>
                    <Shadow>
                        <ScrollView
                            style={[bg_white, p_25, Style.borderRadius(10), Style.width(320), { maxHeight: 600 }]}
                        >
                            <View style={flex_row}>
                                <Text style={[Style.fontSize(15), fw_600, border_radius_pill, Style.backgroundColor('#9d4edd'), px_20, py_5, text_white]}>{viewerLog?.date}</Text>
                            </View>

                            <Text style={[Style.fontSize(15), mt_10, fw_600]}>Event:</Text>
                            <Text style={[Style.borderRadius(10), mt_5, Style.backgroundColor('#e8e8e8'), p_10]}>{viewerLog?.event}</Text>

                            <Text style={[Style.fontSize(15), mt_10, fw_600]}>Previous data:</Text>
                            <Text style={[Style.borderRadius(10), mt_5, Style.backgroundColor('#e8e8e8'), p_10]}>{viewerLog?.previousData}</Text>

                            <Text style={[Style.fontSize(15), mt_10, fw_600]}>New data:</Text>
                            <Text style={[Style.borderRadius(10), mt_5, Style.backgroundColor('#e8e8e8'), p_10]}>{viewerLog?.newData}</Text>

                            <Text style={[Style.fontSize(15), mt_10, fw_600]}>Made by:</Text>
                            <View style={[mt_5, mb_20, align_items_center, justify_center, Style.borderRadius(10), Style.backgroundColor('#e8e8e8'), p_10]}>
                                <Avatar
                                    source={{ uri: viewerLog?.user.profilePictureUrl }}
                                    size={50}
                                    rounded
                                />
                                <Text style={[mt_10, Style.fontSize(15), fw_bold, Style.backgroundColor('#bc9ec1'), border_radius_pill, px_20, py_5, Style.textColor('#fff')]}>{viewerLog?.user.firstName + " " + viewerLog?.user.lastName}</Text>
                                <Text style={[mt_10, Style.fontSize(15), fw_bold, Style.backgroundColor('#bc9ec1'), border_radius_pill, px_20, py_5, Style.textColor('#fff')]}>{viewerLog?.user.phone}</Text>

                            </View>

                            <View>
                                <Button
                                    title={"Close"}
                                    containerStyle={[mt_10]}
                                    color={"#ccdbfd"}
                                    buttonStyle={[Style.borderRadius(100), py_10]}
                                    titleStyle={[Style.textColor('#0081a7')]}
                                    onPress={() => setViewerLog(undefined)}
                                />
                            </View>
                        </ScrollView>
                    </Shadow>
                </View>
            </Modal>

        </View>
    )
}

// -----------------------------------

function LItem(props: ListRenderItemInfo<GraphQLService.Type.SystemLog>) {
    const item = props.item

    return (
        <Shadow
            containerStyle={[mx_15, my_10]}
            style={w_100}
        >
            <TouchableNativeFeedback
                style={Style.borderRadius(10)}
                onPress={() => {
                    DeviceEventEmitter.emit('event.SystemLogger.internal.onItemPress', item)
                }}
            >
                <View style={[flex_row, p_20, bg_white, Style.borderRadius(10)]}>
                    <Icon name='record' type='foundation' size={35} color={'#3c096c'} />
                    <View style={[flex_1, ml_15]}>
                        <View style={flex_row}>
                            <Text style={[Style.fontSize(15), fw_600, border_radius_pill, Style.backgroundColor('#9d4edd'), px_20, py_5, text_white]}>{item.date}</Text>
                        </View>
                        <Text style={[flex_1, mt_5, Style.fontSize(15)]}>{item.event}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </Shadow>
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