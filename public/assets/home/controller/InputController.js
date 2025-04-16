// public/assets/home/controllers/InputController.js

import {ColorSettingsController} from "../pattern-visualizer/ColorSettingController.js?v=0.2.3";
import {PatternVisualizer} from "../pattern-visualizer/PatternVisualizer.js?v=0.2.3";

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
        PatternVisualizer.clearFretboardHtml();
    }

    // Abstract methods to be implemented by subclasses
    attachEventListeners() {
    }

    detachEventListeners() {
    }

    loadLocalStorageValues() {
    }
}