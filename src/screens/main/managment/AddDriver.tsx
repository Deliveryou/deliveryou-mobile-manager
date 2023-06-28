import { View, Text, TouchableNativeFeedback, StyleSheet, StatusBar, ScrollView, DeviceEventEmitter, Pressable, TextInput, StyleProp, ViewStyle, TextStyle, KeyboardTypeOptions, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Style, align_items_center, align_self_center, border_radius_pill, flex_1, flex_row, fw_bold, justify_center, mb_10, mb_15, ml_5, mt_15, mt_20, my_20, p_10, pb_5, px_15, px_20, py_10, w_100 } from '../../../stylesheets/primary-styles'
import { Shadow } from 'react-native-shadow-2'
import { Avatar, Button, Icon, ListItem } from '@rneui/themed'
import { useNavigation, useRoute } from '@react-navigation/native'
import Validator from '../../../utils/Validator'
import { UserService } from '../../../services/UserService'
import { GraphQLService } from '../../../services/GraphQLService'
import { AuthenticationService } from '../../../services/AuthenticationService'

export default function AddDriver() {
    const route = useRoute()
    const navigation = useNavigation()

    const [selectedProfilePic, setSelectedProfilePic] = useState<string | undefined>()
    const phone = useRef('')
    const firstname = useRef('')
    const lastname = useRef('')
    const citizenId = useRef('')
    const dob = useRef('')
    const password = useRef('')
    const passwordConfirmation = useRef('')
    const [passwordConfirmationError, setPasswordConfirmationError] = useState('')

    const backColor = (route.params?.backColor) ? route.params.backColor : 'black'

    const profilePhotoUrl = ((selectedProfilePic) ? selectedProfilePic : "https://randomuser.me/api/portraits/lego/1.jpg")

    function openCamera() {
        navigation.navigate("CameraScreen" as never)
    }

    useEffect(() => {
        DeviceEventEmitter.addListener('event.ProfileEditor.onPhotoChosen', (photoPath: string) => {
            setSelectedProfilePic(photoPath)
        })
    }, [])

    function validate() {
        const updatedUser = {} as LooseObject
        // first name
        if (firstname.current.trim() !== '')
            updatedUser.firstName = firstname.current.trim()
        else {
            ToastAndroid.show('First name cannot be empty', ToastAndroid.LONG)
            return
        }
        // last name
        if (lastname.current.trim() !== '')
            updatedUser.lastName = lastname.current.trim()
        else {
            ToastAndroid.show('Last name cannot be empty', ToastAndroid.LONG)
            return
        }
        // citizen id
        if (citizenId.current.trim() !== '' && [10, 12].includes(citizenId.current.length))
            updatedUser.citizenId = citizenId.current
        else {
            ToastAndroid.show('Invalid citizen ID', ToastAndroid.LONG)
            return
        }
        // dob
        if (dob.current.trim() !== '' && !isNaN(Date.parse(dob.current.trim())))
            updatedUser.dateOfBirth = dob.current.trim()
        else {
            ToastAndroid.show('Invalid date format, [year-month-day]', ToastAndroid.LONG)
            return
        }
        // phone number
        if (phone.current.trim() !== '')
            updatedUser.phone = phone.current.trim()
        else {
            ToastAndroid.show('Invalid phone number', ToastAndroid.LONG)
            return
        }
        // password
        if (password.current !== '' && password.current.length > 7)
            updatedUser.password = password.current
        else {
            ToastAndroid.show('Password length must be at least 8', ToastAndroid.LONG)
            return
        }

        if (password.current !== passwordConfirmation.current) {
            ToastAndroid.show('Password mismatches!', ToastAndroid.LONG)
            return
        }

        return (Object.keys(updatedUser).length > 0) ? updatedUser : null
    }

    function addNewDriver() {
        var obj = validate()

        if (obj === null) {
            ToastAndroid.show('Invalid info, check again!', ToastAndroid.LONG)
            return
        } else if (obj !== undefined) {
            AuthenticationService.register(
                obj,
                () => { },
                (error) => {
                    console.log('>>> error: ', error)
                    ToastAndroid.show('Cannot add driver: server timeout', ToastAndroid.LONG)
                }
            )
        }

    }

    function onPasswordConfirmationTyped(text: string) {
        if (text === password.current) {
            passwordConfirmation.current = text
            setPasswordConfirmationError('')
        } else
            setPasswordConfirmationError('Password mismatches')
    }

    const itemTitleWidth = Style.width(100)

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
                        ADD A NEW DRIVER
                    </Text>
                </View>
            </Shadow>
            {/* -------- CONTENT -------- */}
            <ScrollView style={[flex_1]}>
                <View style={[align_items_center, justify_center, mt_20, mb_15]}>
                    <View style={[border_radius_pill, mb_10]}>
                        <Avatar
                            size={100}
                            rounded
                            source={{ uri: profilePhotoUrl }}
                            containerStyle={Style.border('#d6ccc2', 5, 'solid')}
                        />
                    </View>
                    <Button
                        title={"Use another profile photo"}
                        containerStyle={border_radius_pill}
                        buttonStyle={Style.backgroundColor('#dfecff')}
                        titleStyle={Style.textColor('#0a83ff')}
                        onPress={openCamera}
                    />
                </View>

                <EditorTextField
                    onChangeText={text => firstname.current = text}
                    containerStyle={[pb_5, px_20]}
                    title='First name'
                    titleStyle={itemTitleWidth}
                    placeholder="enter first name"
                />

                <EditorTextField
                    onChangeText={text => lastname.current = text}
                    containerStyle={[pb_5, px_20]}
                    title='Last name'
                    titleStyle={itemTitleWidth}
                    placeholder="enter last name"
                />

                <EditorTextField
                    onChangeText={text => citizenId.current = text}
                    containerStyle={[pb_5, px_20]}
                    title='Citizen ID'
                    titleStyle={itemTitleWidth}
                    placeholder="enter 10 or 12 digits"
                />

                <EditorTextField
                    onChangeText={text => dob.current = text}
                    containerStyle={[pb_5, px_20]}
                    title='Date of birth'
                    titleStyle={itemTitleWidth}
                    placeholder="2000-01-01"
                />

                <PhoneNumber
                    newPhoneRef={phone}
                    itemTitleWidth={itemTitleWidth}
                    spacing={0}
                />

                <EditorTextField
                    onChangeText={text => password.current = text}
                    containerStyle={[pb_5, px_20]}
                    title='Password'
                    titleStyle={itemTitleWidth}
                />

                <EditorTextField
                    onChangeText={onPasswordConfirmationTyped}
                    containerStyle={[pb_5, px_20]}
                    title='Password confirmation'
                    errorMessage={passwordConfirmationError}
                    titleStyle={itemTitleWidth + 50}
                />

                <View style={[flex_row, align_items_center, justify_center, my_20]}>
                    <Button title={"Add driver"}
                        onPress={addNewDriver}
                        containerStyle={border_radius_pill}
                        buttonStyle={[px_15, py_10, Style.backgroundColor('#0a83ff')]}
                    />
                </View>

            </ScrollView>

        </View>
    )
}

