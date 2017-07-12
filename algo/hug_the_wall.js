var utils = require('../utils/utils.js')
var Robot = require('./robot.js')
var constants = require('../utils/constants.js')

exports.hugTheWall = function(sensors, robot, currentMap, prevAction) {
    // this works provided the sensors are accurate and robot movements are also accurate
    lowerLeftPos = utils.getLowerLeft(robot.direction) // do we need this? hmmm...
    if(sensors[3] > 0 && prevAction == constants.FORWARD) {
        return constants.TURN_LEFT;
    }

    if(sensors[0] == 0) {
        if(sensors[1] > 0)
            return constants.TURN_RIGHT;
        return constants.TURN_LEFT;
    }
    
    return constants.FORWARD
}