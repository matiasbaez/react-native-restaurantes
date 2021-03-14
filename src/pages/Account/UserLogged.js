
import React from 'react';
import { View, Text, Button } from 'react-native';

import * as firebase from 'firebase';

export default function UserLogged() {
    return (
        <View>
            <Text>Logueado</Text>
            <Button title="Cerrar sessión"
                onPress={() => firebase.auth().signOut()} />
        </View>
    );
}