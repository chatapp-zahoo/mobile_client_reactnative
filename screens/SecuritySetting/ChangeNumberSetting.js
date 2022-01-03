import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import Toast from "react-native-root-toast";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { useSelector } from "react-redux";
import { postDataAPI } from "../../api";

export default function ChangeNumberSetting() {
  const navigation = useNavigation();
  const { token, user } = useSelector((state) => state.auth);

  const { colors } = useTheme();

  const [sdt, setSDT] = useState("");
  const [currPass, setCurrPass] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSend, setOtpSend] = useState("");

  const showNofication = (nofiText) => {
    Toast.show(nofiText ? nofiText : "", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      containerStyle: {
        backgroundColor: "#fff",
        borderRadius: 200,
        marginBottom: 30,
        paddingHorizontal: 20,
        shadowColor: "#e6e6e6",
        shadowOpacity: 0.5,
      },
      textStyle: {
        color: "#000",
      },
    });
  };

  const handleSendOTP = async () => {
    try {
      if (sdt.length < 10 || sdt.length > 10) {
        showNofication("Số điện thoại không hợp lệ");
        return;
      }

      const r = await postDataAPI("auth/check-numberphone", {
        phoneNumber: sdt,
      });

      if (r.data.msg) {
        const data = {
          phoneNumber: "84" + sdt.slice(1),
        };
        const res = await postDataAPI("auth/send-sms", data);
        setOtpSend(res.data.oneTimePassword);
        showNofication("Mã xác nhận đã được gửi");
      } else {
        showNofication("Số điện thoại đã được đăng ký");
      }
    } catch (error) {}
  };

  const handleUpdateSDT = async () => {
    if (otp.length < 6) {
      showNofication("Mã xác nhận không hợp lệ");
      return;
    }

    try {
      if (otp == otpSend) {
        const data = {
          phoneNumber: sdt,
          password: currPass,
        };
        const res = await postDataAPI(
          "users/change-phone/" + user._id,
          data,
          token
        );

        showNofication(res.data.msg);

        setTimeout(() => {
          navigation.navigate("AccountSettingScreen");
        }, 500);
      } else {
        showNofication("Mã xác nhận không chính xác");
      }
    } catch (error) {
      showNofication("Thất bại");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.action}>
        <MaterialCommunityIcons
          name="account-key"
          color={colors.text}
          size={20}
          style={[styles.icon, { marginRight: 8 }]}
        />
        <TextInput
          placeholder="Mật khẩu hiện tại"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          onChangeText={(pass) => setCurrPass(pass)}
        />
      </View>
      <View style={styles.action}>
        <AntDesign
          name="mobile1"
          color={colors.text}
          size={20}
          style={[styles.icon, { marginRight: 8 }]}
        />
        <TextInput
          placeholder="Số điện thoại mới"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          onChangeText={(e) => setSDT(e)}
        />
        <TouchableOpacity onPress={() => handleSendOTP()}>
          <View
            style={{
              backgroundColor: "#60a0af",
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(1.6),
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Gửi mã
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.action}>
        <Feather
          name="message-square"
          color={colors.text}
          size={20}
          style={[styles.icon, { marginRight: 8 }]}
        />
        <TextInput
          placeholder="Mã xác nhận"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          onChangeText={(e) => setOTP(e)}
        />
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: "#60a0af" }]}
        onPress={() => handleUpdateSDT()}
      >
        <Text style={[styles.buttonText]}>Cập nhật</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 40,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 50,
  },
  action: {
    flexDirection: "row",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
    borderWidth: 0,
    height: responsiveHeight(6),
    fontSize: responsiveFontSize(2),
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
  },
  buttonText: {
    textAlign: "center",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    color: "#fff",
  },
});
