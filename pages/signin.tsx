import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  PasswordInput,
  Dialog,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const Signin: NextPage = () => {
  const [loginError, setLoginError] = useState("");

  const router = useRouter();
  const session = useSession();

  const form = useForm({
    initialValues: {
      username: "",
      password: "secret",
    },
  });

  const username = form.values.username;
  const password = form.values.password;

  const onFinish = () => {
    signIn("credentials", {
      username,
      password,
      callbackUrl: `${window.location.origin}/home`,
      redirect: false,
    }).then(function (result) {
      if (result.error !== null) {
        if (result.status === 401) {
          setLoginError(
            "Your username/password combination was incorrect. Please try again"
          );
        } else {
          setLoginError(result.error);
        }
      } else {
        router.push(result.url);
      }
    });
  };
  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          required
          label="username"
          placeholder="username"
          {...form.getInputProps("username")}
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
  );
};

export default Signin;
