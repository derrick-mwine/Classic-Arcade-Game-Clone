/* jshint esversion: 6 */

const CANVAS_WIDTH = 505;
const CANVAS_HEIGHT = 480;
const FIELD_WIDTH = CANVAS_WIDTH / 5;
const FIELD_HEIGHT = CANVAS_HEIGHT / 6;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 70;
const ENEMY_WIDTH = 60;
const ENEMY_HEIGHT = 70;
const GEM_WIDTH = 60;
const GEM_HEIGHT = 40;

const canvas = document.querySelector("canvas");
const h1 = document.querySelector("h1");
const popup = document.querySelector(".intro-popup");
const popupEnd = document.querySelector(".end-popup");
const counterPoints = document.querySelector(".rate");
const gameTrophies = document.querySelector(".trophies");
const timer = document.querySelector("#timer");
const sound1 = document.querySelector("#sound1");
const sound2 = document.querySelector("#sound2");
const sound3 = document.querySelector("#sound3");
const sound4 = document.querySelector("#sound4");
const sound5 = document.querySelector("#sound5");
const sound6 = document.querySelector("#sound6");

let points = 0;
let m = 0;
let s = 0;
let timeGoes = true;
let allEnemies = [];
let allRocks = [];

// Array positions on canvas.
let position = [
    [110, (FIELD_WIDTH * 0.2)],
    [110, (FIELD_WIDTH * 1.2)],
    [110, (FIELD_WIDTH * 2.2)],
    [110, (FIELD_WIDTH * 3.2)],
    [110, (FIELD_WIDTH * 4.2)],
    [190, (FIELD_WIDTH * 0.2)],
    [190, (FIELD_WIDTH * 1.2)],
    [190, (FIELD_WIDTH * 2.2)],
    [190, (FIELD_WIDTH * 3.2)],
    [190, (FIELD_WIDTH * 4.2)],
    [275, (FIELD_WIDTH * 0.2)],
    [275, (FIELD_WIDTH * 1.2)],
    [275, (FIELD_WIDTH * 2.2)],
    [275, (FIELD_WIDTH * 3.2)],
    [275, (FIELD_WIDTH * 4.2)]
];

// Shuffles the elements in array position.
position = shuffle(position);

h1.innerHTML = "Flogger Game";

popup.innerHTML = "Get to the water while avoiding getting hit by the enemy bugs<br><br>Use your keyboard arrow keys to move the player up, down, right, left<br><br>Collect all rocks to gain hearts and gems to earn keys which eradicates enemies<br><br>Reach the water and gain a star!! Get six stars to win the game<br><br>If a bug hits you, you lose all your stars, and you have to restart from your initial position<br><br><br>Press <span class='red'>ENTER</span> to start game";

/**
 * Superclass representing the characters on the screen: Enemy, Player and Gem */
class Characters {
    /** Characters
     * @param {number} x - Character's x coordinate on canvas
     * @param {variable} y - Character's y coordinate on canvas
     * @param {number} move - Character's move on X axis on canvas
     * @param {string} sprite - Character's sprite used to render character on canvas
     */
    constructor(x = 0, y = 0, move = 0, sprite = '') {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.move = move;
    }

    // Draws, or renders, each character on the canvas using a get method defined in resources.js
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

/**
 * Represents the enemy bugs that run across screen
 * @extends Characters
 */
class Enemy extends Characters {
    /** Enemy
     * @param {number} x - Enemy's x coordinate on canvas
     * @param {variable} y - Enemy's y coordinate on canvas
     * @param {number} move - Enemy's move on X axis
     * @param {string} sprite - Enemy's sprite used to render enemy on canvas
     */
    constructor(x, y, move, sprite) {
        super(x, y, move, sprite);
        this.x = -100;
        this.y = y;
        this.move = (Math.random() * 120) + 70;
        this.sprite = "images/enemy-bug.png";
    }

