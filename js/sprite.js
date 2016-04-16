"use strict";

const POTION_OFFSET = 5;
const SPELL_OFFSET = 6;
const SWORD_OFFSET = 7;
const AXE_OFFSET = 8;
const BOW_OFFSET = 9;
const PROJECTILE_OFFSET = 10;
const ARMOUR_OFFSET = 11;
const HELMET_OFFSET = 12;
const SHIELD_OFFSET = 13;
const STAFF_OFFSET = 14;
const TREASURE_OFFSET = 15;
const PLAYER_OFFSET = 18;
const MONSTER_OFFSET = 19;

const TOTAL_NUM_SHEETS = 3;

var loadedSpriteSheets = 0;

class SpriteSheet {
  constructor(name) {
    this.image = new Image();
    this.ready = false;
    this.image.addEventListener('load', this.onLoad);

    if (name) {
      this.image.src = "res/img/" + name + ".png";
      this.name = name;
    }
    else {
      throw new Error("No filename passed");
    }
    console.log("load", name);
  }
  onLoad() {
    console.log("SpriteSheet.onLoad: ", this.name);
    this.ready = true;
    loadedSpriteSheets++;
    if (loadedSpriteSheets == TOTAL_NUM_SHEETS) {
      begin();
    }
  }
  get isReady() {
    return this.ready;
  }
}

class Sprite {
  constructor(spriteSheet, offsetX, offsetY) {
    this.spriteSheet = spriteSheet;
    this.offsetX = offsetX * TILE_SIZE;
    this.offsetY = offsetY * TILE_SIZE;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
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

var greenSpriteSheet = new SpriteSheet('tileset-green-64');
var redSpriteSheet = new SpriteSheet('tileset-red-64');
var blueSpriteSheet = new SpriteSheet('tileset-blue-64');
var yellowSpriteSheet = new SpriteSheet('tileset-yellow-64');
var uiSpriteSheet = new SpriteSheet('ui');

var targetSprite = new Sprite(uiSpriteSheet, 0, 0);
var currentActorSprite = new Sprite(uiSpriteSheet, 1, 0);

var tileSprites = [ new Sprite(greenSpriteSheet, 1, 1, 32, 32),
                    new Sprite(greenSpriteSheet, 7, 0, 32, 32),
                    new Sprite(greenSpriteSheet, 2, 2, 32, 32)];

var rogueSprite = new Sprite(greenSpriteSheet, 0, 18, 32, 32);
var warlockSprite = new Sprite(greenSpriteSheet, 1, 18, 32, 32);
var berserkerSprite = new Sprite(greenSpriteSheet, 2, 18, 32, 32);
var archerSprite = new Sprite(greenSpriteSheet, 4, 18, 32, 32);
var knightSprite = new Sprite(greenSpriteSheet, 5, 18, 32, 32);
var mageSprite = new Sprite(greenSpriteSheet, 6, 18, 32, 32);
var blackMageSprite = new Sprite(greenSpriteSheet, 7, 18, 32, 32);

var damageKnightSprite = new Sprite(redSpriteSheet, 5, 18, 32, 32);
var damageMageSprite = new Sprite(redSpriteSheet, 6, 18, 32, 32);

var monsterSprites = [];
var monsterDamageSprites = [];
var swordSprites = [];
var fireSwordSprites = [];
var iceSwordSprites = [];
var electricSwordSprites = [];
var axeSprites = [];
var fireAxeSprites = [];
var iceAxeSprites = [];
var electricAxeSprites = [];
var staffSprites = [];
var fireStaffSprites = [];
var iceStaffSprites = [];
var electricStaffSprites = [];
var armourSprites = [];
var helmetSprites = [];
var shieldSprites = [];
var spellSprites = [];
var potionSprites = [];
var treasureSprites = [];

for (let y = MONSTER_OFFSET; y < (MONSTER_OFFSET + 4); ++y) {
  for (let x = 0; x < 8; ++x) {
    monsterSprites.push(new Sprite(greenSpriteSheet, x, y));
    monsterDamageSprites.push(new Sprite(redSpriteSheet, x, y));
  }
}
for (let x = 0; x < 8; ++x) {
  swordSprites.push(new Sprite(greenSpriteSheet, x, SWORD_OFFSET));
  fireSwordSprites.push(new Sprite(redSpriteSheet, x, SWORD_OFFSET));
  iceSwordSprites.push(new Sprite(blueSpriteSheet, x, SWORD_OFFSET));
  electricSwordSprites.push(new Sprite(yellowSpriteSheet, x, SWORD_OFFSET));
  
  axeSprites.push(new Sprite(greenSpriteSheet, x, AXE_OFFSET));
  fireAxeSprites.push(new Sprite(redSpriteSheet, x, AXE_OFFSET));
  iceAxeSprites.push(new Sprite(blueSpriteSheet, x, AXE_OFFSET));
  electricAxeSprites.push(new Sprite(yellowSpriteSheet, x, AXE_OFFSET));
  
  staffSprites.push(new Sprite(greenSpriteSheet, x, STAFF_OFFSET));
  fireStaffSprites.push(new Sprite(redSpriteSheet, x, STAFF_OFFSET));
  iceStaffSprites.push(new Sprite(blueSpriteSheet, x, STAFF_OFFSET));
  electricStaffSprites.push(new Sprite(yellowSpriteSheet, x, STAFF_OFFSET));
  
  armourSprites.push(new Sprite(greenSpriteSheet, x, ARMOUR_OFFSET));
  helmetSprites.push(new Sprite(greenSpriteSheet, x, HELMET_OFFSET));
  shieldSprites.push(new Sprite(greenSpriteSheet, x, SHIELD_OFFSET));
  spellSprites.push(new Sprite(greenSpriteSheet, x, SPELL_OFFSET));
  potionSprites.push(new Sprite(greenSpriteSheet, x, POTION_OFFSET));
  treasureSprites.push(new Sprite(greenSpriteSheet, x, TREASURE_OFFSET));
}
var chestSprites = [ new Sprite(greenSpriteSheet, 0, 4),
                     new Sprite(greenSpriteSheet, 1, 4)
                   ];
