// constants.js
export const GALLERY_CONFIG = {
    // GitHub repository details
    owner: 'jmuozan',
    repo: 'IaaC_LLUM25_Website',
    imagePath: 'assets/img',  // Path within the repository
    
    // Base paths for the website
    basePath: '/IaaC_LLUM25_Website',
    imageUrlPath: '/IaaC_LLUM25_Website/assets/img/',
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