import { View, Text, StyleSheet, Pressable, DeviceEventEmitter, StatusBar, ImageBackground, Alert, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { InputField, InputFieldRef } from '../../components/InputField'
import { Style, align_items_center, align_self_center, bg_danger, bg_transparent, bg_white, border_radius_pill, flex_1, justify_center, justify_space_around, mt_15, mt_20, mt_25, mx_10, mx_20, my_15, overflow_hidden, position_center, px_10, px_20, py_20, text_white } from '../../stylesheets/primary-styles'
import { Button, Dialog, Image } from '@rneui/themed'
import { Divider } from '@rneui/base'
import { Global } from '../../Global'
import { AuthenticationService } from '../../services/AuthenticationService'
import { Authenticate } from './Authenticate'
import { Prioritizer, delay } from '../../utils/ultilities'
import { AxiosError } from 'axios'
import { BlurView } from '@react-native-community/blur'

export default function AuthenticationScreen({ route, navigation }) {
    const [_refresh, setRefresh] = useState(0)

    const refresh = () => setRefresh(value => value + 1)

    useLayoutEffect(() => {
        StatusBar.setTranslucent(true)
        StatusBar.setBarStyle('light-content')
        StatusBar.setBackgroundColor('transparent')
    }, [])

    useEffect(() => {
    }, [])

    return (
        <ImageBackground source={require('../../resources/background.jpg')} style={styles.rootContainer}>
            <View style={styles.topPanel}>
                <BlurView
                    style={[Style.backgroundColor('#ffffff80'), flex_1]}
                    overlayColor='transparent'
                    blurType='light'
                    blurAmount={2}
                    blurRadius={5}
                >
                    <View style={[flex_1, { paddingTop: 200 }]}>
                        <View>
                            <Image source={require('../../resources/logo.png')} style={[{ width: '100%', height: 100, resizeMode: 'contain' }]} />
                        </View>
                    </View>
                </BlurView>
            </View>

            <View style={[mt_25, mx_20]}>
                <LoginSection
                    route={route}
                    navigation={navigation}
                />
            </View>
        </ImageBackground>
    )
}

// -------------------------------------------------------

const prioritizer = new Prioritizer.FirstOnlyMode(100)

interface LoginSectionProps {
    route: any,
    navigation: any
}

function LoginSection(props: LoginSectionProps) {
    const phoneRef: { current?: InputFieldRef } = useRef()
    const passwordRef: { current?: InputFieldRef } = useRef()

    const phoneValue: { current: string } = useRef('')
    const passwordValue: { current: string } = useRef('')

    const loginButtonSize = Style.dimen(50, 200)
    const [loadingDialogVisible, setLoadingDialogVisible] = useState(false)

    const doLogin = () => {
        Authenticate.login({
            phone: phoneValue.current,
            password: passwordValue.current,
            onValidatePasswordFail: () => {
                passwordRef.current?.setInvalid?.(true)
                prioritizer.run(() => ToastAndroid.show('Password must contain at least:\n8 characters (1 number and 1 letter)', 2000))
            },
            onValidatePhoneFail: () => {
                phoneRef.current?.setInvalid?.(true)
                prioritizer.run(() => ToastAndroid.show('ONLY support vietnamese number', 2000))
            },
            onLoginStart: async () => {
                setLoadingDialogVisible(true)
                console.log('dialog: ', loadingDialogVisible)
                console.log('start')
                await delay(1000)
            },
            onLoginFail: (error: AxiosError) => {
                setLoadingDialogVisible(false)
                console.log('dialog: ', loadingDialogVisible)
                console.log('Failed to log in: ', error.cause)
            },
            onLoginSuccess(response) {
                setLoadingDialogVisible(false)
                Global.User.CurrentUser.setType(response.userType)
                Global.User.CurrentUser.id = response.id

                AuthenticationService.securelySaveCredential(
                    response as AuthenticationService.LogInResponse,
                    () => {
                        DeviceEventEmitter.emit('event.AuthenticationScreen.onAuthenticated')
                    },
                    (error) => {
                        Alert.alert('⚠️ Attention',
                            'An error occured when saving for login information!\n\n' +
                            'Your credential will be required when re-launched.',
                            [{
                                text: 'OK',
                                onPress: () => {
                                    DeviceEventEmitter.emit('event.app.authenticationState', true)
                                }
                            }])
                    }
                )

                ToastAndroid.show('Logged in', ToastAndroid.SHORT)
            },
        })
    }

    const toggleDialog = () => {
        setLoadingDialogVisible(!loadingDialogVisible)
        console.log('toggling')
    }

    return (
        <>
            <InputField
                containerStyle={[mt_15]}
                placeholder='Phone number'
                returnKeyType='next'
                onSubmitEditing={() => {
                    passwordRef.current?.focus?.()
                }}
                blurOnSubmit={false}
                ref={phoneRef}
                onChangeText={(text) => phoneValue.current = text}
                textContentType={'telephoneNumber'}
            />

            <InputField
                containerStyle={[mt_15]}
                placeholder='Password'
                // ref={passwordInput}
                onChangeText={(text) => passwordValue.current = text}
                ref={passwordRef}
                onSubmitEditing={doLogin}
                textContentType={'newPassword'}
                secureTextEntry={true}
            />

            <View style={position_center}>
                <Button
                    buttonStyle={[loginButtonSize, border_radius_pill, overflow_hidden]}
                    title={'LOG IN'}
                    containerStyle={[overflow_hidden, border_radius_pill, loginButtonSize, mt_15]}
                    onPress={doLogin} />
            </View>

            <Divider style={[my_15, { width: '55%' }, align_self_center]} width={0.5} />

            <Dialog overlayStyle={Style.dimen(100, 100)} isVisible={loadingDialogVisible}>
                <Dialog.Loading />
            </Dialog>
        </>
    )
}

// -------------------------------------------------------

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },

    topPanel: {
        height: '50%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden'
    },

    x: {
        width: '100%',
        height: 200
    }
});