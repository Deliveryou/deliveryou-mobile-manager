import { View, Text, ToastAndroid, ScrollView, StyleSheet, StatusBar, ImageBackground, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style, align_items_center, align_self_center, bg_black, bg_primary, bg_white, border_radius_pill, flex_1, flex_row, fw_600, fw_700, fw_bold, justify_center, m_0, m_20, mb_10, ml_20, mr_10, mr_15, mr_20, mt_0, mt_10, mt_20, mt_25, mt_5, my_20, my_25, p_0, p_10, p_20, pb_10, pl_0, pl_10, pl_15, position_absolute, pr_10, pt_0, pt_10, px_10, px_15, px_20, py_5, right_0, text_white, w_100 } from '../../../stylesheets/primary-styles'
import { GraphQLService } from '../../../services/GraphQLService'
import { UserService } from '../../../services/UserService'
import { Global } from '../../../Global'
import { Avatar, BottomSheet, Button, Icon } from '@rneui/themed'
import { Shadow } from 'react-native-shadow-2'
import { BackgroundImage } from '@rneui/base'
import Validator from '../../../utils/Validator'
import { APIService } from '../../../services/APIService'

export default function AboutTab() {
    const [user, setUser] = useState<GraphQLService.Type.User>()
    const [btmSheetVisible, setBtmSheetVisible] = useState(false)

    useEffect(() => {
        const u = GraphQLService.Schema.User

        GraphQLService.getCurrentUser(
            Global.User.CurrentUser.id,
            [u.profilePictureUrl, u.firstName, u.lastName, u.phone, u.citizenId, u.dateOfBirth],
            (user) => {
                console.log('------ get user')
                setUser(user)
            },
            () => {
                ToastAndroid.show('Cannot contact server!\nCheck your connection', ToastAndroid.LONG)
            },
            true
        )
    }, [])

    return (
        <ImageBackground
            style={flex_1}
            source={require('../../../resources/about_bg.jpg')}
        >
            <ScrollView style={styles.root}>
                <Text style={[{ textAlign: 'center' }, Style.fontSize(18), fw_700]}>PROFILE OVERVIEW</Text>
                <View style={[align_items_center, my_25]}>
                    <Shadow
                        distance={10}
                        startColor='#8d99ae4d'
                        containerStyle={[my_25]}
                        style={[Style.borderRadius(500)]}
                    >
                        <Avatar
                            source={{ uri: user?.profilePictureUrl }}
                            size={150}
                            rounded
                            containerStyle={[Style.border('#fff', 8, 'solid')]}
                            icon={{ name: 'person-circle-sharp', type: 'ionicon', color: '#ced4da', size: 130 }}
                            iconStyle={[{ paddingLeft: 4, top: -3 }]}
                        />
                    </Shadow>
                    <Text style={[Style.fontSize(18), border_radius_pill, Style.backgroundColor('#227c9d'), text_white, px_10, py_5, fw_700]}>
                        {user?.firstName + ' ' + user?.lastName}
                    </Text>
                </View>

                <Shadow
                    containerStyle={[m_20]}
                    style={[p_20, Style.borderRadius(10), w_100, Style.backgroundColor('#fff')]}
                    distance={10}
                    startColor='#8d99ae4d'
                >
                    <View>
                        <View style={[flex_row, align_items_center]}>
                            <Icon
                                name='phone'
                                type='entypo'
                                color={'#e56b6f'}
                                containerStyle={[Style.borderRadius(100), Style.backgroundColor('#e56b6f33'), Style.padding(5), mr_10]}
                            />
                            <View>
                                <Text>Phone</Text>
                                <Text style={[Style.fontSize(15), fw_700]}>{user?.phone}</Text>
                            </View>
                        </View>
                        <View style={[flex_row, align_items_center, mt_20]}>
                            <Icon
                                name='city-variant'
                                type='material-community'
                                color={'#e56b6f'}
                                containerStyle={[Style.borderRadius(100), Style.backgroundColor('#e56b6f33'), Style.padding(5), mr_10]}
                            />
                            <View>
                                <Text>Citizen ID</Text>
                                <Text style={[Style.fontSize(15), fw_700]}>{user?.citizenId}</Text>
                            </View>
                        </View>
                        <View style={[flex_row, align_items_center, mt_20]}>
                            <Icon
                                name='calendar'
                                type='entypo'
                                color={'#e56b6f'}
                                containerStyle={[Style.borderRadius(100), Style.backgroundColor('#e56b6f33'), Style.padding(5), mr_10]}
                            />
                            <View>
                                <Text>Date Of Birth</Text>
                                <Text style={[Style.fontSize(15), fw_700]}>{user?.dateOfBirth}</Text>
                            </View>
                        </View>
                        <View style={[flex_row, align_items_center, mt_20]}>
                            <Icon
                                name='key'
                                type='antdesign'
                                color={'#e56b6f'}
                                containerStyle={[Style.borderRadius(100), Style.backgroundColor('#e56b6f33'), Style.padding(5), mr_10]}
                            />
                            <Button
                                title={'CHANGE PASSWORD'}
                                color={'#e56b6f33'}
                                buttonStyle={border_radius_pill}
                                titleStyle={[Style.textColor('#e56b6f'), fw_600]}
                                onPress={() => setBtmSheetVisible(true)}
                            />
                        </View>
                    </View>
                </Shadow>

            </ScrollView>
            {
                (btmSheetVisible) ?
                    <BtmSheet
                        visible={btmSheetVisible}
                        currentUser={user}
                        onRequestCancel={() => setBtmSheetVisible(false)}
                    />
                    : null
            }
        </ImageBackground>
    )
}

// ------------------------------------------

