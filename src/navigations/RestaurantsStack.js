
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Restaurants from '../pages/Restaurants/Restaurants';
import AddRestaurant from '../pages/Restaurants/AddRestaurant';

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="restaurants" component={Restaurants}
                options={{ title: "Restaurantes" }} />

            <Stack.Screen name="add-restaurant" component={AddRestaurant}
                options={{ title: "Nuevo Restaurante" }} />

        </Stack.Navigator>
    );
}