// --------------------------------

interface ChangePhoneNumberProps {
    spacing: number
    itemTitleWidth: { width: string | number },
    newPhoneRef: React.MutableRefObject<string>
}

function PhoneNumber(props: ChangePhoneNumberProps) {
    const [expanded, setExpanded] = useState(false)
    const [newPhone, _setNewPhone] = useState<string>('')
    const newPhoneErrorMsg = useRef('')
    const newPhoneInfoMsg = useRef('')
    const [enterOTPErrorMsg, setEnterOTPErrorMsg] = useState('')
    const [_refesh, setRefesh] = useState(0)
    const sendOTPButtonDisabled = useRef(true)
    // const [otpConfirmation, setOtpConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult>()
    const [otpConfirmation, setOtpConfirmation] = useState<{ confirm: (code: string) => Promise<any> }>()
    const newPhoneConfirmed = useRef(false)
    const confirmedNumbers = useRef<Set<string>>(new Set<string>())

    const refresh = () => setRefesh(value => value + 1)

    useEffect(() => {
        //props.newPhoneRef.current = (expanded) ? 
    }, [expanded])


    function sendOTP() {
        // check if the new phone number is already used
        ToastAndroid.show('SMS sent!', ToastAndroid.LONG)

        UserService.phoneExists(newPhone,
            (exists) => {
                if (!exists) {
                    setOtpConfirmation({
                        confirm: async (code) => {
                            if (code.trim() === '234654')
                                return 1;
                            throw 'exception'
                        }
                    })
                    // auth().signInWithPhoneNumber(newPhone)
                    //     .then(res => {
                    //         const toast = (otpConfirmation) ? 'SMS resent' : 'SMS sent!'
                    //         ToastAndroid.show(toast, ToastAndroid.LONG)
                    //         setOtpConfirmation(res)
                    //     })
                    //     .catch(error => ToastAndroid.show('Failed to send sms!', ToastAndroid.LONG))
                } else {
                    newPhoneErrorMsg.current = 'This number already exists'
                    refresh()
                }
            },
            () => ToastAndroid.show('Cannot contact server, try again!', ToastAndroid.LONG)
        )
    }

    function confirmOTP(code: string) {
        if (otpConfirmation)
            otpConfirmation.confirm(code)
                .then(_ => {
                    confirmedNumbers.current.add(newPhone)
                    onCanUsePhone(newPhone)
                    setEnterOTPErrorMsg('')
                })
                .catch(_ => setEnterOTPErrorMsg('Wrong/expired OTP'))
    }

    function onCanUsePhone(phone: string) {
        newPhoneConfirmed.current = true
        sendOTPButtonDisabled.current = true
        setOtpConfirmation(undefined)
        props.newPhoneRef.current = phone
    }

    function setNewPhone(phone: string) {
        phone = phone.trim().replace(/\s+/gm, '')
        Validator.validate(Validator.TYPE.PHONE.COUNTRY_CODE_VN, phone,
            () => {
                if (confirmedNumbers.current.has(phone)) {
                    newPhoneErrorMsg.current = ''
                    onCanUsePhone(phone)
                    refresh()
                } else {
                    newPhoneErrorMsg.current = ''
                    sendOTPButtonDisabled.current = false
                }
                _setNewPhone(phone)
            },
            () => {
                newPhoneErrorMsg.current = 'Invalid phone format'
                newPhoneConfirmed.current = false
                sendOTPButtonDisabled.current = true
                props.newPhoneRef.current = ''
                _setNewPhone(phone)
            }
        )
    }

    const changePhoneButtonColor = (expanded) ? Style.backgroundColor('#fbe260') : Style.backgroundColor('#e5e5eb')
    newPhoneInfoMsg.current = (newPhoneConfirmed.current) ? 'Use this new number' : ''

    return (
        <ListItem.Accordion
            content={
                <TouchableNativeFeedback onPress={() => setExpanded(!expanded)}>
                    <View style={[ml_5, Style.borderRadius(10), p_10, changePhoneButtonColor]}>
                        <Text style={Style.textColor('#495057')}>Add a phone number</Text>
                    </View>
                </TouchableNativeFeedback>
            }
            isExpanded={expanded}
            onPress={() => setExpanded(!expanded)}
        >
            <View style={[p_10, Style.backgroundColor('#dee2e6')]}>
                <EditorTextField
                    spacing={props.spacing}
                    containerStyle={[pb_5, px_20, mb_10]}
                    title='New phone number'
                    placeholder='+84'
                    defaultValue={newPhone}
                    titleStyle={props.itemTitleWidth}
                    keyboardType='phone-pad'
                    onChangeText={setNewPhone}
                    errorMessage={newPhoneErrorMsg.current}
                    infoMessage={newPhoneInfoMsg.current}
                />
                <Button
                    onPress={sendOTP}
                    containerStyle={border_radius_pill}
                    color='#aaccf2'
                    titleStyle={Style.textColor('#0a83ff')}
                    title={(otpConfirmation) ? 'Resend OTP' : 'Send OTP'}
                    disabled={sendOTPButtonDisabled.current}
                />
                {
                    (otpConfirmation) ?
                        <EditorTextField
                            spacing={props.spacing}
                            containerStyle={[pb_5, px_20, mt_20]}
                            title='Enter OTP'
                            titleStyle={props.itemTitleWidth}
                            placeholder='6 digits code'
                            keyboardType='decimal-pad'
                            maxLength={6}
                            onChangeText={(text) => {
                                if (text.length === 6)
                                    confirmOTP(text)
                            }}
                            errorMessage={enterOTPErrorMsg}
                        /> : null
                }
            </View>
        </ListItem.Accordion>
    )
}

