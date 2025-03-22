// public/assets/home/controllers/ChordInputController.js

import {InputController} from "../controller/InputController.js?v=0.0.0";
import {ChordPositionGenerator} from "./ChordPositionGenerator.js?v=0.0.0";

export class ChordInputController extends InputController {
    constructor(patternVisualizer) {
        super(patternVisualizer);
        this.keyInput = document.getElementById('chord-key-input');
        this.scaleDegreeInput = document.getElementById('chord-scale-degree-input');
        this.chordScaleTypeSelect = document.getElementById('chord-scale-type-select');
        this.chordTypeSelect = document.getElementById('chord-type-select');

        // Bound methods to preserve context in event listeners
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadLocalStorageValues() {
        this.keyInput.value = localStorage.getItem('chord-root-note-input') || '';
        this.scaleDegreeInput.value = localStorage.getItem('chord-scale-degree-input') || '';
        this.chordTypeSelect.value = localStorage.getItem('chord-type-select') || '';
        this.chordScaleTypeSelect.value = localStorage.getItem('chord-scale-type-select') || '';

        if (this.keyInput.value && this.chordScaleTypeSelect && this.scaleDegreeInput.value && this.chordTypeSelect.value) {
            this.displayChordPattern();
        }
    }

    attachEventListeners() {
        this.keyInput.addEventListener('input', this.handleInputChange);
        this.scaleDegreeInput.addEventListener('input', this.handleInputChange);
        this.chordTypeSelect.addEventListener('change', this.handleInputChange);
        this.chordScaleTypeSelect.addEventListener('change', this.handleInputChange);
    }

    detachEventListeners() {
        this.keyInput.removeEventListener('input', this.handleInputChange);
        this.scaleDegreeInput.removeEventListener('input', this.handleInputChange);
        this.chordTypeSelect.removeEventListener('change', this.handleInputChange);
        this.chordScaleTypeSelect.removeEventListener('change', this.handleInputChange);
    }

    handleInputChange() {
        if (this.isActive) {
            localStorage.setItem('chord-root-note-input', this.keyInput.value);
            localStorage.setItem('chord-scale-degree-input', this.scaleDegreeInput.value);
            localStorage.setItem('chord-type-select', this.chordTypeSelect.value);
            localStorage.setItem('chord-scale-type-select', this.chordScaleTypeSelect.value);
            this.displayChordPattern();
        }
    }

    displayChordPattern() {
        // this.settingsForm.checkValidity() cannot be used as it needs to have valid name attributes
        if (this.keyInput.checkValidity() && this.scaleDegreeInput.checkValidity()) {
            const notesOnStrings = new ChordPositionGenerator().getChordNotesOnStrings(
                this.keyInput.value,
                this.chordScaleTypeSelect.value,
                this.scaleDegreeInput.value,
                this.chordTypeSelect.value,
            );

            this.patternVisualizer.displayPattern(notesOnStrings, this.chordTypeSelect.value);
        } else {
            this.settingsForm.reportValidity();
        }
    }
}