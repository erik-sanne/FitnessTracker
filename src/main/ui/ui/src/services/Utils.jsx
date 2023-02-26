const Utils = class {

    static camelCase = (text) => {
        text = text.toLowerCase();
        return text.charAt(0).toUpperCase() + text.slice(1)
    }
}

export default Utils;