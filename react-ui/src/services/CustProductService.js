import axios from 'axios';

const CUST_PRODUCT_URL=`http://localhost:4444/api/cust/product`;

const headers = {
    'Content-Type': 'application/json',
    'custAppId': 36
};

export default {
    getAll() {
        return axios.get(CUST_PRODUCT_URL,{headers: headers})
                    .then(response => Promise.resolve(response.data))
                    .catch(error => Promise.reject(error.response.data));
    },

    getByDate(from, to) {
        return axios.get(CUST_PRODUCT_URL+'/filter', { params: {from, to} },{headers: headers})
                    .then(response => Promise.resolve(response.data))
                    .catch(error => Promise.reject(error.response.data));
    },

    add(PRODUCT) {
        return axios.post(CUST_PRODUCT_URL, PRODUCT,{headers: headers})
                    .then(response => Promise.resolve(response.data))
                    .catch(error => Promise.reject(error.response.data));
    },

    update(id, PRODUCT) {
        return axios.put(CUST_PRODUCT_URL+`/${id}`, PRODUCT,{headers: headers})
                    .then(response => Promise.resolve(response.data))
                    .catch(error => Promise.reject(error.response.data));
    },

    delete(id) {
        return axios.delete(CUST_PRODUCT_URL+`/${id}`,{headers: headers})
                    .then(response => Promise.resolve(response.data))
                    .catch(error => Promise.reject(error.response.data));
    }
};