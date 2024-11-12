document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.querySelector(".gallery");
  const imgModal = document.querySelector(".img-modal");
  const imgViewContainer = imgModal.querySelector(".img");
  const modalName = imgModal.querySelector(".img-name p");

  const tl = gsap.timeline({ paused: true });
  let clickedItemImgSrc = "";
  let clickedItemName = "";
  let allImages = []; // Store all images for filtering

  // Create filter controls
  const filterContainer = document.createElement("div");
  filterContainer.classList.add("filter-controls");
  filterContainer.style.cssText = `
    margin: 20px 0;
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
  `;

  // Day filter
  const daySelect = document.createElement("select");
  daySelect.style.cssText = `
    padding: 8px 16px;
    border-radius: 4px;
    background: #1a1a1a;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
  `;

  const dayOption = document.createElement("option");
  dayOption.value = "all";
  dayOption.textContent = "All Days";
  daySelect.appendChild(dayOption);

  // Sort direction toggle
  const sortToggle = document.createElement("button");
  sortToggle.textContent = "↓ Chronological";
  sortToggle.style.cssText = `
    padding: 8px 16px;
    border-radius: 4px;
    background: #1a1a1a;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    min-width: 140px;
  `;
  let sortAscending = true;

  // Insert controls before gallery
  filterContainer.appendChild(daySelect);
  filterContainer.appendChild(sortToggle);
  galleryContainer.parentNode.insertBefore(filterContainer, galleryContainer);

  function parseTimeFromFilename(filename) {
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

  function compareFilenames(a, b, ascending = true) {
    const timeA = parseTimeFromFilename(a);
    const timeB = parseTimeFromFilename(b);
    
    if (!timeA || !timeB) return 0;
    
    // Compare days first
    if (timeA.day !== timeB.day) {
      return ascending ? timeA.day - timeB.day : timeB.day - timeA.day;
    }
    
    // If same day, compare hours
    if (timeA.hours !== timeB.hours) {
      return ascending ? timeA.hours - timeB.hours : timeB.hours - timeA.hours;
    }
    
    // If same hour, compare minutes
    return ascending ? timeA.minutes - timeB.minutes : timeB.minutes - timeA.minutes;
  }

  function updateGallery(images) {
    // Clear existing gallery
    while (galleryContainer.firstChild) {
      galleryContainer.firstChild.remove();
    }

    // Create gallery items
    images.forEach(filename => {
      const item = document.createElement("div");
      item.classList.add("item");

      const itemImg = document.createElement("div");
      itemImg.classList.add("item-img");

      const imgTag = document.createElement("img");
      imgTag.src = `./assets/${filename}`;
      imgTag.loading = "lazy";
      itemImg.appendChild(imgTag);

      const itemName = document.createElement("div");
      itemName.classList.add("item-name");
      
      const timeInfo = parseTimeFromFilename(filename);
      const displayName = timeInfo ? 
        `Day ${timeInfo.day} - ${timeInfo.hours}:${timeInfo.minutes.toString().padStart(2, '0')}` :
        filename;
      
      itemName.innerHTML = `<p>${displayName}</p>`;
      itemName.setAttribute("data-img", filename.replace(/\.(jpeg|jpg)$/, ""));

      item.appendChild(itemImg);
      item.appendChild(itemName);

      item.addEventListener("click", () => {
        const dataImg = itemName.getAttribute("data-img");
        if (imgViewContainer && modalName) {
          clickedItemImgSrc = `./assets/${dataImg}.jpeg`;
          clickedItemName = itemName.textContent;
          imgViewContainer.innerHTML = `<img src="${clickedItemImgSrc}" alt="" />`;
          modalName.textContent = clickedItemName;
          tl.reversed(!tl.reversed());
        }
      });

      galleryContainer.appendChild(item);
    });
  }

  function filterAndSortImages() {
    const selectedDay = daySelect.value;
    let filteredImages = allImages;

    // Filter by day
    if (selectedDay !== 'all') {
      filteredImages = allImages.filter(filename => {
        const timeInfo = parseTimeFromFilename(filename);
        return timeInfo && timeInfo.day.toString() === selectedDay;
      });
    }

    // Sort images
    filteredImages.sort((a, b) => compareFilenames(a, b, sortAscending));
    
    updateGallery(filteredImages);
  }

  // Event listeners for filters
  daySelect.addEventListener('change', filterAndSortImages);
  
  sortToggle.addEventListener('click', () => {
    sortAscending = !sortAscending;
    sortToggle.textContent = sortAscending ? "↓ Chronological" : "↑ Reverse Order";
    filterAndSortImages();
  });

  // Fetch images from GitHub repository
  const owner = 'jmuozan';
  const repo = 'IaaC_LLUM25_Website';
  const path = 'assets';

  fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Expected an array of files');

      // Store all images
      allImages = data
        .filter(file => 
          file.name.toLowerCase().endsWith('.jpeg') || 
          file.name.toLowerCase().endsWith('.jpg')
        )
        .map(file => file.name);

      // Get unique days for the filter
      const days = new Set(allImages.map(filename => {
        const timeInfo = parseTimeFromFilename(filename);
        return timeInfo ? timeInfo.day : null;
      }).filter(day => day !== null));

      // Add day options to select
      [...days].sort((a, b) => a - b).forEach(day => {
        const option = document.createElement("option");
        option.value = day.toString();
        option.textContent = `Day ${day}`;
        daySelect.appendChild(option);
      });

      // Initial gallery display
      filterAndSortImages();
    })
    .catch(error => {
      console.error('Error:', error);
      galleryContainer.innerHTML = '<p style="color: white;">Error loading gallery. Please refresh the page.</p>';
    });

  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      tl.reversed(!tl.reversed());
    });
  }

  function revealModal() {
    tl.to(".img-modal", 0.75, {
      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power4.inOut",
      pointerEvents: "auto",
    });

    tl.to(".gallery, .container", 0.01, {
      pointerEvents: "none",
    });

    tl.to(".img-modal .img", 0.75, {
      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power4.inOut",
    });

    tl.to(
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
    ).reverse();
  }

  revealModal();
});