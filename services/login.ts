import { API_LOGIN } from "@/constants/config";
import { loginUser } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
export const handleLogin = async (username: string, password: string) => {
  const user: loginUser = {
    username: username,
    password: password,
    expiresInMins: 30,
  };
  try {
    const response = await axios.post(API_LOGIN, user, { timeout: 10000 });
    const data = response.data;
    if (data.accessToken) {
      await AsyncStorage.setItem("user_Token", data.accessToken);
      return true;
    } else throw new Error("token hatası");
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Bir hata oluştu",
      text2: error?.message,
    });
    /* console.error("Bir hata oluştu:", error); */
    return false;
  }
};
