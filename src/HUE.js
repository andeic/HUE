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

	var ip = ''; //get('http://www.meethue.com/api/nupnp')[0].internalipaddress;
	var user = '';
	var actions = {};
	
	window.HUE = {};

	HUE.lighturl = 'http://' + ip + '/api/' + user + '/lights/';
	HUE.groupurl = 'http://' + ip + '/api/' + user + '/groups/';
	
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

	HUE.switch = function(light) {
		if (HUE.getLight(light).state.on) {
			actions['on'] = false;
		}
		else {
			actions['on'] = true;
		}
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