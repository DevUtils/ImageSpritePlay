$(document).ready(function() {
	
	$("#element-1").imageSpritePlay
	(
		{
			image: 'img/fly.png',
			frame_count: 4,
			velocity: 65,
			autoplay: false,
			loop: true
		}
	);

	$("#element-2").imageSpritePlay
	(
		{
			image: 'img/dragon.png',
			frame_count: 4,
			velocity: 65,
			autoplay: false,
			loop: false
		}
	);

});