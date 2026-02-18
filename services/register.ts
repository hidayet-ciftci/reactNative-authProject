import { API_REGISTER, FAKE_TOKEN } from "@/constants/config";
import { user } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

export const handleRegisterUser = async (user: user) => {
  try {
    const response = await axios.post(API_REGISTER, {
      ...user,
      age: Number(user.age),
    });
    const data = response.data;
    if (data.id) {
      await AsyncStorage.setItem("user_Token", FAKE_TOKEN);
      return true;
    } else return false;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Bir hata oluştu",
      text2: error?.message,
    });
    /* console.error(error.message); */
    return false;
  }
};
