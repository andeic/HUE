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

	var ip = get('http://www.meethue.com/api/nupnp')[0].internalipaddress;
	var user = '';
	
	window.HUE = {};

	HUE.baseurl = 'http://' + ip + '/api/' + user + '/';
	
	HUE.getLights = function() {
		return get(HUE.baseurl + 'lights');
	}
	
	HUE.test = function() {
		var j = {};
		j['on'] = true;

		put(HUE.baseurl + 'lights/2/state', JSON.stringify(j));
	}

})();