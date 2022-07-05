import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import Wrapper from "./Wrapper";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "dark",
          }}
        >
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
