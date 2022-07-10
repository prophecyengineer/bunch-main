import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
// import Layout from "../Layout";
// import { UserProvider } from "../../../context/user";
import Appshell from "./Appshell";
import PreLoginShell from "./PreLoginShell";
import { UserProvider } from "../../context/user";

export default function Wrapper(props) {
  const session = useSession();
  const router = useRouter();

  if (
    session === null ||
    router.pathname === "/" ||
    router.pathname === "/signin" ||
    router.pathname === "/Onboarding/Email" ||
    router.pathname === "/Onboarding/Username" ||
    router.pathname === "/login" ||
    router.pathname === "/Onboarding/Profile"
  ) {
    return <PreLoginShell>{props.children}</PreLoginShell>;
  }
  if (
    (session !== null && session?.status === "authenticated") ||
    router.pathname === "/"
  ) {
    return (
      <>
        <UserProvider>
          <Appshell>{props.children}</Appshell>
        </UserProvider>
      </>
    );
  }
  if (session === null)
    router.pathname === "/home" ||
      router.pathname === "/profile" ||
      router.pathname === "/explore";
  {
    return (
      <>
        <h1>You are not authenticated</h1>
        <h2>
          <Link href="/">Back to safety</Link>
        </h2>
      </>
    );
  }
}
