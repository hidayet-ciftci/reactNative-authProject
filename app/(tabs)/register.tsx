import { router } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
const LoginScreen = () => {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    age: number | null;
    username: string;
    password: string;
  }>({ firstName: "", lastName: "", age: null, username: "", password: "" });

  const handleSubmit = async () => {
    const API_URL = "https://dummyjson.com/users/add";
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (data.id) {
        const username = user.username;
        const password = user.password;
        setUser({
          firstName: "",
          lastName: "",
          age: null,
          username: "",
          password: "",
        });
        router.push({
          pathname: "/(tabs)",
          params: { username: username, password: password },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>kayıt ol</Text>
      </View>
      <TextInput
        style={styles.input}
        value={user.firstName}
        onChangeText={(text) => {
          setUser({ ...user, firstName: text });
        }}
        placeholder="Firstname"
      />
      <TextInput
        style={styles.input}
        value={user.lastName}
        onChangeText={(text) => {
          setUser({ ...user, lastName: text });
        }}
        placeholder="Lastname"
      />
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={user.age === 0 || user.age === null ? "" : String(user.age)}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          setUser({
            ...user,
            age: Number(numericValue),
          });
        }}
        placeholder="age"
      />
      <TextInput
        style={styles.input}
        value={user.username}
        onChangeText={(text) => {
          setUser({ ...user, username: text });
        }}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={user.password}
        onChangeText={(text) => {
          setUser({ ...user, password: text });
        }}
        placeholder="Şifre"
        secureTextEntry
      />
      <Button title="Kayıt ol" onPress={handleSubmit} />
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
