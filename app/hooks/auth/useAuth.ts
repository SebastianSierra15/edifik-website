import { useSession, signIn, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    return await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  };

  const logout = () => signOut();

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    login,
    logout,
  };
};
