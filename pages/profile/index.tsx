/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import styles from "./Profile.module.css";
import React, { useRef } from "react";
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
} from "@mantine/core";
import { MoreOutline, EditFill, PictureOutline } from "antd-mobile-icons";
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
import { useUserState } from "../../context/user";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { Web3Storage } from "web3.storage";

const axios = require("axios").default;

const Profile: NextPage = (props) => {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const [followingListState, setFollowingListState] = useState([]);
  const [followerListState, setFollowerListState] = useState([]);
  const [readOnlyEditState, setReadOnlyEditState] = useState(true);
  const [name, setName] = useState([]);
  const [bio, setBio] = useState([]);
  const [image, setImage] = useState([]);
  const { user } = useUserState();
  const session = useSession();
  console.log("session", session);

  const stream = require("getstream");
  const userToken = session.data?.user?.userToken;
  const client = stream.connect(apiKey, userToken, appId);
  const [followersVisible, setFollowersVisible] = useState(false);
  const [followingVisible, setFollowingVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState("");
  const demoSrc =
    "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60";

  function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdiREVlNjRmQWY5RmJGOEQ3QTM2MzAyNjY5QkY0OTE0MEJmMDFlZTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY0NjI3MDg5ODEsIm5hbWUiOiJidW5jaCJ9.OwG3jsLnWHWRR_FtnUEwQHyHzzBr1KRo1HVbikiyrb8";

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    // return process.env.WEB3STORAGE_TOKEN;
  }

  const web3client = new Web3Storage({ token: getAccessToken() });
  const ref = useRef<HTMLInputElement | null>(null);
  const PicUploader = () => {
    const [fileList, setFileList] = useState<ImageUploadItem[]>([
      {
        url: demoSrc,
      },
    ]);

    return (
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#999999",
        }}
      >
        <input
          className="inputimage"
          type="file"
          id="input"
          name="file"
          ref={ref}
          multiple
        />
        <PictureOutline style={{ fontSize: 32 }} />
      </div>
    );
  };

  const handleUpload = async () => {
    const imageData = ref.current.files[0].name;
    var fileInput = ref.current;
    console.log("fileInput.files", fileInput.files);

    const rootCid = await web3client.put(fileInput.files, {
      name: "avatar",
      maxRetries: 3,
    });

    console.log("rootCID", rootCid);

    await setImage(
      "https://" + `${rootCid}` + ".ipfs.dweb.link/" + `${imageData}`
    );

    console.log("full res", image);

    return { image };
  };

  const handleNameChange = (value: React.SetStateAction<never[]>) => {
    setName(value);
  };

  const handleBioChange = (value: React.SetStateAction<never[]>) => {
    setBio(value);
  };

  // function to to change fields to be editable
  const editProfile = () => {
    setReadOnlyEditState(false);
  };

  // function to change state of save profile
  const saveProfile = () => {
    setReadOnlyEditState(true);
  };

  const onFinish = async (values: any) => {
    const username = user.id;

    const data = {
      name: name,
      username: username,
      bio: bio,
      image: image,
    };

    // console.log("values from form", data);

    await axios.post("/api/userUpdateProfile", data);
  };

  // loading activities and following stats from getStream.io
  useEffect(() => {
    UserFollowing();
    UserFollowers();
  }, []);

  // const { user, setUser } = useUser();
  //when updating user, push data to getstream in userWrapper
  // form submit handler for saving the profile data

  // function pulling follower data from getStream.io
  const UserFollowers = () => {
    // people following the USER feed of currentUser
    const userOne = client.feed("user", client.userId);
    userOne
      .followers()
      .then((res: { results: string | any[] }) => {
        let List = [];
        for (let i = 0; i < res.results.length; i++) {
          const user = res.results[i].feed_id.slice(5);
          List.push(user);
        }
        setFollowerListState(List);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
  const UserFollowing = () => {
    //got the current user info from getstream
    // current user HOME feed follows these people
    const userOne = client.feed("home", client.userId);
    userOne
      .following()
      .then((res: { results: string | any[] }) => {
        let List = [];
        for (let i = 0; i < res.results.length; i++) {
          const user = res.results[i].target_id.slice(5);
          List.push(user);
        }

        setFollowingListState(List);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const followerUser = (userToFollow: any) => {
    const userOne = client.feed("home", client.userId);
    userOne.follow("user", userToFollow);
    UserFollowing();
    UserFollowers();
  };

  const unfollowerUser = (userToUnFollow: any) => {
    const userOne = client.feed("home", client.userId);
    userOne.unfollow("user", userToUnFollow, { keepHistory: true });
    UserFollowing();
    UserFollowers();
  };

  return (
    <>
      <div className={styles.container}>
        <Button
          onClick={() => {
            saveProfile();
          }}
        >
          edit profile
        </Button>

        {readOnlyEditState ? (
          <>
            {/* <Space className={styles.userDetails} block justify="center">
              <Avatar
                className={styles.avatar}
                src={user?.data?.image}
              ></Avatar>
            </Space> */}

            {/* <Space block justify="center" className={styles.title}>
              <h1>{user?.data?.name}</h1>
            </Space> */}
            {/* <Space block justify="center">
              <p>{user?.data?.bio}</p>
            </Space> */}
            <Grid columns={3}>
              <Button
                className={styles.smallButton}
                onClick={() => {
                  setFollowingVisible(true);
                }}
              >
                following {followingListState.length}
              </Button>

              <div>
                <>
                  <Button
                    className={styles.smallButton}
                    onClick={() => {
                      setFollowersVisible(true);
                    }}
                  >
                    followers {followerListState.length}
                  </Button>
                  {/* <Popup
                      visible={followersVisible}
                      onMaskClick={() => {
                        setFollowersVisible(false);
                      }}
                      bodyStyle={{
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        minHeight: "70vh",
                      }}
                    >
                      {followerListState.slice(0, 10).map((follower) => (
                        <Card>
                          <UserBar
                            key={follower}
                            username={follower}
                            // onClickUser={console.log}
                            avatar="https://i.pinimg.com/originals/4f/a1/41/4fa141173a1b04470bb2f850bc5da13b.png"
                            timestamp="2022-04-19T07:44:11+00:00"
                            subtitle="a user following you"
                          />
                          <Button size="xs" onClick={() => unfollowerUser(follower)}>
                  unfollow?
                </Button>
                        </Card>
                      ))}
                    </Popup> */}
                </>
              </div>

              <Button className={styles.smallButton}>subscribers </Button>
            </Grid>
            <>
              {/* <Popup
                visible={followingVisible}
                onMaskClick={() => {
                  setFollowingVisible(false);
                }}
                bodyStyle={{
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  minHeight: "70vh",
                }}
              >
                {followingListState.slice(0, 10).map((following) => (
                  <Card>
                    <UserBar
                      key={following}
                      username={following}
                      // onClickUser={console.log}
                      avatar="https://i.pinimg.com/originals/4f/a1/41/4fa141173a1b04470bb2f850bc5da13b.png"
                      timestamp="2022-04-19T07:44:11+00:00"
                      subtitle="a user following you"
                    />
                    <Button size="xs" onClick={() => unfollowerUser(follower)}>
                  unfollow?
                </Button>
                  </Card>
                ))}
              </Popup> */}
            </>

            <Card bodyClassName={styles.customBody}>
              {readOnlyEditState ? (
                <>
                  <Button
                    onClick={() => {
                      editProfile();
                    }}
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <h1>hey im here</h1>
                // <Form
                //   name="form"
                //   onFinish={onFinish}
                //   footer={
                //     <Button block type="submit" color="primary" size="large">
                //       update profile
                //     </Button>
                //   }
                // >
                //   <Form.Header>Edit Profile</Form.Header>

                //   <Form.Item
                //     name="name"
                //     label="name"
                //     help="please type your name : John Doe "
                //   >
                //     <Input
                //       type="text"
                //       value={name}
                //       onChange={handleNameChange}
                //       placeholder="name"
                //     />
                //   </Form.Item>

                //   <Form.Item
                //     name="bio"
                //     label="bio"
                //     help="please type your bio"
                //   >
                //     <Input
                //       type="text"
                //       value={bio}
                //       onChange={handleBioChange}
                //       placeholder="bio"
                //     />
                //   </Form.Item>
                //   <Form.Item
                //     name="image"
                //     label="image"
                //     help="please paste your img"
                //   >
                //     <Input
                //       type="text"
                //       value={image}
                //       onChange={handleImageChange}
                //       placeholder="paste an image link"
                //     />
                //   </Form.Item>
                // </Form>
              )}
            </Card>

            {/* <Tabs defaultActiveKey="1">
              <Tabs.Tab title="Public Feed" key="1">
                <StreamApp apiKey={apiKey} appId={appId} token={userToken}>
                  <FlatFeed
                    notify
                    feedGroup="user"
                    Activity={(props) => {
                      let activity;
                      if (props.activity?.actor?.data) {
                        activity = {
                          activity: {
                            //give
                            ...props.activity,
                            actor: {
                              data: {
                                name: props.activity.actor.data.name,
                              },
                            },
                          },
                        } as ActivityProps;
                      }

                      return (
                        <Activity
                          {...props}
                          // data={{ name: props.activity.actor.data.id }}
                          activity={activity?.activity || props.activity}
                          Header={() => (
                            <>
                              <List>
                                <List.Item
                                  key="1"
                                  extra={
                                    <Button
                                      onClick={async () => {
                                        const username = user.id;
                                        const client = stream.connect(
                                          apiKey,
                                          userToken,
                                          appId
                                        );

                                        const feed = client.feed(
                                          "user",
                                          username
                                        );

                                        const removed =
                                          await feed.removeActivity(
                                            props.activity.id
                                          );
                                        console.log("removed", removed);
                                      }}
                                    >
                                      <MoreOutline />
                                    </Button>
                                  }
                                  prefix={
                                    <Avatar
                                      src={props.activity.actor.data.image}
                                    />
                                  }
                                  description={props.activity.actor.id}
                                >
                                  {props.activity.actor.data.name}
                                </List.Item>
                              </List>
                            </>
                          )}
                          Footer={() => (
                            <div style={{ padding: "8px 16px" }}>
                              <LikeButton {...props} />
                              <CommentList activityId={props.activity.id} />
                            </div>
                          )}
                        />
                      );
                    }}
                  />
                </StreamApp>
              </Tabs.Tab>
              <Tabs.Tab title="Private Feed" key="2">
                <div className={styles.private} />
                <StreamApp apiKey={apiKey} appId={appId} token={userToken}>
                  <FlatFeed
                    notify
                    feedGroup="private"
                    Activity={(props) => {
                      let activity;
                      if (props.activity?.actor?.data) {
                        activity = {
                          activity: {
                            //give
                            ...props.activity,
                            actor: {
                              data: {
                                name: props.activity.actor.data.name,
                              },
                            },
                          },
                        } as ActivityProps;
                      }

                      return (
                        <Activity
                          {...props}
                          // data={{ name: props.activity.actor.data.id }}
                          activity={activity?.activity || props.activity}
                          Header={() => (
                            <>
                              <List>
                                <List.Item
                                  key="1"
                                  extra={
                                    <Button
                                      onClick={async () => {
                                        const username = user.id;
                                        const client = stream.connect(
                                          apiKey,
                                          userToken,
                                          appId
                                        );

                                        const feed = client.feed(
                                          "private",
                                          username
                                        );

                                        const removed =
                                          await feed.removeActivity(
                                            props.activity.id
                                          );
                                        console.log("removed", removed);
                                      }}
                                    >
                                      <MoreOutline />
                                    </Button>
                                  }
                                  prefix={
                                    <Avatar
                                      src={props.activity.actor.data.image}
                                    />
                                  }
                                  description={props.activity.actor.id}
                                >
                                  {props.activity.actor.data.name}
                                </List.Item>
                              </List>
                            </>
                          )}
                          Footer={() => (
                            <div style={{ padding: "8px 16px" }}>
                              <LikeButton {...props} />
                              <CommentList activityId={props.activity.id} />
                            </div>
                          )}
                        />
                      );
                    }}
                  />
                </StreamApp>
              </Tabs.Tab>
            </Tabs> */}
          </>
        ) : (
          <>
            <div className={styles.userDetails} block justify="center">
              {/* <Form name="form" onFinish={onFinish}>
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
                      <PicUploader />
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
              </Form> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
