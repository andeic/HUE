$(document).ready(function() {
	

	$('#b').on('click', function() {
		console.log(HUE.getLights());
	});

	$('#on').on('click', function() {
		var rgb = new Array();
		rgb.r = 0;
		rgb.g = 0;
		rgb.b = 255;

		var hex = '#ff0000';

		HUE.bri(1, 111);
		
	});
	
});