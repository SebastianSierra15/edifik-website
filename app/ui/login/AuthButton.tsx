"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return session ? (
    <button onClick={() => signOut()}>Cerrar sesión</button>
  ) : (
    <button onClick={() => signIn("google")}>Iniciar sesión</button>
  );
}
