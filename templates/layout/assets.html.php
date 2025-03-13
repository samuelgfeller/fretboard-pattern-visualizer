<?php
/**
 * Creates versioned CSS and Javascript resources html "link" and "script" tags.
 * This template is fetched by the layout template.
 *
 * @var array<string> $scripts js script paths
 * @var array<string> $jsModule js module script paths
 * @var array<string> $stylesheets stylesheet paths
 * @var string|null $version app version
 */

// CSS stylesheets
foreach ($stylesheets ?? [] as $stylesheet) {
    echo '<link rel="stylesheet" type="text/css" href="' . $stylesheet . (isset($version) ? '?v=' . $version : '') . '">';
}

// Javascript files
foreach ($scripts ?? [] as $script) {
    // With "defer" the script is downloaded in parallel to parsing the page and executed after the page has finished parsing
    echo '<script defer src="' . $script . (isset($version) ? '?v=' . $version : '') . '"></script>';
}

// Javascript module files
foreach ($jsModule ?? [] as $modulePath) {
    echo '<script defer type="module" src="' . $modulePath . (isset($version) ? '?v=' . $version : '') . '"></script>';
}
