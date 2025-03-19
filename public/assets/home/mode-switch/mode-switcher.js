// Switch between scale and chord mode
export class ModeSwitcher {

    static initModeSwitcher() {
        const modeToggle = document.getElementById('mode-toggle');
        const scaleContainer = document.getElementById('scale-mode-container');
        const chordContainer = document.getElementById('chord-mode-container');

        // Set initial state (default to chord mode)
        chordContainer.classList.add('active');

        modeToggle.addEventListener('change', function () {
            if (this.checked) {
                // Scale mode
                scaleContainer.classList.add('active');
                chordContainer.classList.remove('active');
            } else {
                // Chord mode
                chordContainer.classList.add('active');
                scaleContainer.classList.remove('active');

            }
        });
    }

}