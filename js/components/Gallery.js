// components/Gallery.js

export class Gallery {
    constructor(container, modal, textService) {
        this.container = container;
        this.modal = modal;
        this.textService = textService;
        this.currentImages = [];
        this.currentTextMap = new Map();
        this.filters = {
            day: 'all'
        };
        
        this.initObserver();
    }

    initObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px'
            }
        );
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                img.classList.add('loaded');
                resolve(img);
            };
            img.onerror = () => {
                img.classList.add('error');
                reject(new Error(`Failed to load image: ${img.src}`));
            };
            img.src = img.dataset.src;
        });
    }

    // Update the createGalleryItem method in Gallery.js
    createGalleryItem(imageName) {
        const item = document.createElement('div');
        item.className = 'item loading';

        const imagePath = `${GALLERY_CONFIG.imagePath}${imageName}`;

        item.innerHTML = `
            <div class="item-img">
                <img 
                    data-src="${imagePath}" 
                    alt="${imageName}"
                    loading="lazy"
                >
            </div>
            <div class="item-name">
                <p>${imageName}</p>
            </div>
        `;

        const img = item.querySelector('img'); 
        this.observer.observe(img);

        img.addEventListener('load', () => {
            item.classList.remove('loading');
        });

        item.addEventListener('click', () => {
            this.modal.open({
                imageSrc: imagePath,  // Use the same image path here
                imageName: imageName,
                textContent: this.currentTextMap.get(imageName) || ''
            });
        });

        return item;
    }

    filterImages() {
        if (this.filters.day === 'all') {
            return this.currentImages;
        }
        return this.currentImages.filter(image => image.includes(this.filters.day));
    }

    updateGallery(images, textMap = new Map()) {
        this.currentImages = images;
        this.currentTextMap = textMap;
        this.container.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        const filteredImages = this.filterImages();
        
        for (const image of filteredImages) {
            const item = this.createGalleryItem(image);
            fragment.appendChild(item);
        }
        
        this.container.appendChild(fragment);
    }

    updateTextContent(textMap) {
        this.currentTextMap = textMap;
    }

    updateFilters(type, value) {
        this.filters[type] = value;
        this.updateGallery(this.currentImages, this.currentTextMap);
    }

    destroy() {
        this.observer.disconnect();
        this.container.innerHTML = '';
        this.currentImages = [];
        this.currentTextMap.clear();
    }
}