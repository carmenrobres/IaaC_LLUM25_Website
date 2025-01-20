// ImageService.js
import { GALLERY_CONFIG } from '/IaaC_LLUM25_Website/js/constants.js';

export class ImageService {
    async fetchImages() {
        try {
            // Fetch the directory listing
            const response = await fetch(`${window.location.origin}${GALLERY_CONFIG.imagePath}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch images directory: ${response.status}`);
            }

            const html = await response.text();
            
            // Create a temporary DOM element to parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Find all links that end with jpg or jpeg
            const imageLinks = Array.from(doc.querySelectorAll('a'))
                .map(link => link.href)
                .filter(href => /\.(jpg|jpeg)$/i.test(href))
                .map(href => {
                    // Extract just the filename from the full URL
                    const parts = href.split('/');
                    return parts[parts.length - 1];
                });

            // Sort images by timestamp in filename
            return imageLinks.sort((a, b) => {
                const timeA = a.split('_')[0];
                const timeB = b.split('_')[0];
                return timeA.localeCompare(timeB);
            });

        } catch (error) {
            console.error('Error fetching images:', error);
            // If directory listing fails, try loading a single test image
            try {
                const testResponse = await fetch(`${window.location.origin}${GALLERY_CONFIG.imagePath}test.jpg`, { method: 'HEAD' });
                if (testResponse.ok) {
                    return ['test.jpg'];
                }
            } catch (e) {
                console.error('Failed to load test image:', e);
            }
            
            throw new Error('Failed to load images. Please ensure images are properly uploaded to the repository.');
        }
    }
}