import { Button, View } from "react-native";

type Props = {
  onLogin: () => unknown;
};

/**
 * A simple login button
 */
export default function Login({ onLogin }: Props): JSX.Element {
  return (
    <View>
      <Button
        color="#00859c"
        onPress={onLogin}
        title="Se connecter avec Mapado"
      />
    </View>
  );
}
