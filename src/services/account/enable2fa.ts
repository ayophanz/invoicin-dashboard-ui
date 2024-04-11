import axios from '../../plugins/axios';
import otpTransformer from '../../transformers/otpTransformer';

const success = (data: object, resolve: any) => {
    return resolve(data);
};

const fail = (data: object, reject: any) => {
    const transfomer = otpTransformer.fetch(data);
    return reject(transfomer);
};

export default (id: number, data: object) => {
    const transfomer = otpTransformer.send(data);
    console.log(data);
    console.log(transfomer);
    return new Promise((resolve, reject) => {
        axios.post(`api/account/enable-2fa/${id}`, transfomer)
        .then((response) => {
            success(response.data, resolve);
        })
        .catch((error) => {
            fail(error.response.data.errors, reject);
        })
    });
}