import { account } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null,
  isLoadingUser: boolean,
  signIn: (email: string, password: string) => Promise<string | null>,
  signUp: (email: string, password: string) => Promise<string | null>,
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

  const getUser = async () => {
    try {
      const session = await account.get()
      setUser(session)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoadingUser(false)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message
      }
      return "error ocurred while sign up."
    }
  }
  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get()
      setUser(session)
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message
      }
      return "error ocurred while sign in."
    }
  }

  const signOut = async () => {
    try {
      await account.deleteSession('current')
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == undefined) {
    throw new Error("useAuth must be in AuthContextProvider")
  }
  return context;
}
