import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import OtherScreen from "./OtherScreen";
import MapView from "./Map";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen
    // Map: MapView
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;

        switch (routeName) {
          case "Home":
            iconName = "qrcode-scan";
            break;

          case "Settings":
            iconName = "logout";
            break;

          default:
            iconName = null;
        }

        return (
          <MaterialCommunityIcons name={iconName} size={30} color={tintColor} />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "#271c5f",
      inactiveTintColor: "gray"
    }
  }
);

TabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  let headerTitle;

  switch (routeName) {
    case "Home":
      headerTitle = "Scan QRcode";

      break;
    case "Settings":
      headerTitle = "Déconnecter";
      break;

    // case "Other":
    //   headerTitle = "Room";
    //   break;
    default:
      headerTitle = routeName;
  }

  return {
    headerTitle,
    headerStyle: {
      backgroundColor: "#271c5f"
    },
    headerTintColor: "white",
    headerTitleStyle: {
      fontSize: 30,
      fontWeight: "200"
    }
  };
};

export default TabNavigator;
