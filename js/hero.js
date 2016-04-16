"use strict";

class Hero extends Actor {
  constructor(health, energy, strength, agility, wisdom,
              position, sprite, damageSprite, game) {
    super(health, energy,
          position, sprite, damageSprite, HERO, game);
    this.equipWeapon = null;
    this.equipArmour = null;
    this.equipShield = null;
    this.equipArrows = null;

    this.strength = strength;
    this.agility = agility;
    this.wisdom = wisdom;

    this.isFollowing = false;
    this.leader = null;
    this.nextAction = null;
    this.level = 1;
    this.currentExp = 0;
    this.expToNextLvl = 15;
  }
  get armour() {
    return this.equipArmour;
  }
  get arrows() {
    return this.equipArrows;
  }
  get weapon() {
    return this.equipWeapon;
  }
  get shield() {
    return this.equipShield;
  }
  get helmet() {
    return this.equipHelmet;
  }
  get ring() {
    return this.equipRing;
  }
  get primary() {
    return this.weapon;
  }
  get secondary() {
    if (this.equipShield !== null) {
      return this.shield;
    }
  }
  get projectileRange() {
    return 0;
  }
  get primaryAtkPower() {
    return Math.round(this.equipWeapon.power * this.strength / MAX_STRENGTH);
  }
  get primaryAtkEnergy() {
    return Math.round(this.equipWeapon.energy * MAX_AGILITY / this.agility);
  }
  get primaryAtkType() {
    return this.equipWeapon.type;
  }
  get primaryAtkRange() {
    return this.equipWeapon.range;
  }
  get secondaryAtkRange() {
    return 0;
  }
  get physicalDefense() {
    var total = 0;
    if (this.equipArmour) {
      total += this.equipArmour.defense;
    }
    if (this.equipHelmet) {
      total += this.equipHelmet.defense;
    }
    if (this.equipShield) {
      total += this.equipShield.defense;
    }
    return total;
  }
  get action() {
    this.currentSprite = this.sprite;
    if (this.isFollowing) {
      if (this.leader.nextAction == this.leader.attack) {
        this.attack.target = this.leader.attack.target;
        this.nextAction = this.attack;
      } else if (this.position.getCost(this.leader.position) > 3) {
        this.walk.dest = this.leader.position;
        this.nextAction = this.walk;
      } else {
        this.nextAction = this.findTarget;
      }
    }
    return this.nextAction;
  }
  reduceHealth(enemy, damage) {
    console.log("reduce hero health by:", damage);
    this.currentHealth -= damage;
    this.game.map.setDirty(this.position);
    this.currentSprite = this.damageSprite;
    if (this.isFollowing) {
      this.setAttack(enemy);
      this.nextAction = this.attack;
    }
  }
  increaseExp(exp) {
    let nextExpLevel = this.currentExp + Math.round(this.currentExp * 1.5);
    this.currentExp += exp;
    if (this.currentExp >= this.expToNextLvl) {
      this.level++;
      this.expToNextLvl = nextExpLevel;
      this.maxHealth += 3;
      this.currentHealth = this.maxHealth;
      this.maxEnergy++;
      this.currentEnergy = this.maxEnergy;
      console.log("level up");
      return true;
    }
  }

  follow(leader) {
    this.leader = leader;
    this.isFollowing = true;
    this.walk.dest = this.leader.position;
    this.nextAction = this.walk;
  }
  equipItem(item) {
    switch(item.type) {
      case ARMOUR:
      return this.equipArmour = item;
      break;
      case HELMET:
      return this.equipHelmet = item;
      break;
      case SHIELD:
      return this.equipShield = item;
      break;
      case SWORD:
      return this.equipWeapon = item;
      break;
    }
  }
}

class Knight extends Hero {
  constructor(position, game) {
    super(60, 15, 20, 15, 10,
          position, knightSprite, damageKnightSprite, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipWeapon = swords[SWORD0];
    this.equipShield = shields[SHIELD0];
  }
}

class Mage extends Hero {
  constructor(position, game) {
    super(60, 15, 10, 15, 20,
          position, mageSprite, damageMageSprite, game);
    console.log("creating mage");
    this.equipArmour = armours[ARMOUR0];
    this.equipWeapon = staffs[STAFF0];
    //this.equipRing = basicRing;
  }
  get magicBall() {
    return this.equipCrystalBall;
  }
}

class Player {
  constructor(hero) {
    this.currentHero = hero;
    this.game = hero.game;
    this.heroes = [];
    this.shields = new Map();
    this.helmets = new Map();
    this.armours = new Map();
    this.swords = new Map();
    this.staffs = new Map();
    this.axes = new Map();
    this.potions = new Map();
    this.addHero(hero);
  }
  increaseExp(exp) {
    for (let hero of this.heroes) {
      if (hero.increaseExp(exp)) {
        this.UI.addEvent(new TextEvent(this.game.context, new Date().getTime(),
                                       hero.pos, "lvl up!"));
        this.UI.levelUp(hero);
      }
    }
  }
  addUI(UI) {
    this.UI = UI;
  }
  addHero(hero) {
    this.heroes.push(hero);
    if (hero.armour) {
      this.addItem(hero.armour);
    }
    if (hero.helmet) {
      this.addItem(hero.helmet);
    }
    if (hero.weapon) {
      this.addItem(hero.weapon);
    }
    if (hero.shield) {
      this.addItem(hero.shield);
    }
    if (hero.arrows) {
      this.addItem(hero.arrows);
    }
    if (hero.ring) {
      this.addItem(hero.ring);
    }
  }
  addItem(item) {
    let number = 1;
    let items;
    switch(item.type) {
      default:
      console.error("unhandled item type in Player.addItem");
      break;
      case ARMOUR:
      items = this.armours;
      break;
      case HELMET:
      items = this.helmets;
      break;
      case SHIELD:
      items = this.shields;
      break;
      case SWORD:
      items = this.swords;
      break;
      case STAFF:
      items = this.staffs;
      break;
      case AXE:
      items = this.axes;
      break;
      case POTION:
      items = this.potions;
      break;
    }
    if (items.has(item)) {
      number += items.get(item);
    }
    items.set(item, number);
  }
  setDestination(x, y) {
    this.currentHero.setDestination(x, y);
  }
  setRest() {
    for (let hero of this.heroes) {
      hero.setRest();
    }
  }
}
