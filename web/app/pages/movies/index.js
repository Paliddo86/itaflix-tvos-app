import ATV from 'atvjs';
import template from './template.hbs';
import BACKEND from 'lib/api-backend';
import errorTpl from 'shared/templates/error.hbs';
import {
  movieGenres
} from '../../lib/sc';

function fillMovieCollection(movies, index) {
  // Create Data Items
  let dataItems = [];

  var document = getActiveDocument();

  const listItem = document.getElementsByTagName('listItemLockup').item(index);
  const grid = document.getElementsByTagName('grid').item(index);
  let section = grid.firstElementChild;

  let startItemIndex = listItem.dataItem.moviesCount || 0;

  for (let movie of movies) {
    let dataItem = new DataItem("Movie", startItemIndex++);
    dataItem.small_poster = movie.small_poster;
    dataItem.title = movie.title;
    dataItem.id = movie.id;
    dataItem.language = movie.lang;
    dataItem.slug = movie.slug;
    dataItems.push(dataItem);
  }

  // Append Data Items to the Grid Section

  if (!section.dataItem) {
    let sectionDataItem = new DataItem();
    sectionDataItem.movies = [];
    section.dataItem = sectionDataItem;
  }
  listItem.dataItem.moviesCount += dataItems.length;

  Array.prototype.push.apply(section.dataItem.movies, dataItems);
  section.dataItem.touchPropertyPath("movies");
}

function initDataItemToGenre() {
  for (let i = 0; i < movieGenres.length; i++) {
    // Append Data Items to the Grid Section
    var document = getActiveDocument();

    const listItem = document.getElementsByTagName('listItemLockup').item(i);
    const grid = document.getElementsByTagName('grid').item(i);
    let section = grid.firstElementChild;

    if (!section.dataItem) {
      let sectionDataItem = new DataItem();
      sectionDataItem.movies = [];
      section.dataItem = sectionDataItem;
    }

    if (!listItem.dataItem) {
      let listItemDataItem = new DataItem("Genre", i);
      listItemDataItem.name = movieGenres[i].name;
      listItemDataItem.value = movieGenres[i].value;
      listItemDataItem.loadedMoviePage = 0;
      listItemDataItem.moviesCount = 0;
      listItemDataItem.completed = false;
      listItem.dataItem = listItemDataItem;
    }
  }
}

function grabMovies(dataItem) {
  ATV.Ajax
  .get(BACKEND.movies(++dataItem.loadedMoviePage, "movie", dataItem.value))
  .then((xhr) => {
    dataItem.completed = xhr.response.MovieList.length === 0;
    fillMovieCollection(xhr.response.MovieList, parseInt(dataItem.identifier));
  }, (xhr) => {
    ATV.Navigation.presentModal(errorTpl({
      title: "Errore",
      message: "Errore nel recupero dei film - " + xhr.response.error
    }));
  })
}

var MoviesPage = ATV.Page.create({
  name: 'movies-page',
  template: template,
  events: {
    highlight: 'onHighlight',
    load: 'onLoad',
    select: 'onSelect'
  },
  data() {
    return {
      allgenres: movieGenres
    };
  },
  onLoad(_) {
    initDataItemToGenre();
  },
  onHighlight(event) {
    var ele = event.target;
    var dataItem = ele.dataItem;
    if (dataItem === undefined) return;

    if (dataItem.type === "Genre" && dataItem.moviesCount === 0) {
      grabMovies(dataItem);
      return;
    }

    if (dataItem.type === "Movie") {

      const findCurrentLookItem = (element) => {
        let parent = element.parentNode;
        if (parent.tagName === "listItemLockup") return parent.dataItem;
        return findCurrentLookItem(parent);
      }

      let parentDataItem = findCurrentLookItem(ele);
      if (!parentDataItem.completed && dataItem.identifier && parseInt(dataItem.identifier) >= parentDataItem.moviesCount / 2) {
        grabMovies(parentDataItem);
      }
    }
  },
  onSelect(event) {
    var ele = event.target;
    var dataItem = ele.dataItem;

    if (dataItem === undefined) return;

    if (dataItem.type === "Movie") {
      ATV.Navigation.navigate("movie-details", {
        id: dataItem.id,
        slug: dataItem.slug
      });
    }
  }
});

export default MoviesPage;