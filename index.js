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


clientHandler = function(conn) {
  var data = {
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
  conn.send(JSON.stringify(data));
}

piHandler = function(conn) {
  
}

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
    var type = JSON.parse(str).type
    if (type == 0) {
      clientHandler(conn)
    }
    else if (type == 1) {
      piHandler(conn)
    }    
  })

  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8080);  