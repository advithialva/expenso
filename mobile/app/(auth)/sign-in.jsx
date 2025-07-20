import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Client-side validation
    if (!emailAddress.trim()) {
      setError("Please enter an email address");
      return;
    }
    
    if (!password) {
      setError("Please enter a password");
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      setError(""); // Clear any previous errors
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Sign-in incomplete. Please try again.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("No account found with this email address.");
      } else if (err.errors?.[0]?.code === "form_identifier_invalid") {
        setError("Please enter a valid email address.");
      } else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError("An error occurred during sign-in. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: COLORS.background }} // Unified background color
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 10 }} // Balanced padding
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.container}>
        <Image source={require("../../assets/images/image1.png")} style={[styles.illustration, { marginBottom: 20 }]} />
        <Text style={[styles.title, { fontSize: 26, fontWeight: "bold", color: COLORS.primary }]}>Welcome Back</Text>

        {error && typeof error === "string" ? (
          <View style={[styles.errorBox, { borderRadius: 12, padding: 12, backgroundColor: COLORS.lightRed }]}> // Refined error box design
            <Ionicons name="alert-circle" size={22} color={COLORS.expense} />
            <Text style={[styles.errorText, { fontSize: 16, color: COLORS.white }]}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, { borderRadius: 12, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }]} // Unified input field design
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={COLORS.placeholderText}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          backgroundColor={COLORS.black} // Explicitly set
        />

        <TextInput
          style={[styles.input, { borderRadius: 12, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }]} // Unified input field design
          value={password}
          placeholder="Enter password"
          placeholderTextColor={COLORS.placeholderText}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          backgroundColor={COLORS.black} // Explicitly set background color to black
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: "linear-gradient(90deg, #4CAF50, #81C784)", borderRadius: 20, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 10, borderWidth: 2, borderColor: COLORS.primary }]} onPress={onSignInPress}> // Enhanced button visibility
          <Text style={[styles.buttonText, { fontSize: 18, fontWeight: "bold", color: COLORS.white }]}>Sign In</Text>
        </TouchableOpacity>

        <View style={[styles.footerContainer, { marginTop: 20 }]}> // Adjusted spacing for footer
          <Text style={[styles.footerText, { fontSize: 14, color: COLORS.text }]}>Don&apos;t have an account?</Text>

          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, { fontSize: 14, color: COLORS.primary }]}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}