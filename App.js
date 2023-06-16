import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const [budget, setBudget] = useState(0);
  const [input, setInput] = useState(0);
  const [backup, setBackup] = useState(0);

  // Load budget from AsyncStorage on app startup
  useEffect(() => {
    loadBudget();
  }, []);

  // Save budget to AsyncStorage whenever it changes
  useEffect(() => {
    saveBudget();
  }, [budget]);

  const loadBudget = async () => {
    try {
      const savedBudget = await AsyncStorage.getItem("budget");
      if (savedBudget !== null) {
        setBudget(JSON.parse(savedBudget));
      }
    } catch (error) {
      console.log("Error loading budget from AsyncStorage:", error);
    }
  };

  const saveBudget = async () => {
    try {
      await AsyncStorage.setItem("budget", JSON.stringify(budget));
    } catch (error) {
      console.log("Error saving budget to AsyncStorage:", error);
    }
  };

  const onPressAddBudget = () => {
    setBackup(budget);
    setBudget(budget + Number(input));
  };

  const onPressSubBudget = () => {
    setBackup(budget);
    setBudget(budget - input);
  };

  const onPressSetBudget = () => {
    setBackup(budget);
    setBudget(Number(input));
  };

  const onChangeValue = (val) => {
    const fixedInput = val.replace(",", ".");
    setInput(fixedInput);
  };

  const onPressUndo = () => {
    setBudget(backup);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.budget_display}>
          <Text style={{ fontSize: 20 }}>Budžet</Text>
          <Text style={{ fontSize: 35, fontWeight: 700 }}>
            {Number(budget).toFixed(2)}€
          </Text>
        </View>
        <View style={styles.moramsmilistime}>
          <TouchableOpacity onPress={onPressSetBudget}>
            <Ionicons name="chevron-up-circle-outline" size={55} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressUndo}>
            <Ionicons name="arrow-undo-circle-outline" size={55} />
          </TouchableOpacity>
        </View>
        <View style={styles.input}>
          <TouchableOpacity onPress={onPressAddBudget}>
            <Ionicons name="add-circle-outline" size={55} />
          </TouchableOpacity>
          <TextInput
            style={styles.valueInput}
            placeholder="Iznos"
            keyboardType="numeric"
            onChangeText={(val) => onChangeValue(val)}
          />
          <TouchableOpacity onPress={onPressSubBudget}>
            <Ionicons name="remove-circle-outline" size={55} />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingLeft: 40,
    paddingRight: 40,
  },
  budget_display: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  moramsmilistime: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 40,
  },
  valueInput: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "600",
  },
});

