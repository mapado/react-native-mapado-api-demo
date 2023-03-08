import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
// import {
//   AsyncStorageInterface,
//   AuthorizationCodeFlowTokenGenerator,
//   TokenStorage,
// } from "rest-client-sdk";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
  exchangeCodeAsync,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

const CLIENT_ID = "1059_1hu7bnhnb1i8cgskwgcws4gsckowcswk8scgkk44w0gcwosows";
const CLIENT_SECRET = "3e0lbg0ta2o0gg0kg88k8sc840ssoccw08k40ws4ss4ckwc00g";
const SCOPES = "ticketing:events:read";

const discovery = {
  authorizationEndpoint: "https://accounts.mapado.com/oauth/v2/auth",
  tokenEndpoint: "https://oauth2.mapado.com/oauth/v2/token",
};

// function createTokenStorage({ redirectUri }) {
//   const authCodeFlowConfig = {
//     path: "oauth2.mapado.com/oauth/v2/token",
//     scheme: "https",
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     redirectUri,
//     scope: SCOPES,
//   };

//   const tokenGenerator = new AuthorizationCodeFlowTokenGenerator(
//     authCodeFlowConfig
//   ); // Some token generators are defined in `src/TokenGenerator/`
//   const storage: AsyncStorageInterface = {
//     setItem: SecureStore.setItemAsync,
//     getItem: SecureStore.getItemAsync,
//     removeItem: SecureStore.deleteItemAsync,
//   };
//   const tokenStorage = new TokenStorage(tokenGenerator, storage);

//   return tokenStorage;
// }

const redirectUri = makeRedirectUri({
  // native: "react-native-mapado-api-demo://oauth-callback",
  path: "oauth-callback",
  scheme: "react-native-mapado-api-demo",
});

// const tokenStorage = createTokenStorage({ redirectUri });

export default function App() {
  console.log({ redirectUri });

  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: CLIENT_ID,
      scopes: [SCOPES],
      redirectUri,
      extraParams: {
        theme: "pro",
        // minisiteId: "4007",
        // origin: "minisite_account",
      },
    },
    discovery
  );

  const fetchUser = async (accessToken: string) => {
    fetch(
      "https://ticketing.mapado.net/v1/me?fields=@id,firstname,lastname,email",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((body) => {
        console.log(body);

        setUser(body);
      });
  };

  React.useEffect(() => {
    if (response && response.type === "success") {
      console.log(response.params);
      exchangeCodeAsync(
        {
          code: response.params.code,
          redirectUri,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
        },
        discovery
      ).then((token) => {
        console.log(token);

        fetchUser(token.accessToken);
      });
      // tokenStorage
      //   .generateToken(response.params)
      //   .then((token) =>
      //     fetch(
      //       "https://ticketing.mapado.net/v1/me?fields=@id,firstname,lastname,email",
      //       {
      //         headers: {
      //           Authorization: `Bearer ${token.access_token}`,
      //         },
      //       }
      //     )
      //   )
      //   .then((response) => response.json())
      //   .then((body) => {
      //     console.log(body);

      //     setUser(body);
      //   });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      {/* <StatusBar style="auto" /> */}

      {user ? (
        <View>
          <Text>
            Bienvenue {user.firstname} {user.lastname}
          </Text>
          <Button onPress={() => setUser(null)} title="Logout" />
        </View>
      ) : (
        <Button
          disabled={!request}
          onPress={() => promptAsync()}
          title="Login using AuthSession"
        />
      )}
    </View>
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
