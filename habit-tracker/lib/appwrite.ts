import { Client, Account, Databases } from 'react-native-appwrite'

const client = new Client()
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!)


const account = new Account(client)
const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
export const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_HABITS_COLL_ID!;

export { account, databases }
