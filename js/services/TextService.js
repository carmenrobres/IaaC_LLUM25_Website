// TextService.js
export class TextService {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.retryDelay = 1000; // Start with 1 second delay
        this.maxRetries = 3;
    }

    async fetchTextContent(imageName, retryCount = 0) {
        return new Promise((resolve) => {
            this.queue.push({ imageName, retryCount, resolve });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        const { imageName, retryCount, resolve } = this.queue.shift();

        try {
            const { owner, repo, textPath } = GALLERY_CONFIG;
            const textFileName = imageName.replace(/\.(jpg|jpeg)$/i, '.txt');
            
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${textPath}/${textFileName}`
            );
            
            if (response.status === 429 && retryCount < this.maxRetries) {
                // Rate limited - requeue with backoff
                console.warn(`Rate limited, retrying in ${this.retryDelay}ms...`);
                this.queue.unshift({ 
                    imageName, 
                    retryCount: retryCount + 1, 
                    resolve 
                });
                await new Promise(r => setTimeout(r, this.retryDelay));
                this.retryDelay *= 2; // Exponential backoff
            } else if (!response.ok) {
                console.warn(`No text content found for ${imageName} (${response.status})`);
                resolve('');
            } else {
                const data = await response.json();
                resolve(atob(data.content));
                this.retryDelay = 1000; // Reset delay after successful request
            }
        } catch (error) {
            console.warn(`Could not load text for ${imageName}:`, error);
            resolve('');
        } finally {
            this.processing = false;
            // Add delay between requests
            await new Promise(r => setTimeout(r, 100));
            this.processQueue(); // Process next in queue
        }
    }
}
