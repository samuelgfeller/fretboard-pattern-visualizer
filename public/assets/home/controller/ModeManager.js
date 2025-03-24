// public/assets/home/controllers/ModeManager.js
import {ChordInputController} from "../chord/ChordInputController.js?v=0.0.0";
import {ScaleInputController} from "../scale/ScaleInputController.js?v=0.0.0";

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
        // Set initial state (default to chord mode)
        this.chordContainer.classList.add('active');
        this.chordController.activate();

        // Restore from localStorage if available
        if (localStorage.getItem('current-mode') === 'scale') {
            this.modeToggle.checked = true;
            this.switchToScaleMode();
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
    }

    switchToChordMode() {
        this.chordContainer.classList.add('active');
        this.scaleContainer.classList.remove('active');
        this.scaleController.deactivate();
        this.chordController.activate();
        localStorage.setItem('current-mode', 'chord');
    }
}