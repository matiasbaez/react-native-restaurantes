
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/app';

export default function UserInfo(props) {

    const {
        userInfo: { uid, displayName, email, photoURL },
        setLoadingText,
        setLoading,
        toastRef
    } = props;

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA);
        const resultCameraPermission = resultPermission.permissions.camera.status;

        if (resultCameraPermission == "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galeria");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (result.cancelled) {
                toastRef.current.show('No se ha seleccionado ninguna imagen');
            } else {
                uploadImage(result.uri)
                .then(() => {
                    updatePhotoUrl();
                    toastRef.current.show('Imagen subida correctamente');
                })
                .catch(() => {
                    setLoading(false);
                    toastRef.current.show('Error al actualizar la imagen');
                });
            }
        }
    }

    const uploadImage = async (uri) => {
        setLoadingText("Actualizando imagen");
        setLoading(true);

        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = await firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    const updatePhotoUrl = () => {
        firebase.storage().ref(`avatar/${uid}`).getDownloadURL()
        .then(async (response) => {
            const update = {
                photoURL: response
            };

            await firebase.auth().currentUser.updateProfile(update);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            toastRef.current.show('Error al actualizar la imagen');
        });
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                containerStyle={styles.userInfoAvatar}
                source={photoURL ? {uri: photoURL} : require("../../../assets/img/default-avatar.jpg")} >
                    <Avatar.Accessory size={22} onPress={changeAvatar} />
                </Avatar>
            <View>
                <Text style={styles.displayName}>{displayName ? displayName : 'Anónimo'}</Text>
                <Text style={styles.email}>{email ? email : 'Social login' }</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
});
