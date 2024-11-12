document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.querySelector(".gallery");
  const imgModal = document.querySelector(".img-modal");
  const imgViewContainer = imgModal.querySelector(".img");
  const modalName = imgModal.querySelector(".img-name p");

  const tl = gsap.timeline({ paused: true });
  let clickedItemImgSrc = "";
  let clickedItemName = "";

  // GitHub repository details
  const owner = 'jmuozan';
  const repo = 'IaaC_LLUM25_Website';
  const path = 'assets';

  // Function to parse time from filename
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

  // Custom sorting function
  function compareFilenames(a, b) {
    const timeA = parseTimeFromFilename(a);
    const timeB = parseTimeFromFilename(b);
    
    if (!timeA || !timeB) return 0;
    
    // Compare days first
    if (timeA.day !== timeB.day) {
      return timeA.day - timeB.day;
    }
    
    // If same day, compare hours
    if (timeA.hours !== timeB.hours) {
      return timeA.hours - timeB.hours;
    }
    
    // If same hour, compare minutes
    return timeA.minutes - timeB.minutes;
  }

  fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        console.log('Received data:', data);
        throw new Error('Expected an array of files');
      }

      // Filter for jpeg files and sort them
      const imageFiles = data
        .filter(file => 
          file.name.toLowerCase().endsWith('.jpeg') || 
          file.name.toLowerCase().endsWith('.jpg')
        )
        .map(file => file.name)
        .sort(compareFilenames);

      console.log('Found and sorted images:', imageFiles);

      // Create gallery items
      imageFiles.forEach(filename => {
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
        
        // Format the display name to be more readable
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
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      console.log('Error details:', error.message);
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