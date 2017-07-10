const constants = require('./constants.js')

exports.turnRight = function(direction) {
    return (direction + 1) % 4;
}

exports.turnLeft = function(direction) {
    return (direction - 1) % 4;
}


exports.moveForward = function(direction, position) {
    if(direction == constants.DIR_UP)
        position = [position[0] - 1, position[1]]
    else if(direction == constants.DIR_RIGHT)
        position = [position[0], position[1] + 1]
    else if(direction == constants.DIR_DOWN)
        position = [position[0] + 1, position[1]]
    else if(direction == constants.DIR_LEFT)
        position = [position[0], position[1] - 1]
    return position
}