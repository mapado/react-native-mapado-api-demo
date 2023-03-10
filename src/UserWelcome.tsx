import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useAccessToken } from "./TokenContext";

/**
 * Fetch the current authenticated user and get its firstname and lastname
 */
function useUser() {
  const accessToken = useAccessToken();
  const [user, setUser] = useState(null);

  useEffect(() => {
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
        setUser(body);
      });
  }, [accessToken]);

  return user;
}

export default function UserWelcome() {
  const user = useUser();

  // If the user is still fetching, let's wait
  if (!user) {
    return null;
  }

  // Display a user welcome message
  return (
    <Text style={styles.username}>
      Bienvenue {user.firstname} {user.lastname}
    </Text>
  );
}

const styles = StyleSheet.create({
  username: {
    backgroundColor: "#001c3c",
    color: "#fff",
    padding: 20,
    textAlign: "center",
  },
});
