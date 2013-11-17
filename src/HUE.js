/* HUE v0 | (c) Alex Craig | acraig.ca */
(function() {

	var get = function(url) {
		var data;
		$.ajax({
		    url: url,
		    type: 'GET',
		    async: false,
		    success: function(result) {
		        data = result;
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
		        
		    }
		});
	}

	var def = function(arg, val) { 
		return typeof arg !== 'undefined' ? arg : val;
	}

	var ip = '';
	var user = '';
	var actions = {};
	
	window.HUE = {};

	HUE.lighturl = 'http://' + ip + '/api/' + user + '/lights/';
	HUE.groupurl = 'http://' + ip + '/api/' + user + '/groups/';

	HUE.init = function(options) {
		if (options['autoip'] === true) {
			ip = get('http://www.meethue.com/api/nupnp')[0].internalipaddress;
		}
		else {
			ip = def(options['ip'], ip);
		}

		user = def(options['user'], user);

		HUE.lighturl = 'http://' + ip + '/api/' + user + '/lights/';
		HUE.groupurl = 'http://' + ip + '/api/' + user + '/groups/';
	}

	HUE.rgbtoxy = function(rgb) {
		if (rgb['r'] == 0) rgb['r'] = 1;
		if (rgb['g'] == 0) rgb['g'] = 1;
		if (rgb['b'] == 0) rgb['b'] = 1;

		var r = rgb['r'] / 255;
		var g = rgb['g'] / 255;
		var b = rgb['b'] / 255;
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

		var result = new Array();	
		result['x'] = x / (x + y + z);
		result['y'] = y / (x + y + z);
		result['bri'] = rgb['brightness'];
		
		return result;
	}

	HUE.rgbtohex = function(rgb) {
		return "#" + ((1 << 24) + (rgb['r'] << 16) + (rgb['g'] << 8) + rgb['b']).toString(16).slice(1);
	}

	HUE.hextorgb = function(hex) {
		if (hex.charAt(0) === '#') {
			hex = hex.substring(1,7);
		}

		var rgb = new Array();
		rgb['r'] = parseInt(hex.substring(0, 2), 16);
		rgb['g'] = parseInt(hex.substring(2, 4), 16);
		rgb['b'] = parseInt(hex.substring(4, 6), 16);

		return rgb;
	}

	HUE.hextoxy = function(hex) {
		return HUE.rgbtoxy(HUE.hextorgb(hex));
	}
	
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

	HUE.swich = function(light) {
		if (HUE.getLight(light).state.on) {
			actions['on'] = false;
		}
		else {
			actions['on'] = true;
		}
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.lightOn = function(light) {
		actions['on'] = true;
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.lightOff = function(light) {
		actions['on'] = false;
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	HUE.groupOn = function(group) {
		group = def(group, 0);
		actions['on'] = true;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

	HUE.groupOff = function(group) {
		group = def(group, 0);
		actions['on'] = false;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

})();