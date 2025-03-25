<?php

/**
 * Template rendering documentation: https://samuel-gfeller.ch/docs/Template-Rendering.
 *
 * @var Slim\Views\PhpRenderer $this Rendering engine
 * @var string $basePath Base path
 */
$this->setLayout('layout/layout.html.php');

// Asset handling https://samuel-gfeller.ch/docs/Template-Rendering#asset-handling
$this->addAttribute('css', [
    'assets/general/page-component/form/form.css',
    'assets/home/pattern-visualizer/virtual-fretboard.css',
    'assets/home/home.css',
    'assets/home/mode-switch/mode-slider.css',
]);

$this->addAttribute('jsModule', [
    'assets/home/app.js',
]);


?>

<h1>Fretboard Pattern Visualizer</h1>

<form id="settings-form">
    <div id="pre-settings-container">
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
    </div>
    <!-- Scale Mode Container -->
    <div id="scale-mode-container" class="mode-container">
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
    </div>

    <!-- Chord Mode Container -->
    <div id="chord-mode-container" class="mode-container">
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
        <div class="form-input-div">
            <label for="chord-scale-degree-input">Chord (scale degree)</label>
            <input pattern="(♯|♭|#|b)?[1-7]" required
                   title="Enter a valid scale degree (1-7 with optional sharp/flat: ♯, ♭, #, b)"
                   type="text" id="chord-scale-degree-input" placeholder="1" class="form-input">
        </div>
        <div class="form-input-div">
            <label for="chord-type-select">Chord type</label>
            <select id="chord-type-select" class="form-input" required>
                <option value="maj">Major</option>
                <option value="min">Minor</option>
                <option value="dim">Diminished</option>
                <option value="aug">Augmented</option>
                <option value="dom7">Dominant 7</option>
            </select>
        </div>
    </div>

    <!-- Color Settings Button -->
    <div class="form-input-div" id="color-settings-button-container">
        <label for="color-settings-toggle">Colors</label>
        <button type="button" id="color-settings-toggle" class="color-settings-button form-btn">
            <span>🎨</span> Settings
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

</form>