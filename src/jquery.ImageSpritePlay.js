(function($){

	var defaults =
	{
		image       : null,
		frame_count : 0,
		loop        : false,
		autoplay    : false,
		delay       : 0,		// Delay on first play
		inverted    : false,	// false: forward, true: backward
		velocity    : 500,
		onComplete  : null,
	};
	var objects = [];

	var methods =
	{
		init : function(options)
		{
			var opts = $.extend( {}, defaults, options );

			return this.each(function()
			{
				$.fn.imageSpritePlay.process($(this), opts);
			});
		},
		first      : function()      { return this.each(function() { $.fn.imageSpritePlay.first(this); }); },
		previous   : function()      { return this.each(function() { $.fn.imageSpritePlay.previous(this); }); },
		play       : function()      { return this.each(function() { $.fn.imageSpritePlay.play(this); }); },
		delay_play : function(p_arg) { return this.each(function() { $.fn.imageSpritePlay.delay_play(this, p_arg); }); },
		pause      : function()      { return this.each(function() { $.fn.imageSpritePlay.pause(this); }); },
		resume     : function()      { return this.each(function() { $.fn.imageSpritePlay.resume(this); }); },
		stop       : function()      { return this.each(function() { $.fn.imageSpritePlay.stop(this); }); },
		next       : function()      { return this.each(function() { $.fn.imageSpritePlay.next(this); }); },
		goto       : function(p_arg) { return this.each(function() { $.fn.imageSpritePlay.goto(this, p_arg); }); },
		restart    : function()      { return this.each(function() { $.fn.imageSpritePlay.restart(this); }); },
		refresh    : function()      { return this.each(function() { $.fn.imageSpritePlay.refresh(this); }); },
		last       : function()      { return this.each(function() { $.fn.imageSpritePlay.last(this); }); },
		velocity   : function(p_arg) { return this.each(function() { $.fn.imageSpritePlay.velocity(this, p_arg); }); },
		loop       : function(p_arg) { return this.each(function() { $.fn.imageSpritePlay.loop(this, p_arg); }); },
		invert     : function()      { return this.each(function() { $.fn.imageSpritePlay.invert(this); }); },
		delay      : function(p_arg) { return this.each(function() { $.fn.imageSpritePlay.delay(this, p_arg); }); },
		attach     : function(p1, p2){ return this.each(function() { $.fn.imageSpritePlay.attach(this, p1, p2); }); },
	};

	$.fn.imageSpritePlay = function(methodOrOptions)
	{
		if ( methods[methodOrOptions] )
		{
			return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof methodOrOptions === 'object' || ! methodOrOptions )
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error('Method ' + methodOrOptions + ' does not exist on jQuery.imageSpritePlay');
		}
	};

	$.fn.imageSpritePlay.makeId = function()
	{
		var text = "";
		var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789";
		var pl = possible.length;
		for(var i = 0; i < 8; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * pl));
		}
		return text;
	};

	$.fn.imageSpritePlay.loop = function(p_arg, p_loop)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		objects[ids].options.loop = p_loop;
		$.fn.imageSpritePlay.refresh(ids);
	}

	$.fn.imageSpritePlay.delay = function(p_arg, p_delay)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		objects[ids].options.delay = p_delay;
		$.fn.imageSpritePlay.refresh(ids);
	}

	$.fn.imageSpritePlay.invert = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		objects[ids].options.inverted = (!objects[ids].options.inverted);
		if (objects[ids].timer != null)
		{
			$.fn.imageSpritePlay.refresh(ids);
		}
	}

	$.fn.imageSpritePlay.velocity = function(p_arg, p_velocity)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		objects[ids].options.velocity = p_velocity;
		if (objects[ids].timer != null)
		{
			$.fn.imageSpritePlay.refresh(ids);
		}
	}

	$.fn.imageSpritePlay.delay_play = function(p_arg, p_miliseconds)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		setTimeout(function() { objects[ids].options.delay = 0; $.fn.imageSpritePlay.play(ids); }, p_miliseconds);
	}

	$.fn.imageSpritePlay.play = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids === undefined) { return; }

		if (objects[ids].options.delay > 0)
		{
			return $.fn.imageSpritePlay.delay_play(ids, objects[ids].options.delay);
		}

		if (objects[ids].timer != null)
		{
			clearInterval(objects[ids].timer);
		}

		$.fn.imageSpritePlay.first(ids);
		objects[ids].timer = setInterval
		(
			function()
			{
				$.fn.imageSpritePlay.next(ids);
			},
			objects[ids].options.velocity
		);
	}

	$.fn.imageSpritePlay.pause = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		if (objects[ids].timer != null)
		{
			clearInterval(objects[ids].timer);
		}
	}

	$.fn.imageSpritePlay.stop = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		if (objects[ids].timer != null)
		{
			clearInterval(objects[ids].timer);
		}
	}

	$.fn.imageSpritePlay.resume = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		if (objects[ids].timer != null)
		{
			clearInterval(objects[ids].timer);
		}

		objects[ids].timer = setInterval
		(
			function()
			{
				$.fn.imageSpritePlay.next(ids);
			},
			objects[ids].options.velocity
		);
	}

	$.fn.imageSpritePlay.refresh = function(p_arg)
	{
		$.fn.imageSpritePlay.pause(p_arg);
		$.fn.imageSpritePlay.resume(p_arg);
	}

	$.fn.imageSpritePlay.restart = function(p_arg)
	{
		$.fn.imageSpritePlay.stop(p_arg);
		$.fn.imageSpritePlay.play(p_arg);
	}

	$.fn.imageSpritePlay.goto = function(p_arg, p_frame)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		objects[ids].frame = (p_frame - 1);
		$.fn.imageSpritePlay.updateFrame(ids);
	}
	
	$.fn.imageSpritePlay.first = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		objects[ids].frame = (!objects[ids].options.inverted) ? 0 : objects[ids].options.frame_count-1;
		$.fn.imageSpritePlay.updateFrame(ids);
	}
	
	$.fn.imageSpritePlay.previous = function(p_arg, p_force)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		if (p_force === undefined)
		{
			if (objects[ids].options.inverted)
			{
				return $.fn.imageSpritePlay.next(ids, true);
			}
		}

		if (objects[ids].options.loop == false)
		{
			if (objects[ids].frame > 0)
			{
				objects[ids].frame--;
			}
			else
			{
				if (objects[ids].timer != null)
				{
					$.fn.imageSpritePlay._onComplete(ids);
					clearInterval(objects[ids].timer);
				}
				return;
			}
		}
		else
		{
			if (objects[ids].frame > 0)
			{
				objects[ids].frame--;
			}
			else
			{
				$.fn.imageSpritePlay._onComplete(ids);
				objects[ids].frame = objects[ids].options.frame_count-1;
			}
		}
		$.fn.imageSpritePlay.updateFrame(ids);
	};

	$.fn.imageSpritePlay.next = function(p_arg, p_force)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		if (p_force === undefined)
		{
			if (objects[ids].options.inverted)
			{
				return $.fn.imageSpritePlay.previous(ids, true);
			}
		}

		if (objects[ids].options.loop == false)
		{
			if (objects[ids].frame >= objects[ids].options.frame_count-1)
			{
				if (objects[ids].timer != null)
				{
					$.fn.imageSpritePlay._onComplete(ids);
					clearInterval(objects[ids].timer);
				}
				return;
			}
			else
			{
				objects[ids].frame++;
			}
		}
		else
		{
			if (objects[ids].frame < objects[ids].options.frame_count-1)
			{
				objects[ids].frame++;
			}
			else
			{
				$.fn.imageSpritePlay._onComplete(ids);
				objects[ids].frame = 0;
			}
		}
		$.fn.imageSpritePlay.updateFrame(ids);
	};

	$.fn.imageSpritePlay._onComplete = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (objects[ids].options.onComplete !== null)
		{
			objects[ids].options.onComplete.call(this, objects[ids]);
		}
	}

	$.fn.imageSpritePlay.last = function(p_arg)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		objects[ids].frame = (!objects[ids].options.inverted) ? objects[ids].options.frame_count-1 : 0;
		$.fn.imageSpritePlay.updateFrame(ids);
	}

	$.fn.imageSpritePlay.updateFrame = function(p_ids)
	{
		var pos = (objects[p_ids].frame * objects[p_ids].image.frame_size) * -1;
		switch(objects[p_ids].direction)
		{
			case 'h':
				objects[p_ids].element.css('background-position', pos + 'px 0px');
			break;
			case 'v':
				objects[p_ids].element.css('background-position', '0px ' + pos + 'px');
			break;
		}
	};
	
	$.fn.imageSpritePlay.attach = function(p_arg, p1, p2)
	{
		var ids = (typeof(p_arg) == 'object') ? $(p_arg).attr('data-sprite-ids') : p_arg;
		if (ids == undefined) { return; }
		objects[ids].attached = 
		{
			marginTop   : p1,
			marginBottom: p2
		}

		$.fn.imageSpritePlay._ajustRuler(objects[ids]);

		$(window).scroll(function(event) { $.fn.imageSpritePlay._ajustRuler(objects[ids]); });
		$(window).resize(function(event) { $.fn.imageSpritePlay._ajustRuler(objects[ids]); });
	}

	$.fn.imageSpritePlay._ajustRuler = function(p_comp)
	{
		var margin_top    = p_comp.attached.marginTop;
		var margin_bottom = p_comp.attached.marginBottom;
		var point_scroll  = $(window).scrollTop();
		var point_middle  = point_scroll + ($(window).height() / 2);

		var zone_top    = point_middle - margin_top;
		var zone_bottom = point_middle + margin_bottom;

		var obj_top = p_comp.element.offset().top;

		if ( (obj_top > zone_top) && (obj_top < zone_bottom) )
		{
			var area_total = margin_top + margin_bottom;
			var y = obj_top - zone_top;
			var prc = (y * 100) / area_total;

			var frame = Math.round((prc * p_comp.options.frame_count) / 100);
			if (frame <= 0) { frame = 1; }
			p_comp.element.imageSpritePlay('goto', frame);
			$('#regua').css('backgroundColor', 'red');
		}
		else
		{
			$('#regua').css('backgroundColor', 'blue');
		}
	}

	$.fn.imageSpritePlay.process = function(p_elem, p_options)
	{
		var ids = $.fn.imageSpritePlay.makeId();
		while (objects[ids] !== undefined)
		{
			ids = $.fn.imageSpritePlay.makeId();
		}
		var comp = {};
		comp.element = p_elem;
		comp.options = p_options;
		comp.frame = 0;
		comp.direction = '';
		comp.image = {};
		comp.image.frame_size = 0;
		comp.image.loaded = false;
		comp.timer = null;
		comp.attached = null;

		objects[ids] = (comp);
		p_elem.attr('data-sprite-ids', ids).addClass('ImageSpritePlay');

		var tmpImg = new Image() ;
		tmpImg.src = p_options.image;
		tmpImg.onload = function()
		{
			objects[ids].image.loaded = true;
			objects[ids].image.image  = tmpImg;
			objects[ids].image.width  = tmpImg.width;
			objects[ids].image.height = tmpImg.height;
			objects[ids].direction = (objects[ids].image.width > objects[ids].image.height) ? 'h' : 'v';
			switch(objects[ids].direction)
			{
				case 'h':
					objects[ids].image.frame_size = objects[ids].image.width / objects[ids].options.frame_count;
					objects[ids].element
						.css('width', objects[ids].image.frame_size)
						.css('height', objects[ids].image.height)
						.css('background-image', 'url(' + objects[ids].options.image + ')')
						.css('background-repeat', 'no-repeat')
						.css('background-position', '0px 0px')
					;
				break;
				case 'v':
					objects[ids].image.frame_size = objects[ids].image.height / objects[ids].options.frame_count;
					objects[ids].element
						.css('width', objects[ids].image.width)
						.css('height', objects[ids].image.frame_size)
						.css('background-image', 'url(' + objects[ids].options.image + ')')
						.css('background-repeat', 'no-repeat')
						.css('background-position', '0px 0px')
					;
				break;
			}
			if (objects[ids].options.autoplay)
			{
				$.fn.imageSpritePlay.play(ids);
			}
		};
	};

})( jQuery );
