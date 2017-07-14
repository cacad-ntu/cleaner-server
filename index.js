const express = require('express')
const app = express()
const Robot = require('./algo/robot.js')

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
//   var robot = new Robot(10, 10, 1)
//   console.log(robot.direction)
//   robot.turnLeft()
//   console.log(robot.direction)
//   robot.forward()
// })

var ws = require("nodejs-websocket")


clientHandler = function(conn, data) {
  var response = {
    "mazeMap": [
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [4,4,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [2,2,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [2,2,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ]
  }
  conn.send(JSON.stringify(response));
}

piHandler = function(conn, sensors, counter) {
  console.log("From Pi\n")
  console.log(sensors)
  console.log("\n")
  var response  = {
    // only for calibration
    "action": counter
  }
  conn.send(JSON.stringify(response))
}
var counter = 0
var server = ws.createServer(function (conn) {
  // -1: unexplored
  // 0: cleaned
  // 1: explored
  // 2: robot
  // 3: obstacle
  // 4: robot's head

  // type:
  // 0: client
  // 1: pi
  var robot = new Robot(10, 10, 1)
  console.log(robot.direction)
  robot.turnLeft()
  console.log(robot.direction)
  robot.forward()
  conn.on("text", function (str) {
    console.log("Full:")
    console.log(str)
    var msg = JSON.parse(str)
    if (msg.type == 0) {
      clientHandler(conn, msg.data)
    }
    else if (msg.type == 1) {
      piHandler(conn, msg.sensors, counter)
      counter = (counter + 1) % 4
    }    
  })

  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8080);  