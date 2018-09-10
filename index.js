(function () {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;

  function mySpawn() {
    console.log('spawn called');
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
})();


fs = require('fs')
im = require('imagemagick')
server = require('express')();

guid = require('./services/guid-generator');

server.get("/", function (request, response) {

  let msg = guid.generateGuid();

  let output = `images/${guid.generateGuid()}.jpg`;

  const h = 100;
  const w = 500;

  const resolution = 72,
    size = 512,
    sampling_factor = 3,
    background_color = "#003366",
    text_color = "#FFFFFF";

  const args = [
    "-density", `${resolution * sampling_factor}`,
    "-size", `${size * sampling_factor}x${size * sampling_factor}`,
    `canvas:${background_color}`,
    "-fill", text_color,
    "-pointsize", "30",
    "-gravity", "center",
    "-annotate", "+0+0",
    `${msg}`,
    "-resample", `${resolution}`,
    output
  ];

  im.convert(args, function (err, stdout) {
    if (err) {
      console.log(`ERROR: convert => ${err}`);
      throw err;
    } else {

      fs.readFile(output, function (err, data) {
        if (err) throw err;
        response.writeHead(200, {
          'Content-Type': 'image/png'
        })
        response.end(data)
      });
    }

  }, (error) => {
    console.log(error);
  });
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const app = server.listen(4200, () => {
  console.log('server listening');
});