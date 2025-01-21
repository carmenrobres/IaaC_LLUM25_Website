// app.js
import { SELECTORS, GALLERY_CONFIG } from '/IaaC_LLUM25_Website/js/constants.js';
import { Modal } from '/IaaC_LLUM25_Website/js/components/Modal.js';
import { Gallery } from '/IaaC_LLUM25_Website/js/components/Gallery.js';
import { FilterControls } from '/IaaC_LLUM25_Website/js/components/FilterControls.js';

// app.js
import { ImageService } from './services/ImageService.js';
import { TextService } from './services/TextService.js';

class GalleryApp {
    constructor() {
        this.imageService = new ImageService();
        this.textService = new TextService();
        this.init();
    }

    async init() {
        try {
            const images = await this.imageService.fetchImages();
            this.loadGallery(images);
    
            // Subscribe to Supabase changes
            supabase
                .channel('transcriptions')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'transcriptions' }, () => {
                    console.log('Database updated, refreshing gallery...');
                    this.init(); // Reload the gallery on update
                })
                .subscribe();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to load the gallery.');
        }
    }
    

    async loadGallery(images) {
        const galleryContainer = document.querySelector('.gallery');
        galleryContainer.innerHTML = '';

        for (const imageUrl of images) {
            const transcription = await this.textService.fetchTextContent(imageUrl);

            const item = document.createElement('div');
            item.className = 'item';

            item.innerHTML = `
                <img src="${imageUrl}" alt="Image">
                <p>${transcription}</p>
            `;

            galleryContainer.appendChild(item);
        }
    }

    showError(message) {
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = `<p>${message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => new GalleryApp());
