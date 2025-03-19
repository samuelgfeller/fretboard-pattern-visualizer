// public/assets/home/controllers/InputController.js
import {PositionGenerator} from "../../position-generator/position-generator.js?v=0.0.0";

export class InputController {
    constructor(patternVisualizer) {
        this.patternVisualizer = patternVisualizer;
        this.isActive = false;
        this.positionsGenerator = new PositionGenerator();
        this.settingsForm = document.getElementById('settings-form');
    }

    activate() {
        this.isActive = true;
        this.attachEventListeners();
        this.loadLocalStorageValues();
    }

    deactivate() {
        this.isActive = false;
        this.detachEventListeners();
        document.getElementById('fretboard-container')?.remove();
    }

    // Abstract methods to be implemented by subclasses
    attachEventListeners() {}
    detachEventListeners() {}
    loadLocalStorageValues() {}
}