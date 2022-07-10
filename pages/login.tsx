import React, { useState } from "react";
import { getSession, getProviders } from "next-auth/react";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { VerificationStep } from "./VerificationStep";
import { EmailInput } from "./EmailInput";
interface Provider {
  id: string;
  name: string;
  type: string;
  [k: string]: string;
}

interface SigninPageProps {
  isLoggedIn: boolean;
  providers: Array<Provider>;
  csrfToken: string;
}

const SigninPage: NextPage<SigninPageProps> = ({ providers, isLoggedIn }) => {
  const { query } = useRouter();
  const { error } = query;
  const callbackUrl = "https://your-website.com";

  const [email, setEmail] = useState("");
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const emailProvider = EmailProvider;

  if (showVerificationStep) {
    return (
      <div>
        <VerificationStep email={email} callbackUrl={callbackUrl} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>Sign in wiht your email</h2>

        {emailProvider.map((provider) => (
          <EmailInput
            key={provider.id}
            provider={provider}
            onSuccess={(email) => {
              setEmail(email);
              setShowVerificationStep(true);
            }}
          />
        ))}
      </div>

      {/* {credentials} */}
    </div>
  );
};

SigninPage.getInitialProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  return {
    isLoggedIn: session !== null,
    providers: await getProviders(),
  } as unknown as SigninPageProps;
};

export default SigninPage;
