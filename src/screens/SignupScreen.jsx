import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TextInput,
} from "react-native";
import { useAuth } from "../auth/AuthProvider";

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nameLabel = useRef(new Animated.Value(0)).current;
  const emailLabel = useRef(new Animated.Value(0)).current;
  const passwordLabel = useRef(new Animated.Value(0)).current;

  const animateLabelUp = (label) =>
    Animated.timing(label, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();

  const animateLabelDown = (label, value) => {
    if (!value) {
      Animated.timing(label, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password)
      return Alert.alert("Validation", "Please fill all fields");

    try {
      setLoading(true);
      // updated for fake Laravel API
      await signup(name, email, password);

      navigation.replace("MainApp", { screen: "Home" });
    } catch (e) {
      Alert.alert("Signup failed", e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const FloatingLabel = ({ label, animatedValue }) => {
    const top = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    });

    const fontSize = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    });

    const color = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#888", "#000"],
    });

    return (
      <Animated.Text style={[styles.floatingLabel, { top, fontSize, color }]}>
        {label}
      </Animated.Text>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Shoe Store and explore shoes</Text>

        <View style={styles.inputWrapper}>
          <FloatingLabel label="Name" animatedValue={nameLabel} />
          <TextInput
            value={name}
            onChangeText={setName}
            onFocus={() => animateLabelUp(nameLabel)}
            onBlur={() => animateLabelDown(nameLabel, name)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <FloatingLabel label="Email" animatedValue={emailLabel} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            onFocus={() => animateLabelUp(emailLabel)}
            onBlur={() => animateLabelDown(emailLabel, email)}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <FloatingLabel label="Password" animatedValue={passwordLabel} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            onFocus={() => animateLabelUp(passwordLabel)}
            onBlur={() => animateLabelDown(passwordLabel, password)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomText}>
          <Text style={{ color: "#333" }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#444", marginBottom: 30 },
  inputWrapper: {
    marginBottom: 25,
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    left: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  input: {
    backgroundColor: "transparent",
    color: "#000",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  bottomText: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  linkText: { color: "#000", fontWeight: "bold" },
});
