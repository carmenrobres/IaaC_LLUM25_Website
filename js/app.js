// app.js
import { SELECTORS, GALLERY_CONFIG } from '/IaaC_LLUM25_Website/js/constants.js';
import { ImageService } from '/IaaC_LLUM25_Website/js/services/ImageService.js';
import { TextService } from '/IaaC_LLUM25_Website/js/services/TextService.js';
import { Modal } from '/IaaC_LLUM25_Website/js/components/Modal.js';
import { Gallery } from '/IaaC_LLUM25_Website/js/components/Gallery.js';
import { FilterControls } from '/IaaC_LLUM25_Website/js/components/FilterControls.js';


class GalleryApp {
    constructor() {
        this.imageService = new ImageService();
        this.textService = new TextService();
        this.modal = new Modal(SELECTORS.modal);
        this.gallery = new Gallery(
            document.querySelector(SELECTORS.gallery),
            this.modal,
            this.textService
        );
        this.filterControls = new FilterControls(
            document.querySelector(SELECTORS.header),
            this.handleFilterChange.bind(this)
        );
        
        this.init();
    }

    async init() {
        try {
            // Fetch images dynamically using ImageService
            const images = await this.imageService.fetchImages();
            
            // Initialize the gallery with the fetched images
            this.filterControls.updateDayOptions(images);
            this.gallery.updateGallery(images, new Map());
    
            // Fetch and update text content in the background
            await this.fetchTextContent(images);
            
            // Initialize any required icons (if applicable)
            this.initializeLucideIcons();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize the gallery. Please refresh the page.');
        }
    }
    
    async fetchTextContent(images) {
        const textMap = new Map();
        const batchSize = 3; // Fetch in batches to avoid overloading requests
    
        for (let i = 0; i < images.length; i += batchSize) {
            const batch = images.slice(i, i + batchSize);
    
            // Process each image in the batch
            await Promise.all(
                batch.map(async (imageName) => {
                    try {
                        const content = await this.textService.fetchTextContent(imageName);
                        if (content) {
                            textMap.set(imageName, content);
                        }
                    } catch (error) {
                        console.warn(`Failed to fetch text for ${imageName}:`, error);
                    }
                })
            );
    
            // Update the gallery with current text content
            this.gallery.updateTextContent(textMap);
    
            // Add delay between batches for smoother loading
            if (i + batchSize < images.length) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }

    handleFilterChange(filter) {
        this.gallery.updateFilters(filter.type, filter.value);
    }

    showError(message) {
        const gallery = document.querySelector(SELECTORS.gallery);
        gallery.innerHTML = `
            <div class="error-message">
                <p style="color: white; text-align: center; padding: 20px;">
                    ${message}
                </p>
            </div>
        `;
    }

    initializeLucideIcons() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GalleryApp();
});