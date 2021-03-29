import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar, Button, Rating } from 'react-native-elements';
import { map } from 'lodash';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp)

export default function ListReviews(props) {

    const { navigation, restaurantId } = props;
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([]);

    firebase.auth().onAuthStateChanged((user) => {
        setUserLogged(!!user);
    });

    useEffect(() => {
        db.collection('reviews')
        .where('restaurant', '==', restaurantId)
        .get()
        .then((response) => {
            const resultReviews = [];
            response.forEach(doc => {
                const review = doc.data();
                review.id = doc.id;
                resultReviews.push(review);
                setReviews(resultReviews);
            });
        })
    }, [input])

    return (
        <View>
            {userLogged ? (
                <Button
                    title="Esribir comentario"
                    buttonStyle={styles.btnReview}
                    titleStyle={styles.btnAddReviewTitle}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#00a680"
                    }}
                    onPress={() => navigation.navigate("add-restaurant-review",  { restaurantId })}></Button>
            ) : (
                <View>
                    <Text
                        style={{ textAlign: "center", color: "#00a680", padding: 20 }}
                        onPress={() => navigation.navigate("login")}>
                        Para escribir un comentario debes 
                        <Text style={{ fontWeight: "bold" }}>iniciar sesión</Text>
                    </Text>
                </View>
            )}

            {map(reviews, (review, index) => (
                <Review
                    key={index}
                    review={review} />
            ))}
        </View>
    )
}

function Review(props) {
    const { title, review, rating, createAt, userAvatar } = props.review;
    const createReview = new Date(createAt.seconds * 1000);

    return (
        <View style={styles.viewReview}>
            <View style={styles.viewAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.userAvatar}
                    source={ userAvatar ? { uri: userAvatar } : require('../../../assets/img/avatar-default.jpg') } />
            </View>

            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.review}>{review}</Text>

                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly />

                <Text style={styles.reviewDate}>
                    {createReview.getDate()}/{createReview.getMonth() + 1}/{createReview.getFullYear()} - 
                    {createReview.getHours()}:{createReview.getMinutes() < 10 ? '0' : '' }{createReview.getMinutes() }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnReview: {
        backgroundColor: "transparent",
    },
    btnAddReviewTitle: {
        color: "#00a680"
    },
    viewReview: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewAvatar: {
        marginRight: 15
    },
    userAvatar: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold",
    },
    review: {
        paddingTop: 2,
        color: "grey",
        marginBottom: 5
    },
    reviewDate: {
        marginTop: 5,
        color: "grey",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0
    }
});
