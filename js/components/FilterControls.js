// js/components/FilterControls.js
import { parseTimeFromFilename } from '../utils/imageUtils.js';

export class FilterControls {
    constructor(container, onFilterChange) {
        this.container = container;
        this.onFilterChange = onFilterChange;
        this.controls = this.createControls();
        this.setupEventListeners();
    }

    createControls() {
        const filterContainer = document.createElement("div");
        filterContainer.className = "filter-controls";

        const daySelect = document.createElement("select");
        daySelect.innerHTML = '<option value="all">All Days</option>';
        
        const sortButton = document.createElement("button");
        sortButton.textContent = "↓ Chronological";
        
        filterContainer.appendChild(daySelect);
        filterContainer.appendChild(sortButton);
        this.container.appendChild(filterContainer);

        return { daySelect, sortButton };
    }

    setupEventListeners() {
        this.controls.daySelect.addEventListener('change', () => {
            this.onFilterChange({
                type: 'day',
                value: this.controls.daySelect.value
            });
        });

        this.controls.sortButton.addEventListener('click', () => {
            const newDirection = this.controls.sortButton.textContent.includes('↓') ? 'desc' : 'asc';
            this.controls.sortButton.textContent = newDirection === 'asc' ? "↓ Chronological" : "↑ Reverse Order";
            
            this.onFilterChange({
                type: 'sort',
                value: newDirection
            });
        });
    }

    updateDayOptions(images) {
        const days = new Set(
            images
                .map(filename => parseTimeFromFilename(filename)?.day)
                .filter(Boolean)
        );

        const options = Array.from(days)
            .sort((a, b) => a - b)
            .map(day => `<option value="${day}">Day ${day}</option>`);

        this.controls.daySelect.innerHTML = 
            '<option value="all">All Days</option>' + options.join('');
    }
}