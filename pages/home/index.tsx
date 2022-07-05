import type { NextPage } from "next";
import Head from "next/head";
import styles from "./Home.module.css";
import * as React from "react";
import { useState } from "react";
import { PrismaClient } from "@prisma/client";
import "react-activity-feed/dist/index.css";
import { connect } from "getstream";
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
  ActivityProps,
} from "react-activity-feed";
import stream from "getstream";
import { signOut, useSession } from "next-auth/react";
import { Button, Dialog, Card, Divider, Avatar } from "@mantine/core";

const Home = () => {
  const session = useSession();
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const userToken = session.data?.user?.userToken;
  const username = session.data?.user?.username;
  const [followingListState, setFollowingListState] = useState([]);

  // Connection to client for getStream.io
  // const client = stream.connect(apiKey, userToken, appId);

  // function pulling following data from getStream.io

  console.log("userToken", userToken);

  //   const currentUser = client.feed(
  //     "user",
  //     "globalUser",
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0"
  //   );

  const followingList = [
    {
      username: username.tiya,
    },
    { username: username.alex },
  ];

  // const UserFollowers = () => {
  //   // people following the USER feed of currentUser
  //   const userOne = client.feed("user", client.userId);
  //   userOne
  //     .followers()
  //     .then((res: { results: string | any[] }) => {
  //       let List = [];
  //       for (let i = 0; i < res.results.length; i++) {
  //         const user = res.results[i].feed_id.slice(5);
  //         List.push(user);
  //       }
  //       setFollowerListState(List);
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // };
  // const UserFollowing = () => {
  //   //got the current user info from getstream
  //   // current user HOME feed follows these people
  //   const userOne = client.feed("home", client.userId);
  //   userOne
  //     .following()
  //     .then((res: { results: string | any[] }) => {
  //       let List = [];
  //       for (let i = 0; i < res.results.length; i++) {
  //         const user = res.results[i].target_id.slice(5);
  //         List.push(user);
  //       }

  //       setFollowingListState(List);
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // };

  // const followerUser = (userToFollow: any) => {
  //   const userOne = client.feed("home", client.userId);
  //   userOne.follow("user", userToFollow);
  //   UserFollowing();
  //   UserFollowers();
  // };

  // const unfollowerUser = (userToUnFollow: any) => {
  //   const userOne = client.feed("home", client.userId);
  //   userOne.unfollow("user", userToUnFollow, { keepHistory: true });
  //   UserFollowing();
  //   UserFollowers();
  // };

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}> Home </h1>
        <StreamApp apiKey={apiKey} appId={appId} token={userToken}>
          {/* <StatusUpdateForm/> */}
          <FlatFeed
            notify
            feedGroup="home"
            Activity={(props) => {
              console.log("props", props);
              let activity;
              if (props.activity?.actor?.data) {
                activity = {
                  activity: {
                    //give
                    ...props.activity,
                    actor: {
                      data: {
                        name: props.activity.actor.id,

                        //need to assign the profileImage as user?.image in getstream
                        profileImage: props?.activity?.actor?.data?.image,
                      },
                    },
                  },
                } as ActivityProps;
              }

              return (
                <>
                  <Activity
                    onClickUser={() => console.log("im clicking user ")}
                    className="userCard"
                    {...props}
                    // data={{ name: props.activity.actor.data.id }}
                    activity={activity?.activity || props.activity}
                    // Card={() => <Card>{activity.object}</Card>}
                    // Content={({ activity }) => <Card>{activity.object}</Card>}
                    // Header={(activity) => (
                    //   <>
                    //     {/* <Avatar src={props?.activity?.actor?.image} /> */}
                    //   </>
                    // )}

                    HeaderRight={() => (
                      <>
                        {/* {followingListState.includes(
                          props.activity.actor.id
                        ) ? (
                          <Button
                            onClick={() =>
                              unfollowerUser(props.activity.actor.id)
                            }
                          >
                            following
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            onClick={() =>
                              followerUser(props.activity.actor.id)
                            }
                          >
                            follow
                          </Button>
                        )} */}
                      </>
                    )}
                    Footer={() => (
                      <div style={{ padding: "8px 16px" }}>
                        <LikeButton {...props} />

                        <CommentField
                          activity={props.activity}
                          onAddReaction={props.onAddReaction}
                        />

                        <CommentList activityId={props.activity.id} />
                      </div>
                    )}
                  />
                  <Divider />
                </>
              );
            }}
          />
        </StreamApp>
      </main>
    </>
  );
};

export default Home;
