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

import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { redirect } from "next/dist/server/api-utils";
import styles from "../styles/Home.module.css";
import { GridItem } from "antd-mobile/es/components/grid/grid";
const Signin: NextPage = () => {
  const [loginError, setLoginError] = useState("");

  // const [visible, setVisible] = useState(false);
  const router = useRouter();
  const session = useSession();

  // if (session !== null && session?.status === "authenticated") {
  //   router.push("/home");
  // }

  // const back = () => {
  //   router.push("/");
  // };

  // // const onFinish = (values: any) => {
  // //   Dialog.alert({
  // //     content: <pre>{JSON.stringify(values, null)}</pre>,
  // //   });
  // // };
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

    // <>
    //   <NavBar onBack={back}>Log In</NavBar>

    //   <Form
    //     name="form"
    //     onFinish={onFinish}
    //     footer={
    //       <>
    //         <div />
    //         <div className="spacer-small" />
    //         <Button block type="submit" color="primary" size="large">
    //           Log in
    //         </Button>
    //       </>
    //     }
    //   >
    //     <Form.Item
    //       rules={[{ required: true }]}
    //       name="username"
    //       // label="username"
    //       help="please type "
    //     >
    //       <Input
    //         className="input"
    //         type="text"
    //         value={username}
    //         onChange={handleUsernameChange}
    //         placeholder="username"
    //         onlyShowClearWhenFocus
    //         clearable
    //       />
    //     </Form.Item>
    //     <Form.Item
    //       rules={[{ required: true }]}
    //       name="password"

    //       // label="password"
    //     >
    //       <div className={styles.password}>
    //         <Input
    //           className={styles.inputPass}
    //           type="password"
    //           value={password}
    //           onChange={handlePasswordChange}
    //           placeholder="password"
    //           type={visible ? "text" : "password"}
    //         />
    //         <div className={styles.eye}>
    //           {!visible ? (
    //             <EyeInvisibleOutline onClick={() => setVisible(true)} />
    //           ) : (
    //             <EyeOutline onClick={() => setVisible(false)} />
    //           )}
    //         </div>
    //       </div>
    //     </Form.Item>
    //   </Form>
    // </>
  );
};

export default Signin;
