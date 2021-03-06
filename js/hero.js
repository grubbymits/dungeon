"use strict";

class Hero extends Actor {
  constructor(health, energy,
              strength, agility, wisdom, will, endurance,
              vision,
              position, subtype, game) {
    super(health, energy, vision, position,
          heroSprites[subtype], damageHeroSprites[subtype],
          HERO, game);
    this.equipPrimary = null;
    this.equipSecondary = null;
    this.equipArmour = null;
    this.equipHelmet = null;

    this.frozenSprite = frozenHeroSprites[subtype];
    this.shockedSprite = shockedHeroSprites[subtype];
    this.poisonedSprite = poisonedHeroSprites[subtype];
    this.burntSprite = burntHeroSprites[subtype];
    this.healSprite = healHeroSprites[subtype];

    this.strength = strength;
    this.agility = agility;
    this.wisdom = wisdom;
    this.will = will;
    this.endurance = endurance;
    this.subtype = subtype;
    
    this.maxHealth += Math.floor(this.maxHealth *
                                 (this.endurance / MAX_ENDURANCE));
    this.maxEnergy += Math.floor(this.maxEnergy *
                                 (this.endurance / MAX_ENDURANCE) +
                                 this.maxEnergy * (this.will / MAX_WILL));
    this.currentHealth = this.maxHealth;
    this.currentEnergy = this.maxEnergy;
    

    this.isFollowing = false;
    this.leader = null;
    this.nextAction = null;
    this.healAction = new TakePotion(this);
    this.level = 1;
    this.currentExp = 0;
    this.expToNextLvl = 15;
    this.id = 1;
    this.findTarget.targets = this.game.monsters;
  }

  reset() {
    this.currentHealth = this.maxHealth;
    this.currentEnergy = this.maxEnergy;
    this.nextAction = null;
    this.destination = null;
    this.walk = new WalkAction(this);
    this.rest = new RestAction(this);
    this.attack = new InitAttack(this);
    this.findTarget = new FindTarget(this);
    this.primaryAttack = new PrimaryAttack(this);
    this.interaction = new Interact(this);
    this.findTarget.targets = this.game.monsters;
  }

  get isInteractable() {
    return this.isFollowing;
  }

  interact(actor) {
    console.log("actor at:", this.pos);
    // If this hero is interacted with, it needs to move out of its current
    // location to make way for the leader.
    let dest = this.map.getFreeOpposite(this.pos, actor.pos);
    this.walk.dest = dest;
    this.nextAction = this.walk;
  }

  get name() {
    return this.className;
  }
  
  get armour() {
    return this.equipArmour;
  }

  get helmet() {
    return this.equipHelmet;
  }

  get ring() {
    return this.equipRing;
  }

  get primary() {
    return this.equipPrimary;
  }

  get secondary() {
    return this.equipSecondary;
  }

  get primaryAtkPower() {
    return ((100 * this.equipPrimary.power * this.strength / MAX_STRENGTH) /
             100).toFixed(2);
  }

  get primaryAtkMagicPower() {
    return ((100 * this.equipPrimary.effectDuration * this.wisdom / MAX_WISDOM) /
             100).toFixed(2);
  }

  get primaryAtkEnergy() {
    return ((100 * this.equipPrimary.energy * MAX_AGILITY / this.agility) /
             100).toFixed(2);
  }

  get primaryAtkType() {
    return this.equipPrimary.elemType;
  }

  get primaryAtkRange() {
    return this.equipPrimary.range;
  }

  get physicalDefense() {
    let total = 0;
    if (this.equipArmour) {
      total += this.equipArmour.defense;
    }
    if (this.equipHelmet) {
      total += this.equipHelmet.defense;
    }
    if (this.equipSecondary.type == SHIELD) {
      total += this.equipSecondary.defense;
    }
    return total;
  }

  get magicalDefense() {
    let total = MAX_MAGICAL_DEFENSE / 4;
    return total;
  }

  get magicResistance() {
    let total = 0;
    total += this.will;
    return total;
  }

