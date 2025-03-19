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

                getChordNotesOnStrings(rootNoteName, scaleDegree, chordType) {
                    // Get chord tones from definition
                    const chordTones = this.chordTones[chordType] || ['1', '3', '5'];

                    // Get major scale notes as reference
                    const majorScaleNotes = this.scaleNoteGenerator.getScaleNotes(rootNoteName, 'major');

                    // Determine the actual root note based on scale degree
                    const degreeIndex = parseInt(scaleDegree) - 1;
                    const actualRootNote = majorScaleNotes[degreeIndex % 7].noteName;

                    // Get the chromatic scale for note manipulation
                    const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

                    // Build actual chord notes
                    const actualChordNotes = this.getActualChordNotes(actualRootNote, chordTones, chromaticScale);

                    // Map chord notes to each string
                    const chordNotesOnStrings = {};
                    for (let string in availableNotesOnStrings) {
                        chordNotesOnStrings[string] = [];

                        for (let i = 0; i < availableNotesOnStrings[string].length; i++) {
                            const note = availableNotesOnStrings[string][i];

                            // Check if this note is in our chord
                            const chordNoteIndex = actualChordNotes.findIndex(chordNote =>
                                chordNote.noteName === note
                            );

                            if (chordNoteIndex !== -1) {
                                chordNotesOnStrings[string].push({
                                    noteName: note,
                                    number: actualChordNotes[chordNoteIndex].degree,
                                    fretPosition: i
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

                    let selectedNotesOnStrings = [];
                    for (let string in availableNotesOnStrings) {
                        let notesOnString = availableNotesOnStrings[string];
                        selectedNotesOnStrings[string] = notesOnString
                            .map(note => {
                                const noteIndex = noteNames.indexOf(note);
                                return {
                                    noteName: note,
                                    number: noteIndex !== -1 ? scaleNotes[noteIndex].number : null,
                                    fretPosition: notesOnString.indexOf(note)
                                };
                            })
                            .filter(noteObject => noteNames.includes(noteObject.noteName));
                    }
                    return selectedNotesOnStrings;
                }
            }