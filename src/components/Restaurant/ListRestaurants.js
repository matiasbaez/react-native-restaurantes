import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { size } from 'lodash';

export default function ListRestaurants(props) {
    const { restaurants, handleLoadMore, isLoading } = props;
    const navigation = useNavigation();

    return (
        <View>
            {size(restaurants) > 0 ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />} />
            ) : (
                <View style={styles.restaurantsLoader}>
                    <ActivityIndicator color="#00a680" size="large" />
                    <Text>Cargando restaurantes</Text>
                </View>
            )}
        </View>
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const {
        id,
        name,
        images,
        address,
        description
    } = restaurant.item;

    const mainPicture = images[0];

    const goToRestaurant = () => {
        navigation.navigate('restaurant', { id, name });
    }

    return (
        <TouchableOpacity
            onPress={goToRestaurant}>

            <View style={styles.restaurantView}>
                <View style={styles.restaurantViewImage}>
                    <Image
                        style={styles.restaurantImage}
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="fff" />}
                        source={mainPicture ? {uri: mainPicture} : require('../../../assets/img/no-image.png')} />
                </View>

                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

function FooterList(props) {
    const { isLoading } = props;
    if (isLoading) {
        return (
            <View style={styles.restaurantsLoader}>
                <ActivityIndicator size="large" />
            </View>
        );
    } else {
        return (
            <View style={styles.notFoundRestaurants}>
                <Text>No quedan restaurantes por cargar</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    restaurantsLoader: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    restaurantView: {
        flexDirection: "row",
        margin: 10
    },
    restaurantViewImage: {
        marginRight: 15
    },
    restaurantImage: {
        width: 80,
        height: 80
    },
    restaurantName: {
        fontWeight: "bold"
    },
    restaurantAddress: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300
    },
    notFoundRestaurants: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
    }
});
