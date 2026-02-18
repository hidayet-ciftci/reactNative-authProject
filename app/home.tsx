import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchUserProfile } from "@/services/token";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserProfile } from "@/types/user";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleFetch = async () => {
    const profileData = await fetchUserProfile();
    if (profileData) {
      setUser(profileData);
      setLoading(false);
    } else {
      Toast.show({
        type: "error",
        text1: "kullanıcı hatası",
        text2: "Giriş sayfasına yönlendiriliyor",
      });
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ThemedView style={styles.container}>
      {user ? (
        <ScrollView>
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.greeting}>Merhaba,</ThemedText>
              <ThemedText type="title">{user.firstName}</ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={{
                  uri: user.image || "https://via.placeholder.com/150",
                }}
                style={styles.miniAvatar}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusCard}>
            <ThemedText style={styles.cardLabel}>Pozisyon</ThemedText>
            <ThemedText style={styles.cardTitle}>
              {user.company.title}
            </ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              {user.company.department}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <ThemedText style={styles.boxNumber}>29</ThemedText>
              <ThemedText style={styles.boxLabel}>Yaş</ThemedText>
            </View>
            <View style={styles.infoBox}>
              <ThemedText style={styles.boxNumber}>3</ThemedText>
              <ThemedText style={styles.boxLabel}>Proje</ThemedText>
            </View>
            <View style={styles.infoBox}>
              <ThemedText style={styles.boxNumber}>8.5</ThemedText>
              <ThemedText style={styles.boxLabel}>Puan</ThemedText>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <ThemedText style={styles.boxNumber}>143</ThemedText>
              <ThemedText style={styles.boxLabel}>Satış sayısı</ThemedText>
            </View>
            <View style={styles.infoBox}>
              <ThemedText style={styles.boxNumber}>{user.role}</ThemedText>
              <ThemedText style={styles.boxLabel}>Rol</ThemedText>
            </View>
            <View style={styles.infoBox}>
              <ThemedText style={styles.boxNumber}>
                {user.bloodGroup}
              </ThemedText>
              <ThemedText style={styles.boxLabel}>kan grubu</ThemedText>
            </View>
          </View>
          <Button
            title="Profili Görüntüle"
            color="gray"
            onPress={() => {
              router.push("/profile");
            }}
          ></Button>
          <ThemedView style={styles.logoutBtn}>
            <Button title="Çıkış Yap" onPress={handleLogout} color="red" />
          </ThemedView>
        </ScrollView>
      ) : (
        <ThemedText>Kullanıcı bilgisi bulunamadı.</ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: "gray",
  },
  miniAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },

  statusCard: {
    backgroundColor: "#007AFF",
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardLabel: {
    color: "#ffffffb3",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  cardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 25,
    backgroundColor: "#9696961a",
    marginHorizontal: 4,
  },
  boxNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  boxLabel: {
    fontSize: 12,
    color: "gray",
  },
  logoutBtn: {
    marginTop: 20,
  },
});

export default HomeScreen;
