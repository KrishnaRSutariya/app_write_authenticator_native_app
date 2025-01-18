import { Account, Client } from 'react-native-appwrite';

// import Config from 'react-native-config';

const client = new Client().setProject('678a38ce0005750f0cba').setPlatform('com.hmrtech.ReactNativeAppWrite');

const account = new Account(client);

export default account;
