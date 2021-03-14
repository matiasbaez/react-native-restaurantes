
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { map } from 'lodash';

import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeEmailForm from './ChangeEmailForm';
import Modal from '../Modal';

export default function AccountOptions(props) {

    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [showModal, setShowModal] = useState(true);
    const [renderComponent, setRenderComponent] = useState(null);
    
    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo} />
                );
                break;

            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo} />
                );
                break;

            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                        setShowModal={setShowModal}
                        toastRef={toastRef} />
                );
                break;
        
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }

        if (renderComponent) setShowModal(true);
    }

    const menuOptions = generateOptions(selectedComponent);

    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem
                    key={index}
                    containerStyle={styles.menuItem}
                    onPress={menu.onPress} >
                    <Icon
                        type={menu.iconType}
                        name={menu.iconNameLeft}
                        color={menu.iconColorLeft} />
                    <ListItem.Content>
                        <ListItem.Title>{menu.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron
                        color={menu.iconColorRight} />
                </ListItem>
            ))}

            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}
                    children={renderComponent } />
            )}
        </View>
    );
}

function generateOptions(selectedComponent) {
    return [
        {
            title: "Cambiar nombre y apellido",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent('displayName')
        },
        {
            title: "Cambiar email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent('email')
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent('password')
        }
    ];
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3"
    }
});
