// function manipulatePixels(canvas) {
// 	var imageData = canvas.getImageData(0, 0, canvas.width, canvas.height);
// 	var data = imageData.data;
// 	console.log(data);
// }

// $.ajax({
// 	url: 'https://github.com/mlafore3/generative_design/blob/master/sortPixels/light.png',
// 	type: 'GET',
// 	success: function (response){
// 		var photo = new Image();
// 		photo.src = response;
// 		console.log(response);
// 	}
// })

document.addEventListener("DOMContentLoaded", function() {
	var can = document.getElementById('image_canvas');
	var photoSrc = document.getElementById('image');
	var photo = new Image();
	photo.src = photoSrc.src;
	can.width = photo.width;
	can.height = photo.height;
	var ctx = can.getContext("2d");
	ctx.drawImage(photo, 0, 0);
	var imageData = ctx.getImageData(0, 0, can.width, can.height);
	var data = imageData.data;
	console.log(data);
		//manipulatePixels(can);
});
