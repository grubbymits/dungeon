"use strict";

const SWORD_OFFSET = 7;
const AXE_OFFSET = 8;
const ARMOUR_OFFSET = 11;
const HELMET_OFFSET = 12;
const SHIELD_OFFSET = 13;
const STAFF_OFFEST = 14;
const PLAYER_OFFSET = 18;
const ENEMY_OFFSET = 19;

const TOTAL_NUM_SHEETS = 1;

SpriteSheet.totalLoaded = 0;
SpriteSheet.prototype.image;
SpriteSheet.prototype.name;
SpriteSheet.prototype.ready;

function SpriteSheet(name) {
  this.image = new Image();
  this.ready = false;
  this.image.addEventListener('load', this.onLoad);

  if (name) {
    this.image.src = name + ".png";
    this.name = name;
  }
  else {
    // TODO needs to throw error
    throw new Error("No filename passed");
  }
  console.log("load", name);
}

SpriteSheet.prototype.onLoad = function() {
  console.log("SpriteSheet.onLoad: ", this.name);
  this.ready = true;
  SpriteSheet.totalLoaded++;
  if (SpriteSheet.totalLoaded == TOTAL_NUM_SHEETS) {
    begin();
  }
};

SpriteSheet.prototype.isReady = function() {
  //console.log("Sprite.isReady", this.ready);
  return this.ready;
};

class Sprite {
  constructor(spriteSheet, offsetX, offsetY, width, height) {
    this.spriteSheet = spriteSheet;
    this.offsetX = offsetX * width;
    this.offsetY = offsetY * height;
    this.width = width;
    this.height = height;
  }

  render(desX, desY, context) {
    //context.clearRect(desX, desY, this.width, this.height);
    context.drawImage(this.spriteSheet.image,
                      this.offsetX,
                      this.offsetY,
                      this.width, this.height,
                      desX * UPSCALE_FACTOR, desY * UPSCALE_FACTOR,
                      this.width * UPSCALE_FACTOR, this.height * UPSCALE_FACTOR);
  }
}

var spriteSheet = new SpriteSheet('tileset');
var tileSprites = [ new Sprite(spriteSheet, 1, 1, 32, 32),
                    new Sprite(spriteSheet, 1, 0, 32, 32),
                    new Sprite(spriteSheet, 2, 2, 32, 32)];

var rogueSprite = new Sprite(spriteSheet, 0, 18, 32, 32);
var warlockSprite = new Sprite(spriteSheet, 1, 18, 32, 32);
var berserkerSprite = new Sprite(spriteSheet, 2, 18, 32, 32);
var archerSprite = new Sprite(spriteSheet, 4, 18, 32, 32);
var knightSprite = new Sprite(spriteSheet, 5, 18, 32, 32);
var wizardSprite = new Sprite(spriteSheet, 6, 18, 32, 32);
var blackMageSprite = new Sprite(spriteSheet, 7, 18, 32, 32);

var ratSprite = new Sprite(spriteSheet, 0, 19, 32, 32);
var spidersSprite = new Sprite(spriteSheet, 1, 19, 32, 32);
var lizardSprite = new Sprite(spriteSheet, 2, 19, 32, 32);
var bigSpiderSprite = new Sprite(spriteSheet, 3, 19, 32, 32);
var toadSprite = new Sprite(spriteSheet, 4, 19, 32, 32);
var scarabSprite = new Sprite(spriteSheet, 5, 19, 32, 32);
var centipedeSprite = new Sprite(spriteSheet, 6, 19, 32, 32);
var serpentSprite = new Sprite(spriteSheet, 7, 19, 32, 32);
var mushroomSprite = new Sprite(spriteSheet, 0, 20, 32, 32);
var rabbitSprite = new Sprite(spriteSheet, 1, 20, 32, 32);
var batSprite = new Sprite(spriteSheet, 2, 20, 32, 32);
var bigBatSprite = new Sprite(spriteSheet, 3, 20, 32, 32);
var snakeSprite = new Sprite(spriteSheet, 4, 20, 32, 32);
var wolfSprite = new Sprite(spriteSheet, 5, 20, 32, 32);
var boarSprite = new Sprite(spriteSheet, 6, 20, 32, 32);
var bearSprite = new Sprite(spriteSheet, 7, 20, 32, 32);
var slimesSprite = new Sprite(spriteSheet, 0, 21, 32, 32);
var bigSlimeSprite = new Sprite(spriteSheet, 1, 21, 32, 32);
var scorpionSprite = new Sprite(spriteSheet, 2, 21, 32, 32);
var krakenSprite = new Sprite(spriteSheet, 3, 21, 32, 32);
var vampireSprite = new Sprite(spriteSheet, 4, 21, 32, 32);
var mummySprite = new Sprite(spriteSheet, 5, 21, 32, 32);
var wraithSprite = new Sprite(spriteSheet, 6, 21, 32, 32);
var carabiaSprite = new Sprite(spriteSheet, 7, 21, 32, 32);
var goblinSprite = new Sprite(spriteSheet, 0, 22, 32, 32);
var zombieSprite = new Sprite(spriteSheet, 1, 22, 32, 32);
var undeadSprite = new Sprite(spriteSheet, 2, 22, 32, 32);
var orcSprite = new Sprite(spriteSheet, 3, 22, 32, 32);
var cyclopsSprite = new Sprite(spriteSheet, 4, 22, 32, 32);
var werewolfSprite = new Sprite(spriteSheet, 5, 22, 32, 32);
var golemSprite = new Sprite(spriteSheet, 6, 22, 32, 32);
var demonSprite = new Sprite(spriteSheet, 7, 22, 32, 32);

