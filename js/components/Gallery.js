// js/components/Gallery.js
import { parseTimeFromFilename, createDisplayName } from '../utils/imageUtils.js';
import { GALLERY_CONFIG } from '../constants.js';

export class Gallery {
    constructor(container, modal) {
        this.container = container;
        this.modal = modal;
        this.observer = null;
        this.state = {
            currentPage: 1,
            sortDirection: 'asc',
            selectedDay: 'all',
            images: [] // Add images to state
        };

        this.initializeIntersectionObserver();
    }

    initializeIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        this.loadImage(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }

    loadImage(img) {
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = tempImg.src;
            img.classList.add('loaded');
            img.parentElement.parentElement.classList.remove('loading');
        };
        tempImg.src = img.dataset.src;
        delete img.dataset.src;
        this.observer.unobserve(img);
    }

    createItem(filename) {
        const timeInfo = parseTimeFromFilename(filename);
        const displayName = createDisplayName(timeInfo, filename);

        const item = document.createElement('div');
        item.className = 'item loading';
        
        item.innerHTML = `
            <div class="item-img">
                <img 
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    data-src="${GALLERY_CONFIG.imagePath}${filename}"
                    loading="lazy"
                    alt="${displayName}"
                    style="background-color: #1a1a1a;"
                >
            </div>
            <div class="item-name">
                <p>${displayName}</p>
            </div>
        `;

        const img = item.querySelector('img');
        this.observer.observe(img);

        item.addEventListener('click', () => {
            this.modal.updateContent(`${GALLERY_CONFIG.imagePath}${filename}`, displayName);
            this.modal.toggle();
        });

        return item;
    }

    addScrollTrigger() {
        const trigger = document.createElement('div');
        trigger.className = 'scroll-trigger';
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.state.currentPage++;
                this.updateGallery(); // Now uses internal state
                observer.disconnect();
            }
        }, { rootMargin: '100px' });

        observer.observe(trigger);
        this.container.appendChild(trigger);
    }

    filterImages() {
        let filteredImages = [...this.state.images];

        if (this.state.selectedDay !== 'all') {
            filteredImages = filteredImages.filter(filename => {
                const timeInfo = parseTimeFromFilename(filename);
                return timeInfo?.day.toString() === this.state.selectedDay;
            });
        }

        filteredImages.sort((a, b) => {
            const timeA = parseTimeFromFilename(a);
            const timeB = parseTimeFromFilename(b);
            const multiplier = this.state.sortDirection === 'asc' ? 1 : -1;
            return (timeA.timestamp - timeB.timestamp) * multiplier;
        });

        return filteredImages;
    }

    updateGallery(newImages = null) {
        // Update images if new ones are provided
        if (newImages !== null) {
            this.state.images = newImages;
        }

        const filteredImages = this.filterImages();
        const start = 0;
        const end = this.state.currentPage * GALLERY_CONFIG.imagesPerPage;
        const imagesToShow = filteredImages.slice(start, end);

        this.container.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        imagesToShow.forEach(filename => {
            fragment.appendChild(this.createItem(filename));
        });
        this.container.appendChild(fragment);

        if (end < filteredImages.length) {
            this.addScrollTrigger();
        }
    }

    // Add method to update filter state
    updateFilters(type, value) {
        if (type === 'day') {
            this.state.selectedDay = value;
        } else if (type === 'sort') {
            this.state.sortDirection = value;
        }
        this.state.currentPage = 1;
        this.updateGallery();
    }
}