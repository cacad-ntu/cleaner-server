const constants = require('./constants.js')

exports.turnRight = function(direction) {
    return (direction + 1) % 4;
}

exports.turnLeft = function(direction) {
    
    direction = direction - 1
    
    if(direction < 0)
        return 3
    return direction % 4;
}


exports.moveForward = function(direction, position) {
    console.log("DEBUG", position, direction, constants.DIR_UP)
    if (direction == constants.DIR_UP)
        position = [position[0] - 1, position[1]]
    else if (direction == constants.DIR_RIGHT)
        position = [position[0], position[1] + 1]
    else if (direction == constants.DIR_DOWN)
        position = [position[0] + 1, position[1]]
    else if (direction == constants.DIR_LEFT)
        position = [position[0], position[1] - 1]
    return position
}

exports.getLowerLeft = function(direction, position) {
    if (direction == constants.DIR_UP)
        position = [position[0] + 1, position[1] - 1]
    else if (direction == constants.DIR_RIGHT)
        position = [position[0] - 1, position[1] - 1]
    else if (direction == constants.DIR_DOWN)
        position = [position[0] - 1, position[1] + 1]
    else if (direction == constants.DIR_LEFT)
        position = [position[0] + 1, position[1] + 1]
    return position
}

getLeft = function(direction) {
    if (direction == constants.DIR_UP)
        return [0, -1]
    else if (direction == constants.DIR_RIGHT)
        return [-1, 0]
    else if (direction == constants.DIR_DOWN)
        return [0, 1]
    else if (direction == constants.DIR_LEFT)
        return [1, 0]
}

getRight = function(direction) {
    if (direction == constants.DIR_UP)
        return [0, 1]
    else if (direction == constants.DIR_RIGHT)
        return [1, 0]
    else if (direction == constants.DIR_DOWN)
        return [0, -1]
    else if (direction == constants.DIR_LEFT)
        return [-1, 0]
}

getTop = function(direction) {
    // console.log("Inside getTop")
    if (direction == constants.DIR_UP)
        return [-1, 0]
    else if (direction == constants.DIR_RIGHT)
        return [0, 1]
    else if (direction == constants.DIR_DOWN)
        return [1, 0]
    else if (direction == constants.DIR_LEFT)
        return [0, -1]
}

getBottom = function(direction) {
    if (direction == constants.DIR_UP)
        return [1, 0]
    else if (direction == constants.DIR_RIGHT)
        return [0, -1]
    else if (direction == constants.DIR_DOWN)
        return [-1, 0]
    else if (direction == constants.DIR_LEFT)
        return [0, 1]
}

getRobotHead = function(direction) {
    if (direction == constants.DIR_UP)
        return [-1, 0]
    else if (direction == constants.DIR_RIGHT)
        return [0, 1]
    else if (direction == constants.DIR_DOWN)
        return [1, 0]
    else if (direction == constants.DIR_LEFT)
        return [0, -1]
}
check = function(x, y, row, col) {
    if(x < 0 || y < 0 || x >= row || y >= col)
        return false
    return true
}
exports.updateMap = function(robot, mazeMap, sensors) {
    // -1: unexplored
  // 0: cleaned
  // 1: explored
  // 2: robot
  // 3: obstacle
  // 4: robot's head
  sensors[0] = parseInt(sensors[0])
  sensors[1] = parseInt(sensors[1])
  sensors[2] = parseInt(sensors[2])
  sensors[3] = parseInt(sensors[3])
  pos = getTop(robot.direction)
//   console.log(pos)
  for (i = 1; i <= sensors[0] && sensors[0] != 0; ++i) {
      x = robot.row + i * pos[0]
      y = robot.column + i * pos[1]
    //   console.log("Discovered")
      if(!check(x, y, 6, 4))
        break
      if(mazeMap[x][y] == 0)
        continue
      mazeMap[x][y] = -1
  }
  
  x = robot.row + (sensors[0] + 1) * pos[0]
  y = robot.column + (sensors[0] + 1) * pos[1]
  if (sensors[0] < 2 && check(x, y, 6, 4)) {
      mazeMap[x][y] = 3
  }

  pos = getRight(robot.direction)
//   console.log("-------")
//   console.log("Right")
//   console.log(robot.row, robot.column, pos, sensors[1])
  for (i = 1; i <= sensors[1]  && sensors[1] != 0; ++i) {
      x = robot.row + i * pos[0]
      y = robot.column + i * pos[1]
      if(!check(x, y, 6, 4))
        break
      if(mazeMap[x][y] == 0)
        continue
      mazeMap[x][y] = -1
  }
  
  x = robot.row + (sensors[1] + 1) * pos[0]
  y = robot.column + (sensors[1] + 1) * pos[1]
//   console.log(x, y, mazeMap[x][y], sensors[1])
//   console.log("-------")
  if (sensors[1] < 2 && check(x, y, 6, 4)) {
      mazeMap[x][y] = 3
  }

//   pos = getBottom(robot.direction)
//   for (i = 1; i <= sensors[2] && sensors[2] != 0; ++i) {
//       x = robot.row + i * pos[0]
//       y = robot.column + i * pos[1]
//       if(!check(x, y, 6, 4))
//         break
//       mazeMap[x][y] = -1
//   }
  
//   x = robot.row + (sensors[2] + 1) * pos[0]
//   y = robot.column + (sensors[2] + 1) * pos[1]
//   if (sensors[2] < 2 && check(x, y, 6, 4)) {
//       mazeMap[x][y] = 3
//   }

  pos = getLeft(robot.direction)
  
  for (i = 1; i <= sensors[3] && sensors[3] != 0; ++i) {
      x = robot.row + i * pos[0]
      y = robot.column + i * pos[1]
      if(!check(x, y, 6, 4))
        break
      if(mazeMap[x][y] == 0)
        continue
      mazeMap[x][y] = -1
  }
  
  x = robot.row + (sensors[3] + 1) * pos[0]
  y = robot.column + (sensors[3] + 1) * pos[1]
  if (sensors[3] < 2 && check(x, y, 6, 4)) {
      mazeMap[x][y] = 3
  }
  if (mazeMap[5][0] == 3)
    mazeMap[5][0] = 0
  if(mazeMap[5][3] == 3)
    mazeMap[5][3] = 0
  return mazeMap
}