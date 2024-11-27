// ImageService.js
import { GALLERY_CONFIG } from '/IaaC_LLUM25_Website/js/constants.js';


export class ImageService {
    async fetchImages() {
        try {
            const { owner, repo } = GALLERY_CONFIG.repoDetails;
            const branch = 'main'; // or 'master' depending on your default branch
            
            // Use raw GitHub content URL
            const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/assets/img/`);
            
            if (!response.ok) {
                // Try alternate method using GitHub API
                return await this.fetchUsingAPI();
            }
            
            const text = await response.text();
            const files = text.match(/href="[^"]*\.(jpg|jpeg)"/gi) || [];
            
            return files
                .map(file => file.match(/([^\/]+)\.(jpg|jpeg)/i)[0])
                .sort((a, b) => {
                    const timeA = a.split('_')[0];
                    const timeB = b.split('_')[0];
                    return timeA.localeCompare(timeB);
                });

        } catch (error) {
            return await this.fetchUsingAPI();
        }
    }

    async fetchUsingAPI() {
        const { owner, repo } = GALLERY_CONFIG.repoDetails;
        
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/assets/img`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return data
            .filter(file => /\.(jpg|jpeg)$/i.test(file.name))
            .map(file => file.name)
            .sort((a, b) => {
                const timeA = a.split('_')[0];
                const timeB = b.split('_')[0];
                return timeA.localeCompare(timeB);
            });
    }
}