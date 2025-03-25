export class ColorSettingsController {
    constructor() {
        this.colorSettings = {
            'default': '#12c712',
            'major': '#ee2929',
            'minor': '#2e8bff',
            'augmented': '#ff9d00',
            'diminished': '#a64dff'
        };

        this.settingsVisible = false;
        this.loadSavedColors();
        this.setupEventListeners();
        this.applyColors();
    }

    loadSavedColors() {
        // Load saved colors from local storage
        const savedColors = localStorage.getItem('note-colors');
        if (savedColors) {
            this.colorSettings = {...this.colorSettings, ...JSON.parse(savedColors)};

            // Update the color input values
            for (const [key, value] of Object.entries(this.colorSettings)) {
                const input = document.getElementById(`color-${key}`);
                if (input) {
                    input.value = value;
                }
            }
        }
    }

    saveColors() {
        localStorage.setItem('note-colors', JSON.stringify(this.colorSettings));
    }

    setupEventListeners() {
        // Set up toggle button
        const button = document.getElementById('color-settings-toggle');
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSettingsPanel();
            });
        }

        // Set up color input listeners
        const colorTypes = ['default', 'major', 'minor', 'augmented', 'diminished'];
        colorTypes.forEach(key => {
            const input = document.getElementById(`color-${key}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.colorSettings[key] = e.target.value;
                    this.applyColors();
                    this.saveColors();
                });
            }
        });
    }

    toggleSettingsPanel() {
        const panel = document.getElementById('color-settings-panel');
        if (!panel) return;

        this.settingsVisible = !this.settingsVisible;
        // Class active-panel is used to display the panel
        panel.classList.toggle('active-panel');

        // Update button appearance
        const button = document.getElementById('color-settings-toggle');
        if (button) {
            button.classList.toggle('active', this.settingsVisible);
        }
    }

    applyColors() {
        // Set CSS variables
        document.documentElement.style.setProperty('--note-color-default', this.colorSettings.default);
        document.documentElement.style.setProperty('--note-color-major', this.colorSettings.major);
        document.documentElement.style.setProperty('--note-color-minor', this.colorSettings.minor);
        document.documentElement.style.setProperty('--note-color-augmented', this.colorSettings.augmented);
        document.documentElement.style.setProperty('--note-color-diminished', this.colorSettings.diminished);
    }
}