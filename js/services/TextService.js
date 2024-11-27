// services/TextService.js
import { GALLERY_CONFIG } from '../constants.js';

export class TextService {
    async fetchTextContent(imageName) {
        try {
            const { owner, repo } = GALLERY_CONFIG.repoDetails;
            // Remove image extension and replace with .txt
            const textFileName = imageName.replace(/\.(jpg|jpeg)$/i, '.txt');
            
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/assets/txt/${textFileName}`
            );
            
            if (!response.ok) {
                console.warn(`No text content for ${imageName}`);
                return '';
            }
            
            const data = await response.json();
            // GitHub API returns content as base64 encoded
            return atob(data.content);
        } catch (error) {
            console.warn(`Could not load text for ${imageName}:`, error);
            return '';
        }
    }
}