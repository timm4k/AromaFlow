import { useState } from "react";

const ERROR_MAP = {
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/invalid-credential": "Invalid email or password",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/too-many-requests": "Too many attempts. Please try again later",
  "auth/email-already-in-use": "This email is already registered",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/operation-not-allowed": "This authentication method is not enabled",
};

export default function useAuthForm({ mode, login, register }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";

  function validate() {
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email.trim())) return "Please enter a valid email";
    if (!password) return "Password is required";
    if (!isLogin && password.length < 6) return "Password must be at least 6 characters";
    if (!isLogin && password !== confirmPassword) return "Passwords do not match";

    return null;
  }

  async function handleSubmit() {
    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email.trim().toLowerCase(), password);
      } else {
        await register(email.trim().toLowerCase(), password, displayName.trim() || undefined);
      }
    } catch (e) {
      setError(ERROR_MAP[e.code] || e.message || (isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    displayName,
    setDisplayName,
    error,
    isSubmitting,
    isLogin,
    handleSubmit,
  };
}
