import { View, Text, StyleSheet, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style, align_items_center, bg_white, border_radius_pill, flex_1, fw_600, justify_center, ml_10, ml_15, mt_10, mt_20, mt_5, p_20, p_25, px_25, py_10 } from '../../../stylesheets/primary-styles'
import { Shadow } from 'react-native-shadow-2'
import { Button } from '@rneui/themed'
import { UserService } from '../../../services/UserService'
import { Global } from '../../../Global'

export default function PasswordPrompt(props: {
    visible?: boolean,
    onCloseRequest?: () => void,
    onSuccess?: () => void
}) {
    const [error, setError] = useState('*Required')
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const password = React.useRef<string>()

    useEffect(() => {
        props.visible = (props.visible) ? props.visible : false
    }, [])

    function onTyped(text: string) {
        password.current = undefined

        if (text === '') {
            setButtonDisabled(true)
            setError("*Required")
            return
        }

        if (text.length < 8) {
            setButtonDisabled(true)
            setError("Minimum of 8 characters")
            return
        }

        password.current = text
        setError('')
        setButtonDisabled(false)

    }

    function confirmPass() {
        if (password.current && error === '')
            UserService.verifyPassword(
                Global.User.CurrentUser.id,
                password.current,
                (matched) => {
                    console.log('>>>>>>>>>>>>> matched: ', matched)
                    if (matched === true) {
                        props.onSuccess?.()
                        props.onCloseRequest?.()
                        setError('')
                    } else {
                        throw ''
                    }
                },
                (error) => {
                    console.log('>>>>>> error: ', error)
                    setError("Wrong  password, try again!")
                    password.current = undefined
                    setButtonDisabled(true)
                }
            )
    }

    return (
        <Modal
            visible={props.visible}
            transparent
            animationType='slide'
        >
            <View style={[flex_1, Style.backgroundColor('#fffcf255'), align_items_center, justify_center]}>
                <Shadow>
                    <View style={[bg_white, p_25, Style.borderRadius(10)]}>
                        <Text style={[Style.fontSize(16), fw_600, { textAlign: 'center' }]}>Enter your password to continue!</Text>
                        <TextInput
                            style={[border_radius_pill, Style.backgroundColor('#dee2e6d5'), px_25, mt_20, Style.fontSize(15), Style.width(250)]}
                            placeholder='Password'
                            secureTextEntry
                            onChangeText={onTyped}
                        />
                        <Text style={[Style.textColor('#da627d'), ml_10, mt_5]}>{error}</Text>
                        <Button
                            disabled={buttonDisabled}
                            title={"Continue"}
                            containerStyle={[mt_10]}
                            color={"#ccdbfd"}
                            buttonStyle={[Style.borderRadius(100), py_10]}
                            titleStyle={[Style.textColor('#0081a7')]}
                            onPress={confirmPass}
                        />
                    </View>
                </Shadow>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

});