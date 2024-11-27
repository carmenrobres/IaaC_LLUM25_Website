// constants.js
export const GALLERY_CONFIG = {
    repoDetails: {
        owner: 'jmuozan',
        repo: 'IaaC_LLUM25_Website',
        path: 'assets/img'
    },
    // Use absolute paths for GitHub Pages
    imagePath: '/IaaC_LLUM25_Website/assets/img/',
    thumbnailPath: '/IaaC_LLUM25_Website/assets/img/thumbnails/',
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