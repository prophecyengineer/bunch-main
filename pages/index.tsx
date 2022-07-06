import { Button, Container, Center, Title, Stack } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import Username from "./Onboarding/Username";

const Home: NextPage = () => {
  return (
    <Container>
      <Center style={{ width: 400, height: 600 }}>
        <Stack spacing="lg">
          <Title order={1}>Sign in to another social media lol 🙄</Title>
          <Username />
          <Link href="/signin">
            <Button variant="outline">Sign in</Button>
          </Link>
        </Stack>
      </Center>
    </Container>
  );
};

export default Home;
