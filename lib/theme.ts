import axios from 'axios';
import { cache } from 'react';

export interface ThemeResponse {
    id: string;
    name: string;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    mobile_number: string | null;
    phone_number: string | null;
    whatsapp_number: string | null;
    email: string | null;
    logo: string | null;
    primary_color: string;
    secondary_color: string;
    background_color: string;
    font: string | null;
    background_images: {
        url: string;
    }[] | null;
}


export const getThemeData = cache(async (): Promise<ThemeResponse> => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/site-settings/api/v1`, {
            headers:{
                "ngrok-skip-browser-warning": "true"
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching theme:', error);
        // إرجاع قيم افتراضية في حالة الفشل
        return {
            id: 'fallback',
            name: 'Default Theme',
            website: null,
            facebook: null,
            instagram: null,
            mobile_number: null,
            phone_number: null,
            whatsapp_number: null,
            email: null,
            logo: null,
            primary_color: '#FFFFFF',
            secondary_color: '#000000',
            background_color: '#F5F5F5',
            font: null,
            background_images: [],
        };
    }
});