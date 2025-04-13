import {availableNotesOnStrings} from "../../general/general-js/config.js?v=0.2.1";
import {MusicNoteUtils as NoteNameNormalizer} from "../music-util/NoteNameNormalizer.js?v=0.2.1";
import {SaleNoteDegreeCalculator as ScaleNoteDegreeCalculator} from "../music-util/SaleNoteDegreeCalculator.js?v=0.2.1";

export class ChordPositionGenerator {
    constructor() {
        // Define chord tones for each chord type
        this.chordTones = {
            'maj': ['1', '3', '5'],
            'min': ['1', '♭3', '5'],
            'dim': ['1', '♭3', '♭5'],
            'aug': ['1', '3', '♯5'],
            'dom7': ['1', '3', '5', '♭7']
        };
    }

    getChordNotesOnStrings(keyNote, scaleType, scaleDegree, chordType, extraFrets = 2) {
        // 1. Generate the major scale to use as reference for scale degrees
        const majorScaleNotes = ScaleNoteDegreeCalculator.getScaleNotes(keyNote, 'major');
        const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

        // 2. Extract scale degree and accidental alterations
        let degreeNumber, alteration = 0;
        if (scaleDegree.includes('♭') || scaleDegree.includes('b')) {
            degreeNumber = parseInt(scaleDegree.replace(/[♭b]/g, ''));
            alteration = -1;
        } else if (scaleDegree.includes('♯') || scaleDegree.includes('#')) {
            degreeNumber = parseInt(scaleDegree.replace(/[♯#]/g, ''));
            alteration = 1;
        } else {
            degreeNumber = parseInt(scaleDegree);
        }

        const degreeIndex = degreeNumber - 1;

        // 3. Find the chord root note FROM THE MAJOR SCALE
        let chordRootNote;
        if (alteration === 0) {
            chordRootNote = majorScaleNotes[degreeIndex % 7].noteName;
        } else {
            const baseNote = majorScaleNotes[degreeIndex % 7].noteName;
            const baseNoteIndex = chromaticScale.indexOf(NoteNameNormalizer.normalizeNoteName(baseNote));
            chordRootNote = chromaticScale[(baseNoteIndex + alteration + 12) % 12];
        }

        // 4. Get the actual chord tones based on chord type
        const chordToneDefinition = this.chordTones[chordType] || ['1', '3', '5'];
        const actualChordNotes = this.getActualChordNotes(chordRootNote, chordToneDefinition, chromaticScale);

        // 5. Map chromatic positions to MAJOR scale degrees
        const majorScaleDegreeMap = new Map();
        majorScaleNotes.forEach((note, index) => {
            const notePos = chromaticScale.indexOf(NoteNameNormalizer.normalizeNoteName(note.noteName));
            majorScaleDegreeMap.set(notePos, index + 1); // 1-based indexing
        });

        // 6. Assign proper scale degrees, always relative to the major scale
        const chordNotesOnStrings = {};
        for (let string in availableNotesOnStrings) {
            chordNotesOnStrings[string] = [];

            for (let i = 0; i < availableNotesOnStrings[string].length + extraFrets; i++) {
                let note;
                // Consider extra frets
                if (i < availableNotesOnStrings[string].length) {
                    // Use notes from the available configuration
                    note = availableNotesOnStrings[string][i];
                } else {
                    // Calculate notes for the extra frets
                    const baseNote = availableNotesOnStrings[string][0]; // Open string note
                    const baseIndex = chromaticScale.indexOf(NoteNameNormalizer.normalizeNoteName(baseNote));
                    const extraIndex = (baseIndex + i) % 12;
                    note = chromaticScale[extraIndex];
                }

                // Check if this note is in our chord
            const isChordNote = actualChordNotes.some(chordNote =>
                NoteNameNormalizer.normalizeNoteName(chordNote.noteName) ===
                NoteNameNormalizer.normalizeNoteName(note)
            );

                if (isChordNote) {
                    const normalizedNote = NoteNameNormalizer.normalizeNoteName(note);
                    const notePosition = chromaticScale.indexOf(normalizedNote);

                    // Determine degree relative to major scale
                    let degree;
                    if (majorScaleDegreeMap.has(notePosition)) {
                        degree = majorScaleDegreeMap.get(notePosition);
                    } else {
                        // Find closest major scale notes
                        let lowerDegreePos = -1;
                        let lowerDegree = -1;
                        let higherDegreePos = -1;
                        let higherDegree = -1;

                        for (let [pos, deg] of majorScaleDegreeMap.entries()) {
                            if (pos < notePosition && (lowerDegreePos === -1 || pos > lowerDegreePos)) {
                                lowerDegreePos = pos;
                                lowerDegree = deg;
                            }
                            if (pos > notePosition && (higherDegreePos === -1 || pos < higherDegreePos)) {
                                higherDegreePos = pos;
                                higherDegree = deg;
                            }
                        }

                        // Handle circular scale (C-B wraparound)
                        if (lowerDegreePos === -1) {
                            const maxPos = Math.max(...majorScaleDegreeMap.keys());
                            lowerDegreePos = maxPos - 12;
                            lowerDegree = majorScaleDegreeMap.get(maxPos);
                        }
                        if (higherDegreePos === -1) {
                            const minPos = Math.min(...majorScaleDegreeMap.keys());
                            higherDegreePos = minPos + 12;
                            higherDegree = majorScaleDegreeMap.get(minPos);
                        }

                        // Determine notation - prefer flats in most cases
                        const distToLower = notePosition - lowerDegreePos;
                        const distToHigher = higherDegreePos - notePosition;

                        // Common alterations that should use flat notation
                        if (higherDegree === 3 && distToHigher === 1) {
                            degree = `♭3`;
                        } else if (higherDegree === 7 && distToHigher === 1) {
                            degree = `♭7`;
                        } else if (higherDegree === 6 && distToHigher === 1) {
                            degree = `♭6`;
                        } else if (higherDegree === 2 && distToHigher === 1) {
                            degree = `♭2`;
                        } else if (higherDegree === 5 && distToHigher === 1) {
                            degree = `♭5`;
                        }
                        // Exception for #4 (Lydian)
                        else if (lowerDegree === 4 && distToLower === 1) {
                            degree = `♯4`;
                        }
                        // Default to flats for most other cases
                        else if (distToHigher === 1) {
                            degree = `♭${higherDegree}`;
                        } else if (distToLower === 1) {
                            degree = `♯${lowerDegree}`;
                        } else {
                            degree = note;
                        }
                    }

                    const isRoot = (normalizedNote === NoteNameNormalizer.normalizeNoteName(chordRootNote));

                    chordNotesOnStrings[string].push({
                        noteName: note,
                        number: degree,
                        fretPosition: i,
                        isRoot: isRoot,
                        tonality: chordType
                    });
                }
            }
        }

        return chordNotesOnStrings;

    }

    getActualChordNotes(rootNote, chordTones, chromaticScale) {
        // Get root note position in chromatic scale
        let rootIndex = chromaticScale.indexOf(NoteNameNormalizer.normalizeNoteName(rootNote));
        if (rootIndex === -1) return [];

        // Major scale intervals in semitones from root
        const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];

        return chordTones.map(tone => {
            // Parse degree and alterations
            const degreeMatch = tone.match(/([♭♯]*)(\d+)/);
            if (!degreeMatch) return null;

            const [_, alterations, degree] = degreeMatch;
            const degreeIndex = parseInt(degree) - 1;

            // Get base note from major scale
            const interval = majorScaleIntervals[degreeIndex % 7];
            let noteIndex = (rootIndex + interval) % 12;

            // Apply alterations
            if (alterations.includes('♭')) {
                noteIndex = (noteIndex - 1 + 12) % 12;
            } else if (alterations.includes('♯')) {
                noteIndex = (noteIndex + 1) % 12;
            }

            return {
                noteName: chromaticScale[noteIndex],
                degree: tone
            };
        }).filter(Boolean);
    }
}