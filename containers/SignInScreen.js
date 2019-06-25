import React from "react";
import {
  AsyncStorage,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios"; // const axios = require('axios');
import { Constants, Location, Permissions } from "expo";

class SignInScreen extends React.Component {
  state = {
    user: "",
    password: "",
    errorMessage: null,
    load: false
  };

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };

  onPress = async () => {
    this.setState({ load: true });
    try {
      // On charge les données ici
      const response = await axios.post(
        "https://fretas-api.herokuapp.com/login",
        {
          username: this.state.user,
          password: this.state.password
        }
      );

      if (response.data.token) {
        this.setState({ load: false });
        await AsyncStorage.setItem("userToken", response.data.token);
        this.props.navigation.navigate("App");
      } else {
        this.setState({ load: false });
        Alert.alert(
          "Probleme de Conexion",
          "Veuilliez vérifier votre nom d'utilisateur ou votre mot de passe",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    } catch (error) {
      alert("Probleme de Conexion");
    }
  };
  ettoile = rate => {
    let tab = [];
    for (let i = 1; i <= 5; i++) {
      tab.push(
        <Ionicons key={i + "star"} name="md-star" size={30} color="grey" />
      );
    }
    for (let i = 0; i <= Number(rate) - 1; i++) {
      tab[i] = (
        <Ionicons key={i + "star"} name="md-star" size={30} color="#fecc02" />
      );
    }
    //console.log(tab);
    return tab;
  };
  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission refusée"
      });
    } else {
      const location = await Location.getCurrentPositionAsync({});
      this.setState({
        location: location
      });
    }
  };

  render() {
    if (this.state.load === true) {
      {
        return (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 250
            }}
          >
            <ActivityIndicator size="large" color="#ea3554" />
            <Text>connexion en cours</Text>
          </View>
        );
      }
    }
    return (
      <View style={styles.fullscreen}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.Keyboar}
          keyboardVerticalOffset="300"
        >
          <Image
            source={require("../assets/logo.png")}
            style={{ height: 100, resizeMode: "contain", marginBottom: 50 }}
          />
          <Text style={styles.welcome}>Bienvenue</Text>
          <View style={{ width: 250 }}>
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor="grey"
              onChangeText={user => this.setState({ user })}
              value={this.state.user}
            />
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="grey"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              borderRadius: 30,
              height: 60,
              width: 180,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              borderColor: "grey",
              borderWidth: 1
            }}
            onPress={this.onPress}
          >
            <Text style={styles.login}>Se connecter</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
  componentDidMount() {
    this.getLocationAsync();
  }
}

let styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginBottom: 50,
    fontSize: 20,
    color: "grey"
  },
  welcome: {
    marginBottom: 40,
    fontSize: 30,
    color: "grey",
    fontSize: 40
  },
  login: {
    color: "grey",
    fontSize: 25
  },
  Keyboar: {
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export default SignInScreen;
