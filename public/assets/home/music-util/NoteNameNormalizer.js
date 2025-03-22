export class MusicNoteUtils {
    static normalizeNoteName(inputNote) {
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
}