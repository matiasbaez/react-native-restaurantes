
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import { map, size, filter } from 'lodash';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';

import MapView from 'react-native-maps';
import Modal from '../Modal';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import "firebase/storage";
import "firebase/firestore";
import uuid from 'random-uuid-v4';

const widthScreen = Dimensions.get('window').width;
const db = firebase.firestore(firebaseApp);

export default function AddRestaurantForm(props) {

    const { toastRef, setIsLoading, navigation } = props;
    const [formData, setFormData] = useState(defaultData())
    const [selectedImages, setSelectedImages] = useState([]);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [restaurantLocation, setRestaurantLocation] = useState(null);

    const addRestaurant = async () => {
        if (!formData.name || !formData.address || !formData.description) {
            toastRef.current.show('Todos los campos del formulario son obligatorios');
        } else if (size(selectedImages) == 0) {
            toastRef.current.show('El restaurante debe tener al menos una imagen');
        } else if (!restaurantLocation) {
            toastRef.current.show('Debe seleccionar la ubicación del restaurante');
        } else {
            setIsLoading(true);
            const images = await uploadImagesToStorage();
            db.collection('restaurants')
            .add({
                name: formData.name,
                address: formData.address,
                description: formData.description,
                location: restaurantLocation,
                images,
                rating: 0,
                ratingTotal: 0,
                quantityVoting: 0,
                createAt: new Date(),
                createBy: firebase.auth().currentUser.uid
            })
            .then(() => {
                setIsLoading(false);
                toastRef.current.show('Restaurante registrado correctamente');
                navigation.navigate('restaurants')
            })
            .catch(() => {
                toastRef.current.show('Error al registrar el restaurante, por favor intentelo más tarde');
                setIsLoading(false);
            });
        }
    }

    const uploadImagesToStorage = async () => {
        const imageBlob = [];

        await Promise.all(
            map(selectedImages, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref('restaurants').child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`restaurants/${result.metadata.name}`)
                        .getDownloadURL()
                        .then(photoUrl => imageBlob.push(photoUrl))
                })
            })
        );

        return imageBlob;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <RestaurantImage image={selectedImages[0]} />

            <FormAdd
                formData={formData}
                setFormData={setFormData}
                setIsMapVisible={setIsMapVisible}
                restaurantLocation={restaurantLocation} />

            <UploadImage
                toastRef={toastRef}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages} />

            <Button
                buttonStyle={styles.btnAddRestaurant}
                title="Crear restaurante"
                onPress={addRestaurant} />

            <Map
                toastRef={toastRef}
                isMapVisible={isMapVisible}
                setIsMapVisible={setIsMapVisible}
                setRestaurantLocation={setRestaurantLocation} />
        </ScrollView>
    );
}

function FormAdd(props) {
    const { formData, restaurantLocation, setFormData, setIsMapVisible } = props;

    const updateForm = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={e => updateForm(e, 'name')} />

            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={e => updateForm(e, 'address')}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: restaurantLocation ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsMapVisible(true)
                }} />

            <Input
                multiline={true}
                placeholder="Descripción del restaurante"
                inputContainerStyle={styles.textArea}
                onChange={e => updateForm(e, 'description')} />
        </View>
    );
}

function RestaurantImage(props) {
    const { image } = props;

    return (
        <View style={styles.viewRestaurantImage}>
            <Image
                source={ image ? {uri: image} : require("../../../assets/img/no-image.png") }
                style={{width: widthScreen, height: 200}} />
        </View>
    )
}

function UploadImage(props) {

    const { toastRef, selectedImages, setSelectedImages } = props;

    const selectImage = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA);
        if (resultPermissions === 'denied') {
            toastRef.current.show('Es necesario aceptar los permisos de la galeria para seleccionar las imágenes', 3000)
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if (result.cancelled) {
                toastRef.current.show('No se ha seleccionado ninguna imagen', 2000);
            } else {
                setSelectedImages([...selectedImages, result.uri])
            }
        }
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        const results = filter(selectedImages, (imageUrl) => imageUrl !== image);
                        setSelectedImages(results);
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <View style={styles.viewImages}>
            {size(selectedImages) < 5 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={selectImage} />
            )}

            { map(selectedImages, (image, index) => (
                <Avatar
                    key={index}
                    style={styles.previewImage}
                    source={{uri: image}}
                    onPress={() => removeImage(image)} />
            )) }
        </View>
    );
}

function Map(props) {
    const { toastRef, isMapVisible, setIsMapVisible, setRestaurantLocation } = props;
    const [location, setLocation] = useState(null);

    const confirmLocation = () => {
        setRestaurantLocation(location);
        toastRef.current.show('Localización guardada correctamente');
        setIsMapVisible(false);
    } 

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
            const statusPermissions = resultPermissions.permissions.location.status;

            if (statusPermissions !== 'granted') {
                toastRef.current.show('Debe aceptar los permisos de localización', 3000)
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                });
            }
        })();
    }, [])

    return (
        <Modal isVisible={isMapVisible} setIsVisible={setIsMapVisible} >
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}>

                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            draggable>
                        </MapView.Marker>

                    </MapView>
                )}

                <View style={styles.btnViewMap}>
                    <Button
                        title="Guardar"
                        containerStyle={styles.btnViewMapContainerSave}
                        buttonStyle={styles.btnViewMapSave}
                        onPress={confirmLocation} />
 
                    <Button
                        title="Cancelar"
                        containerStyle={styles.btnViewMapContainerCancel}
                        buttonStyle={styles.btnViewMapCancel}
                        onPress={() => setIsMapVisible(false)} />
                </View>
            </View>
        </Modal>
    )
}

function defaultData() {
    return {
        name: "",
        address: "",
        description: ""
    }
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewRestaurantImage: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    previewImage: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    mapStyle: {
        width: "100%",
        height: "550px"
    },
    btnViewMap: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    btnViewMapContainerCancel: {
        paddingLeft: 5
    },
    btnViewMapCancel: {
        backgroundColor: "#a60d0d"
    },
    btnViewMapContainerSave: {
        paddingRight: 5
    },
    btnViewMapSave: {
        backgroundColor: "#00a680"
    },
});
