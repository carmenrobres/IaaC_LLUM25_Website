document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.querySelector(".gallery");
  const imgModal = document.querySelector(".img-modal");
  const imgViewContainer = imgModal.querySelector(".img");
  const modalName = imgModal.querySelector(".img-name p");

  const tl = gsap.timeline({ paused: true });
  let clickedItemImgSrc = "";
  let clickedItemName = "";

  // List of actual image names that exist in your assets folder
  const imageFiles = [
    "09-00_7.jpeg",
    "10-00_7.jpeg",
    "11-00_7.jpeg",
    "12-00_7.jpeg",
    "13-00_7.jpeg",
    "14-00_7.jpeg",
    "15-00_7.jpeg",
    "16-00_7.jpeg",
    "17-00_7.jpeg",
    "18-00_7.jpeg",
    "19-00_7.jpeg",
    "20-00_7.jpeg",
    "21-00_7.jpeg",
    "22-00_7.jpeg",
    "23-00_7.jpeg",
    "00-00_8.jpeg",
    "01-00_8.jpeg",
    "02-00_8.jpeg",
    "03-00_8.jpeg",
    "04-00_8.jpeg",
    "05-00_8.jpeg",
    "06-00_8.jpeg",
    "07-00_8.jpeg",
    "08-00_8.jpeg"
  ];

  // Create gallery items
  imageFiles.forEach(filename => {
    const item = document.createElement("div");
    item.classList.add("item");

    const itemImg = document.createElement("div");
    itemImg.classList.add("item-img");

    const imgTag = document.createElement("img");
    imgTag.src = `./assets/${filename}`;
    itemImg.appendChild(imgTag);

    const itemName = document.createElement("div");
    itemName.classList.add("item-name");
    itemName.innerHTML = `<p>${filename}</p>`;
    itemName.setAttribute("data-img", filename.replace(".jpeg", ""));

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