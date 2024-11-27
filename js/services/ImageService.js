// services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            const { owner, repo, path } = GALLERY_CONFIG.repoDetails;
            // Use raw.githubusercontent.com instead of the API
            const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main`;
            
            // For images, we'll need to make a direct request to your index.html 
            // which should contain the image list
            const response = await fetch(`/${repo}/`);
            const html = await response.text();
            
            // Parse HTML to get image references
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Find all image paths in your assets/img directory
            const images = Array.from(doc.querySelectorAll('img'))
                .map(img => img.src)
                .filter(src => src.includes('/assets/img/'))
                .map(src => src.split('/').pop())
                .filter(name => /\.(jpg|jpeg)$/i.test(name))
                .sort((a, b) => {
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });

            return images;

        } catch (error) {
            console.error('Error fetching images:', error);
            // Fallback to a simple directory scan
            const fallbackImages = await this.fetchFromDirectory();
            if (fallbackImages.length > 0) {
                return fallbackImages;
            }
            throw new Error('Failed to fetch images: ' + error.message);
        }
    }

    async fetchFromDirectory() {
        try {
            const response = await fetch('/assets/img/');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            return Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => /\.(jpg|jpeg)$/i.test(href))
                .map(href => href.split('/').pop())
                .sort((a, b) => {
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });
        } catch (error) {
            console.warn('Fallback directory scan failed:', error);
            return [];
        }
    }
}

// services/TextService.js
export class TextService {
    async fetchTextContent(imageName) {
        try {
            // Get text directly from your repository
            const textFileName = imageName.replace(/\.(jpg|jpeg)$/i, '.txt');
            const response = await fetch(`/assets/txt/${textFileName}`);
            
            if (!response.ok) {
                return '';
            }
            
            return await response.text();
            
        } catch (error) {
            console.warn(`Could not load text for ${imageName}:`, error);
            return '';
        }
    }
}