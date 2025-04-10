export class FretboardImageExporter {
    /**
     * Captures a DOM element and downloads it as an image
     * @param {HTMLElement} element - The DOM element to capture
     * @param {string} fileName - Name for the downloaded file
     */
    static captureAndDownload(element, fileName = 'fretboard.png') {
        if (!element) {
            console.error('No element provided for capture');
            return;
        }

        // Use html2canvas to convert the DOM element to a canvas
        html2canvas(element, {
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background-color') || '#ffffff',
            scale: 2, // Higher quality
            logging: false,
            useCORS: true
        }).then(canvas => {
            // Convert canvas to image and download
            const link = document.createElement('a');
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            link.click();
        })
            .catch(error => {
                console.error('Error generating image:', error);
            });
    }
}