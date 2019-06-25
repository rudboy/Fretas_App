import React from "react";
import { MapView } from "expo";
import axios from "axios"; // const axios = require('axios');

import {
  Button,
  StyleSheet,
  AsyncStorage,
  View,
  ActivityIndicator,
  Text
} from "react-native";

class Mapview extends React.Component {
  state = { tab: [], update: false, toto: true, ligne: 3, num: 0 };

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: "Map"
    };
  };

  Update = () => {
    console.log(this.state.update);
    while (this.state.update === false) {
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
  };

  render() {
    if (this.state.toto === true) {
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
            <Text>Update</Text>
          </View>
        );
      }
    }
    return (
      <View style={styles.map}>
        <MapView
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: 48.856614,
            longitude: 2.3522219,
            latitudeDelta: 0.19,
            longitudeDelta: 0.14
          }}
        >
          {this.state.tab.rooms.map((location, index) => {
            return (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: location.loc[1],
                  longitude: location.loc[0]
                }}
                title={location.title}
                description={location.city.name}
              />
            );
          })}
        </MapView>
      </View>
    );
  }
  componentDidMount = async () => {
    try {
      // On charge les données ici
      const response = await axios.get(
        "https://airbnb-api.now.sh/api/room?city=paris"
      );
      console.log(response.data);
      this.setState({ tab: response.data, update: true, toto: false });
    } catch (error) {
      error;
    }
  };
}

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%"
  }
});

export default Mapview;
