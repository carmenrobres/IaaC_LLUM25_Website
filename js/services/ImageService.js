import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    'https://ogezfwngzpwubwypbzvq.supabase.co', // Replace with your Supabase project URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZXpmd25nenB3dWJ3eXBienZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTUyMzE4MiwiZXhwIjoyMDQ3MDk5MTgyfQ.JW-GhWhgu-iF3_uYzUWEfJ3fjJ6jInd2SeJ3wt881Ak' // Replace with your Supabase anon key
  );

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
      return data.map((image) => image.url);
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }
}

export default ImageService;
