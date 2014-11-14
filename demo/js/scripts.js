$(document).ready(function() {
	
	$("#element-1").imageSpritePlay
	(
		{
			image: 'img/fly.png',
			frame_count: 4,
			velocity: 65,
			autoplay: true,
			loop: true
		}
	);

	$("#element-2").imageSpritePlay
	(
		{
			image: 'img/dragon.png',
			frame_count: 4,
			velocity: 65,
			autoplay: true,
			loop: true,
			onFrame: function(obj)
			{
				if (obj.frame == 2)
				{
					$("#element-2").imageSpritePlay('pause');
					setTimeout(function() { $("#element-2").imageSpritePlay('resume'); }, 2000);
				}
			}
		}
	);

});