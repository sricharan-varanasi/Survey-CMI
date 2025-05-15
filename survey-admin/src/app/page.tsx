"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (login(username, password)) {
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#faebd7] p-4 box-border">
      <div className="h-full w-full border-4 border-black rounded-xl flex items-center justify-center">
        <div className="w-full max-w-sm bg-white text-black p-6 rounded-lg space-y-4 shadow-xl">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            placeholder="Username"
            className="w-full p-2 rounded bg-[#fffafa] text-black border border-gray-400 placeholder-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-[#fffafa] text-black border border-gray-400 placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#f0e68c] hover:bg-yellow-300 text-black p-2 rounded font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
