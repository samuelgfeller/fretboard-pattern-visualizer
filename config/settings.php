<?php
/**
 * This file loads the default and environment-specific settings.
 * Documentation: https://samuel-gfeller.ch/docs/Configuration.
 */

// Load default settings
// MUST NOT be require_once otherwise test settings are included only once and not again for the next tests
$settings = require __DIR__ . '/defaults.php';

// Load secret configuration
if (file_exists(dirname(__DIR__, 2) . '/env.php')) {
    require dirname(__DIR__, 2) . '/env.php'; // Take env outside project dir if existing
} elseif (file_exists(__DIR__ . '/env/env.php')) {
    require __DIR__ . '/env/env.php';
}

// Set APP_ENV if not already set
$_ENV['APP_ENV'] = $_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? 'dev';

// Overwrite previous config with APP_ENV specific values ("env", "test", "prod", "github", etc.)
if (isset($_ENV['APP_ENV'])) {
    $appEnvConfigFile = __DIR__ . '/env/env.' . $_ENV['APP_ENV'] . '.php';
    if (file_exists($appEnvConfigFile)) {
        // e.g. env.test.php or env.prod.php
        require $appEnvConfigFile;
    }
}

return $settings;
