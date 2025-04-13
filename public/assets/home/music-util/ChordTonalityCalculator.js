import {SaleNoteDegreeCalculator} from "./SaleNoteDegreeCalculator.js?v=0.2.1";
import {MusicNoteUtils as NoteNameNormalizer} from "./NoteNameNormalizer.js?v=0.2.1";

export class ChordTonalityCalculator {
    // Does not work with scales other than major / minor
    static getChordTonalitiesForScale(scaleType) {
        // Get the scale notes for a C root (for ease of calculation)
        const scaleNotes = SaleNoteDegreeCalculator.getScaleNotes('C', scaleType);
        const noteNames = scaleNotes.map(note => note.noteName);

        // Function to find interval between two notes in semitones
        const getInterval = (note1, note2) => {
            const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
            const index1 = chromaticScale.indexOf(NoteNameNormalizer.normalizeNoteName(note1));
            const index2 = chromaticScale.indexOf(NoteNameNormalizer.normalizeNoteName(note2));
            return (index2 - index1 + 12) % 12;
        };

        // Calculate chord quality for each scale degree
        const tonalities = {};

        for (let i = 0; i < noteNames.length; i++) {
            const rootIndex = i;
            const thirdIndex = (i + 2) % noteNames.length;
            const fifthIndex = (i + 4) % noteNames.length;

            const rootNote = noteNames[rootIndex];
            const thirdNote = noteNames[thirdIndex];
            const fifthNote = noteNames[fifthIndex];

            const thirdInterval = getInterval(rootNote, thirdNote);
            const fifthInterval = getInterval(rootNote, fifthNote);

            // Determine chord quality based on intervals
            let quality;
            if (thirdInterval === 4 && fifthInterval === 7) {
                quality = 'maj';
            } else if (thirdInterval === 3 && fifthInterval === 7) {
                quality = 'min';
            } else if (thirdInterval === 3 && fifthInterval === 6) {
                quality = 'dim';
            } else if (thirdInterval === 4 && fifthInterval === 8) {
                quality = 'aug';
            } else {
                // Improved fallback for unusual chords
                if (thirdInterval === 3 && fifthInterval === 8) {
                    quality = 'min(♯5)';
                } else if (thirdInterval === 4 && fifthInterval === 6) {
                    quality = 'maj(♭5)';
                } else {
                    quality = 'unk';
                }
            }

            // Use the scale degree symbol instead of numeric index
            tonalities[scaleNotes[i].number] = quality;
        }

        return tonalities;
    }
}