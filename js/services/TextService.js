import { createClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Use environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class TextService {
  static async getTexts() {
    try {
      // Fetch text data from Supabase
      const { data, error } = await supabase
        .from('transcriptions') // Replace with your table name
        .select('transcription'); // Specify the columns to fetch

      if (error) {
        console.error('Error fetching text:', error);
        return [];
      }

      // Return an array of text content
      return data.map((text) => text.content);
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }
}

export default TextService;
