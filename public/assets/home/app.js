import {PatternVisualizer} from "../pattern-visualizer/pattern-visualizer.js?v=0.0.0";

const rootNoteInput = document.getElementById('root-note-input');
const noteNumInput = document.getElementById('note-num-input');
const chordTypeSelect = document.getElementById('chord-type-select');

const patternVisualizer = new PatternVisualizer();

patternVisualizer.displayPattern(rootNoteInput.value !== '' ? rootNoteInput.value : 'C', noteNumInput.value !== '' ? noteNumInput.value : 1, chordTypeSelect.value !== '' ? chordTypeSelect.value : 'major');