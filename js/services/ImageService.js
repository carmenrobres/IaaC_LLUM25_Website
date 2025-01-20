// ImageService.js
import { GALLERY_CONFIG } from '/IaaC_LLUM25_Website/js/constants.js';

export class ImageService {
    constructor() {
        this.baseApiUrl = 'https://api.github.com/repos';
    }

    async fetchImages() {
        try {
            // Use GitHub's REST API to get repository contents
            const response = await fetch(
                `${this.baseApiUrl}/${GALLERY_CONFIG.owner}/${GALLERY_CONFIG.repo}/contents/${GALLERY_CONFIG.imagePath}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();

            // Filter for image files and extract names
            const imageFiles = data
                .filter(file => /\.(jpg|jpeg)$/i.test(file.name))
                .map(file => file.name)
                .sort((a, b) => {
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });

            if (imageFiles.length === 0) {
                throw new Error('No images found in the repository');
            }

            return imageFiles;

        } catch (error) {
            console.error('Error fetching images:', error);
            throw new Error('Failed to load images. Please ensure images are properly uploaded to the repository and the configuration is correct.');
        }
    }
}