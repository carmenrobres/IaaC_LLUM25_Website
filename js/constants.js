// constants.js
export const GALLERY_CONFIG = {
    repoDetails: {
        owner: 'jmuozan',
        repo: 'IaaC_LLUM25_Website',
        path: 'assets/img'
    },
    imagePath: '/IaaC_LLUM25_Website/assets/img/',  // Updated for GitHub Pages
    thumbnailPath: '/IaaC_LLUM25_Website/assets/img/thumbnails/',  // Updated for GitHub Pages
    imagesPerPage: 15
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