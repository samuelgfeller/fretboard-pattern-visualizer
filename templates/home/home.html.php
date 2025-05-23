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
$this->addAttribute('js', [
    'assets/lib/html2canvas.min.js',
]);


?>

<h1>Fretboard Pattern Visualizer</h1>

<form id="settings-form">

</form>