"use strict";

class Monster extends Actor {
  constructor(health, energy,
              index,
              defense, vision, agility,
              xp,
              atkPower, atkType, atkEnergy,
              position, game) {
    super(health, energy, vision, position,
          monsterSprites[index], monsterDamageSprites[index],
          MONSTER, game);
    this.level = this.game.level;
    this.index = index;
    this.exp = xp * this.level;
    this.attackPower = atkPower;
    this.attackType = atkType;
    this.attackEnergy = atkEnergy;
    this.physicalDefense = defense;
    this.magicalDefense = defense;
    this.magicResistance = defense;
    this.agility = agility;
    this.findTarget.targets = this.game.heroes;
    this.name = ENEMY_NAMES[index];
    this.damageSprite = monsterDamageSprites[index];
    this.frozenSprite = frozenMonsterSprites[index];
    this.shockedSprite = shockedMonsterSprites[index];
    this.poisonedSprite = shockedMonsterSprites[index];
    this.burntSprite = burntMonsterSprites[index];
    this.currentSprite = monsterSprites[index];
  }

  get action() {
    this.currentSprite = this.sprite;
    if (this.currentEnergy <= 0) {
      return this.rest;
    } else if (this.nextAction === null) {
      this.nextAction = this.findTarget;
    }
    return this.nextAction;
  }

  get primaryAtkPower() {
    return this.attackPower;
  }

  get primaryAtkEnergy() {
    return this.attackEnergy;
  }

  get primaryAtkType() {
    return this.attackType;
  }

  get primaryAtkMagicPower() {
    return 0.20; //this.attackPower;
  }

  get primaryAtkRange() {
    return 3;
  }

  get secondaryAtkRange() {
    return 0;
  }

  reduceHealth(enemy, damage) {
    this.currentHealth -= damage;
    if (this.currentHealth <= 0) {
      this.game.player.increaseExp(this.exp);
      this.game.audio.die();
      this.game.entitiesToRemove.push(this);
    } else {
      this.setAttack(enemy);
    }
    // set dirty so the health bar is redrawn
    this.game.map.setDirty(this.position);
  }
}

// Creatures:
// Level 1: rat, bat, spiders, rabbit, lizard 
class Rat extends Monster {
  constructor(position, game) {
    super(38,     // health
          4,      // energy
          RAT,    // kind
          15,     // defense
          4,      // vision
          13,     // agility
          5,      // xp
          1.5,    // attack power
          NORMAL, // attack type
          2,      // attack energy
          position, game);
  }
}

class Rabbit extends Monster {
  constructor(position, game) {
    super(40,     // health
          5,      // energy
          RABBIT,    // kind
          15,     // defense
          4,      // vision
          15,     // agility
          6,      // xp
          1.7,    // attack power
          NORMAL, // attack type
          2,      // attack energy
          position, game);
  }
}

class Spiders extends Monster {
  constructor(position, game) {
    super(44,
          4,
          SPIDERS,
          15,
          4,
          14,
          6,
          1.5,
          NORMAL,
          2,
          position, game);
  }
}

class Bat extends Monster {
  constructor(position, game) {
    super(36,     // health
          5,      // energy
          BAT,    // kind
          10,     // defense
          5,      // vision
          16,     // agility
          7,      // xp
          1.5,    // attack power
          NORMAL, // attack type
          2,      // attack energy
          position, game);
  }
}

class Lizard extends Monster {
  constructor(position, game) {
    super(60,
          5,
          LIZARD,
          18,
          5,
          7,
          8,
          2,
          POISON,
          2,
          position, game);
  }
}

// Level 2/3: Mushroom, Spider Champion, Bat Champion
class Mushroom extends Monster {
  constructor(position, game) {
    super(80,             // health
          6,              // energy
          MUSHROOM,       // kind
          18,             // defense
          4,              // vision
          10,             // agility
          10,             // xp
          2.2,            // attack power
          NORMAL,         // attack type
          2,              // attack energy
          position, game);
  }
}

