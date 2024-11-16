// js/constants.js
export const GALLERY_CONFIG = {
    repoDetails: {
        owner: 'jmuozan',
        repo: 'IaaC_LLUM25_Website',
        path: 'assets/img'  // Updated path to include img subfolder
    },
    imagePath: './assets/img/',  // Updated image path
    thumbnailPath: './assets/img/thumbnails/',  // Updated thumbnail path
    imagesPerPage: 12
};

export const SELECTORS = {
    gallery: ".gallery",
    header: ".header-container",
    modal: {
        container: ".img-modal",
        image: ".img-modal .img",
        name: ".img-modal .img-name p",
        closeBtn: ".close-btn"
    }
};