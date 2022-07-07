/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import styles from "./profile/Profile.module.css";
import * as React from "react";
import { useRouter } from "next/router";
import { prisma, PrismaClient } from "@prisma/client";

import { useSession } from "next-auth/react";
import {
  Modal,
  Button,
  Dialog,
  Grid,
  Input,
  Image,
  Space,
  Card,
  Tabs,
  Avatar,
  List,
  Popup,
  Badge,
} from "@mantine/core";
import "react-activity-feed/dist/index.css";
import {
  StreamApp,
  NotificationDropdown,
  FlatFeed,
  LikeButton,
  Activity,
  CommentList,
  CommentField,
  StatusUpdateForm,
  ActivityProps,
  UserBar,
} from "react-activity-feed";
import { useState, useEffect } from "react";
import { useUserState } from "../context/user";
import router from "next/router";
import stream from "stream";

const axios = require("axios").default;
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;

const PublicProfile: NextPage = (props) => {
  const { user } = useUserState();
  const query = router.query;
  // const uid = query.uid;

  // console.log("thing i queried", query.user);

  // i want to see a certain persons page
  //got to go get user from query

  const session = useSession();
  const userName = session?.data?.user?.username;

  const stream = require("getstream");
  const userToken = session.data?.user?.userToken;
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const client = stream.connect(apiKey, userToken, appId);

  // const [user, setUser] = useState();
  const [fetchedData, setFetchedData] = useState([]);

  //takes a few refreshes to load in
  useEffect(() => {
    const getData = async () => {
      const data = await client.user(query.user).get();
      setFetchedData(data);
    };
    getData();
  }, []);
  //load once only

  console.log("fetchedData", fetchedData);

  // const searchUserToken = fetchedData?.token;
  // console.log("user", user);

  return (
    <>
      <Avatar className={styles.avatar} src={fetchedData?.data?.image}></Avatar>

      <h1>{fetchedData?.data?.name}</h1>

      <p>{fetchedData?.data?.bio}</p>
    </>
  );
};

export default PublicProfile;
