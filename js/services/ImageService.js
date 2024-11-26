// services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            const response = await fetch(GALLERY_CONFIG.imagePath);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            // Check if we got valid HTML content
            const html = await response.text();
            
            // Parse the directory listing HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Get all links that point to image files
            const imageFiles = Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => /\.(jpg|jpeg)$/i.test(href))
                .map(href => href.split('/').pop());

            // Sort images by timestamp in the filename
            return imageFiles.sort((a, b) => {
                const timeA = a.split('_')[0];
                const timeB = b.split('_')[0];
                return timeA.localeCompare(timeB);
            });

        } catch (error) {
            console.error('Error fetching images:', error);
            throw new Error('Failed to fetch images: ' + error.message);
        }
    }
}