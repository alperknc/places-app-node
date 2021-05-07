import axios from 'axios';
import { $ } from './bling';

export function adminList(e) {
    e.preventDefault();
    axios
        .get(this.action)
        .then(axios.get("/admin").then(res => {
            let obj = $("table.table1").rows[this.id]
            obj.remove();
        }))
        .catch(console.error);
}

export function confirm(e) {
    e.preventDefault();
    axios
        .get(this.action)
        .then(axios.get("/admin/business").then(res => {
            location.reload();
        }))
        .catch(console.error);
}

export function setActive(e) {
    e.preventDefault();
    axios
        .get(this.action)
        .then(axios.get("/admin/reviews").then(res => {
            location.reload();
        }))
        .catch(console.error);
}