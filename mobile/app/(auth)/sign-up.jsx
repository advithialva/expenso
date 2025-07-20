import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { styles } from "@/assets/styles/auth.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress.trim()) {
      setError(<Text>Please enter an email address</Text>);
      return;
    }

    if (!password) {
      setError(<Text>Please enter a password</Text>);
      return;
    }

    if (password.length < 8) {
      setError(<Text>Password must be at least 8 characters long</Text>);
      return;
    }

    try {
      setError("");
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error("Sign-up error:", err);

      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError(<Text>That email address is already in use. Please try another.</Text>);
      } else if (err.errors?.[0]?.code === "form_password_pwned") {
        setError(
          <Text>This password has been found in an online data breach. Please use a different password.</Text>
        );
      } else if (err.errors?.[0]?.code === "form_password_length_too_short") {
        setError(<Text>Password must be at least 8 characters long.</Text>);
      } else if (err.errors?.[0]?.code === "form_identifier_invalid") {
        setError(<Text>Please enter a valid email address.</Text>);
      } else if (err.errors?.[0]?.message) {
        setError(<Text>{err.errors[0].message}</Text>);
      } else {
        setError(<Text>An error occurred during sign-up. Please try again.</Text>);
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    try {
      setError("");
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", JSON.stringify(err, null, 2));

      if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("Incorrect verification code. Please try again.");
      } else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError("Verification failed. Please try again.");
      }
    }
  };

  const onResendPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setError("");
    } catch (err) {
      console.error("Resend error:", err);
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError("Failed to resend code. Please try again.");
      }
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <TouchableOpacity
          style={[styles.backButton, { position: 'absolute', top: 30, left: 35 }]}
          onPress={() => setPendingVerification(false)}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.verificationTitle}>Verify your email</Text>
        <Text style={styles.verificationSubtitle}>
          We sent a verification code to {emailAddress}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={COLORS.placeholderText}
          onChangeText={(code) => setCode(code)}
        />

        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resendButton, { marginTop: 20, paddingVertical: 12, paddingHorizontal: 20 }]}
        >
          <Text style={[styles.resendButtonText, { fontSize: 16, color: COLORS.text }]}>Didn't receive the code? <Text onPress={onResendPress} style={{ color: COLORS.primary, fontWeight: 'bold' }}>Resend</Text></Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/image2.png")}
            style={[styles.illustration, { marginBottom: 20 }]}
          />
          <Text
            style={[styles.title, { fontSize: 26, fontWeight: "bold", color: COLORS.primary }]}
          >
            Create Account
          </Text>

          {error ? (
            <View
              style={[
                styles.errorBox,
                {
                  borderRadius: 12,
                  padding: 12,
                  backgroundColor: COLORS.lightRed,
                },
              ]}
            >
              <Ionicons name="alert-circle" size={22} color={COLORS.expense} />
              <Text
                style={[
                  styles.errorText,
                  { fontSize: 16, color: COLORS.white },
                ]}
              >
                {error}
              </Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
            style={[
              styles.input,
              {
                borderRadius: 12,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
              },
            ]}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor={COLORS.placeholderText}
            onChangeText={(email) => setEmailAddress(email)}
            backgroundColor={COLORS.black}
          />

          <TextInput
            style={[
              styles.input,
              {
                borderRadius: 12,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
              },
            ]}
            value={password}
            placeholder="Enter password"
            placeholderTextColor={COLORS.placeholderText}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            backgroundColor={COLORS.black}
          />

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "linear-gradient(90deg, #4CAF50, #81C784)",
                borderRadius: 20,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 10,
                borderWidth: 2,
                borderColor: COLORS.primary,
              },
            ]}
            onPress={onSignUpPress}
          >
            <Text
              style={[
                styles.buttonText,
                { fontSize: 18, fontWeight: "bold", color: COLORS.white },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>

          <View style={[styles.footerContainer, { marginTop: 20 }]}>
            <Text style={[styles.footerText, { fontSize: 14, color: COLORS.text }]}>Already have an account?</Text>

            <TouchableOpacity onPress={() => router.replace("/sign-in")}>
              <Text style={[styles.linkText, { fontSize: 14, color: COLORS.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}