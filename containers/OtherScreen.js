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
import { Ionicons } from "@expo/vector-icons";
import { MapView } from "expo";
import axios from "axios"; // const axios = require('axios');
import ImageResizer from "react-native-image-resizer";
import Swiper from "react-native-swiper";

class OtherScreen extends React.Component {
  state = { tab: [], update: false, toto: true, ligne: 3, num: 0 };

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Rooms",
      headerStyle: {
        backgroundColor: "#EB4C52"
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontSize: 30,
        fontWeight: "200"
      }
    };
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

  resizeIMG = img => {
    ImageResizer.createResizedImage(img, 20, 20)
      .then(response => {
        return response.uri;
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image
      })
      .catch(err => {
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
      });
  };
  ligne = () => {
    if (this.state.ligne === 3) {
      this.setState({ ligne: 10 });
    } else {
      this.setState({ ligne: 3 });
    }
  };
  swip = () => {
    this.setState({ i: this.state.num++ });
    return <></>;
  };

  render() {
    console.log(this.state.tab);
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
      <View>
        <View style={{ height: 200 }}>
          <Swiper
            style={{ height: 200, marginTop: 15 }}
            activeDotColor={"red"}
            showsButtons={true}
            showsPagination={false}
          >
            {this.state.tab.photos.map((photo, i) => {
              return (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Image
                    style={styles.image}
                    source={{
                      uri: photo
                    }}
                  />
                </View>
              );
            })}
          </Swiper>
        </View>
        <FlatList
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: "#dbdbdb",
                marginLeft: 10,
                marginRight: 10
              }}
            />
          )}
          data={[this.state.tab]}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View
              // onPress={() => this.goTo(item._id)}
              style={styles.page}
            >
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "black",
                  bottom: 40,
                  height: 60,
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "white", fontSize: 30 }}>
                  {item.price} €
                </Text>
              </View>

              <TouchableOpacity
                onPress={this.ligne}
                style={{
                  flexDirection: "row",
                  width: 250,
                  marginRight: 50
                }}
              >
                <Text numberOfLines={this.state.ligne} style={styles.text}>
                  {item.title + " " + item.description}
                </Text>
                <Image
                  style={styles.image2}
                  source={{
                    uri: item.user.account.photos[0]
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  marginLeft: -110,
                  marginTop: 1,
                  flexDirection: "row"
                }}
              >
                {this.ettoile(item.ratingValue)}
                <Text
                  style={{
                    marginTop: 7,
                    marginLeft: 10,
                    color: "grey"
                  }}
                >
                  {item.reviews} reviews
                </Text>
              </View>
              <View style={styles.map}>
                <MapView
                  style={{ width: "100%", height: 200 }}
                  initialRegion={{
                    latitude: item.loc[1],
                    longitude: item.loc[0],
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.004
                  }}
                >
                  <MapView.Marker
                    coordinate={{
                      latitude: item.loc[1],
                      longitude: item.loc[0]
                    }}
                    title={item.title}
                    description={item.city.name}
                  />
                </MapView>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
  componentDidMount = async () => {
    try {
      // On charge les données ici
      const response = await axios.get(
        "https://airbnb-api.now.sh/api/room/" +
          this.props.navigation.state.params.id
      );
      this.setState({ tab: response.data, update: true, toto: false });
    } catch (error) {
      error;
    }
  };
}

let styles = StyleSheet.create({
  image: {
    height: 200,
    width: 300,
    marginBottom: 20,
    position: "relative"
  },
  map: {
    height: 200,
    width: 300,
    marginBottom: 20,
    marginTop: 20
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
    marginRight: 5
  }
});

export default OtherScreen;
