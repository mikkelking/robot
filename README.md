# Toy robot test assignment

Simple code to control a toy robot on a table top and prevent it from falling off

# Installation

  * Clone the repository 
  * npm install

```
git clone https://github.com/mikkelking/robot
npm install
```

# Control the robot interactively

```
node index.js [--debug]
```

Valid commands (case insensitive) are:
  * PLACE x,y,DIRECTION - range of x and y is 0-4, direction is one of (N,S,E,W,NORTH,SOUTH,EAST,WEST)
  * MOVE
  * LEFT
  * RIGHT
  * REPORT
  * QUIT

# Tests

```
npm test
```

