/* HUE v0 | (c) Alex Craig | acraig.ca */
(function() {
	/* Local variables */

	var ip = '';
	var user = '';
	var actions = {};
	
	/* HUE variables */

	window.HUE = {};

	HUE.lighturl = 'http://' + ip + '/api/' + user + '/lights/';
	HUE.groupurl = 'http://' + ip + '/api/' + user + '/groups/';
	HUE.ajaxResult = '';

	/* Ajax functions */

	var get = function(url) {
		var data;
		$.ajax({
		    url: url,
		    type: 'GET',
		    async: false,
		    success: function(result) {
		        data = result;
		        HUE.ajaxResult = result;
		    }
		});
		return data;
	}

	var put = function(url, data) {
		$.ajax({
		    url: url,
		    type: 'PUT',
		    data: data,
		    success: function(result) {
		    	HUE.ajaxResult = result;
		    }
		});
	}

	/* Default value helper function */
	var def = function(arg, val) { 
		return typeof arg !== 'undefined' ? arg : val;
	}

	/* HUE initialization function */
	HUE.init = function(options) {
		if (options.autoip === true) {
			ip = get('http://www.meethue.com/api/nupnp')[0].internalipaddress;
		}
		else {
			ip = def(options.ip, ip);
		}

		user = def(options.user, user);

		HUE.lighturl = 'http://' + ip + '/api/' + user + '/lights/';
		HUE.groupurl = 'http://' + ip + '/api/' + user + '/groups/';
	}

	/* Colour functions */

	HUE.rgbtoxy = function(rgb) {
		if (rgb.r == 0) rgb.r = 1;
		if (rgb.g == 0) rgb.g = 1;
		if (rgb.b == 0) rgb.b = 1;

		var r = rgb.r / 255;
		var g = rgb.g / 255;
		var b = rgb.b / 255;
		var r2 = r / 12.92;
		var g2 = g / 12.92;
		var b2 = b / 12.92;

		if (r > 0.04045) {
			var r2 = Math.pow((r + 0.055) / (1.0 + 0.055), 2.4);
		}
		if (g > 0.04045) {
			var g2 = Math.pow((g + 0.055) / (1.0 + 0.055), 2.4);
		}
		if (b > 0.04045) {
			var b2 = Math.pow((b + 0.055) / (1.0 + 0.055), 2.4);
		}

		var x = r2 * 0.649926 + g2 * 0.103455 + b2 * 0.197109; 
		var y = r2 * 0.234327 + g2 * 0.743075 + b2 * 0.022598;
		var z = r2 * 0.000000 + g2 * 0.053077 + b2 * 1.035763;
		
		return [x / (x + y + z), y / (x + y + z)];
	}

	HUE.rgbtohex = function(rgb) {
		return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
	}

	HUE.hextorgb = function(hex) {
		if (hex.charAt(0) === '#') {
			hex = hex.substring(1,7);
		}

		var rgb = new Array();
		rgb.r = parseInt(hex.substring(0, 2), 16);
		rgb.g = parseInt(hex.substring(2, 4), 16);
		rgb.b = parseInt(hex.substring(4, 6), 16);

		return rgb;
	}

	HUE.hextoxy = function(hex) {
		return HUE.rgbtoxy(HUE.hextorgb(hex));
	}
	
	/* Data funcitons */

	HUE.getLights = function() {
		return get(HUE.lighturl);
	}

	HUE.getLight = function(light) {
		return get(HUE.lighturl + light);
	}

	HUE.getGroups = function() {
		return get(HUE.groupurl);
	}

	HUE.getGroup = function(group) {
		group = def(group, 0);
		return get(HUE.groupurl + group);
	}

	/* Single light functions */

	HUE.swich = function(light) {
		if (HUE.getLight(light).state.on) {
			actions.on = false;
		}
		else {
			actions.on = true;
		}
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.on = function(light) {
		actions.on = true;
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.off = function(light) {
		actions.on = false;
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.color = function(light, color, time) {
		color = def(color, 'ffffff');
		time = def (time, 4);

		if (time < 0) time = 0;

		if (color instanceof Array) {
			actions.xy = HUE.rgbtoxy(color);
		}
		else if(typeof color === 'string') {
			actions.xy = HUE.hextoxy(color);
		}
		actions.transitiontime = time;
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.bri = function(light, bri, time) {
		bri = def(bri, 255);
		time = def (time, 4);

		if (bri > 255) bri = 255;
		if (bri < 0) bri = 0;
		if (time < 0) time = 0;

		actions.bri = bri;
		actions.transitiontime = time;
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.colorLoop = function(light, timeout) {
		timeout = def(timeout, 0);

		if (HUE.getLight(light).state.effect === 'none') {
			actions.effect = 'colorloop';
		}
		else {
			actions.effect = 'none';
		}
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));

		if (timeout > 0) {
			setTimeout(function() {
				if (actions.effect === 'none') {
					actions.effect = 'colorloop';
				}
				else {
					actions.effect = 'none';
				}
				put(HUE.lighturl + light + '/state', JSON.stringify(actions));
			}, timeout * 100);
		}
	}

	HUE.breathe = function(light) {
		actions.alert = 'select';
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.breathing = function(light, timeout) {
		timeout = def(timeout, 0);

		if (timeout > 29) timeout = 29;

		actions.alert = 'lselect';
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));

		if (timeout > 0) {
			actions.alert = 'none';
			setTimeout(function() {
				put(HUE.lighturl + light + '/state', JSON.stringify(actions));
			}, timeout * 100);
		}
	}

	HUE.custom = function(light, options) {
		put(HUE.lighturl + light + '/state', JSON.stringify(options));
	}

	/* Group functions */
	/* NB: all group functions are prefaced with 'G' */

	HUE.Gon = function(group) {
		group = def(group, 0);
		actions.on = true;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

	HUE.Goff = function(group) {
		group = def(group, 0);
		actions.on = false;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

	HUE.Gcolor = function(group, color, time) {
		group = def(group, 0);
		color = def(color, 'ffffff');
		time = def (time, 4);

		if (time < 0) time = 0;

		if (color instanceof Array) {
			actions.xy = HUE.rgbtoxy(color);
		}
		else if(typeof color === 'string') {
			actions.xy = HUE.hextoxy(color);
		}
		actions.transitiontime = time;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

	HUE.Gbri = function(group, bri, time) {
		group = def(group, 0);
		bri = def(bri, 255);
		time = def (time, 4);

		if (bri > 255) bri = 255;
		if (bri < 0) bri = 0;
		if (time < 0) time = 0;

		actions.bri = bri;
		actions.transitiontime = time;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

	HUE.GcolorLoop = function(group, state, timeout) {
		group = def(group, 0);
		state = def(state, true);
		timeout = def(timeout, 0);

		if (state) actions.effect = 'colorloop';
		else actions.effect = 'none';
		
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));

		if (timeout > 0 && state) {
			setTimeout(function() {
				if (actions.effect === 'none') {
					actions.effect = 'colorloop';
				}
				else {
					actions.effect = 'none';
				}
				put(HUE.groupurl + group + '/action', JSON.stringify(actions));
			}, timeout * 100);
		}
	}

	HUE.Gbreathe = function(group) {
		group = def(group, 0);
		actions.alert = 'select';
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

	HUE.Gbreathing = function(group, timeout) {
		group = def(group, 0);
		timeout = def(timeout, 0);

		if (timeout > 29) timeout = 29;

		actions.alert = 'lselect';
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));

		if (timeout > 0) {
			actions.alert = 'none';
			setTimeout(function() {
				put(HUE.groupurl + group + '/action', JSON.stringify(actions));
			}, timeout * 100);
		}
	}

	HUE.Gcustom = function(group, options) {
		group = def(group, 0);
		put(HUE.groupurl + group + '/action', JSON.stringify(options));
	}

})();