//Css
import './css/app.css';
import './css/environmentDetails.css';
import './css/popup.css';
//Dependencies
import FormController from './js/formController';

//Start program
document.addEventListener('DOMContentLoaded', (event) => {
    window.prompt = window.require('electron-prompt');
    new FormController();
});