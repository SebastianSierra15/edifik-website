"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "../icons/googleIcon";

export default function AuthProviders() {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex items-center justify-center w-full px-6 py-3 bg-white text-black border border-gray-300 rounded-lg shadow-md transition hover:bg-gray-100"
      >
        <GoogleIcon className="h-6 w-6 mr-3" />
        <span className="font-medium">Iniciar con Google</span>
      </button>
    </div>
  );
}
