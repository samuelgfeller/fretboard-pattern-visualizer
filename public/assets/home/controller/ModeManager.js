// public/assets/home/controllers/ModeManager.js
import {ChordSettingsController} from "../chord/ChordSettingsController.js?v=0.3.0";
import {ScaleSettingsController} from "../scale/ScaleSettingsController.js?v=0.3.0";

export class ModeManager {
    constructor(patternVisualizer, positionsGenerator) {

        this.chordController = new ChordSettingsController(patternVisualizer, positionsGenerator);
        this.scaleController = new ScaleSettingsController(patternVisualizer, positionsGenerator);

        this.handleModeChange = this.handleModeChange.bind(this);
    }

    initialize() {
        let scaleModeChecked = false;
        // Restore from localStorage if available
        if (localStorage.getItem('current-mode') === 'scale') {
            this.switchToScaleMode();
            scaleModeChecked = true;
        } else {
            this.switchToChordMode();
        }

        // Listen for mode changes (only exists after either chord or scale mode is activated as it shares settings container
        this.modeToggle = document.getElementById('mode-toggle');
        this.modeToggle.checked = scaleModeChecked;
        document.getElementById('mode-toggle').addEventListener('change', this.handleModeChange);
    }

    handleModeChange() {
        if (this.modeToggle.checked) {
            this.switchToScaleMode();
        } else {
            this.switchToChordMode();
        }
    }

    switchToScaleMode() {
        this.chordController.deactivate();
        this.scaleController.activate();
        localStorage.setItem('current-mode', 'scale');
    }

    switchToChordMode() {
        this.scaleController.deactivate();
        this.chordController.activate();
        localStorage.setItem('current-mode', 'chord');
    }
}