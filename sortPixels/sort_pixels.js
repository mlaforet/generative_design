// function manipulatePixels(canvas) {
// 	var imageData = canvas.getImageData(0, 0, canvas.width, canvas.height);
// 	var data = imageData.data;
// 	console.log(data);
// }

var photo = new Image();
photo.src = 'light.png';

document.addEventListener("DOMContentLoaded", function() {
	var can = document.getElementById('image_canvas');
	photo.onload = function () {
		can.width = photo.width;
		can.height = photo.height;
		can.getContext("2d").drawImage(photo, 0, 0);
		var imageData = can.getImageData(0, 0, 300, 300);
		var data = imageData.data;
		console.log(data);
		//manipulatePixels(can);
	}
});
