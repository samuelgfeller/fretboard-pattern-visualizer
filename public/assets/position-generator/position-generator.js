export class PositionGenerator {
    /**
     * Get the available notes on each string in the diatonic scale of the given key note
     * @param {string}keyNote
     * @param {object} availableNotesOnStrings - Object with string names as keys and arrays of notes as values
     * where the note index is the fret number
     * @return {*[]}
     */
    getAvailableNotesOnStringsInDiatonicScale(keyNote, availableNotesOnStrings) {
        let diatonicScale = this.generateDiatonicScale(keyNote);
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
                    number: diatonicScale.indexOf(note) + 1,
                    fretPosition: notesOnString.indexOf(note)
                }))
                .filter(noteObject => diatonicScale.includes(noteObject.noteName));
        }
        return diatonicNotesOnStrings;
    }

        /**
     * Generates diatonic scale for given key note
     * @param keyNote
     * @return {*[]}
     */
    generateDiatonicScale(keyNote) {
        const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
        const wholeWholeHalfPattern = [2, 2, 1, 2, 2, 2, 1];

        let keyIndex = chromaticScale.indexOf(keyNote);
        let diatonicScale = [keyNote];

        for (let step of wholeWholeHalfPattern) {
            keyIndex = (keyIndex + step) % chromaticScale.length;
            diatonicScale.push(chromaticScale[keyIndex]);
        }

        // Remove the last note which is the 1 again
        diatonicScale.pop();

        return diatonicScale;
    }
}