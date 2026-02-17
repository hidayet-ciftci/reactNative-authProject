import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchUserProfile } from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image, StyleSheet } from "react-native";
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
  address: {
    city: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
  };
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
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText>Bilgiler yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {user ? (
        <>
          <ThemedView style={styles.header}>
            <Image
              source={{ uri: user.image || "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <ThemedText style={styles.name}>
              {user.firstName} {user.lastName}
            </ThemedText>
            <ThemedText type="defaultSemiBold">{user.company.title}</ThemedText>
            <ThemedText style={styles.username}>@{user.username}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoContainer}>
            <ThemedText style={styles.label}>Company Name:</ThemedText>
            <ThemedText style={styles.value}>{user.company.name}</ThemedText>

            <ThemedText style={styles.label}>Email:</ThemedText>
            <ThemedText style={styles.value}>{user.email}</ThemedText>

            <ThemedText style={styles.label}>Telefon:</ThemedText>
            <ThemedText style={styles.value}>{user.phone}</ThemedText>

            <ThemedText style={styles.label}>Address:</ThemedText>
            <ThemedText style={styles.value}>
              {user.address.city}, {user.address.country}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.logoutBtn}>
            <Button title="Çıkış Yap" onPress={handleLogout} color="red" />
          </ThemedView>
        </>
      ) : (
        <ThemedText>Kullanıcı bilgisi bulunamadı.</ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
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
    padding: 15,
    paddingLeft: 20,
    borderRadius: 10,
    elevation: 3,
    gap: 10,
  },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, marginBottom: 5 },
  logoutBtn: { marginTop: 30 },
});

export default ProfileScreen;
