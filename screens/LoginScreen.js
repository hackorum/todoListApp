import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import { Input, Button } from "react-native-elements";
import firebase from "firebase";
import VerificationModal from "../components/VerificationModal";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      modalVisible: false,
    };
    this.passInput = null;
  }
  login = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        if (firebase.auth().currentUser.emailVerified) {
          this.props.navigation.navigate("HomeScreen");
        } else {
          this.setState({
            modalVisible: true,
          });
        }
      })
      .catch(function (error) {
        Alert.alert("Error: " + error.message);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.modalVisible}
          animationType="slide"
          onRequestClose={() => {
            return null;
          }}
        >
          <VerificationModal
            close={() => {
              this.setState({ modalVisible: false });
            }}
          />
        </Modal>
        <Image source={require("../assets/login.gif")} style={styles.gif} />
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
          onChangeText={(text) => this.setState({ password: text })}
        />
        <Button
          type="clear"
          title="Forgot Password?"
          onPress={() => this.props.navigation.navigate("ForgotPasswordScreen")}
        />
        <View style={{ marginTop: 20 }} />
        <Button
          title="Login"
          onPress={() => {
            this.login(this.state.email, this.state.password);
          }}
        />
        <View style={{ marginTop: 80 }} />
        <Button
          type="clear"
          title="Dont Have An Account? Sign Up"
          onPress={() => {
            this.props.navigation.navigate("SignupScreen");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").height / 5,
    marginBottom: 10,
    bottom: 40,
  },
});
