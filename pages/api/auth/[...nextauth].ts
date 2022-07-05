import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
let userAccount = null;

const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const confirmPasswordHash = (plainPassword, hashedPassword) => {
  return new Promise((resolve) => {
    bcrypt.compare(plainPassword, hashedPassword, function (err, res) {
      resolve(res);
    });
  });
};

const configuration = {
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === "production",
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              username: credentials.username,
            },
          });

          if (user !== null) {
            //Compare the hash
            const res = await confirmPasswordHash(
              credentials.password,
              user.password
            );
            if (res === true) {
              userAccount = {
                userId: user.userId,
                name: user.name,
                username: user.username,
                email: user.email,
                userToken: user.userToken,
                isActive: user.isActive,
                bio: user.bio,
                image: user.image,
                stripeToken: user.stripeToken,
              };
              return userAccount;
            } else {
              return null;
            }
          } else {
            console.log("Hash not matched logging in");
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      // console.log("token", token);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user; // Setting token in session
      // console.log("session", session);
      return session;
    },
  },
  pages: {
    signIn: "/", //Need to define custom login page (if using)
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  req: NextAuthOptions | NextApiRequest,
  res: NextApiResponse<any>
) => NextAuth(req, res, configuration);
