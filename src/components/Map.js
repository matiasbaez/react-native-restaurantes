import React from 'react';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';

export default function Map(props) {
    const { name, location, height } = props;

    const openMapApp = () => {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
            query: name
        });
    }

    return (
        <MapView
            style={{ height, width: "100%" }}
            initialRegion={location}
            onPress={openMapApp}>

            <MapView.Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }} />

        </MapView>
    )
}
