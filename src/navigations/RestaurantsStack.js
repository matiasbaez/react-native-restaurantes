
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AddRestaurantReview from '../components/Restaurant/AddRestaurantReview';
import AddRestaurant from '../pages/Restaurants/AddRestaurant';
import Restaurants from '../pages/Restaurants/Restaurants';
import Restaurant from '../pages/Restaurants/Restaurant';

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="restaurants" component={Restaurants}
                options={{ title: "Restaurantes" }} />

            <Stack.Screen name="add-restaurant" component={AddRestaurant}
                options={{ title: "Nuevo Restaurante" }} />

            <Stack.Screen name="restaurant" component={Restaurant} />

            <Stack.Screen name="add-restaurant-review" component={AddRestaurantReview}
                options={{ title: "Nuevo comentario" }} />

        </Stack.Navigator>
    );
}