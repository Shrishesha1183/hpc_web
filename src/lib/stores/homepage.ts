import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface HomePageContent {
    mission: string;
    vision: string;
    aboutUs: string;
    heroImage?: string;
    missionImage?: string;
    visionImage?: string;
    aboutUsImage?: string;  // Add this line
}

export const homePageContent = writable<HomePageContent>({
    mission: '',
    vision: '',
    aboutUs: '',
    heroImage: ''
});

export const fetchHomePageContent = async () => {
    try {
        const docRef = doc(db, 'homepage', 'content');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            homePageContent.set(docSnap.data() as HomePageContent);
        } else {
            // Initialize with default content if none exists
            const defaultContent: HomePageContent = {
                mission: 'Our mission is to provide quality education',
                vision: 'To become a leading educational institution',
                aboutUs: 'We are committed to academic excellence',
                heroImage: ''
            };
            await setDoc(docRef, defaultContent);
            homePageContent.set(defaultContent);
        }
    } catch (error) {
        console.error('Error fetching homepage content:', error);
        throw error;
    }
};

export const updateHomePageContent = async (content: Partial<HomePageContent>) => {
    try {
        const docRef = doc(db, 'homepage', 'content');
        await setDoc(docRef, content, { merge: true });
        homePageContent.update(current => ({ ...current, ...content }));
    } catch (error) {
        console.error('Error updating homepage content:', error);
        throw error;
    }
};