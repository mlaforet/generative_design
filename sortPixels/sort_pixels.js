function manipulatePixels(func, data) {
	var newArray = [];
	for (var i = 0; i < data.length; i += 4) {
		newArray.push(func(data[i], data[i+1], data[i+2], data[i+3]));
	}
	return newArray;
}

// function rgbToHex(r, g, b) {
// 	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16)
// .slice(1);
// }

function changeDS(r, g, b, o) {

	return [r, g, b, o]
}

function rgbToHSL(r, g, b, o) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
	if (max == min) {
		h = s = 0;
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h, s, l, o];
}

function hslToRGB(h, s, l, o){
	var r, g, b;
	if (s == 0) {
		r = g = b = l;
	}else{
		var hue2rgb = function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	return [Math.round(r*255), Math.round(g*255), Math.round(b*255), o];
}

function flattenArray(array) {
	resultArray = [];
	for(var i = 0; i < array.length; i += 1) {
		resultArray.push(array[i][0]);
		resultArray.push(array[i][1]);
		resultArray.push(array[i][2]);
		resultArray.push(array[i][3]);
	}
	return resultArray
}

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
	// var newNew = manipulatePixels(changeDS, data);
	// var sortedArray = newNew.sort(function(a,b) {return (b[1]+b[2]/(b[0]*b[1])) - (a[1]+a[2]/(a[1]*a[0]))});
	// var newImage = flattenArray(sortedArray);
	var hueArray = manipulatePixels(rgbToHSL, data);
	var sortedArray = hueArray.sort(function(a,b) {return ((b[0]*b[1]*b[2])) - ((a[1]*a[0]*a[2]))});
	console.log(hueArray, sortedArray);
	var flattenedArray = flattenArray(sortedArray)
	var rgbArray = manipulatePixels(hslToRGB, flattenedArray);
	var newImage = flattenArray(rgbArray);
	var newPic = new ImageData(new Uint8ClampedArray(newImage), can.width, can.height);
	ctx.putImageData(newPic, 0, 0);
});
