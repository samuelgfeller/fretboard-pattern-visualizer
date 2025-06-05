// public/assets/home/controllers/InputController.js

import {ColorSettingsController} from "../pattern-visualizer/ColorSettingController.js?v=0.3.1";
import {PatternVisualizer} from "../pattern-visualizer/PatternVisualizer.js?v=0.3.1";
import {getColorSettingsButtonHtml, getThemeAndModeSettingsHtml} from "../shared-html/SharedHtmlElements.html.js?v=0.3.1";

export class SettingsController {
    constructor(patternVisualizer) {
        this.patternVisualizer = patternVisualizer;
        this.isActive = false;
        this.settingsForm = document.getElementById('settings-form');
    }

    activate() {
        this.isActive = true;
        this.addSettingsHtmlElements();
        this.attachEventListeners();
        this.loadLocalStorageValues();
        ColorSettingsController.updateTextColors();
    }

    deactivate() {
        this.isActive = false;
        this.detachEventListeners();
        this.removeSettingsHtmlElements();
        PatternVisualizer.clearFretboardHtml();
    }

    // !Abstract methods to be implemented by subclasses
    attachEventListeners() {
    }

    detachEventListeners() {
    }

    loadLocalStorageValues() {
    }

    addSettingsHtmlElements() {
    }

    removeSettingsHtmlElements() {
    }
}