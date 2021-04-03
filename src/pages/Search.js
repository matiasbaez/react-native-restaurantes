
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from 'react-native-elements';

import firebase from 'firebase/app';
import { FireSQL } from 'firesql';

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })

export default function Search(props) {

    const { navigation } = props;

    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if (search) {
            fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '%${search}%'`)
            .then(response => {
                setRestaurants(response);
            });
        }
    }, [search])

    return (
        <View>
            <SearchBar
                placeholder="Buscar restaurante"
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar} />

            { restaurants.length === 0 ? (
                <NotFoundRestaurants />
            ) : (
                <FlatList
                    data={restaurants}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(restaurant) => <Restaurant navigation={navigation} restaurant={restaurant} />} />
            ) }
        </View>
    );
}

function NotFoundRestaurants() {
    return <View style={{ flex: 1, alignItems: "center" }}>
        <Image
            source={require('../../assets/img/no-result-found.png')}
            resizeMode="cover"
            style={{ width: 200, height: 200 }} />
    </View>
}

function Restaurant(props) {
    const { navigation, restaurant } = props;
    const { id, name, images } = restaurant.item;

    return (
        <ListItem
            title={name}
            leftAvatar={{
                source: images[0] ? {uri: images[0]} : require("../../assets/img/no-image.png")
            }}
            rightIcon={<Icon type="material-community" name="chrevron-right" />}
            onPress={() => navigation.navigate("restaurants", { screen: "restaurant", params: { id } })} />
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
    }
});
