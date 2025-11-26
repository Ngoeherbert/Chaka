import React, { useState, useRef, useEffect } from "react";
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

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const emailLabel = useRef(new Animated.Value(0)).current;
  const passwordLabel = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFocus = (label) => {
    Animated.timing(label, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (label, value) => {
    if (!value) {
      Animated.timing(label, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert("Validation", "Please fill all fields");

    try {
      setLoading(true);
      await login(email, password);
      navigation.replace("MainApp", { screen: "Home" });
    } catch (e) {
      Alert.alert("Login failed", e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const renderFloatingLabel = (label, anim) => {
    const top = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    });
    const fontSize = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    });
    const color = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#777", "#000"],
    });

    return (
      <Animated.Text style={[styles.floatingLabel, { top, fontSize, color }]}>
        {label}
      </Animated.Text>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Log in to continue shopping</Text>

          <View style={styles.inputWrapper}>
            {renderFloatingLabel("Email", emailLabel)}
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => handleFocus(emailLabel)}
              onBlur={() => handleBlur(emailLabel, email)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            {renderFloatingLabel("Password", passwordLabel)}
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => handleFocus(passwordLabel)}
              onBlur={() => handleBlur(passwordLabel, password)}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupText}>
            <Text style={{ color: "#444" }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 35,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#000",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 35,
  },

  inputWrapper: {
    marginBottom: 25,
    position: "relative",
  },

  floatingLabel: {
    position: "absolute",
    left: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    zIndex: 10,
  },

  input: {
    borderWidth: 1.6,
    borderColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { height: 1, width: 0 },
  },

  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  signupText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  linkText: {
    color: "#000",
    fontWeight: "bold",
  },
});
