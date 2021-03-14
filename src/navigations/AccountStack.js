
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Account from '../pages/Account/Account';
import Login from '../pages/Account/Login';
import Register from '../pages/Account/Register';

const Stack = createStackNavigator();

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="account" component={Account}
                options={{ title: "Mi Cuenta" }} />
            <Stack.Screen name="login" component={Login} 
                options={{ title: "Iniciar Sesión" }} />
            <Stack.Screen name="register" component={Register} 
                options={{ title: "Registro" }} />
        </Stack.Navigator>
    );
}