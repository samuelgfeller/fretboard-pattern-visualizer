// public/assets/home/controllers/InputController.js

import {ColorSettingsController} from "../pattern-visualizer/ColorSettingController.js?v=0.2.2";

export class InputController {
    constructor(patternVisualizer) {
        this.patternVisualizer = patternVisualizer;
        this.isActive = false;
        this.settingsForm = document.getElementById('settings-form');
    }

    activate() {
        this.isActive = true;
        this.attachEventListeners();
        this.loadLocalStorageValues();
        ColorSettingsController.updateTextColors();
    }

    deactivate() {
        this.isActive = false;
        this.detachEventListeners();
        document.getElementById('fretboard-container')?.remove();
        document.getElementById('download-fretboard-btn')?.remove();
    }

    // Abstract methods to be implemented by subclasses
    attachEventListeners() {
    }

    detachEventListeners() {
    }

    loadLocalStorageValues() {
    }
}