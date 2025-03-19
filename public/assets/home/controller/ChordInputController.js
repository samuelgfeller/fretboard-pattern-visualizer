// public/assets/home/controllers/ChordInputController.js
import {InputController} from './InputController.js?v=0.0.0';

export class ChordInputController extends InputController {
    constructor(patternVisualizer) {
        super(patternVisualizer);
        this.rootNoteInput = document.getElementById('root-note-input');
        this.scaleDegreeInput = document.getElementById('note-num-input');
        this.chordTypeSelect = document.getElementById('chord-type-select');

        // Bound methods to preserve context in event listeners
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadLocalStorageValues() {
        this.rootNoteInput.value = localStorage.getItem('chord-root-note-input') || '';
        this.scaleDegreeInput.value = localStorage.getItem('chord-scale-degree-input') || '';
        this.chordTypeSelect.value = localStorage.getItem('chord-type-select') || '';

        if (this.rootNoteInput.value && this.scaleDegreeInput.value && this.chordTypeSelect.value) {
            this.displayChordPattern();
        }
    }

    attachEventListeners() {
        this.rootNoteInput.addEventListener('input', this.handleInputChange);
        this.scaleDegreeInput.addEventListener('input', this.handleInputChange);
        this.chordTypeSelect.addEventListener('change', this.handleInputChange);
    }

    detachEventListeners() {
        this.rootNoteInput.removeEventListener('input', this.handleInputChange);
        this.scaleDegreeInput.removeEventListener('input', this.handleInputChange);
        this.chordTypeSelect.removeEventListener('change', this.handleInputChange);
    }

    handleInputChange() {
        if (this.isActive) {
            localStorage.setItem('chord-root-note-input', this.rootNoteInput.value);
            localStorage.setItem('chord-scale-degree-input', this.scaleDegreeInput.value);
            localStorage.setItem('chord-type-select', this.chordTypeSelect.value);
            this.displayChordPattern();
        }
    }

    displayChordPattern() {
        // this.settingsForm.checkValidity() cannot be used as it needs to have valid name attributes
        if (this.rootNoteInput.checkValidity() && this.scaleDegreeInput.checkValidity() && this.chordTypeSelect.checkValidity()) {
            const notesOnStrings = this.positionsGenerator.getChordNotesOnStrings(
                this.rootNoteInput.value,
                this.scaleDegreeInput.value,
                this.chordTypeSelect.value
            );
            console.log(notesOnStrings);

            this.patternVisualizer.displayPattern(notesOnStrings);
        } else {
            this.settingsForm.reportValidity();
        }
    }
}