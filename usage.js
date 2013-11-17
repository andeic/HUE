$(document).ready(function() {
	

	$('#b').on('click', function() {
		console.log(HUE.getLights());
	});

	$('#on').on('click', function() {
		HUE.swich(1);
	});
});