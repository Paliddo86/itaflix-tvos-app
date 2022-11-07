const backendUrl = 'http://localhost:3000/';

const toQueryString = (obj) => {
    return (
        _.map(obj, (v, k) => {
            if (_.isArray(v)) {
                return (_.map(v, (av) => `${k}[]=${av}`)).join('&');
            } else {
                return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
            }
        })
    ).join('&');
};
const toUrl = (url = '', params = {}) => {
    let q = toQueryString(params);
    let urlBuffer = [url];
    if (q) {
        urlBuffer.push(/\?.+$/.test(url) ? `&${q}` : `?${q}`);
    }
    return urlBuffer.join('');
};
const buildUrl = (path, params) => toUrl(`${backendUrl}${path}`, params);

const backend = {
	movies(page) {  return buildUrl(`movies/${page}`, {}); },
	movieDetails(id) { return buildUrl(`movie/${id}`); }
}

export default backend;