// Gallery Application
class GalleryApp {
  constructor() {
      // DOM Elements
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

      // State
      this.state = {
          images: [],
          sortDirection: 'asc',
          selectedDay: 'all',
          isModalOpen: false,
          currentImage: null
      };

      // Constants
      this.constants = {
          repoDetails: {
              owner: 'jmuozan',
              repo: 'IaaC_LLUM25_Website',
              path: 'assets'
          },
          imagePath: './assets/'
      };

      // Initialize
      this.init();
  }

  async init() {
      try {
          this.initializeFilterControls();
          this.initializeModal();
          this.setupEventListeners();
          await this.fetchImages();
          this.initializeLucideIcons();
      } catch (error) {
          console.error('Initialization error:', error);
          this.showError('Failed to initialize the gallery. Please refresh the page.');
      }
  }

  initializeFilterControls() {
      // Create filter container
      const filterContainer = document.createElement("div");
      filterContainer.className = "filter-controls";

      // Create day filter
      const daySelect = document.createElement("select");
      daySelect.innerHTML = '<option value="all">All Days</option>';
      
      // Create sort button
      const sortButton = document.createElement("button");
      sortButton.textContent = "↓ Chronological";
      
      // Add to DOM
      filterContainer.appendChild(daySelect);
      filterContainer.appendChild(sortButton);
      this.elements.header.appendChild(filterContainer);

      // Store references
      this.elements.filters = { daySelect, sortButton };
  }

  initializeModal() {
      this.modal = gsap.timeline({ paused: true });
      
      // Set up modal animation
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
      // Filter events
      this.elements.filters.daySelect.addEventListener('change', () => {
          this.state.selectedDay = this.elements.filters.daySelect.value;
          this.updateGallery();
      });

      this.elements.filters.sortButton.addEventListener('click', () => {
          this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
          this.elements.filters.sortButton.textContent = 
              this.state.sortDirection === 'asc' ? "↓ Chronological" : "↑ Reverse Order";
          this.updateGallery();
      });

      // Modal events
      this.elements.modal.closeBtn?.addEventListener('click', () => this.toggleModal());

      // Window resize event
      window.addEventListener('resize', this.handleResize.bind(this));
  }

  async fetchImages() {
      try {
          const { owner, repo, path } = this.constants.repoDetails;
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();
          
          if (!Array.isArray(data)) throw new Error('Expected an array of files');

          // Filter and store images
          this.state.images = data
              .filter(file => /\.(jpeg|jpg)$/i.test(file.name))
              .map(file => file.name);

          // Update day filter options
          this.updateDayFilterOptions();

          // Initial gallery render
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
      item.className = 'item';
      item.innerHTML = `
          <div class="item-img">
              <img src="${this.constants.imagePath}${filename}" loading="lazy" alt="${displayName}">
          </div>
          <div class="item-name">
              <p>${displayName}</p>
          </div>
      `;

      item.addEventListener('click', () => this.openImage(filename, displayName));
      return item;
  }

  updateGallery() {
      let filteredImages = this.state.images;

      // Apply day filter
      if (this.state.selectedDay !== 'all') {
          filteredImages = filteredImages.filter(filename => {
              const timeInfo = this.parseTimeFromFilename(filename);
              return timeInfo?.day.toString() === this.state.selectedDay;
          });
      }

      // Sort images
      filteredImages.sort((a, b) => {
          const timeA = this.parseTimeFromFilename(a);
          const timeB = this.parseTimeFromFilename(b);
          const multiplier = this.state.sortDirection === 'asc' ? 1 : -1;
          return (timeA.timestamp - timeB.timestamp) * multiplier;
      });

      // Update DOM
      this.elements.gallery.innerHTML = '';
      const fragment = document.createDocumentFragment();
      filteredImages.forEach(filename => {
          fragment.appendChild(this.createGalleryItem(filename));
      });
      this.elements.gallery.appendChild(fragment);
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
      // Add any resize-specific handling here
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