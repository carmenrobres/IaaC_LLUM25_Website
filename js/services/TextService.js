// TextService.js
export class TextService {
    async fetchTextContent(imageName) {
        try {
            const { owner, repo } = GALLERY_CONFIG.repoDetails;
            const branch = 'main'; // or 'master' depending on your default branch
            const textFileName = imageName.replace(/\.(jpg|jpeg)$/i, '.txt');
            
            const response = await fetch(
                `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/assets/txt/${textFileName}`
            );
            
            if (!response.ok) {
                return '';
            }
            
            return await response.text();
        } catch (error) {
            console.warn(`Could not load text for ${imageName}:`, error);
            return '';
        }
    }
}