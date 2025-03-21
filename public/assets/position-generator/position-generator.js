import {availableNotesOnStrings} from "../general/general-js/config.js?v=0.0.0";
import {ScaleNoteGenerator} from "./scale-note-generator.js?v=0.0.0";

export class PositionGenerator {
    constructor() {
        this.scaleNoteGenerator = new ScaleNoteGenerator();
        // Define chord tones for each chord type
        this.chordTones = {
            'maj': ['1', '3', '5'],
            'min': ['1', '♭3', '5'],
            'dim': ['1', '♭3', '♭5'],
            'aug': ['1', '3', '♯5'],
            'dom7': ['1', '3', '5', '♭7']
        };
    }

    getChordNotesOnStrings(keyNote, scaleType, scaleDegree, chordType) {
        // 1. Generate the major scale to use as reference for scale degrees
        const majorScaleNotes = this.scaleNoteGenerator.getScaleNotes(keyNote, 'major');
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
            const baseNoteIndex = chromaticScale.indexOf(this.normalizeNoteName(baseNote));
            chordRootNote = chromaticScale[(baseNoteIndex + alteration + 12) % 12];
        }

        // 4. Get the actual chord tones based on chord type
        const chordToneDefinition = this.chordTones[chordType] || ['1', '3', '5'];
        const actualChordNotes = this.getActualChordNotes(chordRootNote, chordToneDefinition, chromaticScale);

        // 5. Map chromatic positions to MAJOR scale degrees
        const majorScaleDegreeMap = new Map();
        majorScaleNotes.forEach((note, index) => {
            const notePos = chromaticScale.indexOf(this.normalizeNoteName(note.noteName));
            majorScaleDegreeMap.set(notePos, index + 1); // 1-based indexing
        });

        // 6. Assign proper scale degrees, always relative to the major scale
        const chordNotesOnStrings = {};
        for (let string in availableNotesOnStrings) {
            chordNotesOnStrings[string] = [];

            for (let i = 0; i < availableNotesOnStrings[string].length; i++) {
                const note = availableNotesOnStrings[string][i];

                // Check if this note is in our chord
                const isChordNote = actualChordNotes.some(chordNote =>
                    chordNote.noteName === note
                );

                if (isChordNote) {
                    const normalizedNote = this.normalizeNoteName(note);
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

                    const isRoot = (normalizedNote === this.normalizeNoteName(chordRootNote));

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
        let rootIndex = chromaticScale.indexOf(this.normalizeNoteName(rootNote));
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

    normalizeNoteName(inputNote) {
        // Map of enharmonic equivalents to standardized notes
        const enharmonicMap = {
            'Cb': 'B', 'C#': 'C♯', 'Db': 'C♯', 'D#': 'D♯',
            'Eb': 'D♯', 'E#': 'F', 'Fb': 'E', 'F#': 'F♯',
            'Gb': 'F♯', 'G#': 'G♯', 'Ab': 'G♯', 'A#': 'A♯',
            'Bb': 'A♯', 'B#': 'C'
        };

        // Replace fancy symbols with ASCII for lookup
        let lookupNote = inputNote
            .replace('♯', '#')
            .replace('♭', 'b');

        return enharmonicMap[lookupNote] || inputNote;
    }

    getScaleNotesOnStrings(rootNoteName, scaleType) {
        const scaleNotes = this.scaleNoteGenerator.getScaleNotes(rootNoteName, scaleType);
        const noteNames = scaleNotes.map(note => note.noteName);

        // Define chord tonalities for each scale degree based on scale type
        const chordTonalities = this.getChordTonalitiesForScale(scaleType);

        let selectedNotesOnStrings = {};
        for (let string in availableNotesOnStrings) {
            let notesOnString = availableNotesOnStrings[string];
            selectedNotesOnStrings[string] = [];

            for (let i = 0; i < notesOnString.length; i++) {
                const note = notesOnString[i];
                const noteIndex = noteNames.indexOf(note);

                if (noteIndex !== -1) {
                    // Only include notes that are in the scale
                    const degreeNumber = scaleNotes[noteIndex].number.replace(/[♯♭]/g, '');
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

    getChordTonalitiesForScale(scaleType) {
        // Get the scale notes for a C root (for ease of calculation)
        const scaleNotes = this.scaleNoteGenerator.getScaleNotes('C', scaleType);
        const noteNames = scaleNotes.map(note => note.noteName);

        // Function to find interval between two notes in semitones
        const getInterval = (note1, note2) => {
            const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
            const index1 = chromaticScale.indexOf(this.normalizeNoteName(note1));
            const index2 = chromaticScale.indexOf(this.normalizeNoteName(note2));
            return (index2 - index1 + 12) % 12;
        };

        // Calculate chord quality for each scale degree
        const tonalities = {};

        for (let i = 0; i < noteNames.length; i++) {
            const rootIndex = i;
            const thirdIndex = (i + 2) % 7;
            const fifthIndex = (i + 4) % 7;

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
                // Fallback for unusual chords
                quality = 'unk';
            }

            tonalities[(i + 1).toString()] = quality;
        }

        return tonalities;
    }
}