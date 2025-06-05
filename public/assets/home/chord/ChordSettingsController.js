// public/assets/home/controllers/ChordInputController.js

import {SettingsController} from "../controller/SettingsController.js?v=0.3.1";
import {ChordPositionGenerator} from "./ChordPositionGenerator.js?v=0.3.1";
import {ColorSettingsController} from "../pattern-visualizer/ColorSettingController.js?v=0.3.1";
import {ChordTonalityCalculator} from "../music-util/ChordTonalityCalculator.js?v=0.3.1";
import {PatternVisualizer} from "../pattern-visualizer/PatternVisualizer.js?v=0.3.1";
import {
    getChordTonalitySettingsHtml,
    getMainChordSettingsHtml
} from "./ChordHtmlElements.html.js?v=0.3.1";

export class ChordSettingsController extends SettingsController {
    constructor(patternVisualizer) {
        super(patternVisualizer);

        this.selectedChordScaleDegree = '';
        this.diatonicChordTonalityOfSelectedScaleDegree = '';


        // Bound methods to preserve context in event listeners
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleScaleDegreeButtonClick = this.handleScaleDegreeButtonClick.bind(this);
    }

    addSettingsHtmlElements() {
        // Add main settings (visible always)
        document.getElementById('settings-form').insertAdjacentHTML('afterbegin', `
            <div id="chord-main-settings-container" class="main-settings-container">
                ${getMainChordSettingsHtml()}
            </div>
        `);

        // Add hidden by default settings
        document.getElementById('collapsible-settings-div').insertAdjacentHTML('afterbegin', `
            ${getChordTonalitySettingsHtml()}
        `);

        // Populate class variables after adding the html elements to the DOM
        this.keyInput = document.getElementById('chord-key-input');
        this.chordScaleTypeSelect = document.getElementById('chord-scale-type-select');
        this.chordTypeSelect = document.getElementById('chord-type-select');
        this.scaleDegreeInput = document.getElementById('chord-scale-degree-input');
        this.chordScaleDegreeButtonsContainer = document.getElementById('chord-scale-degree-buttons');
    }

    removeSettingsHtmlElements() {
        document.getElementById('chord-main-settings-container')?.remove();
        document.getElementById('chord-tonality-select-container')?.remove();
    }

    generateChordScaleDegreeButtons() {
        if (this.chordScaleTypeSelect.value === '') {
            return;
        }
        document.getElementById('scale-degree-input-group').classList.remove('hidden');

        const existingButtons = this.chordScaleDegreeButtonsContainer.querySelectorAll('.scale-degree-button');
        existingButtons.forEach(button => button.remove());

        const chordTonalities = ChordTonalityCalculator.getChordTonalitiesForScale(this.chordScaleTypeSelect.value);

        // Iterate over the Map using for...of
        for (const [scaleDegree, tonality] of chordTonalities.entries()) {
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('scale-degree-button');
            button.classList.add(tonality);
            button.dataset.scaleDegree = scaleDegree;
            button.dataset.diatonicTonality = tonality;
            button.textContent = scaleDegree;

            if (this.selectedChordScaleDegree === scaleDegree) {
                button.classList.add('selected');
            }
            // Insert before the scale degree input
            this.scaleDegreeInput.insertAdjacentElement('beforebegin', button);
        }
    }

    loadLocalStorageValues() {
        this.keyInput.value = localStorage.getItem('chord-root-note-input') || '';
        this.chordTypeSelect.value = localStorage.getItem('chord-type-select') || '';
        this.chordScaleTypeSelect.value = localStorage.getItem('chord-scale-type-select') || '';

        // Generate buttons initially
        this.generateChordScaleDegreeButtons();
        // select the button with the selected scale degree if it exists, otherwise populate scaledegreeinput
        const storedChordScaleDegree = localStorage.getItem('chord-scale-degree') || '';
        this.selectedChordScaleDegree = storedChordScaleDegree;
        const selectedScaleDegreeButton = this.chordScaleDegreeButtonsContainer.querySelector(`.scale-degree-button[data-scale-degree="${storedChordScaleDegree}"]`);
        if (selectedScaleDegreeButton) {
            selectedScaleDegreeButton.click();
        } else {
            this.scaleDegreeInput.value = storedChordScaleDegree;
        }

        if (this.keyInput.value && this.chordScaleTypeSelect.value && this.selectedChordScaleDegree.length > 0) {
            this.displayChordPattern();
        }
    }

    attachEventListeners() {
        this.keyInput.addEventListener('input', this.handleInputChange);
        this.chordTypeSelect.addEventListener('change', this.handleInputChange);
        this.chordScaleTypeSelect.addEventListener('change', this.handleInputChange);
        // Scale degree
        this.scaleDegreeInput.addEventListener('input', this.handleInputChange);
        this.chordScaleDegreeButtonsContainer.addEventListener('click', this.handleScaleDegreeButtonClick);
    }

