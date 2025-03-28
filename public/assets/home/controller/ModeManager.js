// public/assets/home/controllers/ModeManager.js
import {ChordInputController} from "../chord/ChordInputController.js?v=0.1.1";
import {ScaleInputController} from "../scale/ScaleInputController.js?v=0.1.1";

export class ModeManager {
    constructor(patternVisualizer, positionsGenerator) {
        this.modeToggle = document.getElementById('mode-toggle');
        this.scaleContainer = document.getElementById('scale-mode-container');
        this.chordContainer = document.getElementById('chord-mode-container');

        this.chordController = new ChordInputController(patternVisualizer, positionsGenerator);
        this.scaleController = new ScaleInputController(patternVisualizer, positionsGenerator);

        this.handleModeChange = this.handleModeChange.bind(this);
    }

    initialize() {
        // Restore from localStorage if available
        if (localStorage.getItem('current-mode') === 'scale') {
            this.modeToggle.checked = true;
            this.switchToScaleMode();
        }
        else {
            this.switchToChordMode();

        }

        // Listen for mode changes
        this.modeToggle.addEventListener('change', this.handleModeChange);
    }

    handleModeChange() {
        if (this.modeToggle.checked) {
            this.switchToScaleMode();
        } else {
            this.switchToChordMode();
        }
    }

    switchToScaleMode() {
        this.scaleContainer.classList.add('active');
        this.chordContainer.classList.remove('active');
        this.chordController.deactivate();
        this.scaleController.activate();
        localStorage.setItem('current-mode', 'scale');
        // Move the color color-settings-button-container to the scale container
        const colorSettingsButton = document.getElementById('color-settings-button-container');
        if (colorSettingsButton) {
            this.scaleContainer.appendChild(colorSettingsButton);
        }
    }

    switchToChordMode() {
        this.chordContainer.classList?.add('active');
        this.scaleContainer.classList?.remove('active');
        this.scaleController.deactivate();
        this.chordController.activate();
        localStorage.setItem('current-mode', 'chord');
        // Move the color color-settings-button-container to the chord container
        const colorSettingsButton = document.getElementById('color-settings-button-container');
        if (colorSettingsButton) {
            this.chordContainer.appendChild(colorSettingsButton);
        }
    }
}