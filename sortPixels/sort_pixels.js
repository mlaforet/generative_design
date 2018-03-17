// Getting image data does not format data into information about individual pixels
// This function transfroms the raw data into a proper format for further manipulation
function manipulatePixels(data) {
  var newArray = [];
  var pixel = 'pixel_';
  count = 0
  var name;
  for (var i = 0; i < data.length; i += 4) {
    name = pixel + count;
    var name = []
    name.push(data[i], data[i+1], data[i+2], data[i+3]);
    newArray[count] = name;
    count += 1;
  }
  return newArray;
}

// Instantiate variables
var ctx, width, height;
var img = new Object();
var canvas = new Object();
var pixelMap = new Map(); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
var originalArray = []
var currentStage = 1;

// When image is loaded - run the code.
document.addEventListener("DOMContentLoaded", function() {
  canvas = document.getElementById('image_canvas');
  img.src = document.getElementById('image');
  width = canvas.width = img.src.width;
  height = canvas.height = img.src.height;
  start();
});


function start() {
  ctx = canvas.getContext('2d'); // set canvas rendering context
  ctx.drawImage(img.src, 0, 0);

  width = canvas.width;
  height = canvas.height;

  var imgData = ctx.getImageData(0, 0, width, height);
  var pixels = imgData.data;

  l = width * height;
  
  for (i = 0; i < l; i ++) {
    var r = pixels[i * 4 + 0];
    var g = pixels[i * 4 + 1];
    var b = pixels[i * 4 + 2];
    var a = pixels[i * 4 + 3];
    var color = chroma(r,g,b);
    var y = parseInt(i / width, 10);
    var x = i - y * width;
    originalArray.push({
      // original position of a pixel
      y: y,
      x: x,
      d: 1 - chroma.distance('#ffffff', color) / (color.get('rgb')[0] * 0.222 + color.get('rgb')[1] * 0.707 + color.get('rgb')[2] * 0.071),
      //d: chroma.distance('#ffffff', color),
      //d: Math.round(color.get('rgb')[0] * 0.222 + color.get('rgb')[1] * 0.707 + color.get('rgb')[2] * 0.071),
      // Randomly assign animation lifespan
      timeSpan: Math.round(Math.random() * 120) + 30,

      // current frame number, used for interpolation
      frame: 0,

      // Where this pixel should go? Will be computed by computeDestinations()
      destX: 0,
      destY: 0,

      // Current color
      color: color
    });
  }
  var pixelArray = manipulatePixels(pixels);
  var sortedArray = originalArray.concat().sort(function(a, b) {
    return b.d - a.d
    //return (b.d / (b.color.get('rgb')[0] / 100)) - (a.d / (a.color.get('rgb')[0] / 100))
    //return (Math.round(b.color.get('rgb')[0] * 0.222 + b.color.get('rgb')[1] * 0.707 + b.color.get('rgb')[2] * 0.071)) - (Math.round(a.color.get('rgb')[0] * 0.222 + a.color.get('rgb')[1] * 0.707 + a.color.get('rgb')[2] * 0.071))
    // return ((b.color.get('hsl')[0] + b.color.get('hsl')[1] * 2 + b.color.get('hsl')[2] * 5) - 
    //   (a.color.get('hsl')[0] + a.color.get('hsl')[1] * 2 + b.color.get('hsl')[2] * 5))
    //return b.color.get('rgb')[0] - a.color.get('rgb')[0]
  });
  sortedArray.map((obj, index) => {pixelMap.set(String(obj.x) + ',' + String(obj.y), index);});
  originalArray.map((obj) => {
    var index = pixelMap.get(String(obj.x) + ',' + String(obj.y))
    obj.destY = parseInt(index / width, 10);
    obj.destX = index - obj.destY * width; 
  })

  document.body.appendChild(canvas);

  // I did a small pause before initial animation, to set the stage
  setTimeout(() => { requestAnimationFrame(move); }, 1000);
}

function interpolate(t) {
  // This is easeInOutQuad function. See more here https://gist.github.com/gre/1650294
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  // simple linear interpolation.
  return b * t + a * (1 - t);
}

// Main animation loop
function move() {
  // When all pixels cannot be moved anymore, we switch the mode.
  var hasMore = false;

  var imgData = ctx.getImageData(0, 0, width, height);
  var pixels = imgData.data;
  // Okay, let's move the pixels
  originalArray.forEach((point) => {
    // given current frame, use easing to figure out offset of a pixel
    var t = interpolate(point.frame/point.timeSpan);
    if (currentStage === 1 && point.frame < point.timeSpan) {
      point.frame += 1;
      // if at least one point was moved - keep trying on the next frame
      hasMore = true;
      // if (point.frame > 0) point.frame += 2;
    }  else if (currentStage === 2 & point.frame > 0) {
      point.frame -= 1;
      hasMore = true;
      // if (point.frame > 0) point.frame -= 2;
    }

    var x = Math.round(lerp(point.x, point.destX, t));
    var y = Math.round(lerp(point.y, point.destY, t));

    // Color has four components, thus multplying by 4
    var pixelIndex = (x + y * width) * 4;

    var color = point.color.rgba();
    pixels[pixelIndex + 0] = color[0];
    pixels[pixelIndex + 1] = color[1];
    pixels[pixelIndex + 2] = color[2];
    pixels[pixelIndex + 3] = color[3] * 255;
  });

  // All pixels updated on this frame, lets draw them
  ctx.putImageData(imgData, 0, 0);
  
  if (!hasMore) {
    // 3 is just a trick. If current state can be only 1 or 2, then
    // assigning 3 - currentState guarantees that we flip only between
    // these two states.
    currentStage = 3 - currentStage;
    hasMore = true;
    requestAnimationFrame(move);
    // Start next loop after a little pause
    setTimeout(() => requestAnimationFrame(move), 1000);
  } else {
    requestAnimationFrame(move);
  }
}