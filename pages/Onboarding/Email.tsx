import {
  Modal,
  Button,
  Input,
  TextInput,
  Box,
  PasswordInput,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";

import router from "next/router";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
const axios = require("axios").default;

//here we take the username, auth the user and send them off to next steps to building their profile, adding the info to db as we go.

const Email = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localname = localStorage.getItem("username");
      setUsername(localname);
    }
  }, []);

  const onFinish = async () => {
    const email = form.values.email;
    const password = form.values.password;
    const data = {
      email: email,
      password: password,
      username: username,
    };
    await axios.post("/api/signup/signup-email", data);
    signIn("credentials", {
      username,
      password,
      callbackUrl: `${window.location.origin}/Onboarding/Profile`,
      redirect: false,
    })
      .then(function (result) {
        router.push(result.url);
      })
      .catch((err) => {
        alert("Failed to register: " + err.toString());
      });
  };

  const form = useForm({
    initialValues: {
      email: "",
      password: "secret",
    },
  });
  return (
    <>
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            required
            placeholder="email"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Password"
            {...form.getInputProps("password")}
          />

          <Group position="right" mt="md">
            <Button type="submit" onClick={onFinish}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
};

export default Email;
