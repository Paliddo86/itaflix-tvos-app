import ATV from 'atvjs';
import template from './template.hbs';
import BACKEND from 'lib/api-backend';

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
      load: 'onLoad'
  },
  onLoad(event) {
      ATV.Ajax
        .get(BACKEND.movies(loadedMoviePage++))
        .then((xhr) => {
          fillMovieCollection(xhr.response.MovieList);
        }, (xhr) => {
          // error
          console.log(xhr.response);
        })
  },
  onHighlight(event) {
    var ele = event.target;
    var dataItem = ele.dataItem;

    if (dataItem === undefined) return;
    if (dataItem.identifier && parseInt(dataItem.identifier) >= moviesCount - 10) {
      ATV.Ajax
        .get(BACKEND.movies(loadedMoviePage++))
        .then((xhr) => {
         fillMovieCollection(xhr.response.MovieList);
        }, (xhr) => {
          // error
          console.log(xhr.response);
        })
    }
  }
});

export default MoviesPage;