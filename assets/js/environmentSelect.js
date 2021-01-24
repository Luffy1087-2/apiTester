import Select from './select';

class EnvironmentSelect extends Select {
    constructor($select) {
        super($select);
    }

    generateEnvironments(tree) {
        if (!tree || typeof tree !== 'object') {
            throw new TypeError('tree should be an object');
        }

        if (!this.hasDirectories(tree)) {
            throw new TypeError("tree must should contain at least one directory");
        }

        this.fillEnvironments(tree);
    }

    fillEnvironments(tree, $optGroup) {
        if (!tree || typeof tree !== 'object') {
            throw new TypeError('tree should be an object');
        }

        if ($optGroup && $optGroup.get(0).constructor !== HTMLOptGroupElement) {
            throw new TypeError('$optGroup.get(0) should be type of HTMLOptGroupElement');
        }

        if (this.hasFiles(tree) && $optGroup) {
            this.addEnvironmentFiles(tree.dirName, tree.files, $optGroup);
        }

        if (!this.hasDirectories(tree)) {
            return;
        }

        this.addEnvironments(tree.dirs);
    }
    
    addEnvironments(dirs) {
        if (!dirs || dirs.constructor !== Array) {
            throw new TypeError('dirs should be type of Array');
        }
        
        for (let dir of dirs) {
            let $optGroup = this.getOptGroup(dir.dirName);
            this.fillEnvironments(dir, $optGroup);
            this.addOptGroup($optGroup);
        }
    }

    addEnvironmentFiles(dirName, files, $optGroup) {
        if (!files || files.constructor !== Array) {
            throw new TypeError('files should be type of Array');
        }

        for (let file of files) {
            let value = { dirName, queryPath: file.queryPath };
            let $option = this.getOption(file.name, value);
            this.addOptGroupOption($optGroup, $option);
        }
    }

    hasFiles(tree) {
        return  tree &&
                tree.files &&
                tree.files.length > 0;
    }

    hasDirectories(tree) {
        return  tree &&
                tree.dirs &&
                tree.dirs.length > 0;
    }
}

export default EnvironmentSelect;