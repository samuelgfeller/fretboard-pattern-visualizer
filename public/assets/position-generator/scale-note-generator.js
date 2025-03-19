export class ScaleNoteGenerator {
    constructor() {
        // Define only the major scale pattern
        this.majorPattern = [2, 2, 1, 2, 2, 2, 1]; // W-W-H-W-W-W-H


        // Define scale types as alterations to the major scale
        this.scaleDefinitions = {
            'all': {pattern: [1,1,1,1,1,1,1,1,1,1,1,1], alterations: []},
            'major': {pattern: this.majorPattern, alterations: []},
            'minor': {pattern: this.majorPattern, alterations: [3, 6, 7]},
            'dorian': {pattern: this.majorPattern, alterations: [3, 7]},
            'phrygian': {pattern: this.majorPattern, alterations: [2, 3, 6, 7]},
            'lydian': {pattern: this.majorPattern, alterations: [], sharpened: [4]},
            'mixolydian': {pattern: this.majorPattern, alterations: [7]},
            'locrian': {pattern: this.majorPattern, alterations: [2, 3, 5, 6, 7]},

        };


    }

    /**
     * Generates scale notes with proper degree notations
     * @param {string} rootNote - Root note of the scale
     * @param {string} scaleType - Type of scale
     * @return {Array} Array of note objects with note names and proper scale degrees
     */
    getScaleNotes(rootNote, scaleType) {
        const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

        // Normalize the root note
        const normalizedRoot = this.normalizeNoteName(rootNote);

        // Check if normalized root exists in our scale
        if (!chromaticScale.includes(normalizedRoot)) {
            alert(`Invalid root note: ${rootNote}`);
            return [];
        }

        // Generate the major scale as reference
        let majorScaleNotes = this.generateMajorScale(normalizedRoot, chromaticScale);

        // Get scale definition
        const definition = this.scaleDefinitions[scaleType] || this.scaleDefinitions['major'];

        // Build scale notes with proper degrees
        let scaleNotes = [];
        for (let i = 0; i < majorScaleNotes.length; i++) {
            const degreeNumber = i + 1;
            let noteName = majorScaleNotes[i];
            let degreeSymbol = degreeNumber.toString();

            // Apply alterations if needed
            if (definition.alterations.includes(degreeNumber)) {
                // Flatten the note
                noteName = this.flattenNote(noteName, chromaticScale);
                degreeSymbol = "♭" + degreeSymbol;
            } else if (definition.sharpened && definition.sharpened.includes(degreeNumber)) {
                // Sharpen the note
                noteName = this.sharpenNote(noteName, chromaticScale);
                degreeSymbol = "♯" + degreeSymbol;
            }

            scaleNotes.push({
                noteName: noteName,
                number: degreeSymbol
            });
        }

        return scaleNotes;
    }

    generateMajorScale(rootNote, chromaticScale) {
        let keyIndex = chromaticScale.indexOf(rootNote);
        let majorScale = [rootNote];

        for (let step of this.majorPattern) {
            keyIndex = (keyIndex + step) % chromaticScale.length;
            majorScale.push(chromaticScale[keyIndex]);
        }

        // Remove the octave
        majorScale.pop();
        return majorScale;
    }

    flattenNote(note, chromaticScale) {
        let index = chromaticScale.indexOf(note);
        return chromaticScale[(index - 1 + chromaticScale.length) % chromaticScale.length];
    }

    sharpenNote(note, chromaticScale) {
        let index = chromaticScale.indexOf(note);
        return chromaticScale[(index + 1) % chromaticScale.length];
    }

    normalizeNoteName(inputNote) {
        // Map of enharmonic equivalents to standardized notes in the chromatic scale
        const enharmonicMap = {
            'Cb': 'B',
            'C#': 'C♯',
            'Db': 'C♯',
            'D#': 'D♯',
            'Eb': 'D♯',
            'E#': 'F',
            'Fb': 'E',
            'F#': 'F♯',
            'Gb': 'F♯',
            'G#': 'G♯',
            'Ab': 'G♯',
            'A#': 'A♯',
            'Bb': 'A♯',
            'B#': 'C'
        };

        // Replace fancy symbols with ASCII equivalents for lookup
        let lookupNote = inputNote
            .replace('♯', '#')
            .replace('♭', 'b');

        // Get normalized value or use original
        return enharmonicMap[lookupNote] || inputNote;

    }

}