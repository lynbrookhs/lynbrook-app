import { Formik } from "formik";
import React from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import APIError from "../../components/APIError";
import Divider from "../../components/Divider";
import Stack from "../../components/Stack";
import { useRegisterAsGuest } from "../../helpers/api/auth";
import { GuestRegisterModalProps } from "../../navigation/AuthNavigator";

const GuestRegisterModal = ({ navigation }: GuestRegisterModalProps) => {
  const { registerAsGuest, error } = useRegisterAsGuest();

  return (
    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={tw`flex-1`}>
      <ScrollView>
        <Pressable onPress={Keyboard.dismiss} style={tw`flex-1 justify-center p-8`}>
          <Formik
            initialValues={{ email: "", password: "", re_password: "" }}
            onSubmit={registerAsGuest}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <Stack spacing={8}>
                <Text style={tw`text-3xl font-bold text-center`}>Guest Registration</Text>

                {error && <APIError error={error} style={tw`m-0`} />}

                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <Text style={tw`text-sm font-medium text-gray-700`}>Email Address</Text>
                    <TextInput
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      placeholder="Enter email address"
                      keyboardType="email-address"
                      autoCompleteType="email"
                      textContentType="emailAddress"
                      style={tw`bg-white py-2 px-4 border border-gray-300 rounded-md`}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Text style={tw`text-sm font-medium text-gray-700`}>Create Password</Text>
                    <TextInput
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      placeholder="Create password"
                      autoCompleteType="password"
                      textContentType="newPassword"
                      secureTextEntry={true}
                      style={tw`bg-white py-2 px-4 border border-gray-300 rounded-md`}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Text style={tw`text-sm font-medium text-gray-700`}>Verify Password</Text>
                    <TextInput
                      onChangeText={handleChange("re_password")}
                      onBlur={handleBlur("re_password")}
                      value={values.re_password}
                      placeholder="Repeat password"
                      autoCompleteType="password"
                      textContentType="password"
                      secureTextEntry={true}
                      style={tw`bg-white py-2 px-4 border border-gray-300 rounded-md`}
                    />
                  </Stack>

                  <Button title="Register" onPress={() => handleSubmit()} />

                  <Divider />

                  <Button
                    title="Already have an account?"
                    onPress={() => navigation.replace("GuestLogin")}
                  />
                </Stack>
              </Stack>
            )}
          </Formik>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GuestRegisterModal;
