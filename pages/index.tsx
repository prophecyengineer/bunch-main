import { Button, Container, Center, Title, Stack } from "@mantine/core";
import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Username from "./Onboarding/Username";

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }
  return (
    <>
      <Container>
        <Center style={{ width: 350, height: 500 }}>
          <Stack spacing="lg">
            Not signed in <br />
            <Button onClick={() => signIn()}>Sign in</Button>
            <Title order={1}>Sign up for another social media lol 🙄</Title>
            <Username />
          </Stack>
        </Center>
      </Container>
    </>
  );
};

export default Home;
