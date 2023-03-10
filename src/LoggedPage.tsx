import { Button, StyleSheet, View, Text } from "react-native";
import TicketingList from "./TicketingList";
import UserWelcome from "./UserWelcome";

type Props = {
  onLogout: () => void;
};

export default function LoggedPage({ onLogout }) {
  return (
    <View style={styles.container}>
      <UserWelcome />
      <TicketingList />

      <Button color="#00859c" onPress={onLogout} title="Logout" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
