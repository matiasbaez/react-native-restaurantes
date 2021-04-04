
import React, { useState, useRef, useEffect } from 'react';
import { View } from "react-native";
import Toast from 'react-native-easy-toast';

import ListTopRestaurants from '../components/Ranking/ListTopRestaurants';

import { firebaseApp } from '../utils/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {

    const { navigation } = props;
    const [restaurants, setRestaurants] = useState([]);

    const toastRef = useRef();

    useEffect(() => {
        db.collection('restaurants')
        .orderBy('rating', 'desc')
        .limit(5)
        .get()
        .then(response => {
            const restaurants = [];
            response.forEach(doc => {
                const restaurant = doc.data();
                restaurant.id = doc.id;
                restaurants.push(restaurant)
            });

            setRestaurants(restaurants);
        })
    }, [])

    return (
        <View>
            <ListTopRestaurants
                restaurants={restaurants}
                navigation={navigation} />

            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
}