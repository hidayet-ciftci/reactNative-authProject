import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const LoginScreen = () => {
  const [username, setUsername] = useState<string>("emilys");
  const [password, setPassword] = useState<string>("emilyspass");
  const params = useLocalSearchParams<{
    username: string;
    password: string;
  }>();

  useEffect(() => {
    if (params.username) {
      setUsername(params.username);
      setPassword(params.password);
    }
  }, [params]);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          expiresInMins: 30,
        }),
      });
      if (!response.ok) {
        Alert.alert("Hata", "şifre veya kullanıcı adı yanlış");
        return;
      }
      const data = await response.json();
      if (data.accessToken) {
        await AsyncStorage.setItem("user_Token", data.accessToken);
        console.log("giriş yapıldı");
      } else throw new Error("token hatası");
      router.push("/profile");
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      Alert.alert("Hata", "Bağlantı hatası!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Giriş yap</Text>
      </View>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />
      <Button title="Giriş Yap" onPress={handleLogin} />
      <View style={styles.register}>
        <Text style={[{ color: "white" }]}>Hesabın yok mu? </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/register");
          }}
        >
          <Text style={styles.btnSize}>Kayıt ol </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 5 },
  title: {
    color: "white",
    fontSize: 40,
  },
  titleView: {
    marginBottom: 25,
    alignItems: "center",
  },
  input: {
    color: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  btnSize: {
    textDecorationLine: "underline",
    color: "blue",
  },
  register: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default LoginScreen;
