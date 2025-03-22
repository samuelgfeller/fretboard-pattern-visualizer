import {ModeManager} from "./controller/ModeManager.js?v=0.0.0";
import {ChordPositionGenerator} from "./chord/ChordPositionGenerator.js?v=0.0.0";
import {PatternVisualizer} from "./pattern-visualizer/PatternVisualizer.js?v=0.0.0";

// When dom loaded

document.addEventListener('DOMContentLoaded', () => {

    const modeManager = new ModeManager(
        new PatternVisualizer(),
        new ChordPositionGenerator()
    );

    modeManager.initialize();

    return;

    const rootNoteInput = document.getElementById('root-note-input');
    const chordTypeSelect = document.getElementById('chord-type-select');


// Load last valid input from local storage
    rootNoteInput.value = localStorage.getItem('rootNote') || '';

// Display the pattern on load if the inputs are valid
    if (rootNoteInput.value !== '') {
        displayPattern();
    }

    rootNoteInput.addEventListener('input', displayPattern);
    chordTypeSelect.addEventListener('input', displayPattern);

    function displayPattern() {
        // rootNoteInput.value = rootNoteInput.value.toUpperCase();
        if (rootNoteInput.checkValidity()) {
            // Save the last valid input to local storage
            localStorage.setItem('rootNote', rootNoteInput.value);
            patternVisualizer.displayPattern(
                rootNoteInput.value !== '' ? rootNoteInput.value : 'C',
                chordTypeSelect.value !== '' ? chordTypeSelect.value : 'maj'
            );
        } else {
            rootNoteInput.reportValidity();
        }
    }

    function isValid() {
        // Check if inputs are not empty
        if (!rootNoteInput.value) {
            return false;
        }

        // Validate root note (allow standard notation, sharp/flat symbols, and various formats)
        const validRootNotePattern = /^[A-G](♯|♭|#|b)?$/;
        if (!validRootNotePattern.test(rootNoteInput.value)) {
            rootNoteInput.reportValidity();
            return false;
        }
        return true;
    }
});
