import ATV from 'atvjs';

var PlayPage = ATV.Page.create({
    name: 'play',
    ready(options, resolve, reject) {

		let player = new Player();
		let mediaItem = new MediaItem('video', options.links[0].url);
		let playlist = new Playlist();

		playlist.push(mediaItem);
		player.playlist = playlist;
		player.play();

		resolve(false);
    }
});

export default PlayPage;