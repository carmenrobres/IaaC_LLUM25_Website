import { createClient } from './node_modules/@supabase/supabase-js/dist/module/index.js';

// Use environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class GalleryService {
    static async getImagesAndTexts() {
      try {
        // Fetch image data
        const { data: images, error: imageError } = await supabase
          .storage
          .from(GALLERY_CONFIG.supabaseBucket)
          .list('', { limit: GALLERY_CONFIG.imagesPerPage });
  
        if (imageError) {
          console.error('Error fetching images:', imageError);
          return { images: [], texts: new Map() };
        }
  
        // Fetch text data
        const { data: texts, error: textError } = await supabase
          .from(GALLERY_CONFIG.textTable)
          .select('image_url, transcription');
  
        if (textError) {
          console.error('Error fetching text:', textError);
          return { images: [], texts: new Map() };
        }
  
        // Map text content to images
        const textMap = new Map();
        texts.forEach(({ image_url, transcription }) => {
          textMap.set(image_url, transcription);
        });
  
        // Return images and text map
        return {
          images: images.map((image) => `${GALLERY_CONFIG.supabaseUrl}/storage/v1/object/public/${GALLERY_CONFIG.supabaseBucket}/${image.name}`),
          texts: textMap,
        };
      } catch (err) {
        console.error('Unexpected error:', err);
        return { images: [], texts: new Map() };
      }
    }
  }
  

export default ImageService;
