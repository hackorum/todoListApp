import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth } from "firebase";
import db from "../config";
import { MaterialIcons } from "@expo/vector-icons";

export default class AddTodoForm extends Component {
  state = {
    title: "",
  };
  addTodo = () => {
    if (this.state.title) {
      db.collection("todos")
        .add({
          title: this.state.title,
          uid: auth().currentUser.uid,
        })
        .then(() => {
          this.props.close();
        });
    } else {
      Alert.alert("Please Enter A Valid Todo");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.close}>
          <View style={{ marginTop: 10 }} />
          <MaterialIcons name="close" size={30} />
        </TouchableOpacity>
        <TextInput
          style={styles.form}
          maxLength={26}
          placeholder="Enter a todo"
          onChangeText={(text) => this.setState({ title: text })}
          value={this.state.title}
        />
        <TouchableOpacity onPress={this.addTodo} style={styles.submitButton}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  close: {
    width: 20,
    height: 20,
    marginVertical: 15,
  },
  form: {
    borderWidth: 0.7,
    marginHorizontal: 10,
    paddingLeft: 7,
    borderRadius: 7,
    paddingVertical: 15,
    marginVertical: 10,
    width: "75%",
  },
  submitButton: {
    backgroundColor: "#2DA94F",
    padding: "3%",
    width: "75%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 50,
  },
});
