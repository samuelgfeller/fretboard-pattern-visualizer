export function getThemeAndModeSettingsHtml(){
    return `
<div id="permanent-settings-container">
        <label id="dark-mode-switch-container">
            <input id='dark-mode-toggle-checkbox' type='checkbox'>
            <div id='dark-mode-toggle-slot'>
                <div id='dark-mode-sun-icon-wrapper'>
                    <img src="assets/general/dark-mode/sun-icon.svg" alt="sun" id="dark-mode-sun-icon">
                </div>
                <div id="dark-mode-toggle-button"></div>
                <div id='dark-mode-moon-icon-wrapper'>
                    <img src="assets/general/dark-mode/moon-icon.svg" alt="sun" id="dark-mode-moon-icon">
                </div>
            </div>
        </label>
        <!-- Mode Toggle Switch -->
        <div class="toggle-container">
            <span class="toggle-label">Chord</span>
            <label class="switch">
                <input type="checkbox" id="mode-toggle">
                <span class="slider round"></span>
            </label>
            <span class="toggle-label">Scale</span>
        </div>
</div>`;
}

export function getColorSettingsButtonHtml() {
    return `<!-- Color Settings Button -->
    <div class="form-input-div" id="color-settings-button-container">
        <label for="color-settings-toggle">Colors</label>
        <button type="button" id="color-settings-toggle" class="color-settings-button form-btn">
            <span>🎨</span> Choose
        </button>

        <!-- Color Settings Panel -->
        <div id="color-settings-panel">
            <div class="color-picker-group">
                <label for="color-default">Default</label>
                <input type="color" id="color-default" value="#FFFFFF">
            </div>

            <div class="color-picker-group">
                <label for="color-major">Major</label>
                <input type="color" id="color-major" value="#ee2929">
            </div>

            <div class="color-picker-group">
                <label for="color-minor">Minor</label>
                <input type="color" id="color-minor" value="#2e8bff">
            </div>

            <div class="color-picker-group">
                <label for="color-augmented">Augmented</label>
                <input type="color" id="color-augmented" value="#ff9d00">
            </div>

            <div class="color-picker-group">
                <label for="color-diminished">Diminished</label>
                <input type="color" id="color-diminished" value="#12c712">
            </div>
        </div>
</div>`;

}