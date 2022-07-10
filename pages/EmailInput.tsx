import React, { KeyboardEvent, useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { Provider } from "next-auth/providers";

interface EmailInputProps {
  provider: Provider;
  onSuccess: (email: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ provider, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = useCallback(async () => {
    setLoading(true);
    const res = await signIn("email", {
      email: email,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      if (res?.url) {
        window.location.replace(res.url);
      }
    } else {
      onSuccess(email);
    }
  }, [email, onSuccess]);

  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSignin();
      }
    },
    [handleSignin]
  );

  return (
    <div>
      <input
        type="email"
        name="email"
        placeholder="e.g. jane.doe@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyPress={onKeyPress}
      />
      <button disabled={loading}>Next</button>
    </div>
  );
};

export default EmailInput;