function BtmSheet(props: {
    visible: boolean,
    currentUser?: GraphQLService.Type.User,
    onRequestCancel?: () => void
}) {
    const [currentPassError, setCurrentPassError] = useState<string>()
    const [newPassError, setNewPassError] = useState<string>()
    const [confirmPassError, setConfirmPassError] = useState<string>()
    const [canEnterCurrentPass, setCanEnterCurrentPass] = useState(true)
    const currentPass = React.useRef<string>()
    const newPass = React.useRef<string>()

    const onCurrentPassTyped = React.useCallback((text: string) => {
        Validator.validate(
            Validator.TYPE.PASSWORD,
            text,
            () => {
                UserService.verifyPassword(
                    Global.User.CurrentUser.id,
                    text,
                    (matched) => {
                        if (matched) {
                            currentPass.current = text
                            setCurrentPassError('')
                        } else
                            setCurrentPassError('Wrong password')
                    },
                    (error) => ToastAndroid.show('Server timeout!', ToastAndroid.LONG)
                )
            },
            () => setCurrentPassError('Invalid password format')
        )
    }, [])

    function onNewPassTyped(text: string) {
        setConfirmPassError(undefined)

        Validator.validate(
            Validator.TYPE.PASSWORD,
            text,
            () => {
                if (currentPass.current !== text) {
                    newPass.current = text
                    setNewPassError('')
                } else {
                    setNewPassError('New password cannot be the current one')
                }
            },
            () => {
                newPass.current = undefined
                setNewPassError('Invalid password format!')
            }
        )
    }

    function next() {
        if (canEnterCurrentPass) {
            setCanEnterCurrentPass(false)
            setCurrentPassError('')
        }
    }

    function onReEnterTyped(text: string) {
        if (text === newPass.current) {
            setConfirmPassError('')
        } else {
            setConfirmPassError('Password mismatched!')
        }
    }

    function updatePassword() {
        if (confirmPassError === '' && newPass.current && props.currentUser) {
            const obj = { ...props.currentUser, password: newPass.current, id: Global.User.CurrentUser.id }

            delete obj.__typename

            UserService.updateUser(
                obj,
                (updated) => {
                    if (updated) {
                        ToastAndroid.show('Your password has been updated!', ToastAndroid.LONG)
                        props.onRequestCancel?.()
                    } else
                        ToastAndroid.show('Server refused your request!', ToastAndroid.LONG)
                },
                (error) => {
                    console.log('>>>> Error: ', { ...error })
                    ToastAndroid.show('Cannot update your password: server error!', ToastAndroid.LONG)
                }
            )
        } else {
            ToastAndroid.show('Cannot update your password: check again!', ToastAndroid.LONG)
        }
    }

    return (
        <BottomSheet
            isVisible={props.visible}
        >
            <View style={[p_20, bg_white, Style.borderRadius(15, ['top-left', 'top-right'])]}>
                <Text style={[{ textAlign: 'center' }, Style.fontSize(16), fw_600]}>Change Your Password</Text>
                <View>
                    <TextInput
                        placeholder='Enter your current password'
                        style={[Style.backgroundColor('#e2eafc'), px_20, border_radius_pill, mt_25, Style.fontSize(16)]}
                        onChangeText={onCurrentPassTyped}
                        editable={canEnterCurrentPass}
                    />
                    {
                        (currentPassError === '') ?
                            <Icon
                                name='navigate-next'
                                type='material'
                                size={32}
                                color={'#1a659e'}
                                onPress={next}
                                containerStyle={[Style.backgroundColor('#1a659e33'), position_absolute, mt_25, right_0, Style.dimen(45, 45), border_radius_pill, align_items_center, justify_center]}
                            /> : null
                    }
                </View>
                {
                    (!['', undefined].includes(currentPassError)) ? <Text style={[ml_20, mt_5, Style.textColor('#ef233c')]}>{currentPassError}</Text> : null
                }

                {
                    (!canEnterCurrentPass) ?
                        <>
                            <TextInput
                                placeholder='Enter new password'
                                style={[Style.backgroundColor('#e2eafc'), px_20, border_radius_pill, mt_25, Style.fontSize(16)]}
                                onChangeText={onNewPassTyped}
                            />

                            {
                                (!['', undefined].includes(newPassError)) ? <Text style={[ml_20, mt_5, Style.textColor('#ef233c')]}>{newPassError}</Text> : null
                            }

                            <TextInput
                                placeholder='Re-enter new password'
                                style={[Style.backgroundColor('#e2eafc'), px_20, border_radius_pill, mt_25, Style.fontSize(16)]}
                                onChangeText={onReEnterTyped}
                                editable={(newPassError === '')}
                            />

                            {
                                (!['', undefined].includes(confirmPassError)) ? <Text style={[ml_20, mt_5, Style.textColor('#ef233c')]}>{confirmPassError}</Text> : null
                            }
                        </>
                        : null
                }


                <View style={[flex_row, mt_20]}>
                    <Button
                        title={'Cancel'}
                        color={'#1a659e28'}
                        buttonStyle={[border_radius_pill, Style.height(45)]}
                        titleStyle={[Style.textColor('#1a659e'), fw_600]}
                        containerStyle={[flex_1, mr_15]}
                        onPress={() => props.onRequestCancel?.()}
                    />
                    <Button
                        title={'Update Password'}
                        color={'#e56b6f30'}
                        buttonStyle={[border_radius_pill, Style.height(45)]}
                        titleStyle={[Style.textColor('#e56b6f'), fw_600]}
                        onPress={updatePassword}
                        containerStyle={flex_1}
                        disabled={(confirmPassError !== '')}
                    />
                </View>

            </View>
        </BottomSheet >
    )
}

// ------------------------------------------

const styles = StyleSheet.create({
    root: {
        paddingTop: StatusBar.currentHeight + 20,
        flex: 1
    }
});