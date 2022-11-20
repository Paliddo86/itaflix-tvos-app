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
	movies(page, type, genre) {  return buildUrl(`movies/${page}`, {type, genre}); },
	get movieInfo() { return buildUrl(`movie/info`); },
	get stream() { return buildUrl("movie/streamings"); }
}

export default backend;