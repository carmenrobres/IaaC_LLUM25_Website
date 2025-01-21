// constants.js
export const GALLERY_CONFIG = {
    repo: 'IaaC_LLUM25_Website',
    supabaseUrl: 'https://ogezfwngzpwubwypbzvq.supabase.co',
    supabaseBucket: 'images',
    textTable: 'transcriptions', // Supabase table name for text
    imagesPerPage: 15,
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