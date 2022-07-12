React Native Chat app
Description
The aim of this project is to build a chat app for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their location.

Built with
React Native
Expo
Google Firebase
Gifted Chat
User Stories
As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family.
As a user, I want to be able to send messages to my friends and family members to exchange the latest news.
As a user, I want to send images to my friends to show them what I’m currently doing.
As a user, I want to share my location with my friends to show them where I am.
As a user, I want to be able to read my messages offline so I can reread conversations at any time.
As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.
Key Features
A page where users can enter their name and choose a background color for the chat screen before joining the chat.
A page displaying the conversation, as well as an input field and submit button.
The chat must provide users with two additional communication features: sending images and location data.
Data gets stored online and offline.
What technology did I use and why?
I chose to create the mobile application using React Native due to the following considerations:

Develop and maintain the same codebase across different OS (iOS and Android)
Increased performance compared to Hybrid Apps as UI is rendered natively
Possibility to access device's APIs (camera, microphone, ...) (compared to PWA)
Use existing skills in JavaScript and React, no need to learn another programming language
Large and active community
Further, I'm using Android Studio as an Android emulator.

I use Expo as development environment to develop and test the app.

I use the React Navigation third party library to navigate between screens.

I use the React Native Gifted Chat library to create the UI of my chat app. The library has good GitHub statistics and is well documented. Further, it already provides predefined components for integral parts of the chat app:

Message bubbles
A message input field
A send button
Options for displaying user names and avatars