    // Updates enemy's position using dt param, a time delta between ticks
    update(dt) {

        // Multiplies movement by the dt parameter. It ensures all graphics render at same speed regardless of the browser.
        this.x = this.x + (this.move * dt);

        // Resets Enemy's position if actual position is bigger than width of canvas
        if (this.x > CANVAS_WIDTH) {
            this.x = -100;
        }

        // Resets player's position if collision with the Enemy happens
        if (player.x < (this.x + ENEMY_WIDTH) && (player.x + PLAYER_WIDTH) > this.x && player.y < (this.y + ENEMY_HEIGHT) && (player.y + PLAYER_HEIGHT) > this.y) {
            player.x = 2 * FIELD_WIDTH;
            player.y = 5 * FIELD_HEIGHT;
            player.sprite = "images/char-boy.png";

            // Plays correct sound on collision with the Enemy
            let soundEffect1 = true;

            if (soundEffect1) {
                sound1.pause();
                sound1.currentTime = 0;
                sound1.play();
                soundEffect1 = false;
            }

            // Deletes all points if collision with the Enemy happens
            if (points > 0) {
                points = 0;
                counterPoints.innerHTML = "";
            }
        }
    }
}

/**
 * @description Shuffle elements in array.
 * @param {array} array
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Enemy's X cordinate on canvas
let enemyX = Math.floor(Math.random() * 450) + 200;

// Array positions on Y axis for Enemy
let enemyY = [70, 153, 233, 70, 153, 233, 70, 153, 233];

// Movement speed for Enemy
let enemyMove = Math.floor(Math.random() * 100) + 50;

let enemySprite = "images/enemy-bug.png";

// Creates enemy and adds to array
enemyY.forEach(function(enemyY) {
    enemy = new Enemy(enemyX, enemyY, enemySprite);
    allEnemies.push(enemy);

    // Shuffles elements in array with all enemies
    allEnemies = shuffle(allEnemies);
});

/**
 * Class representing Trophy
 * @extends Characters
 */
class Trophy extends Characters {
    /**
     * Creates a Trophy
     * @param {number} x - Trophy's X cordinate on canvas
     * @param {variable} y - Trophy's Y cordinate on canvas
     * @param {string} sprite - Path to graphic file for Trophy
     */
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    // Draws the trophy on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Sets the path to graphic file for rock trophy
let rockSprite = "images/Rock.png";

// Sets 3 rocks on canvas.
let rock1 = new Trophy(position[0][1], position[0][0], rockSprite);
let rock2 = new Trophy(position[1][1], position[1][0], rockSprite);
let rock3 = new Trophy(position[2][1], position[2][0], rockSprite);

// Adds all rocks to array
allRocks.push(rock1, rock2, rock3);

// Shuffles all elements in array with rocks
allRocks = shuffle(allRocks);

// Sets the path to graphic file for gems trophy
let gemsSprite = ["images/Gem_Orange.png", "images/Gem_Blue.png", "images/Gem_Green.png"];

// Creates an array for all gems
let allGems = [];

// Shuffles all elements in array with gems
allGems = shuffle(allGems);

// Shuffles all elements in array with sprite of gems
gemsSprite = shuffle(gemsSprite);

// Sets 3 gems on canvas
let gem1 = new Trophy();
let gem2 = new Trophy();
let gem3 = new Trophy();

/**
 * Represents the player
 * @extends Characters
 */
class Player extends Characters {
    /**
     * Create a Player.
     * @param {number} x - Player's x coordinate on canvas
     * @param {variable} y - Player's y coordinate on canvas
     * @param {string} sprite - Path to graphic file for Player
     */
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.x = x;
        this.y = y;
        this.sprite = "images/char-boy.png";
    }

