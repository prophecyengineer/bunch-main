import { NextPage } from "next";
import ImageUploader, {
  ImageUploadItem,
} from "antd-mobile/es/components/image-uploader";
import { EditFill } from "antd-mobile-icons";
import {
  Modal,
  Button,
  Input,
  TextInput,
  Box,
  PasswordInput,
  Group,
  Avatar,
  Text,
  Space,
} from "@mantine/core";
import {
  Dropzone,
  DropzoneStatus,
  FullScreenDropzone,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";
import router from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import { Web3Storage } from "web3.storage";
const axios = require("axios").default;
// const openRef = useRef<() => void>();
export default function Profile() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Perform localStorage action
    const username = localStorage.getItem("username");
    if (username !== null) {
      setUsername(username);
    }
  }, []);
  console.log("username at profile", username);
  const apiToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdiREVlNjRmQWY5RmJGOEQ3QTM2MzAyNjY5QkY0OTE0MEJmMDFlZTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY0NjI3MDg5ODEsIm5hbWUiOiJidW5jaCJ9.OwG3jsLnWHWRR_FtnUEwQHyHzzBr1KRo1HVbikiyrb8";
  const client = new Web3Storage({ token: apiToken });
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const session = useSession();
  const email = session?.data?.user?.email;
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");

  const form = useForm({
    initialValues: {
      image: "",
      name: "",
      bio: "",
    },
  });

  const onFinish = async () => {
    const name = form.values.name;
    const bio = form.values.bio;

    const data = {
      username: username,
      name: name,
      bio: bio,
      image: image,
    };

    if (data !== null) {
      try {
        await axios.post("/api/edit/profile", data);
        console.log("data", data);
      } finally {
        router.push("/profile");
      }
    }
  };

  const dropzoneChildren = (status: DropzoneStatus) => (
    <Group
      position="center"
      spacing="lg"
      style={{ minHeight: 50, pointerEvents: "none" }}
    >
      <Avatar radius="xl" size="xl" src={null || image} alt="it's me" />
    </Group>
  );
  return (
    <>
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Dropzone
            accept={IMAGE_MIME_TYPE}
            onDrop={async (files) => {
              const imageData = files[0].name;
              const rootCid = await client.put(files, {
                name: "avatar",
                maxRetries: 3,
              });
              setFile(rootCid);
              console.log("rootCID", rootCid);
              await setImage(
                "https://" + `${rootCid}` + ".ipfs.dweb.link/" + `${imageData}`
              );
              return { image };
            }}
          >
            {(status) => dropzoneChildren(status)}
          </Dropzone>
          <Space h="md" />
          <TextInput
            label="Full Name"
            required
            placeholder="Mila Kunis"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Bio"
            placeholder="I like to do human things 👽 "
            {...form.getInputProps("bio")}
          />

          <Group position="right" mt="md">
            <Button type="submit" onClick={onFinish}>
              Add to Profile
            </Button>
          </Group>
        </form>
      </Box>
      {/* <div className={styles.userDetails} block justify="center">
        <Form name="form" onFinish={onFinish}>
          <div>
            <div className="spacer-medium"></div>
            <AutoCenter>
              <Avatar
                className={styles.avatar}
                src={image}
                onClick={() => {}}
                style={{ "--size": "120px" }}
              ></Avatar>
            </AutoCenter>
            <div>
              <AutoCenter>
                <input
                  className="inputimage"
                  type="file"
                  id="input"
                  name="file"
                  multiple
                />
              </AutoCenter>
            </div>
          </div>
          <div className="spacer-medium"></div>

          <Button
            size="large"
            block
            onClick={() => {
              handleUpload();
            }}
          >
            upload image
          </Button>
          <div className="spacer-medium"></div>

          <Form.Item
            rules={[{ required: true }]}
            label="name"
            help="please type your name : John Doe "
          >
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Elon Musk"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            label="bio"
            help="write a cool bio about you "
          >
            <TextArea
              value={bio}
              onChange={handleBioChange}
              placeholder="I am a human I like to do human things 🌍 👽"
            />
          </Form.Item>

          <></>

          <Button block type="submit" color="primary" size="large">
            Submit
          </Button>
        </Form>
      </div> */}
    </>
  );
}
