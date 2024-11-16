// src/js/services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            const { owner, repo, path } = GALLERY_CONFIG.repoDetails;
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (!Array.isArray(data)) throw new Error('Expected an array of files');

            return data
                .filter(file => /\.(jpeg|jpg)$/i.test(file.name))
                .map(file => file.name);
        } catch (error) {
            throw new Error('Failed to fetch images: ' + error.message);
        }
    }
}