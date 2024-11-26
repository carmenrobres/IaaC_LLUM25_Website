export class Modal {
    constructor(selectors) {
        this.modal = document.querySelector(selectors.container);
        this.imgContainer = this.modal.querySelector('.img');
        this.nameElement = this.modal.querySelector('.img-name');
        this.closeBtn = this.modal.querySelector('.close-btn');
        
        // Create text content container if it doesn't exist
        this.textContainer = document.createElement('div');
        this.textContainer.className = 'modal-text-content';
        // Insert text container before the close button
        this.modal.insertBefore(this.textContainer, this.closeBtn);
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Add click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Prevent clicks inside the modal from closing it
        this.imgContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open({ imageSrc, imageName, textContent = '' }) {
        // Create and setup image
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = imageName;

        // Clear previous content
        this.imgContainer.innerHTML = '';
        this.imgContainer.appendChild(img);

        // Update name and text content
        this.nameElement.innerHTML = `<p>${imageName}</p>`;
        this.textContainer.innerHTML = textContent ?
            `<div class="text-content">${textContent}</div>` :
            '<div class="text-content">No description available</div>';

        // Show modal with opacity transition
        this.modal.classList.add('open');
    }

    close() {
        this.modal.classList.remove('open');
    }
}