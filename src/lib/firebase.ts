import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCXTdpY3hliaCeelUaxA5fguwB-clmXHAw",
    authDomain: "clgdept-462f2.firebaseapp.com",
    projectId: "clgdept-462f2",
    storageBucket: "clgdept-462f2.firebasestorage.app",
    messagingSenderId: "801907542782",
    appId: "1:801907542782:web:25c104032863605a4633af",
    measurementId: "G-LXHW2MPFF0"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);