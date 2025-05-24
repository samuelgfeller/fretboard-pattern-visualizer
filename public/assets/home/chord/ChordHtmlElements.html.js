import {getColorSettingsButtonHtml, getThemeAndModeSettingsHtml} from "../shared-html/SharedHtmlElements.html.js?v=0.3.0";

export function getMainChordSettingsHtml() {
    return `
        <div class="form-input-div">
            <label for="chord-key-input">Key note</label>
            <input pattern="[A-G](♯|♭|#|b)?" required
                   title="Enter a valid note (A-G with optional sharp/flat: ♯, ♭, #, b)"
                   type="text" id="chord-key-input" placeholder="C" class="form-input">
        </div>
   
        <div class="form-input-div">
            <label for="chord-scale-type-select">Scale type</label>
            <select id="chord-scale-type-select" class="form-input" required>
                <!-- Ionian: No alterations (1-2-3-4-5-6-7), starts at position 1 -->
                <option value="major">Major</option>
                <!-- Aeolian: ♭3, ♭6, ♭7 (1-2-♭3-4-5-♭6-♭7), starts at position 6 -->
                <option value="minor">Minor</option>
                <!-- Dorian: ♭3, ♭7 (1-2-♭3-4-5-6-♭7), starts at position 2 -->
                <option value="dorian">Dorian</option>
                <!-- Phrygian: ♭2, ♭3, ♭6, ♭7 (1-♭2-♭3-4-5-♭6-♭7), starts at position 3 -->
                <option value="phrygian">Phrygian</option>
                <!-- Lydian: ♯4 (1-2-3-♯4-5-6-7), starts at position 4 -->
                <option value="lydian">Lydian</option>
                <!-- Mixolydian: ♭7 (1-2-3-4-5-6-♭7), starts at position 5 -->
                <option value="mixolydian">Mixolydian</option>
                <!-- Locrian: ♭2, ♭3, ♭5, ♭6, ♭7 (1-♭2-♭3-4-♭5-♭6-♭7), starts at position 7 -->
                <option value="locrian">Locrian</option>
            </select>
        </div>
        
        <div class="form-input-div hidden" id="scale-degree-input-group">
            <label for="chord-scale-degree-input">Chord (scale degree)</label>
            <div id="chord-scale-degree-buttons" class="button-group">
                <!-- Buttons will be dynamically loaded here by JavaScript -->
                <input pattern="(♯|♭|#|b)?[1-7]"
                   title="Enter a valid scale degree (1-7 with optional sharp/flat: ♯, ♭, #, b)"
                   type="text" id="chord-scale-degree-input" placeholder="" class="form-input">
            </div>
        </div>`;
}

export function getChordTonalitySettingsHtml() {
        return `
         <div class="form-input-div" id="chord-tonality-select-container">
            <label for="chord-type-select">Chord type</label>
            <select id="chord-type-select" class="form-input" required>
                <option value="maj">Major</option>
                <option value="min">Minor</option>
                <option value="dim">Diminished</option>
                <option value="aug">Augmented</option>
                <option value="dom7">Dominant 7</option>
            </select>
        </div>
`
}