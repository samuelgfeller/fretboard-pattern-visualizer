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
        this.createSettingsButton();
        this.createColorPickers();
        this.applyColors();
    }

    loadSavedColors() {
        // Load saved colors from local storage
        const savedColors = localStorage.getItem('note-colors');
        if (savedColors) {
            this.colorSettings = {...this.colorSettings, ...JSON.parse(savedColors)};
        }
    }

    saveColors() {
        localStorage.setItem('note-colors', JSON.stringify(this.colorSettings));
    }

    createSettingsButton() {
        // Create button in the settings form
        const settingsForm = document.querySelector('#settings-form');
        if (!settingsForm) return;

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('form-input-div', 'color-settings-button-container');

        // Create button
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'color-settings-toggle';
        button.classList.add('color-settings-button');
        button.innerHTML = '<span>🎨</span> Note Colors';

        // Add click event
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSettingsPanel();
        });

        buttonContainer.appendChild(button)
        settingsForm.appendChild(buttonContainer);
    }

    toggleSettingsPanel() {
        const panel = document.getElementById('color-settings-panel');
        if (!panel) return;

        this.settingsVisible = !this.settingsVisible;
        panel.style.display = this.settingsVisible ? 'block' : 'none';

        // Update button appearance
        const button = document.getElementById('color-settings-toggle');
        if (button) {
            button.classList.toggle('active', this.settingsVisible);
        }
    }

    createColorPickers() {
        // Create settings panel if it doesn't exist
        let settingsPanel = document.getElementById('color-settings-panel');
        if (!settingsPanel) {
            settingsPanel = document.createElement('div');
            settingsPanel.id = 'color-settings-panel';
            settingsPanel.classList.add('color-settings');
            settingsPanel.style.display = 'none'; // Hidden by default

            const title = document.createElement('h4');
            title.textContent = 'Note Color Settings';
            settingsPanel.appendChild(title);

            // Add after the settings form
            document.querySelector('#color-settings-button-container').insertAdjacentElement('beforeend', settingsPanel);
        }

        // Clear existing pickers
        settingsPanel.querySelectorAll('.color-picker-group').forEach(el => el.remove());

        // Create color pickers for each note type
        const labels = {
            'default': 'Default',
            'major': 'Major',
            'minor': 'Minor',
            'augmented': 'Augmented',
            'diminished': 'Diminished'
        };

        for (const [key, label] of Object.entries(labels)) {
            const group = document.createElement('div');
            group.classList.add('color-picker-group');

            const colorLabel = document.createElement('label');
            colorLabel.textContent = label;
            colorLabel.htmlFor = `color-${key}`;

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = `color-${key}`;
            colorInput.value = this.colorSettings[key];
            colorInput.addEventListener('change', (e) => {
                this.colorSettings[key] = e.target.value;
                this.applyColors();
                this.saveColors();
            });

            group.appendChild(colorLabel);
            group.appendChild(colorInput);
            settingsPanel.appendChild(group);
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