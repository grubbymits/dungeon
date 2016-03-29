"use strict";

class Hero extends Actor {
  constructor(health, energy, strength, agility, wisdom,
              position, sprite, damageSprite, game) {
    super(health, energy, position, sprite, damageSprite, HERO, game);
    this.strength = strength;
    this.agility = agility;
    this.wisdom = wisdom;
    this.equipWeapon = null;
    this.equipArmour = null;
    this.equipShield = null;
    this.equipArrows = null;

    this.isFollowing = false;
    this.leader = null;
    this.nextAction = null;
    this.level = 1;
    this.currentExp = 0;
    this.expToNextLvl = 4;
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
  get projectileRange() {
    return 0;
  }
  get meleeAtkPower() {
    return this.equipWeapon.power;
  }
  get meleeAtkEnergy() {
    return this.equipWeapon.energy;
  }
  get meleeAtkType() {
    return this.equipWeapon.type;
  }
  get range() {
    return this.equipWeapon.range;
  }
  get physicalDefense() {
    var total = 0;
    if (this.equipArmour) {
      total += this.equipArmour.defense;
    }
    if (this.equipHelmet) {
      total += this.equipHelmet.defense;
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
    this.currentHealth -= damage;
    this.game.map.setDirty(this.position);
    this.currentSprite = this.damageSprite;
    if (this.isFollowing) {
      this.setAttack(enemy);
      this.nextAction = this.attack;
    }
  }
  increaseExp(exp) {
    this.currentExp += exp;
    console.log("increase exp by", exp);
    if (this.currentExp >= this.expToNextLvl) {
      this.level++;
      this.expToNextLvl = Math.round(this.expToNextLvl * 2);
      console.log("level up");
    }
  }

  follow(leader) {
    this.leader = leader;
    this.isFollowing = true;
    this.walk.dest = this.leader.position;
    this.nextAction = this.walk;
  }
}

class Knight extends Hero {
  constructor(health, energy, position, game) {
    super(health, energy, 10, 5, 3,
          position, knightSprite, damageKnightSprite, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipWeapon = swords[SWORD0];
    this.equipShield = shields[SHIELD0];
    this.meleeSound = document.getElementById("meleeWooshSound");
  }
}

class Mage extends Hero {
  constructor(health, energy, position, game) {
    super(health, energy, 3, 5, 10,
          position, wizardSprite, damageMageSprite, game);
    console.log("creating mage");
    this.equipArmour = armours[ARMOUR0];
    this.equipWeapon = staffs[STAFF0];
    this.equipCrystalBall = crystalBall;
    //this.equipRing = basicRing;
  }
  get magicBall() {
    return this.equipCrystalBall;
  }
}

class Player {
  constructor(hero) {
    this.currentHero = hero;
    this.heroes = [hero];
  }
  addHero(hero) {
    this.heroes.push(hero);
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
