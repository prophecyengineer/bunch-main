import type { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import "react-activity-feed/dist/index.css";
import { connect } from "getstream";
import {
  Modal,
  Button,
  Dialog,
  Grid,
  Input,
  Image,
  Space,
  Text,
  Card,
  Tabs,
  Avatar,
  List,
  Title,
  Group,
  UnstyledButton,
  TextInput,
} from "@mantine/core";
import {
  StreamApp,
  NotificationDropdown,
  FlatFeed,
  LikeButton,
  Activity,
  CommentList,
  CommentField,
  StatusUpdateForm,
  FollowButton,
  NotificationFeed,
} from "react-activity-feed";
import stream from "getstream";
import { useContext, useEffect, useState } from "react";
import { useUserState } from "../../context/user";
import { Web3Storage } from "web3.storage";
import { useForm } from "@mantine/hooks";
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;

const Post = () => {
  const { user } = useUserState();
  const session = useSession();
  const userToken = session.data?.user?.userToken;
  const apiToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdiREVlNjRmQWY5RmJGOEQ3QTM2MzAyNjY5QkY0OTE0MEJmMDFlZTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY0NjI3MDg5ODEsIm5hbWUiOiJidW5jaCJ9.OwG3jsLnWHWRR_FtnUEwQHyHzzBr1KRo1HVbikiyrb8";
  const client = new Web3Storage({ token: apiToken });
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [file, setFile] = useState("");

  async function handleVideoUpload() {
    const videoData = document.getElementById("inputvideo").files[0].name;

    console.log("first part", videoData.name);
    var fileInput = document.getElementById("inputvideo");

    const rootCid = await client.put(fileInput.files, {
      name: "avatar",
      maxRetries: 3,
    });

    setFile(rootCid);
    console.log("rootCID", rootCid);

    await setVideo(
      "https://" + `${rootCid}` + ".ipfs.dweb.link/" + `${videoData}`
    );

    console.log("full video", video);

    return { video };
  }
  async function handleUpload() {
    const imageData = document.getElementById("input").files[0].name;

    console.log("first part", imageData.name);
    var fileInput = document.getElementById("input");

    const rootCid = await client.put(fileInput.files, {
      name: "avatar",
      maxRetries: 3,
    });

    setFile(rootCid);
    console.log("rootCID", rootCid);

    await setImage(
      "https://" + `${rootCid}` + ".ipfs.dweb.link/" + `${imageData}`
    );

    console.log("full res");
    console.log("full image", image);

    return { image };
  }

  const [username, setUsername] = useState("");

  useEffect(() => {
    // Perform localStorage action
    const username = localStorage.getItem("username");
    if (username !== null) {
      setUsername(username);
    }
  }, []);

  const form = useForm({
    initialValues: {
      image: "",
      title: "cool title",
    },
  });

  const onFinish = async () => {
    const title = form.values.title;
    // console.log("hiys", title, image);
    // // const bio = form.values.bio;

    const data = {
      title: title,
      image: image,
    };

    if (data !== null) {
      try {
        await axios.post("/api/post/UserFeed", data);
        console.log("data", data);
      } finally {
        console.log("posted");
      }
    }
  };

  return (
    <>
      <div>
        <input
          className="inputimage"
          type="file"
          id="input"
          name="file"
          multiple
        />
        <Button
          size="md"
          onClick={() => {
            handleUpload();
          }}
        >
          image
        </Button>
        <input
          className="inputimage"
          type="file"
          id="inputvideo"
          name="file"
          multiple
        />
        <Button
          size="md"
          onClick={() => {
            handleVideoUpload();
          }}
        >
          video
        </Button>

        <form>
          <TextInput
            label="title"
            placeholder="cool title "
            {...form.getInputProps("title")}
          />

          <Group position="right" mt="md">
            <Button onClick={onFinish}>upload activity</Button>
          </Group>
        </form>
        <StreamApp apiKey={apiKey} appId={appId} token={userToken}>
          <StatusUpdateForm />
        </StreamApp>
      </div>
    </>
  );
};

export default Post;
