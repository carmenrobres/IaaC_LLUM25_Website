import { createClient } from './node_modules/@supabase/supabase-js/dist/module/index.js';

// Use environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class ImageService {
  static async getImages() {
    try {
      // Fetch image data from Supabase
      const { data, error } = await supabase
        .from('transcriptions') // Replace with your table name
        .select(' image_url'); // Specify the columns to fetch


      if (error) {
        console.error('Error fetching images:', error);
        return [];
      }

      // Return an array of image URLs
      return data.map((image) => image.image_url);
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }
}

export default ImageService;