class SpiderChampion extends Monster {
  constructor(position, game) {
    super(70,
          4,
          SPIDER_CHAMPION,
          20,
          5,
          10,
          11,
          2.5,
          POISON,
          2,
          position, game);
  }
}

class BatChampion extends Monster {
  constructor(position, game) {
    super(60,             // health
          6,              // energy
          BAT_CHAMPION,   // kind
          18,             // defense
          6,              // vision
          16,             // agility
          11,             // xp
          2,              // attack power
          NORMAL,         // attack type
          2,              // attack energy
          position, game);
  }
}

// Level 4/5: Toad, Centipede, Snake
class Toad extends Monster {
  constructor(position, game) {
    super(100,          // health
          10,           // energy
          TOAD,         // kind
          20,           // defense
          6,            // vision
          18,           // agility
          14,           // xp
          2.5,          // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Centipede extends Monster {
  constructor(position, game) {
    super(110,          // health
          10,           // energy
          CENTIPEDE,    // kind
          25,           // defense
          4,            // vision
          13,           // agility
          16,           // xp
          2.6,          // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Snake extends Monster {
  constructor(position, game) {
    super(100,          // health
          10,           // energy
          SNAKE,        // kind
          20,           // defense
          8,            // vision
          20,           // agility
          18,           // xp
          2.8,          // attack power
          POISON,       // attack type
          2,            // attack energy
          position, game);
  }
}

// Level 5/6: Scarab, Zombie
class Scarab extends Monster {
  constructor(position, game) {
    super(140,          // health
          10,           // energy
          SCARAB,       // kind
          25,           // defense
          5,            // vision
          15,           // agility
          20,           // xp
          2.7,          // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Zombie extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          ZOMBIE,       // kind
          19,           // defense
          5,            // vision
          14,           // agility
          20,           // xp
          2.6,          // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

// Level 6: Scorpion, Undead, Serpent 
class Scorpion extends Monster {
  constructor(position, game) {
    super(140,          // health
          10,           // energy
          SCORPION,     // kind
          30,           // defense
          6,            // vision
          22,           // agility
          24,           // xp
          2.9,          // attack power
          POISON,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Undead extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          UNDEAD,       // kind
          20,           // defense
          5,            // vision
          14,           // agility
          22,           // xp
          2.8,          // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Serpent  extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          SERPENT,      // kind
          17,           // defense
          6,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

// Level 7: Werewolf, Goblin, Mummy
class Werewolf extends Monster {
  constructor(position, game) {
    super(180,          // health
          10,           // energy
          WEREWOLF,     // kind
          20,           // defense
          8,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Goblin  extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          GOBLIN,       // kind
          17,           // defense
          6,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Mummy extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          MUMMY,        // kind
          17,           // defense
          6,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

// Level 8: Wolf, Slimes, Orc, Vampire
class Wolf extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          WOLF,         // kind
          17,           // defense
          6,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Slimes extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          SLIMES,       // kind
          17,           // defense
          6,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Orc extends Monster {
  constructor(position, game) {
    super(160,          // health
          10,           // energy
          ORC,          // kind
          17,           // defense
          6,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

class Vampire extends Monster {
  constructor(position, game) {
    super(220,          // health
          15,           // energy
          VAMPIRE,      // kind
          24,           // defense
          8,            // vision
          25,           // agility
          35,           // xp
          3.4,          // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}

// Level 9: Boar, Slime Champion, Cyclops, Wraith
class SlimeChampion extends Monster {
  constructor(position, game) {
    super(250,          // health
          10,           // energy
          SLIME_CHAMPION,       // kind
          17,           // defense
          6,            // vision
          25,           // agility
          28,           // xp
          3,            // attack power
          NORMAL,       // attack type
          2,            // attack energy
          position, game);
  }
}
// Level 10: Bear, Kraken, Golem, Carabia, Demon
