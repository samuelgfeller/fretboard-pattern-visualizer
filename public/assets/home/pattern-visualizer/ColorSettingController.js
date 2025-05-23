export class ColorSettingsController {
    static brightnessThreshold = 130;

    constructor() {
        this.colorSettings = {
            'default': '#ffffff',
            'major': '#ee2929',
            'minor': '#2e8bff',
            'augmented': '#ff9d00',
            'diminished': '#12c712'
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
                e.stopPropagation(); // Prevent click from reaching document
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

        // Add click event listener to the panel to prevent closing when clicked inside
        const panel = document.getElementById('color-settings-panel');
        if (panel) {
            panel.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from reaching document
            });
        }

        // Add document click listener to close panel when clicking outside
        document.addEventListener('click', () => {
            if (this.settingsVisible) {
                this.closeSettingsPanel();
            }
        });
    }

    closeSettingsPanel() {
        const panel = document.getElementById('color-settings-panel');
        if (!panel) return;

        this.settingsVisible = false;
        panel.classList.remove('active-panel');

        // Update button appearance
        const button = document.getElementById('color-settings-toggle');
        if (button) {
            button.classList.remove('active');
        }
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

        // Gives the browser time to apply the CSS changes
        setTimeout(() => {
            ColorSettingsController.updateTextColors();
        }, 100);
    }

    // Function to calculate perceived brightness (returns 0-255)
    static getBrightness(hexColor) {
        // Remove # if present
        hexColor = hexColor.replace('#', '');

        // Parse r, g, b values
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);

        // Calculate perceived brightness using standard formula
        // (299*R + 587*G + 114*B) / 1000
        return (299 * r + 587 * g + 114 * b) / 1000;
    }

    // Dynamic change of black or white text color depending on chosen background
    static updateTextColors() {
        const notes = document.querySelectorAll('.highlighted-note-number');

        notes.forEach(note => {
            const bgColor = window.getComputedStyle(note).backgroundColor;
            // Convert rgb(x, y, z) to hex
            const rgb = bgColor.match(/\d+/g);
            const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
            const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
            const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
            const hexColor = '#' + r + g + b;

            // Set text color based on brightness
            const brightness = this.getBrightness(hexColor);

            const color = brightness > this.brightnessThreshold ? '#000000' : '#ffffff';
            note.style.color = color;
            note.style.borderColor = color;
        });
    }
}