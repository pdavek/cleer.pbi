// Disable autocorrect on all input fields
var inputFields = document.querySelectorAll('.code-display, .code-input, .editor-container');

inputFields.forEach(function(input) {
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
});
