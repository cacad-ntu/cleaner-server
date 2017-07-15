const express = require('express')
const app = express()
const Robot = require('./algo/robot.js')
var utils = require('./utils/utils')
var consts = require('./utils/constants')
var mapper = require('./algo/colaborative.js')

var ws = require("nodejs-websocket")
var prevAction = consts.FORWARD
var robot1 = 0
var robot2 = 0
var robot3 = 0
var action1 = mapper.path1
var action2 = mapper.path2
var action3 = mapper.path3
var mapRow = 0
var mapCol = 0
var counter = 0
generateMap = function(row, column, startRow, startCol, direction) {
  maze = []
  for (i = 0; i < row; ++i) {
    r = []
    for(j = 0;j < column; ++j)
      r.push(-1)
    maze.push(r)
  }
  maze[startRow][startCol] = 11
  // head = utils.getRobotHead(direction)
  // maze[startRow + head[0]][startCol + head[1]] = 4
  return maze
}

mazeMap = []



updateRobot = function(action, robot) {
  if(action == consts.DIR_UP)
    robot.forward()
  else if(action == consts.DIR_RIGHT)
    robot.turnRight()
  else if(action == consts.DIR_DOWN)
    return // not supported yet
  else if(action == consts.DIR_LEFT)
    robot.turnLeft()
  return robot
}

checkPossibleCalibration = function() {
  if((robot.row == 0 && robot.direction == 1) || (robot.row == mapRow - 1 && robot.direction == 3) || (robot.column == 0 && robot.direction == 0) || (robot.column == mapCol - 1 && robot.direction == 2))
    return true
  return false
}

clientHandler = function(conn, direction) {
  
  if(action1.length > counter) {
    mazeMap[robot1.row][robot1.column] = 0
    robot1 = updateRobot(action1[counter], robot1)
    mazeMap[robot1.row][robot1.column] = 11;
  }

  if(action2.length > counter) {
    mazeMap[robot2.row][robot2.column] = 0    
    console.log(robot2.row, robot2.column, action2[counter])
    robot2 = updateRobot(action2[counter], robot2)
    console.log(robot2.row, robot2.column, action2[counter])
    mazeMap[robot2.row][robot2.column] = 12;
  }

  if(action3.length > counter) {
    mazeMap[robot3.row][robot3.column] = 0    
    robot3 = updateRobot(action3[counter], robot3)
    mazeMap[robot3.row][robot3.column] = 13;
  }

  
  counter += 1
  
  
  var response = {
    "mazeMap": mazeMap,
    "direction": [robot1.direction, robot2.direction, robot3.direction]
  }
  conn.send(JSON.stringify(response));
}

piHandler = function(conn, sensors) {
  console.log("From Pi\n")
  console.log(sensors)
  console.log("\n")
  var action = hugTheWall(sensors, robot, mazeMap, prevAction)
  // action = 0
  prevAction = action
  actionString = ""
  if(action == 0)
    actionString = actionString + "W"
  else if(action == 1)
    actionString = actionString + "D"
  else if(action == 2)
    actionString = actionString + "S"
  else
    actionString = actionString + "A"
  actionString = actionString + "001;";
  if(checkPossibleCalibration())
    actionString = actionString + "C;"
  var response  = {
    // only for calibration
    "action": actionString
  }
  
  mazeMap = utils.updateMap(robot, mazeMap, sensors);
  mazeMap[robot.row][robot.column] = 0
  updateRobot(action)
  
  mazeMap[robot.row][robot.column] = 2;
  
  conn.send(JSON.stringify(response))
  clientHandler(conn, robot.direction)
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
var server = ws.createServer(function (conn) {
  // 1: unexplored
  // 0: cleaned
  // -1: explored
  // 2: robot
  // 3: obstacle
  // 4: robot's head

  // type:
  // 0: client
  // 1: pi
  
  robot1 = new Robot(19, 0, 0)
  robot2 = new Robot(19, 0, 0)
  robot3 = new Robot(19, 0, 0)
  mazeMap = generateMap(20, 15, 19, 0, 0)
  conn.on("text", function (str) {
    var msg = JSON.parse(str)
    
    if (msg.type == -1) {
      mapRow = msg.row
      mapCol = msg.column
      var response = {
        "mazeMap": mazeMap,
        "direction": [robot1.direction, robot2.direction, robot3.direction]
      }

      
    //   conn.send(JSON.stringify(response));
      sleep(20).then(() => {
    // Do something after the sleep!
    
    clientHandler(conn, msg.data)
})

      
    }
    else if (msg.type == 0) {
      clientHandler(conn, msg.data)
    }
    else if (msg.type == 1) {
      piHandler(conn, msg.sensors)
      counter = (counter + 1) % 4
    }    
  })

  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8080);  