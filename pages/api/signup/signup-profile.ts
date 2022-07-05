import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
import { connect } from "getstream";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const apiSecret = process.env.REACT_APP_STREAM_APP_SECRET as string;
const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
//     process.env.REACT_APP_STREAM_APP_SECRET,
//     process.env.REACT_APP_STREAM_APP_ID,
//     { location: 'us-east' },
let stream = require("getstream");
const client = stream.connect(apiKey, apiSecret, { location: "dublin" });

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === "POST") {
    const { username, name, bio, image } = req.body;
    client.user(username).update({ name: name, bio: bio, image: image });
    console.log("did the getstream bit");
    try {
      await prisma.user.update({
        where: {
          username: username,
        },
        data: {
          bio: bio,
          image: image,
          name: name,
        },
      });

      console.log("created in db");

      return res.status(200).end();
    } catch (err) {
      return res.status(503).json({ err: err.toString() });
    }
  } else {
    return res
      .status(405)
      .json({ error: "This request only supports POST requests" });
  }
};
