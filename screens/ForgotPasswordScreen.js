import React, { Component } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Header, Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }
  render() {
    return (
      <>
        <Header
          placement="left"
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => {
              this.props.navigation.goBack();
            },
          }}
          centerComponent={{
            text: "Reset Password",
            style: { color: "#fff", fontSize: 25, bottom: 4 },
          }}
        />
        <View style={styles.container}>
          <MaterialIcons name="lock" size={130} style={{ bottom: 90 }} />
          <Input
            containerStyle={{ width: "75%" }}
            placeholder="Email"
            leftIcon={{
              type: "font-awesome",
              name: "envelope",
              size: 25,
              marginRight: 10,
            }}
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
            returnKeyType="next"
          />
          <Button
            onPress={() => {
              firebase
                .auth()
                .sendPasswordResetEmail(this.state.email)
                .then(() => {
                  Alert.alert(
                    "A Password Reset Email Has Been Sent To The Provided Email Address"
                  );
                })
                .catch(function (error) {
                  Alert.alert("Error: " + error.message);
                });
            }}
            title="Continue"
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
