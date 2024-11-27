// services/TextService.js
import { GALLERY_CONFIG } from '../constants.js';

export class TextService {
    async fetchTextContent(imageName) {
        try {
            const textFileName = imageName.replace(/\.(jpg|jpeg)$/i, '.txt');
            const response = await fetch(`/${GALLERY_CONFIG.repoDetails.repo}/assets/txt/${textFileName}`);
            
            if (!response.ok) {
                console.warn(`No text content for ${imageName}`);
                return '';
            }
            
            return await response.text();
        } catch (error) {
            console.warn(`Could not load text for ${imageName}:`, error);
            return '';
        }
    }
}