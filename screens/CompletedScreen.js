import React, { Component } from "react";
import { Text, FlatList, StyleSheet, View, Keyboard } from "react-native";
import { auth } from "firebase";
import db from "../config";
import { SearchBar, Header } from "react-native-elements";

export default class CompletedScreen extends Component {
  state = {
    allCompletedTodos: [],
    search: "",
    filteredData: [],
  };
  constructor() {
    super();
    this.completedRef = null;
  }
  getCompletedTodos() {
    this.completedRef = db
      .collection("completedTodos")
      .where("uid", "==", auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        let allCompletedTodos = [];
        snapshot.forEach((doc) => {
          allCompletedTodos.push({
            ...doc.data(),
            key: doc.id,
          });
          this.setState({ allCompletedTodos: allCompletedTodos });
        });
      });
  }
  searchFilterFunction = (text) => {
    const newData = this.state.allCompletedTodos.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      search: text,
      filteredData: newData,
    });
  };
  componentDidMount() {
    this.getCompletedTodos();
  }
  componentWillUnmount() {
    this.completedRef();
  }
  render() {
    return (
      <View style={styles.fullContainer}>
        <Header
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => {
              this.props.navigation.goBack();
            },
          }}
          centerComponent={{
            text: "Completed Todos",
            style: { color: "#fff", fontSize: 23, fontWeight: "bold" },
          }}
          rightComponent={{ icon: "filter-list-alt", color: "#fff" }}
          backgroundColor="royalblue"
        />
        <SearchBar
          lightTheme
          round
          placeholder="Type Here..."
          onChangeText={(text) => this.searchFilterFunction(text)}
          onClear={() => Keyboard.dismiss()}
          onBlur={() => Keyboard.dismiss()}
          value={this.state.search}
        />
        <View style={{ backgroundColor: "#ddd" }}>
          <FlatList
            data={
              this.state.search === ""
                ? this.state.allCompletedTodos
                : this.state.filteredData
            }
            renderItem={({ item }) => (
              <View style={styles.completed}>
                <Text style={{ fontSize: 20 }}>{item.title}</Text>
                <Text style={{ color: "#444" }}>Completed: {item.time}</Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  header: {
    width: "100%",
    backgroundColor: "royalblue",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    top: 32,
    left: 10,
    marginTop: -30,
  },
  headerTitle: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 8,
  },
  completed: {
    backgroundColor: "#fff",
    paddingVertical: 17,
    paddingLeft: 7,
    borderBottomWidth: 0.3,
    borderBottomColor: "#aaa",
  },
  searchbar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  search: {
    width: "90%",
    height: 50,
    borderWidth: 0.2,
    borderRadius: 7,
    borderColor: "#aaa",
    paddingLeft: 7,
    marginLeft: 4,
    marginVertical: 7,
    backgroundColor: "#fff",
  },
  icon: {
    width: 30,
    height: 30,
  },
});
