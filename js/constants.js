// constants.js
export const GALLERY_CONFIG = {
    repoDetails: {
        owner: 'jmuozan',
        repo: 'IaaC_LLUM25_Website',
        path: 'assets/img'
    },
    // Use relative paths when in production (GitHub Pages)
    imagePath: window.location.hostname === 'jmuozan.github.io' ? 
        '/IaaC_LLUM25_Website/assets/img/' : 
        '/assets/img/',
    thumbnailPath: window.location.hostname === 'jmuozan.github.io' ? 
        '/IaaC_LLUM25_Website/assets/img/thumbnails/' : 
        '/assets/img/thumbnails/',
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