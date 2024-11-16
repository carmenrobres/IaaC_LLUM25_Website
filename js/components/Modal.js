// src/js/components/Modal.js
export class Modal {
    constructor(selectors) {
        this.container = document.querySelector(selectors.container);
        this.image = document.querySelector(selectors.image);
        this.name = document.querySelector(selectors.name);
        this.closeBtn = document.querySelector(selectors.closeBtn);
        this.isOpen = false;
        this.timeline = null;

        this.initializeModal();
        this.setupEventListeners();
    }

    initializeModal() {
        this.timeline = gsap.timeline({ paused: true })
            .to(".img-modal", {
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.75,
                ease: "power4.inOut",
                pointerEvents: "auto"
            })
            .to(".gallery, .container", {
                pointerEvents: "none",
                duration: 0.01
            })
            .to(".img-modal .img", {
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.75,
                ease: "power4.inOut"
            })
            .to(".modal-item p", {
                top: 0,
                duration: 1,
                ease: "power4.inOut",
                stagger: { amount: 0.2 }
            }, "<")
            .reverse();
    }

    setupEventListeners() {
        this.closeBtn?.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.timeline.reversed(!this.timeline.reversed());
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    updateContent(imageSrc, displayName) {
        this.image.innerHTML = `<img src="${imageSrc}" alt="${displayName}">`;
        this.name.textContent = displayName;
    }
}