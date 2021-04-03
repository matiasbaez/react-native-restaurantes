
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';

import UserGuest from './UserGuest';
import UserLogged from './UserLogged';
import Loading from '../../components/Loading';

export default function Account() {

    const [login, setLogin] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            user ? setLogin(true) : setLogin(false);
        });
    }, [])

    if (login === null) return <Loading isVisible={login} text="Cargando..." />;

    return login ? <UserLogged /> : <UserGuest />;
}