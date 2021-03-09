import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";

export default class VerificationModal extends Component {
  render() {
    return (
      <>
        <SafeAreaView
          style={{
            paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
          }}
        />
        <TouchableOpacity onPress={() => this.props.close()}>
          <MaterialIcons style={{ left: 20 }} name="close" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Verify Your Email Address</Text>
        <View style={styles.container}>
          <Text style={{ fontSize: 19, marginTop: 70 }}>
            This email address has not been verified yet!
          </Text>
          <Button
            title="Verify My Email Address"
            style={{ marginTop: 50 }}
            onPress={() => {
              firebase
                .auth()
                .currentUser.sendEmailVerification()
                .then(() => {
                  Alert.alert(
                    "A verification email has been sent to the provided email address",
                    "Click on the link in the email to verify this email id",
                    [
                      {
                        text: "OK",
                        onPress: () => this.props.close(),
                      },
                    ]
                  );
                })
                .catch(function (error) {
                  Alert.alert("Error: " + error.message);
                });
            }}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 27,
    alignSelf: "center",
    fontWeight: "500",
    marginTop: 60,
  },
});
