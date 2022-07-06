/// where we arrange steps of forms

import { NextPage } from "next";
import Username from "./Username";
import { Modal, Button, Input } from "@mantine/core";

import styles from "../../styles/Home.module.css";
import router from "next/router";
import { useState } from "react";
import { signIn } from "next-auth/react";
const axios = require("axios").default;

//here we take the username, auth the user and send them off to next steps to building their profile, adding the info to db as we go.

const Email = () => {
  const username = localStorage.getItem("username");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  // const onFinish = async () => {
  //   const data = {
  //     email: email,
  //     password: password,
  //     username: username,
  //   };

  //   await axios.post("/api/auth/signup/signup-email", data);
  //   signIn("credentials", {
  //     username,
  //     password,
  //     callbackUrl: `${window.location.origin}/signup/Profile`,
  //     redirect: false,
  //   })
  //     .then(function (result) {
  //       router.push(result.url);
  //     })
  //     .catch((err) => {
  //       alert("Failed to register: " + err.toString());
  //     });
  // };

  const back = () => {
    router.push("/");
  };
  return (
    <>
      {/* <NavBar onBack={back}></NavBar>
      <h2 className={styles.title}>sign up with...</h2>
      <div className="spacer-medium"></div>
      <Form
        name="form"
        onFinish={onFinish}
        footer={
          <>
            <div />
            <div className="spacer-small" />
            <Button block type="submit" color="primary" size="large">
              sumbit
            </Button>
          </>
        }
      >
        <Form.Item
          rules={[{ required: true }]}
          help="please type your email address "
        >
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email"
          />
        </Form.Item>
        <Form.Item rules={[{ required: true }]}>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="password"
          />
        </Form.Item>
      </Form> */}
    </>
  );
};

export default Email;
