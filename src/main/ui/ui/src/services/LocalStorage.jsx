
const LocalStorage = class {

    static get = (key, subKey=null, orElse = null) => {
        const object = JSON.parse(localStorage.getItem(key));
        if (!subKey)
            return object ? object : orElse;
        return object ? object[subKey] ? object [subKey] : orElse : orElse;

    }

    static set = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export default LocalStorage;