import CustomInput from "@/components/customInput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { handleLogin } from "@/services/login";
import { fetchUserProfile } from "@/services/token";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
const LoginScreen = () => {
  /*   
  const [username, setUsername] = useState<string>("emilys");
  const [password, setPassword] = useState<string>("emilyspass"); 
  UseForm ile default değerleri aktarıyoruz
  */

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "emilys", // Varsayılan değerleri buraya yazıyoruz
      password: "emilyspass",
    },
  });

  const checkIsLogedIn = async () => {
    const isLogedIn = await fetchUserProfile();
    if (isLogedIn) {
      router.replace("/home");
    }
  };

  useEffect(() => {
    checkIsLogedIn();
  }, []);

  const checkLogin = async (data: { username: string; password: string }) => {
    if (await handleLogin(data.username, data.password)) {
      Toast.show({
        type: "success",
        text1: "Giriş Başarılı",
        text2: "Giriş Sayfasına yönlendiriliyorsunuz",
      });
      setTimeout(() => {
        router.replace("/home");
      }, 1000);
    } else {
      /* console.log("wrong login"); */
      Toast.show({
        type: "error",
        text1: "Giriş Başarısız",
        text2: "Kullanıcı adı veya şifre hatalı ",
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleView}>
        <ThemedText type="title">Giriş yap</ThemedText>
      </ThemedView>
      <CustomInput
        name="username"
        placeholder="Kullanıcı adı"
        control={control}
        rules={{
          required: "kullanici adi zorunludur",
          minLength: { value: 3, message: "en az 3 karakter olmalıdır" },
        }}
      />
      <CustomInput
        name="password"
        placeholder="Şifre"
        secureTextEntry
        control={control}
        rules={{
          required: "Şifre zorunludur",
          minLength: { value: 6, message: "Şifre çok kısa" },
        }}
      />
      <Button title="Giriş Yap" onPress={handleSubmit(checkLogin)} />
      <ThemedView style={styles.register}>
        <ThemedText>Hesabın yok mu? </ThemedText>
        <TouchableOpacity
          onPress={() => {
            router.push("/(auth)/register");
          }}
        >
          <ThemedText type="link">Kayıt ol </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 5 },
  titleView: {
    marginBottom: 25,
    alignItems: "center",
  },
  register: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    gap: 5,
  },
});

export default LoginScreen;
