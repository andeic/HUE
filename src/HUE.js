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

	var ip = ''; //get('http://www.meethue.com/api/nupnp')[0].internalipaddress;
	var user = '';
	var actions = {};
	
	window.HUE = {};

	HUE.lighturl = 'http://' + ip + '/api/' + user + '/lights/';
	HUE.groupurl = 'http://' + ip + '/api/' + user + '/groups/';
	
	/**
	 * Returns a list of lights on the network.
	 */
	HUE.getLights = function() {
		return get(HUE.lighturl);
	}

	/**
	 * Returns the current attributes of a light.
	 * @param int light The number of the light.
	 */
	HUE.getLight = function(light) {
		return get(HUE.lighturl + light);
	}

	/**
	 * Returns a list of groups of the lights.
	 * NB: Currently not suported by philips API.
	 */
	HUE.getGroups = function() {
		return get(HUE.groupurl);
	}

	/**
	 * Returns the attributes of a group.
	 * NB: Currently not suported by philips API.
	 */
	HUE.getGroup = function(group) {
		return get(HUE.groupurl + group);
	}

	/**
	 * Switches a specific light on or off depending on its current state.
	 * @param in light The number of the light.
	 */
	HUE.switch = function(light) {
		if (HUE.getLight(light).state.on) {
			actions['on'] = false;
		}
		else {
			actions['on'] = true;
		}
		put(HUE.lighturl + light + '/state', JSON.stringify(actions));
	}

	/**
	 * Turns a group of lights on.
	 * @param int group The number of the group.
	 */
	HUE.groupOn = function(group) {
		actions['on'] = true;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

	/**
	 * Turns a group of lights off.
	 * @param int group The number of the group.
	 */
	HUE.groupOff = function(group) {
		actions['on'] = false;
		put(HUE.groupurl + group + '/action', JSON.stringify(actions));
	}

})();