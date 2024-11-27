// services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            const { owner, repo, path } = GALLERY_CONFIG.repoDetails;
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Expected an array of files');
            }

            // Get only jpg/jpeg files and extract just the filenames
            const imageFiles = data
                .filter(file => /\.(jpg|jpeg)$/i.test(file.name))
                .map(file => file.name)
                .sort((a, b) => {
                    // Sort by the timestamp in the filename (e.g., "23-46_9.jpeg")
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });

            return imageFiles;

        } catch (error) {
            console.error('Error fetching images:', error);
            throw new Error('Failed to fetch images: ' + error.message);
        }
    }
}