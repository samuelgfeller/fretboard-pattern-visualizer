// public/assets/home/controllers/InputController.js

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