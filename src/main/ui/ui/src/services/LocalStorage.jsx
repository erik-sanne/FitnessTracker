
const LocalStorage = class {

    static get = (key, subKey=null, orElse = null) => {
        const object = JSON.parse(localStorage.getItem(key));
        if (!subKey)
            return object ? object : orElse;
        return object ? (object[subKey] ? object[subKey] : orElse) : orElse;

    }

    static set = (key, value) => {
        if (!Array.isArray(key)) {
            localStorage.setItem(key, JSON.stringify(value));
            return;
        }

        const primKey = key[0];
        const subKey = key[1];

        const object = LocalStorage.get(primKey) || {};
        object[subKey] = value;
        LocalStorage.set(primKey, object);
    }

    static remove = (key, subKey = null) => {
        if (!subKey) {
            localStorage.removeItem(key);
            return;
        }

        const object = LocalStorage.get(key);
        if (object) {
            delete object.subKey;
            LocalStorage.set(key, object);
        }
    }

    static keys = () => {
        return [... Array(localStorage.length).keys()].map(i => localStorage.key(i));
    }
}

export default LocalStorage;