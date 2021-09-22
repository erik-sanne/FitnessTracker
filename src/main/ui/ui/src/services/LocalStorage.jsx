
const LocalStorage = class {

    static get = (key, orElse = null) => {
        const object = JSON.parse(localStorage.getItem(key));
        return object ? object : orElse;

    }

    static set = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export default LocalStorage;