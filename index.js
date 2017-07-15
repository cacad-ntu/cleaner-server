const express = require('express')
const app = express()
const Robot = require('./algo/robot.js')
const algo = require('./algo/hug_the_wall.js')
var utils = require('./utils/utils')
var consts = require('./utils/constants')

var clientConn = 0
var ws = require("nodejs-websocket")
var prevAction = consts.FORWARD
var robot = 0
var mapRow = 0
var mapCol = 0
var firstEnded = 0
secondEnded = 0
generateMap = function(row, column, startRow, startCol, direction) {
  maze = []
  for (i = 0; i < row; ++i) {
    r = []
    for(j = 0;j < column; ++j)
      r.push(1)
    maze.push(r)
  }
  maze[startRow][startCol] = 2
  // head = utils.getRobotHead(direction)
  // maze[startRow + head[0]][startCol + head[1]] = 4
  return maze
}

mazeMap = []
prevMap = []
var counter = 0
var newCounter = 0
clientHandler = function(conn, direction) {
  console.log("Inside client")
  var response = {
    "mazeMap": mazeMap,
    "direction": direction
  }
  clientConn.send(JSON.stringify(response));
}

updateRobot = function(action) {
  if(action == consts.DIR_UP)
    robot.forward()
  else if(action == consts.DIR_RIGHT)
    robot.turnRight()
  else if(action == consts.DIR_DOWN)
    return // not supported yet
  else if(action == consts.DIR_LEFT)
    robot.turnLeft()
}

checkPossibleCalibration = function() {
  if((robot.row == 0 && robot.direction == 1) || (robot.row == mapRow - 1 && robot.direction == 3) || (robot.column == 0 && robot.direction == 0) || (robot.column == mapCol - 1 && robot.direction == 2))
    return true
  return false
}

piHandler = function(conn, sensors) {
  var action = algo.hugTheWall(sensors, robot, mazeMap, prevAction)
  // action = 0
  prevAction = action
  actionString = ""
  actionString = action.toString() + ";" 
  // if(action == 0)
  //   actionString = actionString + "W"
  // else if(action == 1)
  //   actionString = actionString + "D"
  // else if(action == 2)
  //   actionString = actionString + "S"
  // else
  //   actionString = actionString + "A"
  // actionString = actionString + "001;";
  // if(checkPossibleCalibration())
  actionString = actionString + "C;"
  var response  = {
    // only for calibration
    "action": actionString
  }
  
  mazeMap = utils.updateMap(robot, mazeMap, sensors);
  mazeMap[robot.row][robot.column] = 0
  console.log("ACTION", action)
  updateRobot(action)
  
  mazeMap[robot.row][robot.column] = 2;
  
  conn.send(JSON.stringify(response))
  clientHandler(conn, robot.direction)
  if(robot.row == 5 && robot.column == 0 && counter > 1) {
    // end here if needed
    firstEnded = 1
  }
  console.log(robot.row, robot.column, newCounter)
  if(robot.row == 5 && robot.column == 0 && newCounter > 1) {
    console.log("In here man")
    secondEnded = 1
    console.log("FOUND", secondEnded)
    for(i = 0;i<6;++i) {
      for(j=0;j<4;++j) {
        
        if(mazeMap[i][j] == 3 && prevMap[i][j] == -1) {
          console.log("In here again")
          mazeMap[i][j] = 5
        }
      }
    }
    clientHandler(conn, robot.direction)
  }
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
  
  robot = new Robot(5, 0, 0)
  console.log("STARTING", robot.direction)
  conn.on("text", function (str) {
    var msg = JSON.parse(str)
    if (msg.type == -1) {
      clientConn = conn
      mazeMap = generateMap(msg.row, msg.column, robot.row, robot.column, 2)
      mapRow = msg.row
      mapCol = msg.column
      var response = {
        "mazeMap": mazeMap,
        "direction": robot.direction
      }
      conn.send(JSON.stringify(response));
//       sleep(1000).then(() => {
//     // Do something after the sleep!
//     console.log("HERE")
//     piHandler(conn, [0, 1, 2, 0], 0)
// })
      
    }
    else if (msg.type == 0) {
      clientHandler(conn, msg.data)
    }
    else if (msg.type == 1) {
      if(firstEnded == 0 || newCounter > 0)
        piHandler(conn, msg.sensors)
      counter += 1
    }    
    else if(msg.type == 2) {
      console.log("POSITION", robot.row, robot.column, robot.direction)
      if(newCounter == 0) {
        console.log("Reset map")
        counter = 100
        mazeMap = [[0, 0, 0, 0], [0, -1, -1, 0], [0, 3, 3, 0],[0, 3, 3, 0], [0, -1, -1, 0], [0, 0, 0, 0]]
        prevMap = mazeMap.slice()
        for(i=0;i<6;++i) {
          for(j=0;j<4;++j) {
            if(mazeMap[i][j] == 0)
              mazeMap[i][j] = -1
          }
        }
        var response = {
          "mazeMap": mazeMap,
          "direction": robot.direction
        }
        clientConn.send(JSON.stringify(response));
        ++newCounter
      }
      // console.log("Second ended", secondEnded)
      // console.log(msg.sensors)
      if(secondEnded == 0)
        piHandler(conn, msg.sensors)
      ++newCounter
    }
  })

  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8080);  