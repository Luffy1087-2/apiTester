//Css
import './css/app.css';
import './css/environmentDetails.css';
import './css/popup.css';
//Dependencies
import { $ } from './js/dom';
import ModuleLoader from './js/module-loader';

//Start program
$(document).addEventListener('DOMContentLoaded', (event) => {
    window.prompt = window.require('electron-prompt');
    ModuleLoader.load($('body'));
});