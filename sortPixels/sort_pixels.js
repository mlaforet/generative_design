// Getting image data does not format data into information about individual pixels
// This function transfroms the raw data into a proper format for further manipulation

// instantiate variables
var ctx, width, height;
var img = new Object();
var canvas = new Object();
var pixelMap = new Map(); // abiity to iteratively set key-value pairs
var originalArray = []
var currentState = 1;

// intiate pixel sorter after the image is loaded
document.addEventListener("DOMContentLoaded", function() {
  canvas = document.getElementById('image_canvas');
  img.src = document.getElementById('image');
  width = canvas.width = img.src.width;
  height = canvas.height = img.src.height;

  formatData();
});


function formatData() {
  ctx = canvas.getContext('2d'); // set canvas rendering context
  ctx.drawImage(img.src, 0, 0);

  var imgData = ctx.getImageData(0, 0, width, height);
  var pixels = imgData.data;

  l = width * height; 

  // map pixel information to x,y coordinates and attach information
  for (i = 0; i < l; i ++) {
    var j = i * 4;
    var r = pixels[j + 0];
    var g = pixels[j + 1];
    var b = pixels[j + 2];
    var a = pixels[j + 3];
    var color = chroma(r,g,b);
    // map index of array to grid based on image size
    var y = parseInt(i / width, 10);
    var x = i - y * width; // y * width is min index value of row
    // attach information to originalArray
    originalArray.push({
      color: color,
      y: y,
      x: x,
      d: 1 - chroma.distance('#ffffff', color) / (color.get('rgb')[0] * 0.222 + color.get('rgb')[1] * 0.707 + color.get('rgb')[2] * 0.071), // get the colour distance from white and divide by the pixels grayscale repr
      timeSpan: 50,
      frame: 0, // current frame number, used for interpolation
      destX: 0, // computeDestinations()
      destY: 0,
    });
  }
  // compute destX and destY
  var sortedArray = originalArray.concat().sort(function(a, b) {
    return b.d - a.d
  });
  sortedArray.map((obj, index) => {pixelMap.set(String(obj.x) + ',' + String(obj.y), index);});
  originalArray.map((obj) => {
    var index = pixelMap.get(String(obj.x) + ',' + String(obj.y))
    obj.destY = parseInt(index / width, 10);
    obj.destX = index - obj.destY * width; 
  })
  setTimeout(() => { requestAnimationFrame(animate); }, 1000);
}

function interpolate(t) {
  // This is easeInOutQuad function. See more here https://gist.github.com/gre/1650294
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  // simple linear interpolation.
  return b * t + a * (1 - t);
}

// animation
function animate() {
  var hasMore = false;

  var imgData = ctx.getImageData(0, 0, width, height);
  var pixels = imgData.data; // one pixel has four components

  originalArray.forEach((point) => {          
    if (currentState === 1 && point.frame < point.timeSpan) {
      point.frame += 1;
      hasMore = true;
    }  else if (currentState === 2 && point.frame > 0) {
      point.frame -= 1;
      hasMore = true;
    }
    // get coordinates of transition point
    var t = interpolate(point.frame/point.timeSpan);
    var x = Math.round(lerp(point.x, point.destX, t));
    var y = Math.round(lerp(point.y, point.destY, t));

    var pixelIndex = (x + y * width) * 4;
    var color = point.color.rgba(); // gives all a values of 1

    // update pixel color values for this animation frame
    pixels[pixelIndex + 0] = color[0];
    pixels[pixelIndex + 1] = color[1];
    pixels[pixelIndex + 2] = color[2];
    pixels[pixelIndex + 3] = color[3] * 255;
  });

  ctx.putImageData(imgData, 0, 0); // redraw img for animation frame

  // recursion
  if (!hasMore) {
    currentState = 3 - currentState;
    hasMore = true;
    setTimeout(() => requestAnimationFrame(animate), 1000);
  } else {
    requestAnimationFrame(animate);
  }
}