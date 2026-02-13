import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    image: string;
    phone: string;
    username: string;
  }>();
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("user_Token");

      if (!token) {
        Alert.alert("Hata", "Giriş yapmamışsınız!");
        router.replace("/");
        return;
      }

      const response = await fetch("https://dummyjson.com/user/me", {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (!response.ok) return;
      setUser({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        maidenName: data.maidenName,
        age: data.age,
        gender: data.gender,
        email: data.email,
        image: data.image,
        phone: data.phone,
        username: data.username,
      });
    } catch (error) {
      console.error("Profil Yükleme Hatası:", error);
      Alert.alert("Hata", "Veri çekilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_Token");
    router.replace("/");
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Bilgiler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.header}>
            <Image
              source={{ uri: user.image || "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.username}>@{user.username}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>Telefon:</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>

          <View style={styles.logoutBtn}>
            <Button title="Çıkış Yap" onPress={handleLogout} color="red" />
          </View>
        </>
      ) : (
        <Text>Kullanıcı bilgisi bulunamadı.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#333",
  },
  name: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 16, color: "gray" },
  infoContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  label: { fontSize: 14, fontWeight: "bold", color: "#555", marginTop: 10 },
  value: { fontSize: 16, marginBottom: 5 },
  logoutBtn: { marginTop: 30 },
});

export default ProfileScreen;
