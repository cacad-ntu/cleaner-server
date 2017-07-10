var utils = require('../utils/utils')

function Robot(row, column, direction) {
    this.row = row;
    this.column = column;
    this.direction = direction;
}

Robot.prototype.turnRight = function() {
    this.direction = utils.turnRight(this.direction)
}

Robot.prototype.turnLeft = function() {
    this.direction = utils.turnLeft(this.direction)
}

Robot.prototype.forward = function() {
    var position = utils.moveForward(this.direction, [this.row, this.column])
    this.row = position[0]
    this.column = position[1]
}
module.exports = Robot;