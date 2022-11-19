import ATV from 'atvjs';
import template from './template.hbs';
import BACKEND from 'lib/api-backend';
import errorTpl from 'shared/templates/error.hbs';

var MovieDetailsPage = ATV.Page.create({
	name: 'movie-details',
	template: template,
	ready(options, resolve, reject) {
		ATV.Ajax
			.post(BACKEND.movieInfo, {headers: {"Content-Type": "application/json"}, data: JSON.stringify({id: options.id, slug: options.slug})})
			.then((xhr) => {
				resolve(xhr.response.movie);
			}, (xhr) => {
				// error
				ATV.Navigation.presentModal(errorTpl({title: "Errore", message: "Errore nel recupero dei dati: "  + xhr.response.error}));
				reject(xhr);
			})
	}
});

export default MovieDetailsPage;