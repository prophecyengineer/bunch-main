import { useSession } from "next-auth/react";

export default async (req, res) => {
  const stream = require("getstream");
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;

  const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWlsYWt1bmlzIn0.ddz61d_85dLlUvH_jUd7aY7KtuQ710t1y1kdT3uK8fQ";

  const client = stream.connect(apiKey, userToken, appId);

  const user1 = client.feed("user", "milakunis");

  //  const currentUser = client.feed("timeline", req.params.username);
  if (req.method === "POST") {
    const { title, image } = req.body;
    const user1 = client.feed("user", "milakunis", userToken);

    // Create a bit more complex activity
    const activity = {
      verb: "run",
      title: title,
      object: JSON.stringify({ iframe: image }),
      course: { name: "Golden Gate park", distance: 10 },
      participants: ["Thierry", "Tommaso"],
      started_at: new Date(),
      foreign_id: "run:1",
      location: { type: "point", coordinates: [37.769722, -122.476944] },
    };

    await user1.addActivity(activity);

    console.log("did the getstream bit");
  } else {
    return res
      .status(405)
      .json({ error: "This request only supports POST requests" });
  }
};
