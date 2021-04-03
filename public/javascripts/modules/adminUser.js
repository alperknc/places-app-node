import axios from 'axios';

export function isBusiness(e) {
    axios
        .get(this.action)
        .then(axios.get("/admin/users").then(res => {
            location.reload();
        }))
        .catch(console.error);

    
}

export function isAdmin(e) {
    axios
        .get(this.action)
        .then(axios.get("/admin/users").then(res => {
            location.reload();
        }))
        .catch(console.error);
}