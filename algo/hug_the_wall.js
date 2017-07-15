var utils = require('../utils/utils.js')
var Robot = require('./robot.js')
var constants = require('../utils/constants.js')

exports.hugTheWall = function(sensors, robot, currentMap, prevAction) {
    // this works provided the sensors are accurate and robot movements are also accurate
    
    lowerLeftPos = utils.getLowerLeft(robot.direction, [robot.row, robot.column]) // do we need this? hmmm...
    if(sensors[3] > 0 && prevAction == constants.FORWARD) {
        return constants.TURN_LEFT;
    }
    pos = utils.moveForward(robot.direction, [robot.row, robot.column])
    console.log("debug here", pos[0], pos[1], robot.direction)
    if (pos[0] == 5 && pos[1] == 0 && robot.direction == 3)
        return constants.FORWARD
    
    // if(pos[0] == 4 && pos[1] == 3 && robot.direction == 2)
    //     return constants.FORWARD
    if(sensors[0] == 0) {
        if(sensors[1] > 0)
            return constants.TURN_RIGHT;
        return constants.TURN_LEFT;
    }
    
    return constants.FORWARD
}