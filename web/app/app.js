import ATV from 'atvjs';

// template helpers
import 'lib/template-helpers';
// raw css string
import css from 'assets/css/app.css';
// shared templates
import loaderTpl from 'shared/templates/loader.hbs';
import errorTpl from 'shared/templates/error.hbs';
import descriptiveTpl from 'shared/templates/descriptive.hbs';

// pages
import HomePage from 'pages/home';
import MoviesPage from 'pages/movies';
import TvShowsPage from 'pages/tvshows';
import MovieDetailsPage from 'pages/movie-details';
import PlayPage from 'pages/play';

ATV.start({
	style: css,
	menu: {
		items: [{
			id: 'home',
			name: 'Home',
			page: HomePage,
			attributes: { autoHighlight: true }
		}, {
			id: 'movies-page',
			name: 'Film',
			page: MoviesPage
		}, {
			id: 'tvshows-page',
			name: 'Serie TV',
			page: TvShowsPage
		}]
	},
	// global handlers
	handlers: {
		select: {
			showMore(e) {
				let element = e.target;
				let showDescription = element.getAttribute('allowsZooming');

				if (showDescription) {
					ATV.Navigation.presentModal(descriptiveTpl({message: element.textContent}));
				}
			}
		}
	},
	templates: {
		loader: loaderTpl,
		error: errorTpl,
		descriptive: descriptiveTpl,
		// status level error handlers
		status: {
			'404': () => errorTpl({
				title: '404',
				message: 'Pagina non trovata!'
			}),
			'500': () => errorTpl({
				title: '500',
				message: 'An unknown error occurred in the application. Please try again later.'
			}),
			'503': () => errorTpl({
				title: '503',
				message: 'An unknown error occurred in the application. Please try again later.'
			})
		}
	},
	onLaunch(options) {
		ATV.Navigation.navigateToMenuPage();
	}
});
