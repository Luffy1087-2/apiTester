const isSelector = (data) => {
    return typeof data === 'string' && /^([^<]|[a-z#\.])+$/.test(data);
};

const isFromDOM = (data) => {
    return  data instanceof DOM &&
            data.els &&
            data.els.constructor === Array &&
            data.els.every(el => el instanceof HTMLElement);
};

class DOM {
    constructor (data) {
        let els;
        if (isSelector(data)) {
            els = Array.from(document.querySelectorAll(data));
        } else if (DOM.shouldCreateDOM(data)) {
            els = $(document.createElement('div')).setContent(data).getChildren();
        } else if (isFromDOM(data)) {
            els = data.get(0);
        } else if (data && data.constructor === Array && data.els.every(el => el instanceof HTMLElement)) {
            els = data;
        } else if (data instanceof HTMLElement || data instanceof HTMLDocument) {
            els = [ data ];
        } else {
            els = [];
        }

        this.els = els;

        return this;
    }

    static $ (data) {
        return new DOM(data);
    }

    static shouldCreateDOM (data) {
        return typeof data === 'string' && /<[^>]+>/i.test(data);
    }
    
    setAttributes (attrs = {}) {
        for (let key in attrs) {
            key = key.toLowerCase();
            if (key === 'class') {
                this.addClass(attrs[key]);
            } else if (key === 'style') {
                this.addStyle(attrs[key]);
            } else {
                this.setAttribute(key, attrs[key]);
            }
        }

        return this;
    }

    addStyle (styles) {
        const rules = styles.split(';').map((style => style.trim()));
        for (let rule of rules) {
            let [ ruleKey, ruleValue ] = rule.split(':');
            let pieces = ruleKey.trim().split('-');
            let prop = pieces.slice(1).reduce((value, currentValue) => {
                return `${value}${currentValue.substring(0,1).toUpperCase()}${currentValue.substring(1)}`;
            }, pieces[0].toLowerCase());

            this.els.forEach(el => { el.style[prop] = ruleValue.trim(); });
        }

        return this;
    }

    getAttribute (attrName) {
        return this.els[0].getAttribute(attrName);
    }

    setAttribute (attrName, attrValue) {
        this.els.forEach(el => el.setAttribute(attrName, attrValue));

        return this;
    }

    addClass (className) {
        this.els.forEach(el => el.classList.add(className));

        return this;
    }

    removeClass (className) {
        this.els.forEach(el => el.classList.remove(className));

        return this;
    }

    toggleClass (className) {
        this.els.forEach(el => el.classList.toggle(className));
        
        return this;
    }

    setContent (content, shouldAppend = false) {
        this.els.forEach(el => el.innerHTML = shouldAppend ? el.innerHTML.concat(content) : content);

        return this;
    }

    appendChild (elToAppend) {
        const elsToAppend = [ ...isFromDOM(elToAppend) ? elToAppend.els : elToAppend ];
        this.els.forEach(el => elsToAppend.forEach(eta => el.appendChild(eta)));

        return this;
    }

    empty () {
        this.els.forEach(el => {
            while (el.children.length > 0) {
               el.firstChild.remove();
            }
        });

        return this;
    }

    addEventListener (evtName, callback) {
        this.els.forEach(el => el.addEventListener(evtName, callback));

        return this;
    }

    querySelector (selector) {
        const context = this.els[0] || document;
        
        return context.querySelector(selector);
    }

    $querySelector (selector) {
        return $(this.querySelector(selector));
    }

    querySelectorAll (selector, $context) {
        $context = $context || this.els;
        let els = [];

        $context.forEach(el => els = [ ...el.querySelectorAll(selector) ]);

        return els;
    }

    $querySelectorAll (selector, $context) {
        return this.querySelectorAll(selector, $context).map(el => $(el));
    }

    getChildren () {
        return [ ...this.els[0].children ];
    }

    get (index) {
        return this.els[index];
    }

    get els () {
        return this._els;
    }

    set els (els) {
        this._els = els;
    }

    get hasJsonValue () {
        try {
            return JSON.parse(this._els[0].value);
        } catch(e) {
            return false;
        }
    }

    get jsonValue () {
        return JSON.parse(this._els[0].value);
    }

    *[Symbol.iterator] () {
        for (let el of this.els) {
            yield el;
        }
    }
}

const $ = DOM.$;

export { DOM, $ };