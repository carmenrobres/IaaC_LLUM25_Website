// TextService.js
import { supabase } from './supabaseClient.js';

export class TextService {
    async fetchTextContent(imageUrl) {
        try {
            const { data, error } = await supabase
                .from('transcriptions')
                .select('transcription')
                .eq('image_url', imageUrl)
                .single();

            if (error) {
                console.warn(`No transcription found for ${imageUrl}:`, error);
                return '';
            }

            return data.transcription;
        } catch (error) {
            console.error('Error in fetchTextContent:', error);
            return '';
        }
    }
}
