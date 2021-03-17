import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
import firebase from 'firebase'
import db from '../config';
import { MaterialIcons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from 'react-native-elements'

export default class AddTodoScreen extends Component {
  state = {
    title: "",
    pickerVisible: false,
    picker2Visible: false,
    dueDate: null,
    dueTime: null
  }
  togglePicker2 = () => {
    this.setState({
      picker2Visible: !this.state.picker2Visible
    })
  }
  togglePicker = () => {
    this.setState({
      pickerVisible: !this.state.pickerVisible
    })
  }
  addTodo = () => {
    if (this.state.title) {
      db.collection("todos")
        .add({
          title: this.state.title,
          uid: firebase.auth().currentUser.uid,
          dueDate: this.state.dueDate,
          dueTime: this.state.dueTime,
          timePassed: false
        })
        .then(() => {
          this.props.navigation.goBack();
        });
    } else {
      Alert.alert("Please Enter A Valid Todo");
    }
  }
  handleConfirm = (date) => {
    let dueDate = date.toString();
    let newDate = dueDate.slice(0, 16)
    this.setState({
      dueDate: newDate
    })
    this.togglePicker();
  };
  handleConfirm2 = (time) => {
    let dueTime = time.toString();
    let newTime = dueTime.slice(16, 21)
    this.setState({
      dueTime: newTime
    })
    this.togglePicker2();
  };
  render() {
    return (
      <View style={styles.container}>
        <DateTimePickerModal
          isVisible={this.state.picker2Visible}
          mode="time"
          onConfirm={this.handleConfirm2}
          onCancel={this.togglePicker2}
        />
        <DateTimePickerModal
          isVisible={this.state.pickerVisible}
          mode="date"
          onConfirm={this.handleConfirm}
          onCancel={this.togglePicker}
        />
        <TouchableOpacity style={{bottom: 50}} onPress={() => this.props.navigation.goBack()}>
          <View style={{ marginTop: 10 }} />
          <MaterialIcons name="close" size={30} />
        </TouchableOpacity>
        <Input
          style={styles.form}
          leftIcon={{
            type: "font-awesome",
            name: "chevron-right",
            size: 25,
            marginRight: 10,
          }}
          containerStyle={{width: '75%'}}
          maxLength={26}
          placeholder="Enter a todo"
          onChangeText={(text) => this.setState({ title: text })}
          value={this.state.title}
        />
        <TouchableOpacity onPress={() => this.togglePicker()} style={{width: '75%', height: 70, top: 30, zIndex: 10}} />
          <Input
            style={styles.form}
            leftIcon={{
              type: "font-awesome",
              name: "calendar",
              size: 25,
              marginRight: 10,
            }}
            containerStyle={{width: '75%', bottom: 50}}
            maxLength={26}
            placeholder="Enter the due date"
            value={this.state.dueDate}
            editable={false}
          />
        <TouchableOpacity onPress={() => this.togglePicker2()} style={{width: '75%', height: 70, zIndex: 10}} />
          <Input
            style={styles.form}
            leftIcon={{
              type: "materialicons",
              name: "access-time",
              size: 25,
              marginRight: 10,
            }}
            containerStyle={{width: '75%', bottom: 90}}
            maxLength={26}
            placeholder="Enter the due time"
            value={this.state.dueTime}
            editable={false}
          />
        <TouchableOpacity onPress={this.addTodo} style={styles.submitButton}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginHorizontal: 10,
    marginVertical: 10,
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
})

