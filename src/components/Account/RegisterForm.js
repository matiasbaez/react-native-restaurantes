
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Icon, Input, Button } from 'react-native-elements';

import { validateEmail } from '../../utils/Validations';
import Loading from '../Loading';

import { size, isEmpty } from 'lodash';
import * as firebase from 'firebase';

export default function RegisterForm(props) {

    const { toastRef } = props;
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormData());

    const onSubmit = () => {
        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.repeatPassword)
        ) {
            toastRef.current.show('Todos los campos son obligatorios');
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('El formato del email es incorrecto');
        } else if (formData.password !== formData.repeatPassword) {
            toastRef.current.show('Las contraseñas no coinciden');
        } else if (size(formData.password) < 6) {
            toastRef.current.show('La contraseña deben tener un minimo de 6 caracteres');
        } else {
            setLoading(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then(response => {
                setLoading(false);
                navigation.navigate('account');
            })
            .catch(err => {
                setLoading(false);
                toastRef.current.show("El usuario ya existe");
            });
        }
    }

    const onChange = (e, type) => {
        const value = e.nativeEvent.text;
        setFormData({ ...formData, [type]: value });
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight} />
                } />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showPassword}
                onChange={e => onChange(e, "password")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline" }
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword) } />
                } />
            <Input
                placeholder="Repetir Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={!showRepeatPassword}
                onChange={e => onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={ showRepeatPassword ? "eye-off-outline" : "eye-outline" }
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword) } />
                } />
            <Button
                title="Registrarse"
                containerStyle={styles.btnRegisterContainer}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit} />

            <Loading isVisible={loading} text="Creando cuenta..." />
        </View>
    );
}

function defaultFormData() {
    return {
        email: "",
        password: "",
        repeatPassword: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnRegisterContainer: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
});
