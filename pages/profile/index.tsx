/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import styles from "./Profile.module.css";
import React, { useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Photo,
  MessageCircle,
  Settings,
  Lock,
  Router,
} from "tabler-icons-react";

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
import router, { useRouter } from "next/router";

import { useState, useEffect } from "react";
import { useUserState } from "../../context/user";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { Web3Storage } from "web3.storage";
import Link from "next/link";

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
  console.log("session", user);
  const stream = require("getstream");
  const userToken = session.data?.user?.userToken;
  const client = stream.connect(apiKey, userToken, appId);
  const [followersVisible, setFollowersVisible] = useState(false);
  const [followingVisible, setFollowingVisible] = useState(false);

  const router = useRouter();

  // const handleUpload = async () => {
  //   const imageData = ref.current.files[0].name;
  //   var fileInput = ref.current;
  //   console.log("fileInput.files", fileInput.files);

  //   const rootCid = await web3client.put(fileInput.files, {
  //     name: "avatar",
  //     maxRetries: 3,
  //   });

  //   console.log("rootCID", rootCid);

  //   await setImage(
  //     "https://" + `${rootCid}` + ".ipfs.dweb.link/" + `${imageData}`
  //   );

  //   console.log("full res", image);

  //   return { image };
  // };

  // const handleNameChange = (value: React.SetStateAction<never[]>) => {
  //   setName(value);
  // };

  // const handleBioChange = (value: React.SetStateAction<never[]>) => {
  //   setBio(value);
  // };

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

  const getIframe = (props) => {
    console.log("JSON.parse(props?.activity?.object)", props?.activity?.object);
    return JSON.parse(props?.activity?.object)?.iframe;
  };

  const getVideo = (props) => {
    console.log("JSON.parse(props?.activity?.object)", props?.activity?.object);
    return JSON.parse(props?.activity?.object)?.video;
  };

  return (
    <>
      <div>
        {readOnlyEditState ? (
          <>
            <Avatar className={styles.avatar} src={user?.data?.image}></Avatar>

            <Title>{user?.data?.name}</Title>

            <Text>{user?.data?.bio}</Text>

            <Button
              className={styles.smallButton}
              onClick={() => {
                setFollowingVisible(true);
              }}
            >
              {" "}
              following {followingListState.length}
            </Button>
            <Button
              className={styles.smallButton}
              onClick={() => {
                setFollowersVisible(true);
              }}
            >
              followers {followerListState.length}
            </Button>
            <Link href="/profile/EditProfile">
              <Button>Edit Profile</Button>
            </Link>

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
            {/* </>
              </div>

              <Button className={styles.smallButton}>subscribers </Button>
            </Grid> */}
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

            <Tabs>
              <Tabs.Tab
                label="Public Feed"
                icon={<Photo size={18} strokeWidth={1} color={"white"} />}
              >
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
                        <Card shadow="sm" p="md">
                          <Activity
                            className={styles.activity}
                            {...props}
                            // data={{ name: props.activity.actor.data.id }}
                            activity={activity?.activity || props.activity}
                            Header={() => (
                              <>
                                <Grid>
                                  <Grid.Col span={9}>
                                    <UnstyledButton
                                      onClick={() =>
                                        router.push(
                                          "/" + `${props.activity.actor.id}`
                                        )
                                      }
                                    >
                                      <Group>
                                        <Avatar
                                          size={43}
                                          src={props.activity.actor.data.image}
                                        />
                                        <div>
                                          <Text>
                                            {props.activity.actor.data.name}
                                          </Text>
                                          <Text size="xs" color="gray">
                                            @{props.activity.actor.id}
                                          </Text>
                                        </div>
                                      </Group>
                                    </UnstyledButton>
                                  </Grid.Col>

                                  <Grid.Col span={2}>
                                    <Button
                                      size="xs"
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
                                      delete
                                    </Button>
                                  </Grid.Col>
                                </Grid>
                              </>
                            )}
                            Content={() => (
                              <>
                                <Space h="sm" />
                                {/* {props?.activity?.object.media && (
                                  <img src={props?.activity?.object?.media} />
                                )} */}
                                <iframe src={getVideo(props)} />
                                <img src={getIframe(props)} />
                                <Text>{props?.activity?.object}</Text>
                              </>
                            )}
                            Footer={() => (
                              <div>
                                <LikeButton {...props} />
                                <CommentList activityId={props.activity.id} />
                              </div>
                            )}
                          />
                        </Card>
                      );
                    }}
                  />
                </StreamApp>
              </Tabs.Tab>
              <Tabs.Tab
                key="2"
                label="Private Feed"
                icon={<Lock size={18} strokeWidth={1} color={"white"} />}
              >
                <div className={styles.private} />
              </Tabs.Tab>
            </Tabs>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Profile;
