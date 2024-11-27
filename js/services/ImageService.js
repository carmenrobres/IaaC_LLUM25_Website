// services/ImageService.js
import { GALLERY_CONFIG } from '../constants.js';

export class ImageService {
    async fetchImages() {
        try {
            const { owner, repo, path } = GALLERY_CONFIG.repoDetails;
            const response = await fetch(`/${repo}/assets/img/`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const images = Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => /\.(jpg|jpeg)$/i.test(href))
                .map(href => href.split('/').pop())
                .sort((a, b) => {
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });

            return images;
        } catch (error) {
            throw new Error('Failed to fetch images: ' + error.message);
        }
    }
}