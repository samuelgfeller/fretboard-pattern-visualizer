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
]);

$this->addAttribute('jsModule', [
    'assets/home/app.js',
        ]);


?>


<h1>Fretboard Pattern Visualizer</h1>

<div id="settings-container">
    <div class="form-input-div">
        <label for="root-note-input">Root note</label>
        <input type="text" id="root-note-input" placeholder="C#" class="form-input">
    </div>
    <div class="form-input-div">
        <label for="root-note-input">Num</label>
        <input type="number" id="note-num-input" placeholder="1" class="form-input">
    </div>

    <!--    Maj min dim maj7 etc select -->
    <div class="form-input-div">
        <label for="chord-type-select">Chord type</label>
        <select id="chord-type-select" class="form-input">
            <option value="maj">Major</option>
            <option value="min">Minor</option>
            <option value="dim">Diminished</option>
            <option value="aug">Augmented</option>
            <option value="maj">Major</option>
            <option value="min">Minor</option>
            <option value="maj7">Major 7</option>
            <option value="min7">Minor 7</option>
            <option value="dom7">Dominant 7</option>
        </select>
    </div>

</div>