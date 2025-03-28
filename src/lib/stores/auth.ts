import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import type { User } from 'firebase/auth';
import {
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged
} from 'firebase/auth';
import { staffMembers } from './staff';
import { events } from './events';
import { homePageContent } from './homepage';

export const user = writable<User | null>(null);

onAuthStateChanged(auth, (firebaseUser) => {
	user.set(firebaseUser);
});

export const signIn = async (email: string, password: string) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return { success: true };
	} catch (error) {
		console.error('Error signing in:', error);
		return { success: false, error };
	}
};

export const signOut = async () => {
	try {
		await firebaseSignOut(auth);
		staffMembers.set([]);
		events.set([]);
		homePageContent.set({
			mission: '',
			vision: '',
			aboutUs: '',
			heroImage: ''
		});
		return { success: true };
	} catch (error) {
		console.error('Error signing out:', error);
		return { success: false, error };
	}
};