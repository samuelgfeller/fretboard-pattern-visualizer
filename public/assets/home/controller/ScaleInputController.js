import {InputController} from './InputController.js?v=0.0.0';

export class ScaleInputController extends InputController {
    constructor(patternVisualizer) {
        super(patternVisualizer);

        this.rootNoteInput = document.getElementById('scale-root-note-input');
        this.scaleTypeSelect = document.getElementById('scale-type-select');

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadLocalStorageValues() {
        this.rootNoteInput.value = localStorage.getItem('scale-root-note-input') || '';
        this.scaleTypeSelect.value = localStorage.getItem('scale-type-select') || '';

        if (this.rootNoteInput.value && this.scaleTypeSelect.value) {
            this.displayScalePattern();
        }
    }

    attachEventListeners() {
        this.rootNoteInput.addEventListener('input', this.handleInputChange);
        this.scaleTypeSelect.addEventListener('change', this.handleInputChange);
    }

    detachEventListeners() {
        this.rootNoteInput.removeEventListener('input', this.handleInputChange);
        this.scaleTypeSelect.removeEventListener('change', this.handleInputChange);
    }

    handleInputChange() {
        if (this.isActive) {
            localStorage.setItem('scale-root-note-input', this.rootNoteInput.value);
            localStorage.setItem('scale-type-select', this.scaleTypeSelect.value);
            this.displayScalePattern();
        }
    }

    displayScalePattern() {
        if (this.rootNoteInput.checkValidity() && this.scaleTypeSelect) {
            const notesOnStrings = this.positionsGenerator.getScaleNotesOnStrings(
                this.rootNoteInput.value, this.scaleTypeSelect.value
            );
            this.patternVisualizer.displayPattern(notesOnStrings);
        } else {
            this.settingsForm.reportValidity();
        }
    }

}