const FeedComponent = (feedGroup) => {
  return (
    <FlatFeed
      notify
      feedGroup={feedGroup}
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
                          router.push("/" + `${props.activity.actor.id}`)
                        }
                      >
                        <Group>
                          <Avatar
                            size={43}
                            image={props.activity.actor.data.image}
                          />
                          <div>
                            <Text>{props.activity.actor.data.name}</Text>
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

                          const feed = client.feed("user", username);

                          const removed = await feed.removeActivity(
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
                  <Text>{props?.activity?.object}</Text>
                </>
              )}
              Footer={() => (
                <div>
                  <LikeButton {...props} />
                  <CommentField
                    activity={props.activity}
                    onAddReaction={props.onAddReaction}
                  />

                  <CommentList activityId={props.activity.id} />
                </div>
              )}
            />
          </Card>
        );
      }}
    />
  );
};

export default FeedComponent;
