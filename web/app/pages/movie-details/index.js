import ATV from 'atvjs';
import template from './template.hbs';
import BACKEND from 'lib/api-backend';
import errorTpl from 'shared/templates/error.hbs';

var MovieDetailsPage = ATV.Page.create({
	name: 'movie-details',
	template: template,
	ready(options, resolve, reject) {
		let movieId = options.movieId;

		ATV.Ajax
			.get(BACKEND.movieDetails(movieId))
			.then((xhr) => {
				resolve(xhr.response.movie);
			}, (xhr) => {
				// error
				ATV.Navigation.presentModal(errorTpl({title: "Errore", message: "Errore nel recupero dei dati, controllare il server"}));
				reject();
			})
	}
});

export default MovieDetailsPage;