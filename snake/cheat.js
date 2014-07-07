// food position
var food_position = null;

// search states
var LOST = 0;           // going both wrong directions
var HORIZ = 1;          // going in the right horizontal direction
var VERT = 2;           // going in the right vertical direction
var ONTARGET = 3;       // headed toward the food

var state = LOST;

var options = [0, 0, 0, 0];     // list of moves that won't get you killed
var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;

function locate_food() {
    for (var i = 0; i < positions.length; i++) {
        for (var j = 0; j < positions[i].length; j++) {
            if (positions[i][j] == 2) {
                food_position = {x: i, y: j};
                return;
            }
        }
    }
    food_position = {x: 0, y: 0};
}

function get_options() {
    options = [0, 0, 0, 0];
    // left
    if (checkPosition(head.x - 1, head.y) != 1) options[LEFT] = 1;

    // up
    if (checkPosition(head.x, head.y - 1) != 1) options[UP] = 1;

    // right
    if (checkPosition(head.x + 1, head.y) != 1) options[RIGHT] = 1;

    // down
    if (checkPosition(head.x, head.y + 1) != 1) options[DOWN] = 1;
}

function continue_straight() {
    console.log('continuing straight');
    if (checkPosition(head.x + direction.x, head.y + direction.y) != 1) {
        food_position = null;
        return true;
    }
    return false;
}

function correct_horizontal() {
    console.log('correcting horizontal');
    // get new direction
    var new_direction;
    if (head.x - food_position.x > 0) {
        new_direction = {x: -1, y: 0};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            if (state == VERT) state = ONTARGET;
            else state = HORIZ;
            return true;
        }
        return false;
    }
    else if (head.x - food_position.x < 0) {
        new_direction = {x: 1, y: 0};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            if (state == VERT) state = ONTARGET;
            else state = HORIZ;
            return true;
        }
        return false;
    }
    else return continue_straight();
}

function avoid_horizontal() {
    console.log('avoiding horizontal');
    // get new direction
    var new_direction;
    if (head.x - food_position.x > 0) {
        new_direction = {x: 1, y: 0};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        return false;
    }
    else if (head.x - food_position.x < 0) {
        new_direction = {x: -1, y: 0};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        return false;
    }
    else {
        // try both
        new_direction = {x: 1, y: 0};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        new_direction = {x: -1, y: 0};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        return false;
    }
}

function correct_vertical() {
    console.log('correcting vertical');
    // get new direction
    var new_direction;
    if (head.y - food_position.y > 0) {
        new_direction = {x: 0, y: -1};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            if (state == HORIZ) state = ONTARGET;
            else state = VERT;
            return true;
        }
        return false;
    }
    else if (head.y - food_position.y < 0) {
        new_direction = {x: 0, y: 1};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            if (state == HORIZ) state = ONTARGET;
            else state = VERT;
            return true;
        }
        return false;
    }
    else return continue_straight();
}

function avoid_vertical() {
    console.log('avoiding vertical');
    // get new direction
    var new_direction;
    if (head.y - food_position.y > 0) {
        new_direction = {x: 0, y: 1};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        return false;
    }
    else if (head.y - food_position.y < 0) {
        new_direction = {x: 0, y: -1};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        return false;
    }
    else {
        // try both
        new_direction = {x: 0, y: 1};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        new_direction = {x: 0, y: -1};
        if (checkPosition(head.x + new_direction.x, head.y + new_direction.y) != 1) {
            direction = new_direction;
            state = LOST;
            return true;
        }
        return false;
    }
}

function cheat() {
    // if we don't have a food position, find it
    if (!food_position) locate_food();

    // choose action
    switch (state) {
        case LOST:
            // try to correct horizontal
            if (correct_horizontal()) break;

            // try to correct vertical
            if (correct_vertical()) break;

            // try to continue straight
            if (continue_straight()) break;

            // try to avoid horizontal
            if (avoid_horizontal()) break;

            // try to avoid vertical
            if (avoid_vertical()) break;
            break;
        case HORIZ:
            // check if time to turn
            if (head.x == food_position.x) {
                // try to correct vertical
                if (correct_vertical()) break;

                // try to continue straight
                if (continue_straight()) break;

                // try to avoid vertical
                if (avoid_vertical()) break;
            }
            else {
                // try to continue straight
                if (continue_straight()) break;

                // try to correct vertical
                if (correct_vertical()) break;

                // try to avoid vertical
                if (avoid_vertical()) break;
            }
            break;
        case VERT:
            // check if time to turn
            if (head.y == food_position.y) {
                // try to correct horizontal
                if (correct_horizontal()) break;

                // try to continue straight
                if (continue_straight()) break;

                // try to avoid horizontal
                if (avoid_horizontal()) break;
            }
            else {
                // try to continue straight
                if (continue_straight()) break;

                // try to correct horizontal
                if (correct_horizontal()) break;

                // try to avoid horizontal
                if (avoid_horizontal()) break;
            }
            break;
        case ONTARGET:
            // try to continue straight
            if (continue_straight()) break;

            // try to avoid horizontal
            if (avoid_horizontal()) break;

            // try to avoid vertical
            if (avoid_vertical()) break;
            break;
        default:
            break;
    }
}
