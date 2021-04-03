
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';

import Loading from '../../components/Loading';
import UserInfo from '../../components/Account/UserInfo';
import AccountOptions from '../../components/Account/AccountOptions';

import firebase from 'firebase/app';

export default function UserLogged() {

    const toastRef = useRef();

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [realoadUserInfo, setReloadUserInfo] = useState(false);

    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
        setReloadUserInfo(false);
    }, [realoadUserInfo])

    return (
        <View style={styles.viewUserInfo}>
            {userInfo && <UserInfo
                userInfo={userInfo}
                toastRef={toastRef}
                setLoading={setLoading}
                setLoadingText={setLoadingText} />}

            {userInfo && <AccountOptions
                userInfo={userInfo}
                toastRef={toastRef}
                setReloadUserInfo={setReloadUserInfo} />}

            <Button
                title="Cerrar sessión"
                titleStyle={styles.btnCloseSessionText}
                buttonStyle={styles.btnCloseSession}
                onPress={() => firebase.auth().signOut()} />

            <Loading isVisible={loading} text={loadingText} />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: "#00e680"
    }
});
