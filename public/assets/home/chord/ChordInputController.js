// public/assets/home/controllers/ChordInputController.js

import {InputController} from "../controller/InputController.js?v=0.1.1";
import {ChordPositionGenerator} from "./ChordPositionGenerator.js?v=0.1.1";
import {ColorSettingsController} from "../pattern-visualizer/ColorSettingController.js?v=0.1.1";
import {ChordTonalityCalculator} from "../music-util/ChordTonalityCalculator.js?v=0.1.1";

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

        if (this.keyInput.value && this.chordScaleTypeSelect.value && this.scaleDegreeInput.value) {
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
        this.keyInput?.removeEventListener('input', this.handleInputChange);
        this.scaleDegreeInput?.removeEventListener('input', this.handleInputChange);
        this.chordTypeSelect?.removeEventListener('change', this.handleInputChange);
        this.chordScaleTypeSelect?.removeEventListener('change', this.handleInputChange);
    }

    handleInputChange(event) {
        if (this.isActive) {
            localStorage.setItem('chord-root-note-input', this.keyInput.value);
            localStorage.setItem('chord-scale-degree-input', this.scaleDegreeInput.value);
            localStorage.setItem('chord-type-select', this.chordTypeSelect.value);
            localStorage.setItem('chord-scale-type-select', this.chordScaleTypeSelect.value);
            this.displayChordPattern(event);
            ColorSettingsController.updateTextColors();
        }
    }

    displayChordPattern(event = null) {
        // this.settingsForm.checkValidity() cannot be used as it needs to have valid name attributes
        if (this.keyInput.checkValidity() && this.scaleDegreeInput.checkValidity() && this.chordScaleTypeSelect.checkValidity()) {
            // Set the this.chordTypeSelect to the default tonality, only if the change didn't come from the chord type select
            if (event === null || event.target !== this.chordTypeSelect) {
                // Is tested only for major and minor scales, other scales might not work
                const chordTonalities = ChordTonalityCalculator.getChordTonalitiesForScale(this.chordScaleTypeSelect.value);
                this.chordTypeSelect.value = chordTonalities[this.scaleDegreeInput.value.replace('#', '♯').replace('b', '♭',)];
            }
            // Check if chordTypeSelect is valid (not empty) before generating the chord
            if (this.chordTypeSelect.checkValidity()) {
                let extraFrets = 3;
                const notesOnStrings = new ChordPositionGenerator().getChordNotesOnStrings(
                    this.keyInput.value,
                    this.chordScaleTypeSelect.value,
                    this.scaleDegreeInput.value,
                    this.chordTypeSelect.value,
                    extraFrets
                );

                this.patternVisualizer.displayPattern(notesOnStrings, this.chordTypeSelect.value, extraFrets);
            }
        } else if (localStorage.getItem('chord-root-note-input') && localStorage.getItem('chord-scale-degree-input') && localStorage.getItem('chord-scale-type-select')) {
            this.settingsForm.reportValidity();
        }
    }
}