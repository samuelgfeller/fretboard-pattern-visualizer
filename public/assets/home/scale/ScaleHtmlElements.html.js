
export function getMainScaleSettingsHtml(){
    return `    
        <div class="form-input-div">
            <label for="scale-root-note-input">Root note</label>
            <input pattern="[A-G](♯|♭|#|b)?" required
                   title="Enter a valid note (A-G with optional sharp/flat: ♯, ♭, #, b)"
                   type="text" id="scale-root-note-input" placeholder="C" class="form-input">
        </div>
        <div class="form-input-div">
            <label for="scale-type-select">Scale type</label>
            <select id="scale-type-select" class="form-input" required>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
                <option value="dorian">Dorian</option>
                <option value="phrygian">Phrygian</option>
                <option value="lydian">Lydian</option>
                <option value="mixolydian">Mixolydian</option>
                <option value="locrian">Locrian</option>
            </select>
        </div>
    `;
}