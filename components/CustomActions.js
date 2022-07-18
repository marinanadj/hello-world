import React from "react";
import PropTypes from "prop-types";
//imports for communicatios features (permission and device camera/image gallery)
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
//native component to allow text components to be clickable (and button)
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { storage } from "../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default class CustomActions extends React.Component {
  imagePicker = async () => {
    // expo permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      if (status === "granted") {
        // pick image
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
        // canceled process
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //location function
  getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) => console.log(error)
        );
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  uploadImageFetch = async (uri) => {
    //To create your own blob, you need to create a new XMLHttpRequest and set its responseType to 'blob'. Then, open the connection and retrieve the URI’s data (the image) via GET:
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      //on load
      xhr.onload = function () {
        resolve(xhr.response);
      };
      //on error
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      //on complete
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    // Create a child reference
    //images will be uploaded in the subfolder "images"
    const imagesRef = ref(storage, `images/${imageName}`);
    // imagesRef now points to 'images'
    //upload blob
    await uploadBytes(imagesRef, blob);
    console.log("blob uploaded");
    const downloadUrl = await getDownloadURL(imagesRef);
    console.log(
      "file available on firebase storage at the following link",
      downloadUrl
    );
    return downloadUrl;
  };

  onActionPress = () => {
    const options = [
      "Choose from library",
      "Take picture",
      "Send location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.imagePicker();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
        }
      }
    );
  };
  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

//proptype for customactions component
CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};