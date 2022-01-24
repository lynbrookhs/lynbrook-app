import { Formik } from "formik";
import { Error, useSignInAsGuest } from "lynbrook-app-api-hooks";
import React, { useCallback, useState } from "react";
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
import { GuestLoginModalProps } from "../../navigation/AuthNavigator";

const GuestLoginModal = ({ navigation }: GuestLoginModalProps) => {
  const [error, setError] = useState<Error | undefined>(undefined);
  const { signInAsGuest } = useSignInAsGuest();

  const handleSignIn = useCallback(async (values) => {
    try {
      await signInAsGuest(values);
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <ScrollView>
        <Pressable onPress={Keyboard.dismiss} style={tw`flex-1 justify-center p-8`}>
          <Formik initialValues={{ email: "", password: "" }} onSubmit={handleSignIn}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <Stack spacing={8}>
                <Text style={tw`text-3xl font-bold text-center`}>Guest Login</Text>

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
                    <Text style={tw`text-sm font-medium text-gray-700`}>Password</Text>
                    <TextInput
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      placeholder="Enter password"
                      autoCompleteType="password"
                      textContentType="password"
                      secureTextEntry
                      style={tw`bg-white py-2 px-4 border border-gray-300 rounded-md`}
                    />
                  </Stack>

                  <Button title="Sign In" onPress={() => handleSubmit()} />

                  <Divider />

                  <Button
                    title="Don't have an account?"
                    onPress={() => navigation.replace("GuestRegister")}
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

export default GuestLoginModal;
