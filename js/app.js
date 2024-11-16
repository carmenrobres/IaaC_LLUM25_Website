// js/app.js
import { SELECTORS } from './constants.js';
import { ImageService } from './services/ImageService.js';
import { Modal } from './components/Modal.js';
import { Gallery } from './components/Gallery.js';
import { FilterControls } from './components/FilterControls.js';

class GalleryApp {
    constructor() {
        this.imageService = new ImageService();
        this.modal = new Modal(SELECTORS.modal);
        this.gallery = new Gallery(
            document.querySelector(SELECTORS.gallery),
            this.modal
        );
        this.filterControls = new FilterControls(
            document.querySelector(SELECTORS.header),
            this.handleFilterChange.bind(this)
        );
        
        this.init();
    }

    async init() {
        try {
            const images = await this.imageService.fetchImages();
            this.filterControls.updateDayOptions(images);
            this.gallery.updateGallery(images);
            this.initializeLucideIcons();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize the gallery. Please refresh the page.');
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