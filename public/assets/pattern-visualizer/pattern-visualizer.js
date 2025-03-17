import {PositionGenerator} from "../position-generator/position-generator.js?v=0.0.0";
import {availableNotesOnStrings} from "../general/general-js/config.js?v=0.0.0";

export class PatternVisualizer {

    constructor() {
        this.positionsGenerator = new PositionGenerator();
    }

    displayPattern(rootNoteName, numberInKey, chordType) {
        let chordNotes = this.positionsGenerator.generateDiatonicScale(rootNoteName);

        const notesOnStrings = this.positionsGenerator.getChordNotesOnStrings(chordNotes)
        console.log(notesOnStrings);
        // Must be before the slider is added so that the slider init can highlight the selected are on load
        this.addFretboard(notesOnStrings);

    }

    static getSavedFretRange() {
        const fretboardNr = document.querySelector(`.fretboard-for-patterns:not(.inactive-fretboard)`).dataset.fretboardNr;
        return localStorage.getItem(`note-in-key-fret-range-${fretboardNr}`);
    }

    addFretboard(notesOnStrings) {
        document.querySelector('#settings-container').insertAdjacentHTML('afterend', `
            <div class="fretboard-container">
                <div id="fretboard-for-pattern"></div>
            </div>
        `);

        const notePositionsOnFretboard = this.addVirtualFretboardHtml(notesOnStrings);
        // Add patterns from the first fretboard to the local storage
        localStorage.setItem('fret-pattern-positions', JSON.stringify(notePositionsOnFretboard));
    }

    addVirtualFretboardHtml(diatonicNotesOnStrings) {
        const fretboard = document.querySelector(`#fretboard-for-pattern`);
        // Store the total number of frets on the string to place indicator helpers and scrollIntoView on mobile
        let totalFrets = availableNotesOnStrings[Object.keys(availableNotesOnStrings)[0]].length - 1;
        fretboard.dataset.totalFrets = totalFrets.toString();

        let noteOnePositions = {};

        let stringIndex = 0;
        // Construct fretboard with available notes on strings
        for (const [stringName, notes] of Object.entries(availableNotesOnStrings)) {
            let string = document.createElement('div');
            string.className = 'string';
            string.dataset.stringName = stringName;

            // Create a new div for the string name
            let stringNameDiv = document.createElement('div');
            let stringNameSpan = document.createElement('span');
            stringNameDiv.className = 'string-name';
            // Set the noteName data attribute to the first note of the string
            stringNameSpan.dataset.noteName = stringName;

            // Set the text content to the string name (overwritten if diatonic note number)
            stringNameSpan.textContent = stringName;
            // Add note number of open string name
            let noteObject = diatonicNotesOnStrings[stringName].find(
                noteObject => noteObject.noteName === stringName || noteObject.noteName === 'E' && stringName === 'E2'
            );
            if (noteObject) {
                this.addDiatonicNoteNumberColor(stringNameSpan, noteObject.number);
            }
            stringNameDiv.dataset.fretPosition = '0';
            // Append the string name div to the string div
            stringNameDiv.appendChild(stringNameSpan);
            string.appendChild(stringNameDiv);

            // move the first element of the notes array to the end so it's the last one
            notes.push(notes.shift());

            for (const index in notes) {
                // Calculate the fret number where 1 is on the right
                let fretPositionNumber = parseInt(index) + 1;

                let fretPosition = document.createElement('div');
                fretPosition.classList.add('fret-position');
                fretPosition.dataset.fretPosition = fretPositionNumber.toString();
                fretPosition.dataset.noteName = notes[index];
                string.appendChild(fretPosition);

                // Display note number in diatonic-note-number span if the current note name is in the diatonic scale
                let noteObject = diatonicNotesOnStrings[stringName].find(noteObject => noteObject.noteName === notes[index]);
                if (noteObject) {
                    let diatonicNoteNumber = document.createElement('span');
                    this.addDiatonicNoteNumberColor(diatonicNoteNumber, noteObject.number);
                    fretPosition.appendChild(diatonicNoteNumber);
                    if (noteObject.number === 1) {
                        // There can only be one key note on a string
                        noteOnePositions[stringName] = fretPositionNumber;
                    }
                }
            }

            // let hr = document.createElement('hr');
            // string.appendChild(hr);
            fretboard.appendChild(string);

            stringIndex++;
        }
        return noteOnePositions;
    }

    addDiatonicNoteNumberColor(element, noteNumber) {
        element.classList.add('diatonic-note-number');
        if ([1, 4, 5].includes(noteNumber)) {
            element.classList.add('diatonic-major');
        } else if ([2, 3, 6].includes(noteNumber)) {
            element.classList.add('diatonic-minor');
        } else if (noteNumber === 7) {
            element.classList.add('diatonic-diminished');
        }
        element.textContent = noteNumber;
    }

    static saveFretRangeInLocalStorage(lowerLimit, upperLimit) {
        const fretboardNr = document.querySelector(`.fretboard-for-patterns:not(.inactive-fretboard)`).dataset.fretboardNr;
        localStorage.setItem(`note-in-key-fret-range-${fretboardNr}`, JSON.stringify({
            lowerLimit: lowerLimit,
            upperLimit: upperLimit
        }));
    }

}