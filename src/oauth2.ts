import { useState, useEffect } from "react";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
  exchangeCodeAsync,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// expo's AuthSession configuration
const DISCOVERY_CONFIG = {
  // the endpoint to authenticate the user
  authorizationEndpoint: "https://accounts.mapado.com/oauth/v2/auth", // if you are not using expo, you will need to pass the `minisiteId` query parameter in the authentication url.

  // the endpoint to exchange the code for an access token
  tokenEndpoint: "https://oauth2.mapado.com/oauth/v2/token",
};

// this is required to make the AuthSession work on web
WebBrowser.maybeCompleteAuthSession();

// create the redirect uri with `/oauth-callback` as the path.
// this is specific to your application but must match the redirect uri configured in your application on Mapado's application list.
const redirectUri = makeRedirectUri({
  // native: "com.mapado.react-native-mapado-api-demo://oauth-callback",
  path: "oauth-callback",
  scheme: "com.mapado.react-native-mapado-api-demo",
});

type Oauth2HookReturnType = {
  promptAsync: () => unknown;
  accessToken: string | undefined;
  logout: () => void;
};

export function useOauth2Flow(): Oauth2HookReturnType {
  // helper to log the redirect uri in your console to see that it DOES match your configuration
  console.log({ redirectUri });

  // For the demo to be simple, we store the access token in the App component.
  // You probably don't want to do that in your application, but use a more robust and secured storage like Expo SecureStore https://docs.expo.dev/versions/v48.0.0/sdk/securestore/
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  // helper to logout our authenticated user
  const logout = () => {
    setAccessToken(null);
  };

  // This is how Expo AuthSession handle oauth2 authentication for us.
  // See https://docs.expo.dev/versions/latest/sdk/auth-session/
  // If you are on a web app, a custom react-native, android, ios app, or any other platform, you can still use the oauth2 mechanism with the Mapado API.
  // In that case, please refer to your platform documentation to see how to handle the oauth2 authentication.
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: process.env.CLIENT_ID,
      scopes: [process.env.SCOPES],
      redirectUri,
      extraParams: {
        // this extra parameter MUST be set, as your user are authenticated on your minisite and not on the Mapado global platform.
        minisiteId: `${process.env.MINISITE_ID}`,
      },
    },
    DISCOVERY_CONFIG
  );

  useEffect(() => {
    if (response && response.type === "success") {
      // after your user has successfully logged in, you can exchange the code for an access token.
      // this is handled by the expo `exchangeCodeAsync` method here, but you can also do it yourself as it does implements Oauth2 specification.
      exchangeCodeAsync(
        {
          code: response.params.code,
          redirectUri,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
        },
        DISCOVERY_CONFIG
      ).then((token) => {
        setAccessToken(token.accessToken);
      });
    }
  }, [response]);

  return {
    promptAsync,
    accessToken,
    logout,
  };
}