var swordSprites = [ new Sprite(spriteSheet, 0, 7, 32, 32),
                     new Sprite(spriteSheet, 1, 7, 32, 32),
                     new Sprite(spriteSheet, 2, 7, 32, 32),
                     new Sprite(spriteSheet, 3, 7, 32, 32),
                     new Sprite(spriteSheet, 4, 7, 32, 32),
                     new Sprite(spriteSheet, 5, 7, 32, 32),
                     new Sprite(spriteSheet, 6, 7, 32, 32),
                     new Sprite(spriteSheet, 7, 7, 32, 32),
                   ];

var armourSprites = [ new Sprite(spriteSheet, 0, 11, 32, 32),
                      new Sprite(spriteSheet, 1, 11, 32, 32),
                      new Sprite(spriteSheet, 2, 11, 32, 32),
                      new Sprite(spriteSheet, 3, 11, 32, 32),
                      new Sprite(spriteSheet, 4, 11, 32, 32),
                      new Sprite(spriteSheet, 5, 11, 32, 32),
                      new Sprite(spriteSheet, 6, 11, 32, 32),
                      new Sprite(spriteSheet, 7, 11, 32, 32),
                    ];
var helmetSprites = [ new Sprite(spriteSheet, 0, 12, 32, 32),
                      new Sprite(spriteSheet, 1, 12, 32, 32),
                      new Sprite(spriteSheet, 2, 12, 32, 32),
                      new Sprite(spriteSheet, 3, 12, 32, 32),
                      new Sprite(spriteSheet, 4, 12, 32, 32),
                      new Sprite(spriteSheet, 5, 12, 32, 32),
                      new Sprite(spriteSheet, 6, 12, 32, 32),
                      new Sprite(spriteSheet, 7, 12, 32, 32),
                    ];
var shieldSprites = [ new Sprite(spriteSheet, 0, 13, 32, 32),
                      new Sprite(spriteSheet, 1, 13, 32, 32),
                      new Sprite(spriteSheet, 2, 13, 32, 32),
                      new Sprite(spriteSheet, 3, 13, 32, 32),
                      new Sprite(spriteSheet, 4, 13, 32, 32),
                      new Sprite(spriteSheet, 5, 13, 32, 32),
                      new Sprite(spriteSheet, 6, 13, 32, 32),
                      new Sprite(spriteSheet, 7, 13, 32, 32),
                    ];
var staffSprites = [ new Sprite(spriteSheet, 0, 14, 32, 32),
                     new Sprite(spriteSheet, 1, 14, 32, 32),
                     new Sprite(spriteSheet, 2, 14, 32, 32),
                     new Sprite(spriteSheet, 3, 14, 32, 32),
                     new Sprite(spriteSheet, 4, 14, 32, 32),
                     new Sprite(spriteSheet, 5, 14, 32, 32),
                     new Sprite(spriteSheet, 6, 14, 32, 32),
                     new Sprite(spriteSheet, 7, 14, 32, 32),
                    ];