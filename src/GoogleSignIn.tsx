import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleSignIn() {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "outline",
          size: "large",
          type: "standard",
        }
      );

      // Optional: auto prompt
      // window.google.accounts.id.prompt();
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log("ID token:", response.credential);

    // Decode JWT if needed (optional)
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(window.atob(base64));

    console.log("Decoded user:", decodedPayload);
    // Now you can:
    // - Save user info to local state
    // - Send ID token to your backend or Google Sheets
  };

  return <div id="google-signin-btn"></div>;
}
