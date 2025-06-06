export function initDarkModeToggle() {
// Get the toggle switch element
    const toggleSwitch = document.querySelector('#dark-mode-toggle-checkbox');

    if (toggleSwitch) {
        // Add event listener to the toggle switch for theme switching
        toggleSwitch.addEventListener('change', switchTheme, false);

        // Retrieve the current theme from localStorage
        const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

        // Set the theme based on the stored value from localStorage
        if (currentTheme) {
            // Set the data-theme attribute on the html element
            document.documentElement.setAttribute('data-theme', currentTheme);

            // Check the toggle switch if the current theme is 'dark'
            if (currentTheme === 'dark') {
                toggleSwitch.checked = true;
            }
        }
    }
}

/**
 * Handle theme switching with localstorage
 *
 * @param e
 */
function switchTheme(e) {
    let theme;
    // Check the current theme and switch to the opposite theme
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        theme = 'light';
    } else {
        theme = 'dark';
    }
    // Set html data-attribute and local storage entry
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}


