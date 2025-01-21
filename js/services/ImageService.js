// ImageService.js
import { supabase } from './supabaseClient.js';

export class ImageService {
    async fetchImages() {
        try {
            const { data, error } = await supabase
                .from('transcriptions')
                .select('image_url');

            if (error) {
                console.error('Error fetching images:', error);
                throw new Error('Failed to load images.');
            }

            if (!data || data.length === 0) {
                throw new Error('No images found in the database.');
            }

            // Extract URLs from the fetched data
            return data.map(row => row.image_url);
        } catch (error) {
            console.error('Error in fetchImages:', error);
            throw error;
        }
    }
}
