// services/TextService.js
import { GALLERY_CONFIG } from '/IaaC_LLUM25_Website/js/constants.js';

export class TextService {
    async fetchTextContent(imageName) {
        try {
            const { owner, repo, textPath } = GALLERY_CONFIG;
            const textFileName = imageName.replace(/\.(jpg|jpeg)$/i, '.txt');
            
            // Use GitHub API to get the text file content
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${textPath}/${textFileName}`
            );
            
            if (!response.ok) {
                console.warn(`No text content found for ${imageName}`);
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