
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Rating, ListItem, Icon } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import { map } from 'lodash';

import ListReviews from '../../components/Restaurant/ListReviews';
import CarouselImages from '../../components/Carousel';
import Loading from '../../components/Loading';
import Map from '../../components/Map';

import { firebaseApp } from '../../utils/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);
const widthScreen = Dimensions.get('window').width;

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const toastRef = useRef()

    const [restaurant, setRestaurant] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [rating, setRating] = useState(0);

    firebase.auth().onAuthStateChanged((user) => setIsLogged(!!user));

    useFocusEffect(
        useCallback(() => {
            db.collection('restaurants')
            .doc(id)
            .get()
            .then((response) => {
                const data = response.data();
                data.id = response.id;
                setRestaurant(data);
                setRating(data.rating)
            })
        }, [])
    );

    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isLogged && restaurant) {
            db.collection('favorites')
            .where('restaurant', '==', restaurant.id)
            .where('user', '==', firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                setIsFavorite(!!response.docs.length);
            });
        }
    }, [isLogged, restaurant])

    const addFavorite = () => {
        if (!isLogged) {
            toastRef.current.show('Debes iniciar sesión para guardarlo en favoritos');
        } else {
            const data = {
                user: firebase.auth().currentUser.uid,
                restaurant: restaurant.id
            }

            db.collection('favorites')
            .add(data)
            .then(() => {
                setIsFavorite(true);
                toastRef.current.show('Añadido a favoritos correctamente');
            })
            .catch(() => {
                toastRef.current.show('Error al intentar añadir a favoritos');
            });
        }
    }

    const removeFavorite = () => {
        db.collection('favorites')
        .where('restaurant', '==', restaurant.id)
        .where('user', '==', firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
            response.forEach(doc => {
                const favoriteId = doc.id;
                db.collection('favorites')
                .doc(favoriteId)
                .delete()
                .then(() => {
                    setIsFavorite(false)
                    toastRef.current.show('Restaurante eliminado de la lista de favoritos');
                })
                .catch(() => {
                    toastRef.current.show('No se ha podido eliminar el restaurante de la lista de favoritos');
                })
            });

        })
    }

    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    size={15}
                    type="material-community"
                    name={ isFavorite ? "heart" : "heart-outline" }
                    color={ isFavorite ? "#f00" : "#000" }
                    underlayColor="trasparent"
                    onPress={isFavorite ? removeFavorite : addFavorite} />
            </View>

            <CarouselImages
                imagesArray={restaurant.images}
                height={250}
                width={widthScreen} />

            <RestaurantTitle
                name={restaurant.name}
                description={restaurant.description}
                rating={rating} />

            <RestaurantInfo
                name={restaurant.name}
                address={restaurant.address}
                location={restaurant.location} />

            <ListReviews
                navigation={navigation}
                restaurantId={restaurant.id}
                setRating={setRating} />

            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    )
}

function RestaurantTitle(props) {
    const { name, description, rating } = props;

    return (
        <View style={styles.restaurantViewTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.restaurantName}>{name}</Text>
                <Rating
                    style={styles.rating}
                    startingValue={parseFloat(rating)}
                    imageSize={20}
                    readonly />
            </View>
            <Text style={styles.restaurantDescription}>{description}</Text>
        </View>
    )
}

function RestaurantInfo(props) {
    const { name, address, location } = props;

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null
        },
        {
            text: "111 222 333",
            iconName: "phone",
            iconType: "material-community",
            action: null
        },
        {
            text: "email@restaurante.com",
            iconName: "at",
            iconType: "material-community",
            action: null
        }
    ]

    return (
        <View style={styles.restaurantViewInfo}>
            <Text style={styles.restaurantInfoTitle}></Text>
            <Map
                height={100}
                name={name}
                location={location} />

            { map(listInfo, (item, index) => (
                <ListItem key={index}>
                    <Icon type={item.iconType} name={item.iconName} color="#00a680" />
                    <ListItem.Content containerStyle={styles.listItemContainer}>
                        <ListItem.Title>{item.text}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            )) }
        </View>
    )
}


const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    restaurantViewTitle: {
        padding: 15
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: "bold"
    },
    restaurantDescription: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0,
    },
    restaurantViewInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    listItemContainer: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    }
})
