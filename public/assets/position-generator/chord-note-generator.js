export class ChordNoteGenerator {
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