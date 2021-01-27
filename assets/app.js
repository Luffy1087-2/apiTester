//Css
import './css/app.css';
import './css/environmentDetails.css';
import './css/popup.css';
//Dependencies
import { $ } from './js/dom';

//Start program
document.addEventListener('DOMContentLoaded', (event) => {
    window.prompt = window.require('electron-prompt');
    const $modules = $('[data-module]');
    for (let el of $modules) {
        let $el = $(el);
        let dir = $el.getAttribute('data-dir') || 'js';
        let moduleName = $el.getAttribute('data-module');
        import(`./${dir}/${moduleName}`).then((Module) => new Module.default());
    }
});