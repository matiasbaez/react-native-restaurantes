
import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Toast from 'react-native-easy-toast';

import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/Restaurant/AddRestaurantForm';

export default function AddRestaurant(props) {
    const { navigation } = props;

    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    return (
        <View>
            <AddRestaurantForm
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation} />

            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Creando restaurante" />
        </View>
    );
}

const styles = StyleSheet.create({
    viewForm: {
        marginRight: 10,
        marginLeft: 10
    },
});
