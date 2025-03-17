import {availableNotesOnStrings} from "../general/general-js/config.js";

export class PositionGenerator {
    /**
     * Get the available notes on each string in the diatonic scale of the given key note
     * @param {*[]} chordNotes
     * @return {*[]}
     */
    getChordNotesOnStrings(chordNotes) {
        let diatonicNotesOnStrings = [];
        // For each string, filter-out notes that should not be playable
        for (let string in availableNotesOnStrings) {
            let notesOnString = availableNotesOnStrings[string];
            // Remove all non-diatonic tones from the notes on a string
            // Result: {note: 'A', number: 1}, {note: 'B', number: 2}
            diatonicNotesOnStrings[string] = notesOnString
                // Add the note number to the note object
                .map(note => ({
                    noteName: note,
                    number: chordNotes.indexOf(note) + 1,
                    fretPosition: notesOnString.indexOf(note)
                }))
                .filter(noteObject => chordNotes.includes(noteObject.noteName));
        }
        return diatonicNotesOnStrings;
    }


}