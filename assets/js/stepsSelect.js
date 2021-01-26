import Select from './select';

class StepSelect extends Select {
    constructor($select) {
        super($select);
    }

    swapSteps(nextPosition) {
        if (typeof nextPosition !== 'number') {
            throw new TypeError("nextPosition should be type of number");
        }

        const $steps = this.getSelect();
        const steps = $steps.get(0);
        const selectedIndex = steps.selectedIndex;
        const nextIndex = selectedIndex+nextPosition;
        const options = [ ...steps.options ];
        
        steps.focus();
        if (selectedIndex === -1 || typeof options[nextIndex] === 'undefined') { return; }
    
        const currentStep = options[selectedIndex];
        const nextStep = options[nextIndex];

        $steps.empty();
        options[selectedIndex] = nextStep;
        options[nextIndex] = currentStep;
        options.forEach(opt => {
            const $option = this.getOption(opt.text, opt.value);
            this.addOption($option);
        });
        steps.selectedIndex = nextIndex;
    }

    removeStep() {
        const steps = this.getSelect().get(0);
        const selectedIndex = steps.selectedIndex;

        if (steps.selectedIndex === -1) { return; }

        steps.options.remove(selectedIndex);
        steps.selectedIndex  = selectedIndex - 1 > -1 ? selectedIndex - 1 : selectedIndex;
        steps.focus();
    }

    addSteps(steps) {
        if (!steps || steps.constructor !== Array) {
            throw new TypeError("steps should be type of Array");
        }

        const $steps = this.getSelect();

        $steps.empty();
        steps.forEach((step) => this.createAndAddOption(step.fileName, step.queryPath));
    }
}

export default StepSelect;