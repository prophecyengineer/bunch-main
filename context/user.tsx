import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";

const UserStateContext = createContext({
  name: "Jane",
  username: "Doe",
  bio: "a first bio",
  isActive: 1,
  email: "jane@example.com",
});

export function UserProvider({ children }) {
  const session = useSession();
  console.log("session hello", session);
  const userToken = session?.data?.user?.userToken;
  const username = session?.data?.user?.username;
  const [user, setUser] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  if (username !== null) {
    const stream = require("getstream");
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
    const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
    const client = stream.connect(apiKey, userToken, appId);
    useEffect(() => {
      getUser();
    }, []);
    async function getUser() {
      try {
        const userFallback = await client.user(username).get();
        setUser(userFallback);
        //   console.log("user from stream", userFallback);
      } catch (err) {
        console.log(err);
      }
    }

    const state = {
      user,
    };

    return (
      <UserStateContext.Provider value={state}>
        {children}
      </UserStateContext.Provider>
    );
  }
}

export function useUserState() {
  const state = useContext(UserStateContext);
  if (state === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return state;
}
