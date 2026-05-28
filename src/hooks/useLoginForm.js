import { useState } from "react";

export default function useLoginForm(login) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);

    try {
      const ok = await login(email.trim().toLowerCase(), password);

      if (!ok) {
        setError("Invalid email or password");
      }
    } catch (e) {
      const code = e.code;

      if (code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later");
      } else {
        setError(e.message || "Login failed. Please try again");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
