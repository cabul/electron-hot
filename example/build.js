/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var physics = __webpack_require__(1);
	var canvas = document.createElement('canvas');
	canvas.style.position = 'absolute';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.background = '#222222';

	window.addEventListener('resize', function () {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	});

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	document.body.appendChild(canvas);

	var ctx = canvas.getContext('2d');

	var balls = [];
	var start = null;

	function render(now) {
	  window.requestAnimationFrame(render);

	  if (!start) {
	    start = now;
	  }

	  var seconds = (now - start) / 1000;

	  ctx.clearRect(0, 0, canvas.width, canvas.height);

	  ctx.fillStyle = '#ffffff';
	  ctx.font = '16px Helvetica Neue';
	  ctx.textAlign = 'center';

	  ctx.fillText(seconds.toFixed(1) + 's', canvas.width / 2, 32);

	  physics.step(balls, canvas);

	  balls.forEach(function(ball) {
	    ctx.beginPath();
	    ctx.arc(ball.position[0], ball.position[1], ball.radius, 0, 2 * Math.PI, false);
	    ctx.fillStyle = '#ffffff';
	    ctx.fill();
	    ctx.closePath();
	  });
	}

	window.requestAnimationFrame(render);

	window.addEventListener('click', function (evt) {
	  balls.push({
	    position: [evt.x, evt.y],
	    velocity: [0, 0],
	    radius: 25,
	    elasticity: 0.5
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
	  step: function(balls, canvas) {
	    var gravity = [0, 0];
	    balls.forEach(function(ball) {
	      ball.position[0] += ball.velocity[0];
	      ball.position[1] += ball.velocity[1];

	      ball.velocity[0] += gravity[0];
	      ball.velocity[1] += gravity[1];

	      if (ball.position[1] + ball.radius > canvas.height) {
	        ball.position[1] = canvas.height - ball.radius;
	        ball.velocity[1] *= -ball.elasticity;
	        if (Math.abs(ball.velocity[1]) < gravity[1]*2) {
	          ball.velocity[1] = 0;
	        }
	      }
	    });
	  }
	};


/***/ }
/******/ ]);