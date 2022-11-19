import ATV from 'atvjs';
import template from './template.hbs';
import BACKEND from 'lib/api-backend';
import errorTpl from 'shared/templates/error.hbs';

var moviesCount = 0;
var loadedMoviePage = 1;

function fillMovieCollection(movies) {
  // Create Data Items
  let dataItems = [];
  for(let movie of movies) {
      moviesCount++

      let dataItem = new DataItem("Movie", moviesCount);
      dataItem.small_poster = movie.small_poster;
      dataItem.title = movie.title;
      dataItem.id = movie.id;
      dataItem.language = movie.lang;
      dataItem.slug = movie.slug;
      dataItems.push(dataItem);
  }

  // Append Data Items to the Grid Section
  var document = getActiveDocument();

  const grid = document.getElementsByTagName('grid').item(0);
  const section = grid.getElementsByTagName('section').item(0);

  if (!section.dataItem) {
    let sectionDataItem = new DataItem();
    sectionDataItem.movies = [];
    section.dataItem = sectionDataItem;
  }

  Array.prototype.push.apply(section.dataItem.movies, dataItems);
  section.dataItem.touchPropertyPath("movies");
}

var MoviesPage = ATV.Page.create({
    name: 'movies-page',
    template: template,
    events: {
      highlight: 'onHighlight',
      load: 'onLoad',
      select: 'onSelect'
  },
  onLoad(_) {
      ATV.Ajax
        .get(BACKEND.movies(loadedMoviePage++))
        .then((xhr) => {
          fillMovieCollection(xhr.response.MovieList);
        }, (xhr) => {
          // error
          ATV.Navigation.presentModal(errorTpl({title: "Errore", message: "Errore nel recupero dei film, controllare il server"}));
        })
  },
  onHighlight(event) {
    var ele = event.target;
    var dataItem = ele.dataItem;

    if (dataItem === undefined) return;
    if (dataItem.identifier && parseInt(dataItem.identifier) >= moviesCount / 2) {
      ATV.Ajax
        .get(BACKEND.movies(loadedMoviePage++))
        .then((xhr) => {
         fillMovieCollection(xhr.response.MovieList);
        }, (xhr) => {
          // error
          ATV.Navigation.presentModal(errorTpl({title: "Errore", message: "Errore nel recupero dei film, controllare il server"}));

        })
    }
  },
  onSelect(event) {
    var ele = event.target;
    var dataItem = ele.dataItem;
    console.log("dataItem select", dataItem)

    if (dataItem === undefined) return;
    ATV.Navigation.navigate("movie-details", {id: dataItem.id, slug: dataItem.slug});
  }
});

export default MoviesPage;