import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Login from "./Login";
import LoggedPage from "./LoggedPage";
import { TokenContextProvider } from "./TokenContext";
import { useOauth2Flow } from "./oauth2";

/**
 * This is the Demo application entry point.
 * It is a simple React Native application that uses Expo.
 */
export default function App() {
  const { promptAsync, accessToken, logout } = useOauth2Flow();

  return (
    // We use a TokenContextProvider to share the access token with all the components
    <TokenContextProvider accessToken={accessToken}>
      <View style={styles.container}>
        <StatusBar style="auto" />

        {accessToken ? (
          // if the user is logged in, we display the LoggedPage component
          <LoggedPage onLogout={logout} />
        ) : (
          // if the user is not logged in, we display the Login component
          // if the user want's to login, let's redirect him to the Mapado API authenthication page
          <Login onLogin={() => promptAsync()} />
        )}
      </View>
    </TokenContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
