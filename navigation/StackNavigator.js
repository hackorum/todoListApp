import {
  createStackNavigator,
  CardStyleInterpolators,
} from "react-navigation-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import CompletedScreen from "../screens/CompletedScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AddTodoScreen from "../screens/AddTodoScreen";
import * as firebase from "firebase";

const defaultRoute = firebase.auth().currentUser ? "HomeScreen" : "LoginScreen";

export const StackNavigator = createStackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
    },
    SignupScreen: {
      screen: SignupScreen,
      navigationOptions: {
        gestureEnabled: true,
      },
    },
    ForgotPasswordScreen: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        gestureEnabled: true,
      },
    },
    AddTodoScreen: {
      screen: AddTodoScreen
    },
    HomeScreen: {
      screen: HomeScreen,
    },
    CompletedScreen: {
      screen: CompletedScreen,
      navigationOptions: {
        gestureEnabled: true,
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      gestureEnabled: false,
      gestureDirection: "horizontal",
    },
  }
);
