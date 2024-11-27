// services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            const { owner, repo } = GALLERY_CONFIG.repoDetails;
            // Use GitHub's API to get repository contents
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/assets/img`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            const images = data
                .filter(file => /\.(jpg|jpeg)$/i.test(file.name))
                .map(file => file.name) 
                .sort((a, b) => {
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });

            return images;
        } catch (error) {
            console.error('Error details:', error);
            throw new Error('Failed to fetch images: ' + error.message);
        }
    }
}