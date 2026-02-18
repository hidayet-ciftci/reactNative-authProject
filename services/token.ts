import { API_PROFILE } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("user_Token");
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Token hatası",
      });
      return null;
    }
    const response = await axios.get(API_PROFILE, {
      // axios ile -> url , data , config
      headers: { Authorization: "Bearer " + token },
      timeout: 10000,
    });
    const data = response.data;
    if (data.id) {
      return data;
    } else throw new Error("empty data");
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Bir hata oluştu",
      text2: error?.message,
    });
    /* console.error("Profil Yükleme Hatası:", error); */
    return null;
  }
};
