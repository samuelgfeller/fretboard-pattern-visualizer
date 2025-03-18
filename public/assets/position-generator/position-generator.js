import {availableNotesOnStrings} from "../general/general-js/config.js?v=0.0.0";

export class PositionGenerator {

    /**
     * Get the available notes on each string in the diatonic scale of the given key note
     * @param {*[]} chordNotes
     * @return {*[]}
     */
    getChordNotesOnStrings(chordNotes) {
        // Extract just the note names from the chord notes objects
        const noteNames = chordNotes.map(note => note.noteName);

        let selectedNotesOnStrings = [];
        // For each string, filter-out notes that should not be playable
        for (let string in availableNotesOnStrings) {
            let notesOnString = availableNotesOnStrings[string];
            console.log(notesOnString);
            // Filter notes that are in our scale
            selectedNotesOnStrings[string] = notesOnString
                .map(note => {
                    // Find the corresponding chord note to get its number
                    const noteIndex = noteNames.indexOf(note);
                    return {
                        noteName: note,
                        number: noteIndex !== -1 ? chordNotes[noteIndex].number : null,
                        fretPosition: notesOnString.indexOf(note)
                    };
                })
                .filter(noteObject => noteNames.includes(noteObject.noteName));
        }
        return selectedNotesOnStrings;
    }

}