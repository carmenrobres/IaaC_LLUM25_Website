// services/TextService.js
export class TextService {
    async fetchTextContent(imageName) {
        try {
            const { owner, repo } = GALLERY_CONFIG.repoDetails;
            const textFileName = imageName.replace(/\.(jpg|jpeg)$/i, '.txt');
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/assets/txt/${textFileName}?ref=main`;
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                return '';
            }
            
            const data = await response.json();
            return atob(data.content);
            
        } catch (error) {
            console.warn(`Could not load text for ${imageName}:`, error);
            return '';
        }
    }
}