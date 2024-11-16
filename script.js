// Gallery Application with optimized image loading and infinite scroll
class GalleryApp {
    constructor() {
        this.elements = {
            gallery: document.querySelector(".gallery"),
            header: document.querySelector(".header-container"),
            modal: {
                container: document.querySelector(".img-modal"),
                image: document.querySelector(".img-modal .img"),
                name: document.querySelector(".img-modal .img-name p"),
                closeBtn: document.querySelector(".close-btn")
            }
        };

        this.state = {
            images: [],
            sortDirection: 'asc',
            selectedDay: 'all',
            isModalOpen: false,
            currentImage: null,
            currentPage: 1,
            imagesPerPage: 12,
            observer: null
        };

        this.constants = {
            repoDetails: {
                owner: 'jmuozan',
                repo: 'IaaC_LLUM25_Website',
                path: 'assets'
            },
            imagePath: './assets/',
            thumbnailPath: './assets/thumbnails/' // Add a thumbnails directory
        };

        this.init();
    }

    async init() {
        try {
            this.initializeFilterControls();
            this.initializeModal();
            this.setupEventListeners();
            this.initializeIntersectionObserver();
            await this.fetchImages();
            this.initializeLucideIcons();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize the gallery. Please refresh the page.');
        }
    }

    initializeIntersectionObserver() {
        this.state.observer = new IntersectionObserver((entries) => {
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
        this.state.observer.unobserve(img);
    }

    initializeFilterControls() {
        const filterContainer = document.createElement("div");
        filterContainer.className = "filter-controls";

        const daySelect = document.createElement("select");
        daySelect.innerHTML = '<option value="all">All Days</option>';
        
        const sortButton = document.createElement("button");
        sortButton.textContent = "↓ Chronological";
        
        filterContainer.appendChild(daySelect);
        filterContainer.appendChild(sortButton);
        this.elements.header.appendChild(filterContainer);

        this.elements.filters = { daySelect, sortButton };
    }

    initializeModal() {
        this.modal = gsap.timeline({ paused: true });
        
        this.modal
            .to(".img-modal", {
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.75,
                ease: "power4.inOut",
                pointerEvents: "auto"
            })
            .to(".gallery, .container", {
                pointerEvents: "none",
                duration: 0.01
            })
            .to(".img-modal .img", {
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.75,
                ease: "power4.inOut"
            })
            .to(".modal-item p", {
                top: 0,
                duration: 1,
                ease: "power4.inOut",
                stagger: { amount: 0.2 }
            }, "<")
            .reverse();
    }

    setupEventListeners() {
        this.elements.filters.daySelect.addEventListener('change', () => {
            this.state.selectedDay = this.elements.filters.daySelect.value;
            this.state.currentPage = 1;
            this.updateGallery();
        });

        this.elements.filters.sortButton.addEventListener('click', () => {
            this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
            this.elements.filters.sortButton.textContent = 
                this.state.sortDirection === 'asc' ? "↓ Chronological" : "↑ Reverse Order";
            this.state.currentPage = 1;
            this.updateGallery();
        });

        this.elements.modal.closeBtn?.addEventListener('click', () => this.toggleModal());
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    async fetchImages() {
        try {
            const { owner, repo, path } = this.constants.repoDetails;
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (!Array.isArray(data)) throw new Error('Expected an array of files');

            this.state.images = data
                .filter(file => /\.(jpeg|jpg)$/i.test(file.name))
                .map(file => file.name);

            this.updateDayFilterOptions();
            this.updateGallery();

        } catch (error) {
            console.error('Error fetching images:', error);
            this.showError('Failed to load images. Please try again later.');
        }
    }

    updateDayFilterOptions() {
        const days = new Set(
            this.state.images
                .map(filename => this.parseTimeFromFilename(filename)?.day)
                .filter(Boolean)
        );

        const options = Array.from(days)
            .sort((a, b) => a - b)
            .map(day => `<option value="${day}">Day ${day}</option>`);

        this.elements.filters.daySelect.innerHTML = 
            '<option value="all">All Days</option>' + options.join('');
    }

    parseTimeFromFilename(filename) {
        const match = filename.match(/(\d{2})-(\d{2})_(\d+)/);
        if (match) {
            const [, hours, minutes, day] = match;
            return {
                day: parseInt(day),
                hours: parseInt(hours),
                minutes: parseInt(minutes),
                timestamp: new Date(2024, 0, day, hours, minutes).getTime()
            };
        }
        return null;
    }

    createGalleryItem(filename) {
        const timeInfo = this.parseTimeFromFilename(filename);
        const displayName = timeInfo
            ? `Day ${timeInfo.day} - ${timeInfo.hours}:${String(timeInfo.minutes).padStart(2, '0')}`
            : filename;

        const item = document.createElement('div');
        item.className = 'item loading';
        
        item.innerHTML = `
            <div class="item-img">
                <img 
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    data-src="${this.constants.imagePath}${filename}"
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
        this.state.observer.observe(img);

        item.addEventListener('click', () => this.openImage(filename, displayName));
        return item;
    }

    updateGallery() {
        let filteredImages = this.filterImages();
        const start = 0;
        const end = this.state.currentPage * this.state.imagesPerPage;
        const imagesToShow = filteredImages.slice(start, end);

        this.elements.gallery.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        imagesToShow.forEach(filename => {
            fragment.appendChild(this.createGalleryItem(filename));
        });
        this.elements.gallery.appendChild(fragment);

        if (end < filteredImages.length) {
            this.addScrollTrigger();
        }
    }

    addScrollTrigger() {
        const trigger = document.createElement('div');
        trigger.className = 'scroll-trigger';
        trigger.style.height = '20px';
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.state.currentPage++;
                this.updateGallery();
                observer.disconnect();
            }
        }, { rootMargin: '100px' });

        observer.observe(trigger);
        this.elements.gallery.appendChild(trigger);
    }

    filterImages() {
        let filteredImages = this.state.images;

        if (this.state.selectedDay !== 'all') {
            filteredImages = filteredImages.filter(filename => {
                const timeInfo = this.parseTimeFromFilename(filename);
                return timeInfo?.day.toString() === this.state.selectedDay;
            });
        }

        filteredImages.sort((a, b) => {
            const timeA = this.parseTimeFromFilename(a);
            const timeB = this.parseTimeFromFilename(b);
            const multiplier = this.state.sortDirection === 'asc' ? 1 : -1;
            return (timeA.timestamp - timeB.timestamp) * multiplier;
        });

        return filteredImages;
    }

    openImage(filename, displayName) {
        this.state.currentImage = filename;
        this.elements.modal.image.innerHTML = `
            <img src="${this.constants.imagePath}${filename}" alt="${displayName}">
        `;
        this.elements.modal.name.textContent = displayName;
        this.toggleModal();
    }

    toggleModal() {
        this.state.isModalOpen = !this.state.isModalOpen;
        this.modal.reversed(!this.modal.reversed());
        document.body.style.overflow = this.state.isModalOpen ? 'hidden' : '';
    }

    handleResize() {
        if (this.state.isModalOpen) {
            // Update modal positioning/sizing if needed
        }
    }

    showError(message) {
        this.elements.gallery.innerHTML = `
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