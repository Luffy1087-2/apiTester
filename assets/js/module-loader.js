import { $, DOM } from './dom';

class ModuleLoader {
    static load ($context) {
        if ($context && $context.constructor !== DOM) {
            throw new TypeError('$context should be type of DOM');
        }

        $context = $context || $('body');
        const $modules = $context.$querySelectorAll('[data-module]');
        for (let $el of $modules) {
            let dir = $el.getAttribute('data-dir');
            let moduleName = $el.getAttribute('data-module');
            let path = ModuleLoader.toPath([dir, moduleName]);
            import(`./${path}`).then((Module) => new Module.default());
        }
    }

    static toPath (pieces) {
        const newPieces = pieces.reduce((newPieces, value) => {
            if (value) {
                newPieces.push(value);
            }
            
            return newPieces;
        }, []);

        return newPieces.join('/');
    }
}

export default ModuleLoader;