function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("DIR_UP", 0)
define("DIR_RIGHT", 1)
define("DIR_DOWN", 2)
define("DIR_LEFT", 3)