  get action() {
    this.currentSprite = this.sprite;
    if (this.isFollowing) {
      if (this.leader.nextAction == this.leader.attack) {
        this.attack.target = this.leader.attack.target;
        this.nextAction = this.attack;
      } else if (this.position.getCost(this.leader.position) > 5) {
        this.walk.dest = this.leader.position;
        this.nextAction = this.walk;
      } else if ((this.nextAction == this.walk) && (this.walk.dest != this.pos)) {
        return this.nextAction;
      } else {
        console.log("returning findTarget as nextACtion");
        this.nextAction = this.findTarget;
      }
    }
    return this.nextAction;
  }
  
  takePotion(potion) {
    this.healAction.potion = potion;
    this.nextAction = this.healAction;
  }

  reduceHealth(enemy, damage) {
    this.currentHealth -= damage;
    if (this.currentHealth <= 0) {
      this.game.audio.die();
      this.game.entitiesToRemove.add(this);
    } else {
      if (this.isFollowing) {
        this.setAttack(enemy);
        this.nextAction = this.attack;
      }
    }
  }
  
  increaseHealth(amount) {
    console.log("increase health by:", amount);
    this.currentHealth += amount;
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth;
    }
  }
  
  increaseExp(exp) {
    let nextExpLevel = this.currentExp + Math.round(this.currentExp * 1.5);
    this.currentExp += exp;
    if (this.currentExp >= this.expToNextLvl) {
      this.level++;
      this.expToNextLvl = nextExpLevel;
      this.maxHealth += Math.floor(MAX_HEALTH_INC * (this.endurance / MAX_ENDURANCE));
      this.maxEnergy += Math.floor(MAX_ENERGY_INC * (this.endurance / MAX_ENDURANCE) +
                                   MAX_ENERGY_INC * (this.will / MAX_WILL));
      this.currentHealth = this.maxHealth;
      this.currentEnergy = this.maxEnergy;
      return true;
    }
  }

  follow(leader) {
    console.log("follow", this.name, leader.name);
    this.leader = leader;
    this.isFollowing = true;
    this.walk.dest = this.leader.position;
    this.nextAction = this.walk;
  }

  unfollow() {
    console.log("unfollow", this.name);
    this.leader = null;
    this.isFollowing = false;
    this.nextAction = null;
  }
  
  equipItem(item) {
    console.log("equipItem", item);
    switch(item.type) {
      case ARMOUR:
      this.equipArmour = item;
      break;
      case HELMET:
      this.equipHelmet = item;
      break;
      case SHIELD:
      case ARROWS:
      case THROWING:
      case SCROLL:
      this.equipSecondary = item;
      break;
      case SWORD:
      case AXE:
      case BOW:
      case STAFF:
      this.equipPrimary = item;
      break;
    }
  }
}

