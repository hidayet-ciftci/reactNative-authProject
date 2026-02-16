import CustomInput from "@/components/customInput";
import { handleRegisterUser } from "@/services/register";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export interface user {
  firstName: string;
  lastName: string;
  age: string;
  username: string;
  password: string;
}
const LoginScreen = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "", // Varsayılan değerleri buraya yazıyoruz
      password: "",
      firstName: "",
      lastName: "",
      age: "",
    },
  });

  const handleRegister = async (data: user) => {
    if (await handleRegisterUser(data)) {
      Toast.show({
        type: "success",
        text1: "kullanıcı kayıt edildi",
        text2: "giriş sayfasına yönlendirliyorsunuz",
      });
      setTimeout(() => {
        router.push({
          pathname: "/profile",
        });
      }, 1000);
    } else {
      Toast.show({
        type: "error",
        text1: "kullanıcı kayıt edilemedi",
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>kayıt ol</Text>
      </View>
      <CustomInput
        name="firstName"
        placeholder="isim"
        control={control}
        rules={{
          required: "isim zorunludur",
          minLength: { value: 3, message: "en az 3 karakter olmalıdır" },
        }}
      />
      <CustomInput
        name="lastName"
        placeholder="soy isim"
        control={control}
        rules={{
          required: "Soy isim zorunludur",
          minLength: { value: 3, message: "en az 3 karakter olmalıdır" },
        }}
      />
      <CustomInput
        name="age"
        placeholder="yaşınızı giriniz"
        control={control}
        keyboardType="numeric"
        rules={{
          required: "yaş zorunludur",
          min: { value: 18, message: "yaşınız 18'den büyük olmalıdır." },
          max: { value: 99, message: "yaşınız 99'dan küçük olmalıdır." },
          pattern: {
            value: /^[0-9]+$/,
            message: "Lütfen sadece sayı giriniz",
          },
        }}
      />
      <CustomInput
        name="username"
        placeholder="Kullanıcı adını giriniz"
        control={control}
        rules={{
          required: "Kullanıcı adı zorunludur",
          minLength: { value: 3, message: "en az 3 karakter olmalıdır" },
        }}
      />
      <CustomInput
        name="password"
        placeholder="şifreyi giriniz"
        secureTextEntry
        control={control}
        rules={{
          required: "şifre zorunludur",
          minLength: { value: 6, message: "en az 6 karakter olmalıdır" },
        }}
      />
      <Button title="Kayıt ol" onPress={handleSubmit(handleRegister)} />
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
