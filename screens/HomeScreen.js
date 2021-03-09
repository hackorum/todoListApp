import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AddTodoForm from "../components/AddTodoForm";
import db from "../config";
import firebase from "firebase";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      todos: [],
      modalVisible: false,
      uid: firebase.auth().currentUser.uid,
    };
    this.todosRef = null;
  }
  getTodos = () => {
    this.todosRef = db
      .collection("todos")
      .where("uid", "==", this.state.uid)
      .onSnapshot((snapshot) => {
        let todos = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          todos.push({ ...data, key: doc.id });
        });
        this.setState({ todos: todos });
      });
  };
  getTime = () => {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    let dayInWeek = weekday[date.getDay()];
    let dayInMonth = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullTime =
      hour +
      ":" +
      minute +
      " " +
      dayInWeek +
      ", " +
      dayInMonth +
      "-" +
      month +
      "-" +
      year;

    return fullTime;
  };
  getNumberOfTodosCompleted = () => {
    this.completedRef = db
      .collection("completedTodos")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        this.setState({ completed: snapshot.size });
      });
  };
  moveItemToCompleted = (title, key) => {
    if (this.state.todos.length === 1) {
      this.setState({ todos: [] });
    }
    db.collection("todos")
      .doc(key)
      .delete()
      .then(() => {
        db.collection("completedTodos").add({
          title: title,
          time: this.getTime(),
          uid: firebase.auth().currentUser.uid,
        });
      });
  };
  confirmDelete = (item) => {
    Alert.alert(
      "Delete Todo",
      "Are You Sure You Want To Delete " + item.title,
      [
        {
          text: "Cancel",
          onPress: () => null,
        },
        { text: "Yes", onPress: () => this.delete(item.key) },
      ],
      { cancelable: true }
    );
  };
  delete = (key) => {
    if (this.state.todos.length === 1) {
      this.setState({ todos: [] });
    }
    db.collection("todos").doc(key).delete();
  };
  renderItem = ({ item }) => {
    return (
      <View style={styles.todoContainer}>
        <Text>{item.title}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => this.moveItemToCompleted(item.title, item.key)}
          >
            <MaterialIcons name="check" size={30} color="#0F9D58" />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => this.confirmDelete(item)}>
            <MaterialIcons name="close" size={30} color="#DB4437" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  componentDidMount() {
    this.getTodos();
    this.getNumberOfTodosCompleted();
  }
  componentWillUnmount() {
    this.todosRef();
  }
  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <AddTodoForm close={() => this.setState({ modalVisible: false })} />
          </View>
        </Modal>
        <View style={styles.header}>
          <SafeAreaView style={styles.subTopContainer}>
            <Text style={styles.subHeading}> My Stats </Text>
            <View style={styles.stats}>
              <Text style={styles.statsText}>
                Pending: {this.state.todos.length}
              </Text>
              <Text style={styles.statsText}>
                Completed: {this.state.completed}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("CompletedScreen");
                }}
                style={styles.viewCompleted}
              >
                <Text style={{ color: "white" }}>View Completed</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <TouchableOpacity
            style={{ flexDirection: "row", top: 30, left: 50 }}
            onPress={() =>
              firebase
                .auth()
                .signOut()
                .then(() => {
                  this.props.navigation.navigate("LoginScreen");
                })
            }
          >
            <MaterialIcons name="logout" size={24} color="black" />
            <Text style={{ top: 2, marginLeft: 5 }}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.title}>
            <Text style={styles.titleText}>TODOs</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.setState({ modalVisible: true })}
            style={styles.addButton}
          >
            <MaterialIcons name="add" size={50} />
          </TouchableOpacity>
        </View>
        <FlatList data={this.state.todos} renderItem={this.renderItem} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#888",
  },
  subTopContainer: {
    backgroundColor: "#e5e5e5",
    marginRight: "55%",
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: Dimensions.get("window").height / 3,
    backgroundColor: "royalblue",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    elevation: 20,
  },
  subHeading: {
    paddingTop: StatusBar.currentHeight,
    fontSize: 17,
    color: "#333",
    textDecorationLine: "underline",
  },
  stats: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20%",
  },
  statsText: {
    color: "#333",
    fontSize: 16,
  },
  viewCompleted: {
    backgroundColor: "royalblue",
    width: 130,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginVertical: 20,
  },
  title: {
    flexDirection: "row-reverse",
    alignSelf: "center",
    left: "30%",
    bottom: 150,
  },
  titleText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "dodgerblue",
    width: 100,
    height: 100,
    flexDirection: "row-reverse",
    alignSelf: "center",
    left: 80,
    bottom: 110,
    marginBottom: -60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  todoContainer: {
    backgroundColor: "white",
    paddingVertical: "7%",
    width: "80%",
    marginTop: "10%",
    borderRadius: 15,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
  buttons: {
    flexDirection: "row",
    left: 17,
  },
  separator: {
    width: 20,
  },
});
