import React from 'react';
import { View, Text, Button, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import {db,auth} from '../config/firebase';
import {collection} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo';

export default class Chat extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
                image: null,
                location: null,
            },
            isConnected: false

        };


        //Config parameters for the database
       /* const firebaseConfig = {
            apiKey: "AIzaSyCWbJ4FUbljnu9BSekgF7v5S4tt39rrml4",
            authDomain: "chatapp-96fe4.firebaseapp.com",
            projectId: "chatapp-96fe4",
            storageBucket: "chatapp-96fe4.appspot.com",
            messagingSenderId: "460847624665",
            appId: "1:460847624665:web:214f252bd4f88527eea9c8",
            measurementId: "G-HDQ8KG7R0H"
        };

        //initialize 
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }*/

        //references the messages collection in the database
        this.referenceChatMessages = collection(db,"messages");
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // goes through each document
        querySnapshot.forEach((doc) => {
            // gets the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                createdAt: data.createdAt.toDate(),
                text: data.text,
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                },
                image: data.image || null,
                location: data.location || null
            });
        });
        this.setState({
            messages: messages
        });

    };

    //adding messages to the database
    addMessage() {
        const message = this.state.messages[0];

        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null,
        });
    }

    //Delete messages form AsynStorage
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    //Save messages into AsychStorage
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    //when a message is sent, calls saveMessage
    onSend(messages = []) {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
            this.saveMessages();//<-----------new for asynch, should it go here?
        });
    }


    componentDidMount() {

        //when component mounts, display user name in the title
        const name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        //take snapshot of messages collection in the Firestone Database
        this.referenceChatMessages = collection(db,'messages');
        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)

        //Check if user is connected
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log('online');
            } else {
                console.log('offline');
            }


            //User Authentication on Firebase
            this.authUnsubscribe = auth.onAuthStateChanged(async (user) => {
                if (!user) {
                    await auth.signInAnonymously();
                }
                this.setState({
                    uid: user.uid,
                    messages: [],
                    user: {
                        _id: user.uid,
                        name: name,
                        avatar: "https://placeimg.com/140/140/any",
                    },
                });
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);
            });
        });
    }

    //Get Messages from AsyncStorage if user is offline
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    componentWillUnmount() {
        // close connections when app is closed
        this.unsubscribe();
        this.authUnsubscribe();
    }


    // When user is offline disable sending new messages 
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    // Change the color of the user/right bubble 
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'blue'
                    },
                    left: {
                        backgroundColor: 'white'
                    }
                }}
            />
        )
    }

    render() {
        let bgColor = this.props.route.params.bgColor;
        return (
            <View style={{ flex: 1, backgroundColor: bgColor }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderUsernameOnMessage={true}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id,
                        name: this.state.name,
                        avatar: this.state.user.avatar
                    }}
                />
                <Button
                    title="Go to Start"
                    onPress={() => this.props.navigation.navigate("Start")}
                />

                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        );
    }
}