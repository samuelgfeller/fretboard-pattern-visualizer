import {availableNotesOnStrings} from "../../general/general-js/config.js?v=0.2.2";
import {MusicNoteUtils as NoteNameNormalizer} from "../music-util/NoteNameNormalizer.js?v=0.2.2";
import {SaleNoteDegreeCalculator} from "../music-util/SaleNoteDegreeCalculator.js?v=0.2.2";
import {ChordTonalityCalculator} from "../music-util/ChordTonalityCalculator.js?v=0.2.2";

export class ScalePositionGenerator {

    getScaleNotesOnStrings(rootNoteName, scaleType) {
        const scaleNotes = SaleNoteDegreeCalculator.getScaleNotes(rootNoteName, scaleType);
        const noteNames = scaleNotes.map(note => note.noteName);

        // Define chord tonalities for each scale degree based on scale type
        const chordTonalities = ChordTonalityCalculator.getChordTonalitiesForScale(scaleType);

        let selectedNotesOnStrings = {};
        for (let string in availableNotesOnStrings) {
            let notesOnString = availableNotesOnStrings[string];
            selectedNotesOnStrings[string] = [];

            for (let i = 0; i < notesOnString.length; i++) {
                const note = notesOnString[i];
                const noteIndex = noteNames.indexOf(note);

                if (noteIndex !== -1) {
                    // Only include notes that are in the scale
                    const degreeNumber = scaleNotes[noteIndex].number;
                    selectedNotesOnStrings[string].push({
                        noteName: note,
                        number: scaleNotes[noteIndex].number,
                        fretPosition: i,
                        isRoot: (noteIndex === 0), // First note in scale array is the root
                        tonality: chordTonalities[degreeNumber]
                    });
                }
            }
        }
        return selectedNotesOnStrings;
    }
}