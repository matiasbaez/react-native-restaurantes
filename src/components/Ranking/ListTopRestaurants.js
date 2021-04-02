import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Image, Icon, Rating } from 'react-native-elements';

export default function ListTopRestaurants(props) {

    const { navigation, restaurants } = props;

    const [state, setstate] = useState(initialState)

    return (
        <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={restaurants}
            renderItem={(restaurant) => <Restaurant
                navigation={navigation}
                restaurant={restaurant} />} />
    )
}

function Restaurant(props) {
    const { navigation, restaurant } = props;
    const { id, name, images, description, rating } = restaurant.item;
    const [iconColor, setIconColor] = useState('#000');

    useEffect(() => {
        switch (restaurant.index) {
            case 0:
                setIconColor('#efb819');
                break;
    
            case 1:
                setIconColor('#e3e4e5');
                break;
    
            case 2:
                setIconColor('#cd7f32');
                break;
        }
    }, [])


    return (
        <TouchableOpacity onPress={() => navigation.navigate('restaurants', {screen: 'restaurant', params: { id }})}>
            <Card containerStyle={styles.cardContainer}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.iconContainer} />

                <Image
                    style={styles.restaurantImage}
                    resizeMode="cover"
                    source={ images[0] ? {uri: images[0]} : require('../../../assets/img/no-image.png') } />

                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>

                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readonly />

                    <Text style={styles.description}>{description}</Text>
                </View>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 30,
        borderWidth: 0
    },
    iconContainer: {
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1
    },
    restaurantImage: {
        width: "100%",
        height: 200,
    },
    titleRating: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    }
});
