import LocalStorage from "./LocalStorage";
import get from "./Get";
import {getCookie} from "react-use-cookie";

const GetCache = class {
    static #base = 'getcache.'

    static #hashed = (string) => {
        return window.btoa(string);
    }

    static #cachekey = () => {
        return `${this.#base}${getCookie('session_token')}`
    }

    static #invalidateOld = () => {
        const caches = LocalStorage.keys().filter(key => key !== this.#cachekey()).filter(key => key.includes(this.#base));
        caches.forEach(key => localStorage.removeItem(key));
    }

    static get = (endpoint) => new Promise((resolve, reject) => {
        this.#invalidateOld();

        let cachevalue = LocalStorage.get(this.#cachekey(), this.#hashed(endpoint));
        if (cachevalue) {
            resolve(cachevalue);
            return;
        }

        get(endpoint).then(resp => {
            LocalStorage.set([this.#cachekey(), this.#hashed(endpoint)], resp);
            resolve(resp);
        }).catch(err => reject(err));
    })

    static invalidate(endpoint=null) {
        if (endpoint) {
            LocalStorage.remove(this.#cachekey(), this.#hashed(endpoint))
            return;
        }

        const caches = LocalStorage.keys().filter(key => key.includes(this.#base));
        caches.forEach(key => localStorage.removeItem(key));
    }
}

export default GetCache;