import { BlurView } from "expo-blur";
import { Cloud, CloudRain, CloudSnow, SunDim } from "phosphor-react-native";
import { StyleSheet, Text, View } from "react-native";
export default function forecast({data}) {

    const date_time = data?.dt_txt
    const arr= date_time.split(' ')
    const currdate = arr[0]
    const date = new Date(currdate)
    const alldays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    let day = alldays[date.getDay()]
    
    const today_date = new Date()
    if(currdate == today_date.toISOString().split('T')[0])
        day='Today'
    

    let icon = <Cloud size={44} color="#4b8db9" weight="duotone" />
    switch (data?.weather[0]?.main){

        case "Clear" : icon = <SunDim size={44} color="#c1d16b" weight="duotone" />
                         break
        case "Clouds" : icon = <Cloud size={44} color="#4b8db9" weight="duotone" />
                         break
        case "Rain"  : icon = <CloudRain size={44} color="#acbdc8" weight="duotone" />
                       break
        case "Snow"  : icon = <CloudSnow size={44} color="#ffffff" weight="fill" />
                      
    }
    return (

        <View style={{
            overflow: "hidden",
            borderRadius: 10,
            margin : 15,
            boxShadow : "px 2px 10px px black",
          

        }}>
            <BlurView intensity={60} tint="dark"  >
                <View style={style.forecastbar}>
                    <Text style={style.forecasttext}>{day}</Text>
                    {icon}
                    <Text style={style.forecasttext}>{data?.main?.temp}°C</Text>
                </View>
            </BlurView>
        </View>
    )
}
const style = StyleSheet.create({
    forecastbar: {
        flexDirection: "row",
        height: 80,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
    },
    forecasttext: {
        fontSize: 17,
        fontWeight: "800",
        color: "white",
    },
    forecasttexticon: {
        fontSize: 17,
        fontWeight: "800",
        color:"rgba(232, 241, 243, 0.5)",
    },

})