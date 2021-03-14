
import React, { useRef } from 'react';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Divider } from 'react-native-elements';
import Toast from 'react-native-easy-toast';

import LoginForm from '../../components/Account/LoginForm';

export default function Login() {
    const toastRef = useRef();

    return (
        <KeyboardAwareScrollView>
            <ScrollView>
                <Image 
                    source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                    resizeMode="contain" 
                    style={styles.logo}/>
                <View style={styles.viewContainer}>
                    <LoginForm toastRef={toastRef} />
                    <CreateAccount />
                </View>
                <Divider style={styles.divider} />
                <Toast ref={toastRef} position="center" opacity={0.9} />
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

function CreateAccount(props) {

    const navigation = useNavigation();

    return (
        <Text style={styles.registerText}>
            ¿No tienes una cuenta?
            <Text style={styles.btnRegister}
                onPress={() => navigation.navigate("register")}> Registrate</Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    registerText: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold"
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40
    }
});