    // Draws the player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Updates the Player
    update() {
        // Adds new behaviours when player have collision with rocks.
        /* if(this.x < rock1.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock1.x && this.y < rock1.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock1.y) {
        	rocksCollision();

        	// Adds gem1 to canvas
        	gem1 = new Trophy(position[3][1], position[3][0], gemsSprite[0]);

        	// Adds gem1 to array
        	allGems.push(gem1);

        	// Sets a position on axis X on -900 for rock1.
        	rock1.x = -900;
        } */

        if (this.x < rock2.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock2.x && this.y < rock2.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock2.y) {
            rocksCollision();

            // Adds gem2 to canvas
            gem2 = new Trophy(position[4][1], position[4][0], gemsSprite[1]);

            // Adds gem2 to array
            allGems.push(gem2);

            // Sets x cordinate -900 for rock2
            rock2.x = -900;
        }

        if (this.x < rock3.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock3.x && this.y < rock3.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock3.y) {
            rocksCollision();

            // Adds gem3 to canvas
            gem3 = new Trophy(position[5][1], position[5][0], gemsSprite[2]);

            // Adds gem3 to array
            allGems.push(gem3);

            // Sets x cordinate -900 for rock3.
            rock3.x = -900;
        }

        // Adds new behaviours when player collides with gems
        if (this.x < gem1.x + GEM_WIDTH && this.x + PLAYER_WIDTH > gem1.x && this.y < gem1.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > gem1.y) {

            // Sets x cordinate -900 for gem1
            gem1.x = -900;

            // Deletes element on position 0 from array with enemies
            delete allEnemies[0];

            gemsCollision();
        }

        if (this.x < gem2.x + GEM_WIDTH && this.x + PLAYER_WIDTH > gem2.x && this.y < gem2.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > gem2.y) {

            // Sets x cordinate -900 for gem2
            gem2.x = -900;

            // Deletes element on position 4 from array with enemies
            delete allEnemies[4];

            gemsCollision();
        }

        if (this.x < gem3.x + GEM_WIDTH && this.x + PLAYER_WIDTH > gem3.x && this.y < gem3.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > gem3.y) {

            // Sets x cordinate -900 for gem3
            gem3.x = -900;

            // Deletes element on position 8 from array with enemies
            delete allEnemies[8];
            gemsCollision();
        }
    }

