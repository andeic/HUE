$(document).ready(function() {
	

	$('#b').on('click', function() {
		console.log(HUE.getLights());
	});

	$('#on').on('click', function() {
		HUE.swich(1);
	});

	var rgb = new Array();
	rgb['r'] = 255;
	rgb['g'] = 0;
	rgb['b'] = 0;

	console.log(HUE.rgbtoxy(rgb));

	var hex = '#ff0000';
	console.log(HUE.hextoxy(hex));
});