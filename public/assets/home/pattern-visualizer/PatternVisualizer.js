import {availableNotesOnStrings} from "../../general/general-js/config.js?v=0.2.0";
import {FretboardImageExporter} from "./FretboardImageExporter.js?v=0.2.0";

export class PatternVisualizer {

    constructor() {

    }

    displayPattern(notesOnStrings, scaleOrChordType, extraFrets = 2) {
        document.getElementById('fretboard-container')?.remove();

        document.querySelector('#settings-form').insertAdjacentHTML('afterend', `
            <div id="fretboard-container">
               <div id="fretboard-for-pattern"></div>
            </div>
            <button type="button" id="download-fretboard-btn" class="color-settings-button form-btn">
            <span>⬇️</span> Download image
        </button>
        `);

        this.addVirtualFretboardHtml(notesOnStrings, scaleOrChordType, extraFrets);
        this.attachDownloadButtonListener();

    }

    attachDownloadButtonListener() {
        const downloadBtn = document.getElementById('download-fretboard-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const container = document.getElementById('fretboard-container');

                let keyInput = document.getElementById('chord-key-input').value;
                let scaleDegreeInput = document.getElementById('chord-scale-degree-input').value;
                let chordScaleTypeSelect = document.getElementById('chord-scale-type-select').value;
                let chordTypeSelect = document.getElementById('chord-type-select').value;

                let fileName = `Key-${keyInput}-Degree-${scaleDegreeInput}-Chord-${chordTypeSelect}-Scale-${chordScaleTypeSelect}.png`;

                FretboardImageExporter.captureAndDownload(container, fileName);
            });
        }
    }

    static getSavedFretRange() {
        const fretboardNr = document.querySelector(`.fretboard-for-patterns:not(.inactive-fretboard)`).dataset.fretboardNr;
        return localStorage.getItem(`note-in-key-fret-range-${fretboardNr}`);
    }

    addVirtualFretboardHtml(notesOnStrings, scaleOrChordType, extraFrets) {
        const fretboard = document.querySelector(`#fretboard-for-pattern`);
        // Add chord type as a class for styling
        if (scaleOrChordType) {
            fretboard.classList.add(`type-${scaleOrChordType.toLowerCase().replace(/\s+/g, '-')}`);
        }
        // Create a deep copy of availableNotesOnStrings to prevent actually modifying the original object
        let availableNotesOnStringsCopy = JSON.parse(JSON.stringify(availableNotesOnStrings));
        // Add extra frets to the end of the string starting from the first note
        for (const [stringName, notes] of Object.entries(availableNotesOnStringsCopy)) {
            // Add extra frets to the end of the string starting from the first note
            for (let i = 0; i < extraFrets; i++) {
                notes.push(notes[i]);
            }
        }

        // Store the total number of frets on the string to place indicator helpers and scrollIntoView on mobile
        let totalFrets = availableNotesOnStringsCopy[Object.keys(availableNotesOnStringsCopy)[0]].length - 1;
        fretboard.dataset.totalFrets = (totalFrets).toString();

        let noteOnePositions = {};

        let stringIndex = 0;
        // Construct fretboard with available notes on strings
        for (const [stringName, notes] of Object.entries(availableNotesOnStringsCopy)) {
            let string = document.createElement('div');
            string.className = 'string';
            string.dataset.stringName = stringName;

            // Create a new div for the string name
            let stringNameDiv = document.createElement('div');
            let stringNameSpan = document.createElement('span');
            stringNameDiv.className = 'string-name';
            // Set the noteName data attribute to the first note of the string
            stringNameSpan.dataset.noteName = stringName;

            // Set the text content to the string name (overwritten if note number)
            stringNameSpan.textContent = stringName;
            // Add note number of open string name
            let noteObject = notesOnStrings[stringName].find(
                noteObject => noteObject.noteName === stringName || noteObject.noteName === 'E' && stringName === 'E2'
            );
            if (noteObject) {
                this.addNoteColor(stringNameSpan, noteObject);
                // Replace the string name with the note number
                stringNameSpan.textContent = noteObject.number;
            }
            stringNameDiv.dataset.fretPosition = '0';
            // Append the string name div to the string div
            stringNameDiv.appendChild(stringNameSpan);
            string.appendChild(stringNameDiv);

            // Remove the first element of the notes array as it's the string name
            notes.shift();

            for (const index in notes) {
                // Calculate the fret number where 1 is on the right
                let fretPositionNumber = parseInt(index) + 1;

                let fretPosition = document.createElement('div');
                fretPosition.classList.add('fret-position');
                fretPosition.dataset.fretPosition = fretPositionNumber.toString();
                fretPosition.dataset.noteName = notes[index];
                string.appendChild(fretPosition);

                // Display note number in highlighted-note-number span if the current note name is in the diatonic scale
                let noteObject = notesOnStrings[stringName].find(noteObject => noteObject.noteName === notes[index]);
                if (noteObject) {
                    let diatonicNoteNumber = document.createElement('span');
                    this.addNoteColor(diatonicNoteNumber, noteObject);
                    diatonicNoteNumber.textContent = noteObject.number;
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

    addNoteColor(element, noteObject) {
        element.classList.add('highlighted-note-number');

        // First check if it's a root note
        if (noteObject.isRoot) {
            element.classList.add('root');
        }

        if (noteObject.tonality) {
            element.classList.add(`${noteObject.tonality}`)
        }
    }

    static saveFretRangeInLocalStorage(lowerLimit, upperLimit) {
        const fretboardNr = document.querySelector(`.fretboard-for-patterns:not(.inactive-fretboard)`).dataset.fretboardNr;
        localStorage.setItem(`note-in-key-fret-range-${fretboardNr}`, JSON.stringify({
            lowerLimit: lowerLimit,
            upperLimit: upperLimit
        }));
    }

}