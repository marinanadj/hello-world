import React, { Component } from "react";

//import relevant components from react native
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { View, Text, StyleSheet} from 'react-native';

import { signInAnonymously } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo';

import MapView from 'react-native-maps';

//import custom CustomActions
import CustomActions from './CustomActions';

//Firestore Database
const firebase = require('firebase');
require('firebase/firestore');

//// firebase adding credential in order to connect to firebase
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
        image: null,
        location: null,
      },
      isConnected: false,
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
    
    
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }
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
                
                // save messages when user online
                this.saveMessages();
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        
  });
    });
}

// // temporarly storage of messages (storage)
async getMessages() {
  let messages = '';
  try {
    messages = await AsyncStorage.getItem('messages') || [];
    this.setState({
      messages: JSON.parse(messages)
    });
  } catch (error) {
    
  }
};

// firebase storage
async saveMessages() {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
  } catch (error) {
    console.log(error.message);
  }
}

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

// stop listening to auth and collection changes
componentWillUnmount() {
  this.authUnsubscribe();
  
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
    image: message.image || null,
    location: message.location || null,
  });
}

onSend(messages = []) {
  this.setState((previousState) => ({
    messages: GiftedChat.append(previousState.messages, messages),
  }),() => {
    this.addMessages();
    this.saveMessages();
  });
}


onCollectionUpdate = (querySnapshot) => {
  const messages = [];
  // go through each document
  querySnapshot.forEach((doc) => {
    // get the QueryDocumentSnapshot's data
    var data = doc.data();
    messages.push({
      _id: data._id,
      text: data.text,
      createdAt: data.createdAt.toDate(),
      user: {
        _id: data.user._id,
        name: data.user.name,
        avatar: data.user.avatar
      },
      image: data.image || null,
      location: data.location || null,
    });
  });
  this.setState({
    messages: messages,
  });
};


// When user is offline disable sending new messages 
renderInputToolbar(props) {
  if (this.state.isConnected == false) {
  } else {
    return(
      <InputToolbar
      {...props}
      />
    );
  }
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

// creating the circle button
renderCustomActions = (props) => {
  return <CustomActions {...props} />;
};

 //Render the map location
renderCustomView (props) {
  const { currentMessage} = props;
  if (currentMessage.location) {
    return (
        <MapView
          style={{width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3}}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
    );
  }
  return null;
}

  render() {
    let { color, name } = this.props.route.params;
    return (

      //fullscreen component
      <View style={[{ backgroundColor: color }, styles.container]}>
      <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          //Render action is responsible for creating the circle button 
          renderActions={this.renderCustomActions}
          
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderCustomView={this.renderCustomView}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: name,
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