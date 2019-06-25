import React, { Component } from "react";
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  ActivityIndicator,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import axios from "axios"; // const axios = require('axios');
import { BarCodeScanner, Permissions, Location } from "expo";

export default class App extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    resultatScanne: null,
    choix: "",
    userId: "",
    latitude: null,
    longitude: "",
    update: false
  };
  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    this.getLocationAsync();
    this._requestCameraPermission();
    const { navigation } = this.props;
    this.setState({ choix: navigation.getParam("choix", "null") });
    let userToken = await AsyncStorage.getItem("userToken");
    try {
      // On charge les données ici
      const response = await axios.get(
        "https://fretas-api.herokuapp.com/get_my_user_info?token=" + userToken
      );
      this.setState({ userId: response.data._id });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission refusée"
      });
    } else {
      //si la permission est activé on recupere la position actuel
      const Currentlocation = await Location.getCurrentPositionAsync({});
      this.setState({
        latitude: Currentlocation.coords.latitude,
        longitude: Currentlocation.coords.longitude
      });
    }
    //console.log(this.state.Currentlocation);
  };

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.resultatScanne) {
      LayoutAnimation.spring();
      this.setState({ resultatScanne: result.data });
    }
  };
  Update = () => {
    while (this.state.latitude === null) {
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
          <Text>Update</Text>
        </View>
      );
    }
    this.requestToserver();
  };

  static navigationOptions = ({ navigation }) => {
    return {
      // header: null

      title: "Placer le QRCODE dans le cadre",
      headerStyle: {
        backgroundColor: "white",
        marginTop: -20
      },
      headerTintColor: "#271c5f",
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: "500"
      }
    };
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text style={{ color: "#fff" }}>
            Camera permission is not granted
          </Text>
        ) : this.state.resultatScanne === null ? (
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width
            }}
          />
        ) : (
          this.Update()
          // <View />
        )}
        {/* {this._maybeRenderUrl()} */}
        <StatusBar hidden />
      </View>
    );
  }

  requestToserver = async () => {
    if (this.state.resultatScanne) {
      if (this.state.choix === "depart") {
        try {
          // On charge les données ici
          const response1 = await axios.post(
            "https://fretas-api.herokuapp.com/car",
            {
              immat: this.state.resultatScanne
            }
          );
          const response = await axios.post(
            "https://fretas-api.herokuapp.com/follow_list",
            {
              localisation: [this.state.latitude, this.state.longitude],
              etat: this.state.choix,
              cars: response1.data[0]._id,
              creator: this.state.userId
            }
          );
          console.log(response.data.message);
          if (response.data.message === "Created okay") {
            this.props.navigation.navigate("Home", { result: "ok" });
          } else {
            this.setState({ resultatScann: null });
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (this.state.choix === "arriver") {
        try {
          // On charge les données ici
          const response1 = await axios.post(
            "https://fretas-api.herokuapp.com/car",
            {
              immat: this.state.resultatScanne
            }
          );
          const response = await axios.post(
            "https://fretas-api.herokuapp.com/follow_list",
            {
              localisation: [this.state.latitude, this.state.longitude],
              etat: this.state.choix,
              cars: response1.data[0]._id,
              creator: this.state.userId
            }
          );
          console.log(response.data.message);
          if (response.data.message === "Created okay") {
            this.props.navigation.navigate("Home", { result: "ok" });
          } else {
            this.setState({ resultatScann: null });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      return;
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    flexDirection: "row"
  },
  url: {
    flex: 1
  },
  urlText: {
    color: "#fff",
    fontSize: 20
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18
  }
});
