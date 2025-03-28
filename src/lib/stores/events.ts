import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Event {
    id?: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    image?: string;
}


export const events = writable<Event[]>([]);

export const fetchEvents = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Event[];
        events.set(eventsData);
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'events'), event);
        const newEvent = { ...event, id: docRef.id };
        events.update(events => [...events, newEvent]);
        return newEvent;
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
};

export const updateEvent = async (id: string, event: Partial<Event>) => {
    try {
        const eventRef = doc(db, 'events', id);
        await updateDoc(eventRef, event);
        events.update(events =>
            events.map(e => (e.id === id ? { ...e, ...event } : e))
        );
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const deleteEvent = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'events', id));
        events.update(events => events.filter(e => e.id !== id));
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};