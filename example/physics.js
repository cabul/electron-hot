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