    // Handles keyPress event for player
    handleInput(keyPress) {

        if ((keyPress == 'left' || keyPress == 'right' || keyPress == 'down' || keyPress == 'up') && (this.x < rock1.x + GEM_WIDTH && this.x + PLAYER_WIDTH > rock1.x && this.y < rock1.y + GEM_HEIGHT && this.y + PLAYER_HEIGHT > rock1.y)) {
            rocksCollision();

            // Adds gem1 to canvas
            gem1 = new Trophy(position[3][1], position[3][0], gemsSprite[0]);

            // Adds gem1 to array
            allGems.push(gem1);

            // Sets x cordinate -900 for rock1
            rock1.x = -900;
        }

        // Start game when Enter key is pressed.
        if (keyPress == 'enter') {
            startGame();
        }

        // Moves player to left when Left key is pressed given that player's position on x axis is greater than 0
        if (keyPress == 'left' && this.x > 0) {
            this.x -= FIELD_WIDTH;
        } else if (keyPress == 'left' && this.x < 0) {
            this.x === 0;
        }

        // Moves player up when UP key is pressed given that player's position on Y axis is greater than 0
        if (keyPress == 'up' && this.y > 0) {
            this.y -= FIELD_HEIGHT;
        }

        // Moves player to right when Right key is pressed given that player's position on X axis is less than 4*FIELD_WIDTH
        if (keyPress == 'right' && this.x < (4 * FIELD_WIDTH)) {
            this.x += FIELD_WIDTH;
        } else if (keyPress == 'right' && this.x > (4 * FIELD_WIDTH)) {
            this.x == 4 * FIELD_WIDTH;
        }

        // Moves player down when Down key is pressed given that player's position on Y axis is less than 5*FIELD_HEIGHT
        if (keyPress == 'down' && this.y < (5 * FIELD_HEIGHT)) {
            this.y += FIELD_HEIGHT;
        } else if (keyPress == 'down' && this.y > (5 * FIELD_HEIGHT)) {
            this.x == 5 * FIELD_HEIGHT;
        }

        // Relods game when End key is pressed
        if (keyPress == 'end') {
            reload();
        }

        // Moves player to initial position when the position on Y axis is less than 0
        if (this.y < 1) {
            this.x = 2 * FIELD_WIDTH;
            this.y = 5 * FIELD_HEIGHT;

            // Adds star when quantity of points is less than 7
            if (points < 7) {
                points = points + 1;
                counterPoints.innerHTML += "<img class='star' src='images/smallStar.png'>";

                // Adds sound5
                let soundEffect5 = true;

                // Plays sound5
                if (soundEffect5) {
                    sound5.pause();
                    sound5.currentTime = 0;
                    sound5.play();
                    soundEffect5 = false;
                }
            }

            // Ends game when quantity of points equals 6
            if (points == 6) {
                gameOver();

                // Adds sound6
                let soundEffect6 = true;

                // Plays sound6.
                if (soundEffect6) {
                    sound6.pause();
                    sound6.currentTime = 0;
                    sound6.play();
                    soundEffect6 = false;
                }
            }
        }
    }
}

/**
 * @description Starts game
 */
function startGame() {
    popup.style.display = "none";
    popupEnd.style.display = "none";
    counterPoints.innerHTML = "";
    gameTrophies.innerHTML = "";
    points = 0;
    timerGameStart();
    sound4.loop = true;
    sound4.play();
}

/**
 * @description Adds functionalities for player on collision with rock
 */
function rocksCollision() {

    // Adds heart image to canvas
    img = new Image();
    img.onload = function() {
        gameTrophies.appendChild(img);
    };
    img.src = "images/smallHeart.png";

    // Adds sound2
    let soundEffect2 = true;

    // Plays sound2
    if (soundEffect2) {
        sound2.pause();
        sound2.currentTime = 0;
        sound2.play();
        soundEffect2 = false;
    }
}

/**
 * @description Adds functionalities for player on collision with gem
 */
function gemsCollision() {

    // Adds key image to canvas
    img2 = new Image();
    img2.onload = function() {
        gameTrophies.appendChild(img2);
    };
    img2.src = "images/smallKey.png";

    // Adds sound3
    let soundEffect3 = true;

    // Plays sound3
    if (soundEffect3) {
        sound3.pause();
        sound3.currentTime = 0;
        sound3.play();
        soundEffect3 = false;
    }
}

// Sets player on initial position
let player = new Player(2 * FIELD_WIDTH, 5 * FIELD_HEIGHT);

// Listens for key presses
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        35: 'end',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * @description Start game timer
 */
function timerGameStart() {
    setInterval('count()', 1000);
}

/**
 * @description Stop game timer
 */
function timerGameStop() {
    timeGoes == false;
}

/**
 * @description Counts game
 */
function count() {
    if (timeGoes == true) {
        s.value = s;
        m.value = m;

        s++;

        if (s == 60) {
            m++;
            s = 0;
        }
    } else {
        s = 0;
        m = 0;
    }
    timer.innerHTML = 'Time: ' + m + ' min ' + s + ' sec';
}

/**
 * @description Reloads the game
 */
function reload() {
    window.location.reload();
}

/**
 * @description Ends the game
 */
function gameOver() {

    // Display game time
    let gameTime = m + ' min ' + s + ' sec';

    // Displays game over info
    popupEnd.style.display = 'block';
    popupEnd.innerHTML = "<span class='bravo'>Game Over</span><br><br>Your Time: <span class='red'>" + gameTime + "</span><br><br><img src='images/gameover.png' alt='congrats'><br><br><span class='infoEnd'>Press <span class='red'>END</span> key to refresh game";

    // Sets value of variable timeGoes to false and stop the timer
    timeGoes = false;

    // Sets game time to 0
    timer.style.display = 'none';

    // Pauses music and set current Time on 0 for audio file
    sound4.pause();
    sound4.currentTime = 0;

}
