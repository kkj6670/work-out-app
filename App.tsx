import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Weather } from "./coomponents/Weather";
import { WorkOuts } from "./coomponents/work-outs/WorkOuts";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Weather />
        <View style={styles.workoutsWrap}>
          <Text style={styles.contentsTitle}>WorkOuts</Text>
          <WorkOuts />
        </View>
        <StatusBar barStyle={"default"} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 30,
  },
  contentsTitle: {
    fontSize: 20,
    marginVertical: 10,
  },
  workoutsWrap: {
    flex: 1,
  },
});
