import {ScalePositionGenerator as ScalePositionsGenerator} from "./ScalePositionGenerator.js?v=0.2.3";
import {SettingsController} from "../controller/SettingsController.js?v=0.2.3";
import {ColorSettingsController} from "../pattern-visualizer/ColorSettingController.js?v=0.2.3";
import {getMainScaleSettingsHtml} from "./ScaleHtmlElements.html.js?v=0.2.3";
import {getColorSettingsButtonHtml, getThemeAndModeSettingsHtml} from "../shared-html/SharedHtmlElements.html.js?v=0.2.3";

export class ScaleSettingsController extends SettingsController {
    constructor(patternVisualizer) {
        super(patternVisualizer);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    addSettingsHtmlElements() {
        let html = `
            <div id="scale-main-settings-container" class="main-settings-container">
                ${getMainScaleSettingsHtml()}
            </div>`;
        document.getElementById('settings-form').insertAdjacentHTML('afterbegin', html);

        // Populate class variables after adding the html elements to the DOM
        this.rootNoteInput = document.getElementById('scale-root-note-input');
        this.scaleTypeSelect = document.getElementById('scale-type-select');
    }

    removeSettingsHtmlElements() {
        document.getElementById('scale-main-settings-container')?.remove();
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
        this.rootNoteInput?.removeEventListener('input', this.handleInputChange);
        this.scaleTypeSelect?.removeEventListener('change', this.handleInputChange);
    }

    handleInputChange() {
        if (this.isActive) {
            // Replace the root note input with the upper case version of the note
            this.rootNoteInput.value = this.rootNoteInput.value.toUpperCase();
            localStorage.setItem('scale-root-note-input', this.rootNoteInput.value);
            localStorage.setItem('scale-type-select', this.scaleTypeSelect.value);
            this.displayScalePattern();
            ColorSettingsController.updateTextColors();
        }
    }

    displayScalePattern() {
        if (this.rootNoteInput.checkValidity() && this.scaleTypeSelect.checkValidity()) {
            const notesOnStrings = new ScalePositionsGenerator().getScaleNotesOnStrings(
                this.rootNoteInput.value, this.scaleTypeSelect.value
            );
            if (this.scaleTypeSelect.value === 'phrygian') {
                // Remove any tonality coloring as it's not correctly calculated (b7 is major, not minor)
                for (let string in notesOnStrings) {
                    notesOnStrings[string] = notesOnStrings[string].map(note => {
                        note.tonality = '';
                        return note;
                    });
                }
            }

            this.patternVisualizer.displayPattern(notesOnStrings, this.scaleTypeSelect.value);
        } else if (localStorage.getItem('scale-type-select')) {
            this.settingsForm.reportValidity();
        }
    }

}