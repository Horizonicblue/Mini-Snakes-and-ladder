
var GameScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
    function gameScene(config){
        Phaser.Scene.call(this, config);
    },

    preload: function() {
        this.load.image('player1', 'img/player1.png');
        this.load.image('player2', 'img/player2.png');
        this.load.image('board', 'img/board.png');
        this.load.image('ladder', 'img/ladder.png');
        this.load.image('snake', 'img/snake.png');
        this.load.image('rolldice', 'img/rolldice.png');

        this.load.image('redturn', 'img/redturn.png');
        this.load.image('yellowturn', 'img/yellowturn.png');

    },

    create: function() {
        this.win = false;
        this.board = this.add.image(300, 350, 'board');
        this.playerOne = this.add.image(70, 575, 'player1');
        this.playerOne.depth = 2;
        this.playerOne.boardPosition = 0;

        this.playerTwo = this.add.image(80, 580, 'player2');
        this.playerTwo.depth = 2;
        this.playerTwo.boardPosition = 0;
        this.addLevelData();
        this.turn = 1;

        this.addLadders();
        this.addSnakes();

        this.redTurn = this.add.image(300, 620, 'redturn');
        this.redTurn.alpha = 1;
        this.yellowTurn = this.add.image(300, 620, 'yellowturn');
        this.yellowTurn.alpha = 0;
        this.diceText = this.add.text(260, 650, '', {fontSize: 80, color:'white'});
        this.diceText.alpha = 0;

        this.diceNumber = null;
        this.dice = this.add.image(300, 700, 'rolldice');
        this.dice.setInteractive();
        this.dice.on("pointerdown", function() {
            if(this.win)
                return;
            this.diceNumber = Phaser.Math.RND.between(1, 6);
            this.dice.alpha = 0;
            this.diceText.alpha = 1;
            this.diceText.setText(this.diceNumber);
            this.redTurn.alpha = 0;
            this.yellowTurn.alpha = 0;
            switch(this.turn) {
                case 1:
                    this.movePlayer(this.playerOne);
                    break;
                case 2:
                    this.movePlayer(this.playerTwo);
                    break;
            };
            this.changeTurn();

            var _this = this;
            setTimeout(function() {
                if(_this.win)
                    return;
                _this.dice.alpha = 1;
                _this.diceText.alpha = 0;
                _this.diceText.setText('');
                _this.showTurn();
            }, 1200);
        }, this);
    },

    addLevelData: function () {
        /*this.boardPoints = [
            [0,600], [100,600], [200,600], [300,600], [400,600],
            [400,500], [300,500], [200,500], [100,500], [0,500]
        ];*/
        this.boardPoints = [
            [100,600],	[150,600],	[200,600],	[250,600],	[300,600],	[350,600],	[400,600],	[450,600],	[500,600],	[550,600],
            [550,550],	[500,550],	[450,550],	[400,550],	[350,550],	[300,550],	[250,550],	[200,550],	[150,550],	[100,550],
            [100,500],	[150,500],	[200,500],	[250,500],	[300,500],	[350,500],	[400,500],	[450,500],	[500,500],	[550,500],
            [550,450],	[500,450],	[450,450],	[400,450],	[350,450],	[300,450],	[250,450],	[200,450],	[150,450],	[100,450],
            [100,400],	[150,400],	[200,400],	[250,400],	[300,400],	[350,400],	[400,400],	[450,400],	[500,400],	[550,400],
            [550,350],	[500,350],	[450,350],	[400,350],	[350,350],	[300,350],	[250,350],	[200,350],	[150,350],	[100,350],
            [100,300],	[150,300],	[200,300],	[250,300],	[300,300],	[350,300],	[400,300],	[450,300],	[500,300],	[550,300],
            [550,250],	[500,250],	[450,250],	[400,250],	[350,250],	[300,250],	[250,250],	[200,250],	[150,250],	[100,250],
            [100,200],	[150,200],	[200,200],	[250,200],	[300,200],	[350,200],	[400,200],	[450,200],	[500,200],	[550,200],
            [550,150],	[500,150],	[450,150],	[400,150],	[350,150],	[300,150],	[250,150],	[200,150],	[150,150],	[100,150]
        ]
        this.ladderPoints = [
            [200,600,200,400],
            [400,450,400,250]
        ];
        this.snakePoints = [
            [500,350,450,550],
            [300,150,250,350]
        ];
    },

    addLadders: function() {
        for (let index = 0; index < this.ladderPoints.length; index++) {
            var ladder = this.add.image(this.ladderPoints[index][2]-40, this.ladderPoints[index][3]-40, 'ladder');
                ladder.setOrigin(0,0);
        }  
    },

    addSnakes: function() {
        for (let index = 0; index < this.snakePoints.length; index++) {
            var ladder = this.add.image(this.snakePoints[index][0], this.snakePoints[index][1]-40, 'snake');
                ladder.setOrigin(1,0);
        }  
    },

    movePlayer: function(player) { 
        player.boardPosition += this.diceNumber;
        var point = this.boardPoints[player.boardPosition];
        if(!point) {
            this.playerWin(player);
            return;
        }
        var ladderPoint = this.checkSL(this.ladderPoints, point[0], point[1]);
        var snakePoints = this.checkSL(this.snakePoints, point[0], point[1]);
        if(ladderPoint.sl) {
            this.tweenPlayer(player, ladderPoint.sl[2] - 30, ladderPoint.sl[3] - 25);
            player.boardPosition = ladderPoint.position;
        }
        else if(snakePoints.sl) {
            this.tweenPlayer(player, snakePoints.sl[2] - 30, snakePoints.sl[3] - 25);
            player.boardPosition = ladderPoint.position;
        }
        else {
            this.tweenPlayer(player, point[0] - 30, point[1] - 25);
        }
    },

    tweenPlayer: function(player, x, y) {
        return this.tweens.add({
            targets: player,
            x: x, y: y,
            duration: 1000,
            ease: Phaser.Math.Easing.Sine.InOut,
            // onComplete: function(tween, target, _this) {
            //     _this.groupAsteroid.killAndHide(target[0]);
            // },
            // onCompleteParams: [ this ]
        });
    },

    changeTurn: function() {
        if(this.diceNumber == 6)
            return;
    
        if(this.turn == 1) {
            this.turn = 2;
        }
        else {
            this.turn = 1;
        }
    },

    showTurn: function() {
        if(this.turn == 1) {
            this.redTurn.alpha = 1;
            this.yellowTurn.alpha = 0;
        }
        else {
            this.redTurn.alpha = 0;
            this.yellowTurn.alpha = 1;
        }
    },

    checkSL: function(slPoints, x, y) {
        var slPoint = slPoints.find(function(ladder) {
            return ladder[0] == x && ladder[1] == y ? ladder : null; 
        });
        var position;
        if(slPoint) {
            position = this.boardPoints.findIndex(function(point) {
                return point[0] == slPoint[2]  && point[1] == slPoint[3]; 
            });
        }
        return {
            sl: slPoint,
            position: position + 1
        };
    },

    playerWin: function(player) {
        this.win = true;
        var winner = player.texture.key == 'player1' ? 'Red' : 'Yellow';
        this.add.text(100, 40, winner + ' Wins', {fontSize: 60, color:'white'});
    },

});

var config = {
    type: Phaser.CANVAS,
	scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameplace',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 600,
        height: 800
    },
    // scene: {
    //     preload: preload,
    //     create: create,
    //     update: update
    // }
    scene: GameScene
};

var game = new Phaser.Game(config);
