import { createContext, useContext } from "react";

const TokenContext = createContext<string | undefined>(undefined);

type Props = {
  accessToken: string | undefined;
  children: React.ReactNode;
};

export function TokenContextProvider({
  children,
  accessToken,
}: Props): JSX.Element {
  return (
    <TokenContext.Provider value={accessToken}>
      {children}
    </TokenContext.Provider>
  );
}

export function useAccessToken(): string {
  const value = useContext(TokenContext);

  if (typeof value === "undefined") {
    throw new Error(
      "useAccessToken must be used within a TokenContextProvider"
    );
  }

  return value;
}