class Knight extends Hero {
  constructor(position, game) {
    super(100, 15,
          22, 14, 7, 10, 17,     // 70
          5,
          position, KNIGHT, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = swords[SWORD0];
    this.equipSecondary = shields[SHIELD0];
    this.className = 'knight';
  }
}

class Mage extends Hero {
  constructor(position, game) {
    super(50, 15,
          9, 13, 22, 17, 9,
          6,
          position, MAGE, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = staffs[STAFF0];
    this.equipSecondary = spells[SPELL0];
    this.className = 'mage';
    this.castSpell = new CastSpell(this);
  }

  get action() {
    // In order of priority:
    // - attempt to heal anyone in bad shape
    // - attack whoever the leader is attacking
    // - set destination near the leader
    // - move away from a potential melee attacker
    // - walk
    if (this.isFollowing) {
      for (let hero of this.game.heroes) {
        if (hero.currentHealth < hero.maxHealth / 2) {
          this.castSpell.spell = this.equipSecondary;
          this.castSpell.target = hero;
          this.nextAction = this.castSpell;
          return this.nextAction;
        }
      }
      if (this.leader.nextAction == this.leader.attack) {
        this.attack.target = this.leader.attack.target;
        this.nextAction = this.attack;
      } else if (this.position.getCost(this.leader.position) > 5) {
        this.walk.dest = this.leader.position;
        this.nextAction = this.walk;
      } else if (this.attack.target != null &&
                 this.attack.target.currentHealth > 0 &&
                 (this.position.getCost(this.attack.target.pos) <= 3)) {
        // Mages should try to keep away from melee attacks.
        let dest = this.map.getFreeOpposite(this.pos, this.attack.target.pos);
        this.walk.dest = dest;
        this.nextAction = this.walk;
      } else if ((this.nextAction == this.walk) && (this.walk.dest != this.pos)) {
        return this.nextAction;
      } else {
        console.log("returning findTarget as nextACtion");
        this.nextAction = this.findTarget;
      }
    }
    return this.nextAction;
  }

  get primaryAtkPower() {
    return ((100 * this.equipPrimary.power * this.wisdom / MAX_WISDOM)/100).toFixed(2);
  }

  get primaryAtkEnergy() {
    return ((100* this.equipPrimary.energy * MAX_WILL / this.will)/100).toFixed(2);
  }
}

class Rogue extends Hero {
  constructor(position, game) {
    super(50, 15,
          15, 20, 10, 14, 11,
          7,
          position, ROGUE, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = swords[SWORD0];
    this.equipSecondary = throwing[THROWING0];
    this.secondaryAttack = new SecondaryAttack(this);
    this.className = 'rogue';
  }

  get secondaryAtkPower() {
    return ((100 * this.equipSecondary.power * this.strength / MAX_STRENGTH) /
             100).toFixed(2);
  }

  get secondaryAtkEnergy() {
    return ((100 * this.equipSecondary.energy * MAX_AGILITY / this.agility) /
             100).toFixed(2);
  }

  get secondaryAtkType() {
    return this.equipSecondary.elemType;
  }

  get secondaryAtkRange() {
    return this.equipSecondary.range;
  }
}

class Archer extends Hero {
  constructor(position, game) {
    super(50, 15,
          13, 22, 9, 11, 15,
          7,
          position, ARCHER, game);
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.equipPrimary = bows[BOW0];
    this.equipSecondary = arrows[ARROWS0];
    this.className = 'archer';
  }

  get action() {
    // In order of priority:
    // - attack whoever the leader is attacking
    // - set destination near the leader
    // - move away from a potential melee attacker
    // - walk
    if (this.isFollowing) {
      if (this.leader.nextAction == this.leader.attack) {
        this.attack.target = this.leader.attack.target;
        this.nextAction = this.attack;
      } else if (this.position.getCost(this.leader.position) > 5) {
        this.walk.dest = this.leader.position;
        this.nextAction = this.walk;
      } else if (this.attack.target != null &&
                 this.attack.target.currentHealth > 0 &&
                 (this.position.getCost(this.attack.target.pos) <= 3)) {
        // Archers should try to keep away from melee attacks.
        let dest = this.map.getFreeOpposite(this.pos, this.attack.target.pos);
        this.walk.dest = dest;
        this.nextAction = this.walk;
      } else if ((this.nextAction == this.walk) && (this.walk.dest != this.pos)) {
        return this.nextAction;
      } else {
        console.log("returning findTarget as nextACtion");
        this.nextAction = this.findTarget;
      }
    }
    return this.nextAction;
  }

  get primaryAtkPower() {
    return ((100 * ((this.equipPrimary.power + this.equipSecondary.power) *
                      this.strength / MAX_STRENGTH))/100).toFixed(2);
  }

  get primaryAtkEnergy() {
    return ((100 * ((this.equipPrimary.energy + this.equipSecondary.energy) *
                      MAX_AGILITY / this.agility)/100)).toFixed(2);
  }
}

class Warlock extends Hero {
  constructor(position, game) {
    super(50, 15,
          18, 9, 13, 15, 15,
          position, WARLOCK, game);
    this.equipPrimary = axes[AXE0];
    this.equipSecondary = spells[SPELL0];
    this.equipArmour = armours[ARMOUR0];
    this.equipHelmet = helmets[HELMET0];
    this.className = 'warlock';
  }
}

