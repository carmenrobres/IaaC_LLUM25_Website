document.addEventListener("DOMContentLoaded", function () {
  class GalleryApp {
    constructor() {
      // Main containers
      this.galleryContainer = document.querySelector(".gallery");
      this.headerContainer = this.createHeaderContainer();
      this.filterControls = this.createFilterControls();
      
      // Modal elements
      this.imgModal = document.querySelector(".img-modal");
      this.imgViewContainer = this.imgModal?.querySelector(".img");
      this.modalName = this.imgModal?.querySelector(".img-name p");
      this.closeBtn = document.querySelector(".close-btn");
      
      // State
      this.allImages = [];
      this.sortAscending = true;
      this.timeline = gsap.timeline({ paused: true });
      
      // Initialize
      this.setupEventListeners();
      this.initializeModal();
      this.fetchImages();
    }

    createHeaderContainer() {
      const headerContainer = document.createElement("div");
      headerContainer.classList.add("header-container");
      headerContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 4em 50px 2em 50px;
        width: calc(100% - 100px);
      `;

      // Move existing h1 into header container
      const existingH1 = document.querySelector("h1");
      const h1Parent = existingH1.parentNode;
      headerContainer.appendChild(existingH1);
      existingH1.style.margin = "0";
      
      h1Parent.insertBefore(headerContainer, h1Parent.firstChild);
      return headerContainer;
    }

    createFilterControls() {
      const filterContainer = document.createElement("div");
      filterContainer.classList.add("filter-controls");
      filterContainer.style.cssText = `
        display: flex;
        gap: 20px;
        align-items: center;
      `;

      // Create day filter
      const daySelect = document.createElement("select");
      daySelect.style.cssText = `
        padding: 8px 16px;
        border-radius: 0px;
        background: #1a1a1a;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
      `;
      const defaultOption = document.createElement("option");
      defaultOption.value = "all";
      defaultOption.textContent = "All Days";
      daySelect.appendChild(defaultOption);

      // Create sort toggle
      const sortToggle = document.createElement("button");
      sortToggle.textContent = "↓ Chronological";
      sortToggle.style.cssText = `
        padding: 8px 16px;
        border-radius: 0px;
        background: #1a1a1a;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        min-width: 140px;
      `;

      filterContainer.appendChild(daySelect);
      filterContainer.appendChild(sortToggle);
      this.headerContainer.appendChild(filterContainer);

      return {
        container: filterContainer,
        daySelect,
        sortToggle
      };
    }

    parseTimeFromFilename(filename) {
      const match = filename.match(/(\d{2})-(\d{2})_(\d+)/);
      if (match) {
        const [, hours, minutes, day] = match;
        return {
          day: parseInt(day),
          hours: parseInt(hours),
          minutes: parseInt(minutes)
        };
      }
      return null;
    }

    compareFilenames(a, b) {
      const timeA = this.parseTimeFromFilename(a);
      const timeB = this.parseTimeFromFilename(b);
      
      if (!timeA || !timeB) return 0;
      
      const multiplier = this.sortAscending ? 1 : -1;
      
      if (timeA.day !== timeB.day) return (timeA.day - timeB.day) * multiplier;
      if (timeA.hours !== timeB.hours) return (timeA.hours - timeB.hours) * multiplier;
      return (timeA.minutes - timeB.minutes) * multiplier;
    }

    createGalleryItem(filename) {
      const item = document.createElement("div");
      item.classList.add("item");

      const itemImg = document.createElement("div");
      itemImg.classList.add("item-img");

      const img = document.createElement("img");
      img.src = `./assets/${filename}`;
      img.loading = "lazy";
      itemImg.appendChild(img);

      const itemName = document.createElement("div");
      itemName.classList.add("item-name");
      
      const timeInfo = this.parseTimeFromFilename(filename);
      const displayName = timeInfo ? 
        `Day ${timeInfo.day} - ${timeInfo.hours}:${timeInfo.minutes.toString().padStart(2, '0')}` :
        filename;
      
      itemName.innerHTML = `<p>${displayName}</p>`;
      itemName.setAttribute("data-img", filename.replace(/\.(jpeg|jpg)$/, ""));

      item.appendChild(itemImg);
      item.appendChild(itemName);

      item.addEventListener("click", () => this.handleItemClick(itemName));

      return item;
    }

    handleItemClick(itemName) {
      if (!this.imgViewContainer || !this.modalName) return;

      const dataImg = itemName.getAttribute("data-img");
      const clickedItemImgSrc = `./assets/${dataImg}.jpeg`;
      const clickedItemName = itemName.textContent;

      this.imgViewContainer.innerHTML = `<img src="${clickedItemImgSrc}" alt="" />`;
      this.modalName.textContent = clickedItemName;
      this.timeline.reversed(!this.timeline.reversed());
    }

    updateGallery() {
      const selectedDay = this.filterControls.daySelect.value;
      let filteredImages = this.allImages;

      if (selectedDay !== 'all') {
        filteredImages = this.allImages.filter(filename => {
          const timeInfo = this.parseTimeFromFilename(filename);
          return timeInfo && timeInfo.day.toString() === selectedDay;
        });
      }

      filteredImages.sort((a, b) => this.compareFilenames(a, b));
      
      this.galleryContainer.innerHTML = '';
      filteredImages.forEach(filename => {
        this.galleryContainer.appendChild(this.createGalleryItem(filename));
      });
    }

    initializeModal() {
      if (!this.imgModal) return;

      this.timeline
        .to(".img-modal", 0.75, {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
          pointerEvents: "auto",
        })
        .to(".gallery, .container", 0.01, {
          pointerEvents: "none",
        })
        .to(".img-modal .img", 0.75, {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        })
        .to(
          ".modal-item p",
          1,
          {
            top: 0,
            ease: "power4.inOut",
            stagger: {
              amount: 0.2,
            },
          },
          "<"
        )
        .reverse();
    }

    setupEventListeners() {
      this.filterControls.daySelect.addEventListener('change', () => this.updateGallery());
      
      this.filterControls.sortToggle.addEventListener('click', () => {
        this.sortAscending = !this.sortAscending;
        this.filterControls.sortToggle.textContent = this.sortAscending ? 
          "↓ Chronological" : "↑ Reverse Order";
        this.updateGallery();
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener("click", () => {
          this.timeline.reversed(!this.timeline.reversed());
        });
      }
    }

    async fetchImages() {
      try {
        const owner = 'jmuozan';
        const repo = 'IaaC_LLUM25_Website';
        const path = 'assets';

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Expected an array of files');

        this.allImages = data
          .filter(file => /\.(jpeg|jpg)$/i.test(file.name))
          .map(file => file.name);

        // Populate day filter options
        const days = new Set(
          this.allImages
            .map(filename => this.parseTimeFromFilename(filename)?.day)
            .filter(Boolean)
        );

        [...days].sort((a, b) => a - b).forEach(day => {
          const option = document.createElement("option");
          option.value = day.toString();
          option.textContent = `Day ${day}`;
          this.filterControls.daySelect.appendChild(option);
        });

        this.updateGallery();
      } catch (error) {
        console.error('Error:', error);
        this.galleryContainer.innerHTML = '<p style="color: white;">Error loading gallery. Please refresh the page.</p>';
      }
    }
  }

  // Initialize the gallery application
  new GalleryApp();
});