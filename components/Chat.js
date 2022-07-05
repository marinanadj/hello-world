import React, { Component } from "react";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { View, Text, StyleSheet} from 'react-native';

//Firestore Database
const firebase = require('firebase');
require('firebase/firestore');

// SDK from Firestore
const firebaseConfig = {
    apiKey: "AIzaSyDueaDz7lAjboRMCGm6GBXRBe-MRs5AD0Q",
    authDomain: "chatapp-7195d.firebaseapp.com",
    projectId: "chatapp-7195d",
    storageBucket: "chatapp-7195d.appspot.com",
    messagingSenderId: "35620742814",
};


class Chat extends Component {
  constructor(){
    super();
    this.state ={
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    }

    // initializes the Firestore app
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
    //Stores and retrieves the chat messages users send
    this.referenceChatMessages = firebase.firestore().collection("messages");

    this.referenceMessagesUser= null;
  }
  componentDidMount() {
    
    let { name} = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Reference to load messages via Firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // Authenticates user via Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
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
      this.referenceMessagesUser = firebase
                .firestore()
                .collection("messages")
                .where("uid", '==', this.state.uid);
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
  });
}

// stop listening to auth and collection changes
componentWillUnmount() {
  this.authUnsubscribe();
  this.unsubscribe();
}

 // Adds messages to cloud storage
 addMessages() {
  const message = this.state.messages[0];
  this.referenceChatMessages.add({
    uid: this.state.uid,
    _id: message._id,
    text: message.text || "",
    createdAt: message.createdAt,
    user: message.user,
  });
}

onSend(messages = []) {
  this.setState((previousState) => ({
    messages: GiftedChat.append(previousState.messages, messages),
  }),() => {
    this.addMessages();
  });
}

onCollectionUpdate = (querySnapshot) => {
  const messages = [];
  // go through each document
  querySnapshot.forEach((doc) => {
    // get the QueryDocumentSnapshot's data
    let data = doc.data();
    messages.push({
      _id: data._id,
      text: data.text,
      createdAt: data.createdAt.toDate(),
      user: data.user,
    });
  });
  this.setState({
    messages: messages
  });
}

// Customize the color of the sender bubble
renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#ADD8E6'
        }
      }}
    />
  )
}

  render() {
    let { color } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: color }, styles.container]}>
      <GiftedChat
      renderBubble={this.renderBubble.bind(this)}
      messages={this.state.messages}
      onSend={(messages) => this.onSend(messages)}
      user={{
        _id: this.state.user._id,
        name: this.state.name,
         avatar: this.state.user.avatar 

      }}
    />
     {/* Avoid keyboard to overlap text messages on older Andriod versions  */}
    {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Chat;