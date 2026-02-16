import { fetchUserProfile } from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
export interface profile {
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
}
const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<profile | null>(null);
  const [loading, setLoading] = useState(true);

  const handleProfile = async () => {
    const profileData = await fetchUserProfile();
    if (profileData) {
      setUser(profileData);
      setLoading(false);
    } else {
      Toast.show({
        type: "error",
        text1: "kullanıcı hatası oluştu",
      }); // Router'ı component , içinde kullanmak best practice
      setTimeout(() => {
        router.replace("/");
      }, 1000); // api ya da services.ts içinde sadece o func işlemi olsun, data return.
    }
  };

  const handleLogout = async () => {
    Toast.show({
      type: "info",
      text1: "Çıkış yapılıyor",
    });
    await AsyncStorage.removeItem("user_Token");
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  };
  useEffect(() => {
    handleProfile();
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
