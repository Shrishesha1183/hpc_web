import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';

interface Achievement {
	title: string;
	description: string;
	date: string;
}

export interface StaffMember {
	id?: string;
	name: string;
	role: string;
	priority: number; // Add priority field
	photoUrl: string;
	email: string;
	phone?: string;
	department: string;
	qualifications: string[];
	specialization?: string;
	achievements: Achievement[];
	bio: string;
}

// Add priority mapping constant
export const STAFF_PRIORITIES = {
	'HOD': 1,
	'Professor': 2,
	'Associate Professor': 3,
	'Assistant Professor': 4,
	'Guest Faculty': 5
} as const;

export const staffMembers = writable<StaffMember[]>([]);

export const fetchStaffMembers = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'staff'));
		const staff = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		})) as StaffMember[];
		staffMembers.set(staff);
		return { success: true };
	} catch (error) {
		console.error('Error fetching staff:', error);
		return { success: false, error };
	}
};

export const addStaffMember = async (staffData: Omit<StaffMember, 'id'>) => {
	try {
		const docRef = await addDoc(collection(db, 'staff'), staffData);
		const newStaff = { id: docRef.id, ...staffData };
		staffMembers.update((staff) => [...staff, newStaff]);
		return { success: true, id: docRef.id };
	} catch (error) {
		console.error('Error adding staff:', error);
		return { success: false, error };
	}
};

export const updateStaffMember = async (id: string, staffData: Partial<StaffMember>) => {
	try {
		await updateDoc(doc(db, 'staff', id), staffData);
		staffMembers.update((staff) =>
			staff.map((member) => (member.id === id ? { ...member, ...staffData } : member))
		);
		return { success: true };
	} catch (error) {
		console.error('Error updating staff:', error);
		return { success: false, error };
	}
};

export const deleteStaffMember = async (id: string) => {
	try {
		await deleteDoc(doc(db, 'staff', id));
		staffMembers.update((staff) => staff.filter((member) => member.id !== id));
		return { success: true };
	} catch (error) {
		console.error('Error deleting staff:', error);
		return { success: false, error };
	}
};