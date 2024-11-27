// services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            const { owner, repo, path } = GALLERY_CONFIG.repoDetails;
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=main`;
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Filter for image files and sort by timestamp
            return data
                .filter(file => /\.(jpg|jpeg)$/i.test(file.name))
                .map(file => file.name)
                .sort((a, b) => {
                    // Sort by the timestamp in the filename
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