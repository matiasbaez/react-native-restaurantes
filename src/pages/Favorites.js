
import React, { useState, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Image, Icon, Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';

import Loading from '../components/Loading';

import { firebaseApp } from '../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {

    const { navigation } = props;

    const [restaurants, setRestaurants] = useState(null);
    const [userLogged, setUserLogged] = useState(false);
    const [refreshList, setRefreshList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toastRef = useRef();

    firebase.auth().onAuthStateChanged(user => setUserLogged(!!user));

    useFocusEffect(
        useCallback(() => {
            if (userLogged) {
                const userId = firebase.auth().currentUser.uid;
                db.collection('favorites')
                .where('user', '==', userId)
                .get()
                .then(response => {
                    const restaurantIds = [];
                    response.forEach(doc => {
                        restaurantIds.push(doc.data().restaurant);
                    });

                    getRestaurants(restaurantIds)
                    .then(response => {
                        const restaurants = [];
                        response.forEach(doc => {
                            const restaurant = doc.data();
                            restaurant.id = doc.id;
                            restaurants.push(restaurant);
                        });

                        setRestaurants(restaurants);
                    });
                });
            }
        }, [userLogged, refreshList])
    )

    const getRestaurants = (restaurantIds) => {
        const restaurants = [];
        restaurantIds.forEach(restaurantId => {
            const result = db.collection('restaurants').doc(restaurantId).get();
            restaurants.push(result);
        });

        return Promise.all(restaurants);
    }

    if (!userLogged) {
        return <UserNotLogged navigation={navigation} />
    }

    if (restaurants?.length === 0) {
        return <NotFoundRestaurants />
    }

    return (
        <View style={styles.viewBody}>
            { restaurants ? (
                <FlatList
                    data={restaurants}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(restaurant) => <Restaurant
                        toastRef={toastRef}
                        navigation={navigation}
                        restaurant={restaurant}
                        setIsLoading={setIsLoading}
                        setRefreshList={setRefreshList} />} />
            ) : (
                <View style={styles.restaurantsLoader}>
                    <ActivityIndicator size="large" />
                    <Text style={{ textAlign: "center" }}>Cargando restaurantes</Text>
                </View>
            ) }

            <Loading isVisible={isLoading} text="Eliminando restaurante" />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
}

function NotFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                No tienes restaurantes en tu lista
            </Text>
        </View>
    );
}

function UserNotLogged(props) {
    const { navigation } = props;

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{ fontSize: 20, fontWeight: "center", textAlign: "center" }}>
                Debes iniciar sesión para ver está sección
            </Text>
            <Button
                title="Iniciar sesión"
                containerStyle={{ marginTop: 20 }}
                buttonStyle={{ color: "#00a680" }}
                onPress={() => navigation.navigate("account", {screen: "login"}) } />
        </View>
    )
}

function Restaurant(props) {
    const { navigation, restaurant, setIsLoading, toastRef, setRefreshList } = props;
    const { id, name, images } = restaurant.item;

    const confirmToRemoveFavorite = () => {
        Alert.alert(
            'Eliminar restaurante de favoritos',
            '¿Estas seguro de realizar está acción?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: removeFavorite
                }
            ],
            { cancelable: false }
        )
    }

    const removeFavorite = () => {
        setIsLoading(true);

        db.collection('favorites')
        .where('restaurant', '==', id)
        .where('user', '==', firebase.auth().currentUser.uid)
        .get()
        .then(response => {
            response.forEach(doc => {
                const favoriteId = doc.id;
                db.collection('favorites')
                .doc(favoriteId)
                .delete()
                .then(() => {
                    setIsLoading(false);
                    setRefreshList(true);
                    toastRef.current.show('Restaurante eliminado correctamente');
                })
                .catch(() => {
                    setIsLoading(false);
                    toastRef.current.show('No se pudo eliminar de favoritos');
                });
            })
        })
    }

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity
                onPress={() => navigation.navigate('restaurants', {screen: 'restaurant', params: { id }}) }>
                    <Image
                        resizeMode="cover"
                        style={styles.image}
                        PlaceholderContent={<ActivityIndicator color="#fff" />}
                        source={images[0] ? {uri: images[0]} : require('../../assets/img/no-image.png')} />

                    <View style={styles.info}>
                        <Text style={styles.name}>{name}</Text>
                        <Icon
                            type="material-community"
                            name="heart"
                            color="#f00"
                            containerStyle={styles.favorite}
                            onPress={confirmToRemoveFavorite} />
                    </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    restaurantsLoader: {
        marginTop: 10,
        marginBottom: 10
    },
    restaurant: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff"
    },
    name: {
        fontWeight: "bold",
        fontSize: 30
    },
    favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100
    }
});
