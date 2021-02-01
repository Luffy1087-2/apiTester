import { $ } from './dom';

class Select {
    constructor($select) {
        if ($select && $select.get(0).constructor !== HTMLSelectElement) {
            throw new TypeError("$select.get(0) should be type of HTMLSelectElement");
        }

        this.$select = $select || $('SELECT');
    }

    getSelect() {
        return this.$select;
    }
 
    getOption(text, value) {
        const $option = $('<option>');
        const option = $option.get(0);

        option.text = text;
        option.value = typeof value === 'object' ? JSON.stringify(value) : value;

        return $option;
    }

    getOptGroup(label) {
        const $optGroup = $('<optgroup>');

        $optGroup.get(0).label = label;

        return $optGroup;
    }

    addOption($option) {
        const option = $option.get(0);
        
        if (!$option || option.constructor !== HTMLOptionElement) {
            throw new TypeError('$option.get(0) should be type of HTMLOptionElement');
        }

        this.$select.get(0).appendChild(option);
    }

    addOptGroup($optGroup) {
        if (!$optGroup || $optGroup.get(0).constructor !== HTMLOptGroupElement) {
            throw new TypeError('$optGroup.get(0) should be type of HTMLOptGroupElement');
        }

        this.$select.get(0).appendChild($optGroup.get(0));
    }

    addOptGroupOption($optGroup, $option) {
        if (!$optGroup || $optGroup.get(0).constructor !== HTMLOptGroupElement) {
            throw new TypeError('$optGroup.get(0) should be type of HTMLOptGroupElement');
        }
    
        if (!$option || $option.get(0).constructor !== HTMLOptionElement) {
            throw new TypeError('$option.get(0) should be type of HTMLOptionElement');
        }

        $optGroup.get(0).appendChild($option.get(0));
    }

    createAndAddOption(text, value) {
        const $option = this.getOption(text, value);
        
        this.addOption($option);
    }
}

export default Select;