    detachEventListeners() {
        this.keyInput?.removeEventListener('input', this.handleInputChange);
        this.scaleDegreeInput?.removeEventListener('input', this.handleInputChange);
        this.chordTypeSelect?.removeEventListener('change', this.handleInputChange);
        this.chordScaleTypeSelect?.removeEventListener('change', this.handleInputChange);
        this.chordScaleDegreeButtonsContainer?.removeEventListener('click', this.handleScaleDegreeButtonClick);
    }

    handleInputChange(event) {
        if (this.isActive) {
            // Replace the note input with the upper case version of the note
            this.keyInput.value = this.keyInput.value.toUpperCase();
            localStorage.setItem('chord-root-note-input', this.keyInput.value);
            localStorage.setItem('chord-type-select', this.chordTypeSelect.value);
            localStorage.setItem('chord-scale-type-select', this.chordScaleTypeSelect.value);
            if (event.target === this.scaleDegreeInput) {
                this.removeSelectedScaleDegree();
                // Check if scale degree input is valid
                if (!this.scaleDegreeInput.checkValidity()) {
                    this.scaleDegreeInput.reportValidity();
                    return;
                }
                localStorage.setItem('chord-scale-degree', this.scaleDegreeInput.value);
                this.selectedChordScaleDegree = this.scaleDegreeInput.value;


            }

            if (event.target === this.chordScaleTypeSelect) {
                this.generateChordScaleDegreeButtons();
                this.removeSelectedScaleDegree();
                PatternVisualizer.clearFretboardHtml();
            }

            this.displayChordPattern(event);
            ColorSettingsController.updateTextColors();
        }
    }

    removeSelectedScaleDegree() {
        const previouslySelected = this.chordScaleDegreeButtonsContainer.querySelector('.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        this.selectedChordScaleDegree = '';
    }

    handleScaleDegreeButtonClick(event) {
        if (event.target.tagName === 'BUTTON') {
            this.scaleDegreeInput.value = '';
            // Remove 'selected' class from previously selected button
            const previouslySelected = this.chordScaleDegreeButtonsContainer.querySelector('.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }

            // Add 'selected' class to the clicked button
            event.target.classList.add('selected');
            this.diatonicChordTonalityOfSelectedScaleDegree = event.target.dataset.diatonicTonality;
            this.selectedChordScaleDegree = event.target.dataset.scaleDegree;
            localStorage.setItem('chord-scale-degree', this.selectedChordScaleDegree);
            // Also set the new
            this.displayChordPattern(event);
            ColorSettingsController.updateTextColors();
        }
    }


    displayChordPattern(event = null) {
        // this.settingsForm.checkValidity() cannot be used as it needs to have valid name attributes
        if (this.keyInput.checkValidity() && (this.selectedChordScaleDegree.length > 0)
            && this.chordScaleTypeSelect.checkValidity()) {
            // Set the this.chordTypeSelect to the default tonality, only if the change didn't come from the chord type select
            if (event === null || event.target !== this.chordTypeSelect) {
                // Is tested only for major and minor scales, other scales might not work
                // const chordTonalities = ChordTonalityCalculator.getChordTonalitiesForScale(this.chordScaleTypeSelect.value);
                // console.log(chordTonalities);
                // const chordType = chordTonalities[this.scaleDegreeInput.value.replace('#', '♯').replace('b', '♭',)] ?? '';
                this.chordTypeSelect.value = this.diatonicChordTonalityOfSelectedScaleDegree;
                localStorage.setItem('chord-type-select', this.diatonicChordTonalityOfSelectedScaleDegree);
                // If chordTonalities does not contain an element with the key this.scaleDegreeInput, report validity on chord type select
                if (this.diatonicChordTonalityOfSelectedScaleDegree === '') {
                    document.getElementById('collapsible-settings-container').classList.add('expanded');
                    this.chordTypeSelect.reportValidity();
                }
            }
            // Check if chordTypeSelect is valid (not empty) before generating the chord
            if (this.chordTypeSelect.checkValidity()) {
                let extraFrets = 3;
                const notesOnStrings = new ChordPositionGenerator().getChordNotesOnStrings(
                    this.keyInput.value,
                    this.chordScaleTypeSelect.value,
                    this.selectedChordScaleDegree,
                    this.chordTypeSelect.value,
                    extraFrets
                );

                this.patternVisualizer.displayPattern(notesOnStrings, this.chordTypeSelect.value, extraFrets);
            }
        } else if (localStorage.getItem('chord-root-note-input') && localStorage.getItem('chord-scale-degree') && localStorage.getItem('chord-scale-type-select')) {
            console.log('Invalid input');
            this.settingsForm.reportValidity();
            PatternVisualizer.clearFretboardHtml();
        }
    }
}