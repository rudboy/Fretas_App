import React from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import axios from "axios"; // const axios = require('axios');
import { Ionicons } from "@expo/vector-icons";

class HomeScreen extends React.Component {
  state = {};
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: "Scan"
    };
  };

  goTo = choix => {
    if (choix === "depart") {
      this.props.navigation.navigate("Scann", { choix: choix });
    }
    if (choix === "arriver") {
    }
    this.props.navigation.navigate("Scann", { choix: choix });
  };

  render() {
    const { navigation } = this.props;
    console.log(navigation.getParam("result", "null"));
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 40
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{ height: 100, resizeMode: "contain", marginBottom: 50 }}
        />
        {/* {this.Update()} */}
        <TouchableOpacity
          style={styles.buttom}
          onPress={() => this.goTo("depart")}
        >
          <Text style={styles.text}>DEPART</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttom}
          onPress={() => this.goTo("arriver")}
        >
          <Text style={styles.text}>ARRIVER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  componentDidMount = async () => {};
}
let styles = StyleSheet.create({
  image: {
    height: 200,
    width: 300,
    marginBottom: 20,
    position: "relative"
  },
  buttom: {
    height: 100,
    width: 300,
    borderRadius: 15,
    borderColor: "grey",
    borderWidth: 2,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  image2: {
    height: 50,
    width: 50,
    borderRadius: 30
  },
  page: {
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30
  },
  text: {
    fontSize: 20,
    color: "grey",
    fontWeight: "600"
  }
});

export default HomeScreen;
