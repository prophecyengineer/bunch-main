import { Button, Container, Center, Title, Stack } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import Username from "./Onboarding/Username";

const Home: NextPage = () => {
  return (
    <Container>
      <Center style={{ width: 350, height: 500 }}>
        <Stack spacing="lg">
          <Title order={1}>Sign up for another social media lol 🙄</Title>
          <Username />
        </Stack>
      </Center>
    </Container>
  );
};

export default Home;
