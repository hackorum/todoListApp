import React, { Component } from "react";
import { StyleSheet, View, Image, Alert } from "react-native";
import { Header, Input, Button } from "react-native-elements";
import firebase from "firebase";

export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      clicked: false,
    };
    this.passInput = null;
    this.confirmPassInput = null;
  }
  signup = (email, password, confirmPassword) => {
    if (password != confirmPassword) {
      return Alert.alert("Passwords Do Not Match");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
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
                    onPress: () => {
                      this.setState({
                        clicked: true,
                      });
                    },
                  },
                ]
              );
            });
        })
        .catch(function (error) {
          Alert.alert("Error: " + error.message);
        });
    }
  };
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
            text: "Sign Up",
            style: { color: "#fff", fontSize: 25, bottom: 4 },
          }}
        />
        <Image source={require("../assets/signup.png")} style={styles.image} />
        {!this.state.clicked ? (
          <View style={styles.container}>
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
              onSubmitEditing={() => this.passInput.focus()}
              returnKeyType="next"
            />
            <Input
              ref={(ref) => (this.passInput = ref)}
              containerStyle={{ width: "75%" }}
              placeholder="Password"
              leftIcon={{
                type: "font-awesome",
                name: "lock",
                size: 35,
                marginRight: 10,
              }}
              secureTextEntry
              onSubmitEditing={() => this.confirmPassInput.focus()}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <Input
              ref={(ref) => (this.confirmPassInput = ref)}
              containerStyle={{ width: "75%" }}
              placeholder="Confirm Password"
              leftIcon={{
                type: "font-awesome",
                name: "lock",
                size: 35,
                marginRight: 10,
              }}
              secureTextEntry
              onChangeText={(text) => this.setState({ confirmPassword: text })}
            />
            <View style={{ marginTop: 20 }} />
            <Button
              title="Sign Up"
              onPress={() => {
                this.signup(
                  this.state.email,
                  this.state.password,
                  this.state.confirmPassword
                );
              }}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <Button
              title="I Have Verified Myself"
              onPress={() => {
                firebase
                  .auth()
                  .currentUser.reload()
                  .then(() => {
                    if (firebase.auth().currentUser.emailVerified) {
                      this.props.navigation.navigate("HomeScreen");
                    } else {
                      Alert.alert(
                        "This email address has not been verified yet!"
                      );
                    }
                  });
              }}
            />
            <View style={{ marginTop: 50 }} />
            <Button
              title="Resend Email"
              onPress={() => {
                firebase
                  .auth()
                  .currentUser.sendEmailVerification()
                  .then(() => {
                    Alert.alert(
                      "A verification email has been sent to the provided email address",
                      "Click on the link in the email to verify this email id"
                    );
                  })
                  .catch(function (error) {
                    Alert.alert("Error: " + error.message);
                  });
              }}
            />
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 100,
  },
  image: {
    width: 130,
    height: 130,
    alignSelf: "center",
    top: 70,
  },
});
