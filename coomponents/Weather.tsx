import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CurrentWeather, WeatherData, getWeather } from "../api/weather";

const REFETCH_DURATION = 1000 * 60 * 10;

export const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState<CurrentWeather | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const initWeather = async () => {
      // 위치조회
      const {
        coords: { latitude, longitude },
      } = await getCurrentPositionAsync({ accuracy: 5 });

      // 날씨조회
      const response = await getWeather({ latitude, longitude, current_weather: true });
      const json: WeatherData = await response.json();
      setWeatherInfo(json.current_weather);
    };

    (async () => {
      try {
        // 권한체크
        const { granted } = await requestForegroundPermissionsAsync();
        setPermission(granted);

        if (granted) {
          await initWeather();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();

    // REFETCH_DURATION마다 reset
    const intervalInitWeather = setInterval(() => {
      initWeather();
    }, REFETCH_DURATION);

    return () => {
      clearInterval(intervalInitWeather);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>현재 날씨 : </Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text>
          {!permission && "(위치 권한을 허용 해주세요.)"}
          {permission && !weatherInfo && "날씨 정보를 불러오지 못했습니다."}
          {permission && weatherInfo && `${weatherInfo?.temperature}°C`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
    paddingBottom: 5,
  },
});
