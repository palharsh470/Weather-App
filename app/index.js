import { BlurView } from "expo-blur";
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { Cloud, CloudRain, CloudSnow, SunDim } from "phosphor-react-native";
import { useEffect, useState } from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Cards from "../components/maincards";
import Forecast from "../components/mainforecast";

const api_key="c51ef01a79ab2a387101f4ea220bc65a";

export default function HomePage() {

    useEffect(function(){
     handledevicelocation()
    },[])

    const [map, setmap] = useState(false)
    function showmap() {
        setmap(!map)
    }


    const [markerlocation, setmarkerlocation] = useState(null)

    function getmaplocation(maplocation) {
        const location = {
            longitude: maplocation?.nativeEvent?.coordinate?.longitude,
            latitude: maplocation?.nativeEvent?.coordinate?.latitude
        }
        setmarkerlocation(location)
    }

    const [currentlocationdata, setcurrentlocationdata] = useState(null)

    function confirmlocation() {
        setmap(!map)
        const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${markerlocation?.latitude}&lon=${markerlocation?.longitude}&appid=${api_key}&units=metric`

        fetch(weatherurl).then(function (response) {
            response?.json().then(function (data) {

                setcurrentlocationdata(data)
            })
        })
        const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${markerlocation?.latitude}&lon=${markerlocation?.longitude}&appid=${api_key}&units=metric`

        fetch(forecasturl).then(function (response) {
            response?.json().then(function (data) {

                setforecastdata(data)
            })
        })
    }

    const [forecastdata, setforecastdata] = useState("")

    function handledevicelocation() {
        requestForegroundPermissionsAsync().then(function (permission) {
            if (permission?.status == "granted") {
                getCurrentPositionAsync().then(function (response) {

                    const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${response?.coords?.latitude}&lon=${response?.coords?.longitude}&appid=${api_key}&units=metric`

                    fetch(weatherurl).then(function (response) {
                        response?.json().then(function (data) {

                            setcurrentlocationdata(data)
                        })
                    })
                    const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${response?.coords?.latitude}&lon=${response?.coords?.longitude}&appid=${api_key}&units=metric`

                    fetch(forecasturl).then(function (response) {
                        response?.json().then(function (data) {

                            setforecastdata(data)
                        })
                    })

                })
            }
            else {
                Alert.alert("Perimssion not granted allow the permissin from settings")
            }
        })
    }

    const todayforecast = forecastdata?.list?.filter(function (item, index) {
        if (index < 8)
            return true
        else
            false
    })

    const fivedayforecast = forecastdata?.list?.filter(function (item, index) {
        if (index % 8 == 0)
            return true
        else
            false
    })

    let icon = <Cloud size={60} color="#4b8db9" weight="duotone" />
    switch (currentlocationdata?.weather[0]?.main) {

        case "Clear": icon = <SunDim size={60} color="#c1d16b" weight="duotone" />
            break
        case "Clouds": icon = <Cloud size={60} color="#4b8db9" weight="duotone" />
            break
        case "Rain": icon = <CloudRain size={60} color="#acbdc8" weight="duotone" />
            break
        case "Snow": icon = <CloudSnow size={60} color="#ffffff" weight="fill" />

    }

    return (
        <ScrollView>
            <ImageBackground source={{ uri: "https://images.pexels.com/photos/13025342/pexels-photo-13025342.jpeg" }}>
                <View style={styles.currentweather}>
                    <Text style={[styles.currentWeatherText, { fontSize: 50 }]}>{currentlocationdata?.name}</Text>
                    <Text style={styles.currentWeatherText}>{currentlocationdata?.main?.temp}°C</Text>
                    {icon}
                    <Text style={styles.currentWeatherText}>{currentlocationdata?.weather[0]?.main}</Text>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-around',

                }}>
                    <TouchableOpacity
                        onPress={handledevicelocation}>
                        <View style={{
                            overflow: "hidden",
                            flexDirection: "row",
                            borderRadius: 10,
                            justifyContent: "space-between",
                            boxShadow: "px 2px 10px px black",
                        }}>
                            <BlurView intensity={60} tint="dark" style={{ padding: 10 }} >
                                <Text style={[styles.airconditionsparenttext, { fontSize: 15, }]}>Your Location</Text>
                            </BlurView>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={showmap}>
                        <View style={{
                            overflow: "hidden",
                            flexDirection: "row",
                            borderRadius: 10,
                            justifyContent: "space-between",
                            boxShadow: "px 2px 10px px black",
                        }}>
                            <BlurView intensity={60} tint="dark" style={{ padding: 10 }} >
                                <Text style={[styles.airconditionsparenttext, { fontSize: 15 }]} >Open Map</Text>
                            </BlurView>
                        </View>
                    </TouchableOpacity>

                </View>

                <Text style={styles.forecastText}>TODAY'S FORECAST</Text>
                <ScrollView horizontal style={{
                    paddingLeft: 10
                }}>
                    {
                        todayforecast?.map(function (item, index) {
                            return <Cards key={index} data={item}></Cards>
                        })
                    }
                </ScrollView>

                <Text style={styles.forecastText}>AIR CONDITIONS</Text>

                <View style={{
                    overflow: "hidden",
                    borderRadius: 10,
                    marginHorizontal: "auto",
                    boxShadow: "px 2px 10px px black",
                }}>
                    <BlurView intensity={60} tint="dark" style={{}} >
                        <View style={styles.airconditions}>
                            <View style={styles.airconditionsColumnparent}>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Feels Like</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.main?.feels_like}</Text>
                                </View>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Humidity</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.main?.humidity}</Text>
                                </View>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Ground Level</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.main?.grnd_level}</Text>
                                </View>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Visibility</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.visibility}</Text>
                                </View>

                            </View>
                            <View style={styles.airconditionsColumnparent}>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Pressure</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.main?.pressure}</Text>
                                </View>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Wind</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.wind?.speed} m/sec</Text>
                                </View>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Sea level</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.main?.sea_level}</Text>
                                </View>
                                <View style={styles.airconditionsColumn}>
                                    <Text style={styles.airconditionsparenttext}>Description</Text>
                                    <Text style={styles.airconditionschildtext}>{currentlocationdata?.weather[0]?.description}</Text>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </View>

                <Text style={styles.forecastText}>5-DAY FORECAST</Text>
                {
                    fivedayforecast?.map(function (item, index) {
                        return <Forecast key={index} data={item} ></Forecast>
                    })
                }

                <Modal visible={map} transparent={true} >
                    <View style={styles.map}>
                        <MapView onPress={getmaplocation} zoomEnabled={true} style={{
                            height: 400,
                        }} >
                            {markerlocation && <Marker coordinate={{
                                longitude: markerlocation?.longitude,
                                latitude: markerlocation?.latitude
                            }} />
                            }
                        </MapView>
                        <TouchableOpacity style={{
                            backgroundColor: "white",
                            height: 30,
                            borderWidth: 2,
                            justifyContent: "center"
                        }} onPress={confirmlocation}><Text>Confirm Location</Text></TouchableOpacity>
                    </View>
                </Modal>

            </ImageBackground>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    currentweather: {
        alignItems: "center",
        marginHorizontal: "auto",
        marginTop: 80,
        gap: 20,
        marginVertical: 60,
    },
    currentWeatherText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
    },
    forecastText: {
        fontSize: 20,
        fontWeight: "800",
        color: "rgba(232, 241, 243, 0.5)",
        marginVertical: 30,
        marginLeft: 20
    },
    airconditions: {

        flexDirection: "row",
        justifyContent: "center",
        padding: 20,
        gap: 50,
        borderRadius: 10

    },
    airconditionsColumnparent: {
        gap: 10,
        marginHorizontal: 10

    },
    airconditionsparenttext: {
        fontSize: 20,
        fontWeight: "800",
        color: "rgba(232, 241, 243, 0.5)",
    },
    airconditionschildtext: {
        fontSize: 15,
        fontWeight: "800",
        color: "white",
    },
    airconditionsColumn: {
        alignItems: "center"
    },
    map: {
        width: "90%",
        position: "absolute",
        marginHorizontal: 22,
        marginVertical: 200,
        // boxShadow : " 0 , 0 , 10px , 10px , white "
    }


})