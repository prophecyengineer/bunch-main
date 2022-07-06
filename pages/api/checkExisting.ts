import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
let userAccount = null;

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // console.log(req.body)
  // const username = JSON.parse(JSON.stringify(req.body));
  const body = { ...req.body };
  // const response = await req

  // came out like {Alex: ""} until we spread out the request body with ...

  try {
    // const result = console.log()
    const result = await prisma.user.findUnique({
      where: { username: body?.query?.username },
    });

    res.status(200).json({ result });
    console.log("result", result);
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
