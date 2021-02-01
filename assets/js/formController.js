import ajax from './ajax';
import api from './api';
import popup from './popup';
import { $ } from './dom';
import EnvironmentSelect from './environmentSelect';
import StepsSelect from './stepsSelect';

class FormController {
    
    constructor(ajax, api, popup, EnvironmentSelect, StepsSelect) {
        this.ajax = ajax;
        this.api = api;
        this.popup = popup;
        const $env = $('#environment');
        const $steps = $('#steps');
        this.envSelect = new EnvironmentSelect($env);
        this.stepsSelect = new StepsSelect($steps);
        $('#save').addEventListener('click', this.savePipeline.bind(this));
        $('#add').addEventListener('click', this.addStepOrScenario.bind(this));
        $('#up').addEventListener('click', this.stepsSelect.swapSteps.bind(this.stepsSelect, -1));
        $('#down').addEventListener('click', this.stepsSelect.swapSteps.bind(this.stepsSelect, 1));
        $('#remove').addEventListener('click', this.stepsSelect.removeStep.bind(this.stepsSelect));
        $('#showDetails').addEventListener('click', this.showEnvironmentDetails.bind(this));
        $env.addEventListener('change', this.addSteps.bind(this));
        this.addEnvironments().then(this.addSteps.bind(this));
    }

    async addStepOrScenario() {
        const stepsOrScenario = await this.api.addStepOrScenario();
        
        if (!stepsOrScenario || !stepsOrScenario.areSteps && !stepsOrScenario.isScenario || stepsOrScenario.paths.length === 0) {
            return;
        }

        var steps = stepsOrScenario.paths.map(p => ( { fileName: p.fileName, queryPath: p.queryPath } ));
        this.stepsSelect.addSteps(steps, stepsOrScenario.isScenario);
    }

    async savePipeline() {
        const steps = $('#steps').get(0);
        if (steps.options.length === 0) {
            alert('Pipeline is empty');
        }

        const fileName = await prompt({ title:"Type the file name" });
        if (!fileName) {
            return;
        }

        const stepsObj = Array.from(steps.options).reduce((prev, cur) => {
            prev.steps.push(cur.value);

            return prev;
        }, { steps: [], fileName });


        const data = await this.api.savePipeline(stepsObj);

        if (data.response !== 'ok') {
            alert(data.response);
        }
    }

    async addEnvironments() {
        const envTree = await this.api.getEnvironments();

        this.envSelect.addTree(envTree);
    }

    async addSteps() {
        const $env = this.envSelect.getSelect();

        if (!$env.hasJsonValue) {
            return void alert('Cannot retrieve value for environment');
        }

        const env = $env.get(0);
        const selectedOption = env.selectedOptions[0];
        if (selectedOption.parentNode.tagName === 'OPTGROUP' && selectedOption.parentNode.label === env.dataset.value) {
            return;
        }

        env.dataset.value = selectedOption.parentNode.label;

        const steps = await this.api.getSteps($env.jsonValue.dirName);
        this.stepsSelect.addSteps(steps, true);
    }

    async showEnvironmentDetails() {
        const environment = $('#environment').jsonValue.queryPath;
        const htmlResponse = await this.ajax.get('getEnvironmentDetails', { query: { environment }, html: true });

        this.popup.open({ content: htmlResponse, closeButtonCnt: 'X' });
    }
};

export default FormController.bind(this, ajax, api, popup, EnvironmentSelect, StepsSelect);