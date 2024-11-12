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
  const path = 'assets'; // The folder path in your repository

  // Fetch images from GitHub repository
  fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Check if data is an array
      if (!Array.isArray(data)) {
        console.log('Received data:', data);
        throw new Error('Expected an array of files');
      }

      // Filter for jpeg files
      const imageFiles = data
        .filter(file => 
          file.name.toLowerCase().endsWith('.jpeg') || 
          file.name.toLowerCase().endsWith('.jpg')
        )
        .map(file => file.name);

      console.log('Found images:', imageFiles);

      // Create gallery items
      imageFiles.forEach(filename => {
        const item = document.createElement("div");
        item.classList.add("item");

        const itemImg = document.createElement("div");
        itemImg.classList.add("item-img");

        const imgTag = document.createElement("img");
        imgTag.src = `./assets/${filename}`;
        imgTag.loading = "lazy"; // Add lazy loading for better performance
        itemImg.appendChild(imgTag);

        const itemName = document.createElement("div");
        itemName.classList.add("item-name");
        itemName.innerHTML = `<p>${filename}</p>`;
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