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
    'assets/pattern-visualizer/virtual-fretboard.css',
    'assets/home/home.css',
    'assets/home/mode-switch/slider.css',
]);

$this->addAttribute('jsModule', [
    'assets/home/app.js',
]);


?>

<h1>Fretboard Pattern Visualizer</h1>

<form id="settings-form">
    <!-- Mode Toggle Switch -->
    <div class="toggle-container">
        <span class="toggle-label">Chord</span>
        <label class="switch">
            <input type="checkbox" id="mode-toggle">
            <span class="slider round"></span>
        </label>
        <span class="toggle-label">Scale</span>
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
            <label for="root-note-input">Root note</label>
            <input pattern="[A-G](♯|♭|#|b)?" required
                   title="Enter a valid note (A-G with optional sharp/flat: ♯, ♭, #, b)"
                   type="text" id="root-note-input" placeholder="C" class="form-input">
        </div>
        <div class="form-input-div">
            <label for="note-num-input">Scale degree</label>
            <input type="number" id="note-num-input" placeholder="1" min="1" value="1" class="form-input" required>
        </div>
        <div class="form-input-div">
            <label for="chord-type-select">Chord type</label>
            <select id="chord-type-select" class="form-input">
                <option value="maj">Major</option>
                <option value="min">Minor</option>
                <option value="dim">Diminished</option>
                <option value="aug">Augmented</option>
                <option value="dom7">Dominant 7</option>
            </select>
        </div>
    </div>

</form>