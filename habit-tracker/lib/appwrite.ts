import { Client, Account } from 'react-native-appwrite'

const client = new Client()
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!)


const account = new Account(client)

export { account }
