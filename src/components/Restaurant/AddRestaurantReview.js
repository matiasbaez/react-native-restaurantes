import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';

import Loading from '../../components/Loading';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function AddRestaurantReview(props) {

    const toastRef = useRef();

    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { navigation, route } = props;
    const { restaurantId } = route.params;
    
    const addReview = () => {
        if (!rating) {
            toastRef.current.show('Debes indicar una puntuación');
        } else if (!title) {
            toastRef.current.show('El titulo es obligatorio');
        } else if (!Review) {
            toastRef.current.show('La descripción es obligatorio');
        } else {
            setIsLoading(true);

            const user = firebase.auth().currentUser;
            const data = {
                user: user.id,
                userAvatar: user.photoURL,
                restaurant: restaurantId,
                review,
                rating,
                createAt: new Date()
            }

            db.collection('reviews')
            .add(data)
            .then(() => {
                updateRestaurant();
            })
            .catch((err) => {
                toastRef.current.show('Error al enviar el comentario');
                setIsLoading(false);
            })
        }
    }

    const updateRestaurant = () => {
        const restaurantRef = db.collection('restaurants').doc(restaurantId);

        restaurantRef
        .get()
        .then((response) => {
            const restaurant = response.data();
            const ratingTotal = restaurant.ratingTotal + rating;
            const quantityVoting = restaurant.quantityVoting + 1;
            const average = ratingTotal / quantityVoting;

            restaurantRef.update({
                rating: average,
                ratingTotal,
                quantityVoting
            })
            .then(() => {
                setIsLoading(false);
                navigation.goBack();
            });
        });
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={[
                        "Pésimo",
                        "Dificiente",
                        "Normal",
                        "Muy bueno",
                        "Excelente"
                    ]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value) => setRating(value)} />
            </View>
            <View style={styles.reviewForm}>
                <Input
                    placeholder="Titulo"
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)} />

                <Input
                    multiline={true}
                    placeholder="Comentario"
                    containerStyle={styles.textArea}
                    onChange={(e) => setReview(e.nativeEvent.text)} />

                <Button
                    title="Enviar comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview} />
            </View>

            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Enviando comentario" />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    reviewForm: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: 100,
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
});