// -------------------------------

// --------------------------------

type LooseObject = {
    [key: string]: any
}

interface EditorTextFieldProps {
    containerStyle?: StyleProp<ViewStyle>,
    title: string,
    spacing?: number,
    titleStyle?: StyleProp<TextStyle>,
    defaultValue?: string,
    onFocusStyle?: {
        borderColor: string,
        borderBottomWidth: number
    },
    editable?: boolean,
    errorMessage?: string,
    //errorStyle?: StyleProp<TextStyle>,
    infoMessage?: string,
    placeholder?: string,
    keyboardType?: KeyboardTypeOptions,
    onChangeText?: (text: string) => void,
    refObject?: React.MutableRefObject<LooseObject>,
    maxLength?: number,
    value?: React.MutableRefObject<string | undefined>
}

function EditorTextField(props: EditorTextFieldProps) {
    const [beingFocus, setBeingFocus] = useState(false)
    const input = useRef<TextInput>(null)

    const spacing = (props.spacing) ? props.spacing : 10

    let titleStyle = (props.titleStyle) ? props.titleStyle : {}

    const inputBottomStyle = (beingFocus) ?
        ((props.onFocusStyle) ? props.onFocusStyle : { borderColor: 'blue', borderBottomWidth: 1 }) : {}

    let containerStyle = (props.containerStyle) ? props.containerStyle : {}

    function clear() {
        input.current?.clear()
    }

    useEffect(() => {
        if (props.refObject?.current) {
            props.refObject.current.clearText = clear
        }

    }, [])


    const displayError: boolean = (props.errorMessage !== undefined && props.errorMessage.trim() !== '')
    const displayInfo: boolean = (props.infoMessage !== undefined && props.infoMessage.trim() !== '')

    return (
        <View style={[styles.editorTextFieldContainer, containerStyle]}>
            <Pressable onPress={() => input.current?.focus()}>
                <Text style={[styles.editorTextFieldTitle, titleStyle]}>{props.title}</Text>
            </Pressable>
            <View style={Style.dimen('100%', spacing)} />
            <View style={flex_1}>
                <TextInput
                    style={[styles.editorTextFieldInput, (displayError) ? mt_15 : {}, inputBottomStyle]}
                    defaultValue={props.defaultValue}
                    onFocus={() => {
                        setBeingFocus(true)
                        props.value = undefined
                    }}
                    onBlur={() => setBeingFocus(false)}
                    editable={props.editable}
                    placeholder={props.placeholder}
                    keyboardType={props.keyboardType}
                    onChangeText={props.onChangeText}
                    maxLength={props.maxLength}
                    ref={input}
                    value={props.value?.current}
                />
                {
                    (displayInfo || displayError) ?
                        (
                            (displayError) ?
                                <Text style={[styles.error]}>{props.errorMessage?.trim()}</Text>
                                : (
                                    (displayInfo) ?
                                        <Text style={[styles.info]}>{props.infoMessage?.trim()}</Text> : null
                                )
                        )
                        : null
                }
            </View>
        </View>
    )
}

// --------------------------------

const styles = StyleSheet.create({
    editorTextFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    editorTextFieldTitle: {
        fontSize: 15,
    },

    editorTextFieldInput: {
        marginTop: 5,
        fontSize: 15,
        flex: 1,
        padding: 5,
    },

    error: {
        color: '#ff595e'
    },

    info: {
        color: '#4fca62'
    },

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