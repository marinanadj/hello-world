import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';

import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat"

import { auth, db } from '../config/firebase';

export default function Chat(props) {
    // Retrieving the name and color properties passed from the Start Screen
    let { name, color } = props.route.params;

    // State to hold messages
    const [state, setState] = useState({
        messages: [],
        uid: 0,
        user: {
            _id: "",
            name: "",
            avatar: "",
            image: null,
            location: null,
        },
        isConnected: false,
    });

    // Create reference to the messages collection on firestore
    let messagesRef = null;

    useEffect(async () => {
        // Set the screen title to the user name entered in the start screen
        props.navigation.setOptions({ title: name });

        // Create a query to the messages collection, retrieving all messages sorted by their date of creation
        // const messagesQuery = messagesRef.orderBy("createdAt", "desc")

        let unsubscribe;
        messagesRef = db.collection("messages");
        const authUnsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                auth.signInAnonymously();
            }

            setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any",
                },
            });

            // onSnapshot returns an unsubscriber, listening for updates to the messages collection
            unsubscribe = messagesRef.orderBy("createdAt", "desc").onSnapshot(onCollectionUpdate);
        })
        // unsubsribe snapshot listener on unmount
        return () => unsubscribe(), authUnsubscribe();
    }, []);

    // Add the last message of the messages state to the Firestore messages collection
    const addMessage = (message) => {
        messagesRef.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user
        });
    }

    // Create custom onSend function, appending the newly created message to the messages state, 
    // then calling addMessage to add to Firestore
    const onSend = useCallback((messages = []) => {
        setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            addMessage();
        });
    }, [])

    // Reading snapshot data of messages collection, adding messages to messages state
    const onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
                image: data.image || null,
                location: data.location || null,
            });
        });

        setState({
            messages: messages,
        });
    }

    // Customize the color of the sender bubble
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }


    return (
        // Setting the background color to the color picked by the user in the start screen
        <View
            style={[{ backgroundColor: color }, styles.container]}
        >
            <GiftedChat
                renderBubble={renderBubble.bind()}
                messages={state.messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(messages)}
                // Add user data to message, using name provided in start screen and uid from auth object
                user={{
                    _id: auth?.currentUser?.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any'
                }}
            />

            {/* Avoid keyboard to overlap text messages on older Andriod versions */}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})