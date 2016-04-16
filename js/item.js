"use strict";

class Item {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
  get name() {
    switch(this.type) {
      default:
        console.log("unhandled item type in Item.name");
        return null;
      case POTION:
        return POTION_NAMES[this.subtype];
      case SWORD:
        return SWORD_NAMES[this.subtype];
      case HELMET:
        return HELMET_NAMES[this.subtype];
      case ARMOUR:
        return ARMOUR_NAMES[this.subtype];
      case SHIELD:
        return SHIELD_NAMES[this.subtype];
      case STAFF:
        return STAFF_NAMES[this.subtype];
      case AXE:
        return AXE_NAMES[this.subtype];
      case TREASURE:
        return TREASURE_NAMES[this.subtype];
    }
  }
  get sound() {
    switch(this.type) {
      default:
        console.log("unhandled item type in Item.sound");
        return null;
      case SWORD:
      case AXE:
        return slashAttackSound;
      case STAFF:
        if (type == ELECTRIC) {
          return electricMagicSound;
        } else if (type == FIRE) {
          return fireMagicSound;
        } else if (type == ICE) {
          return iceMagicSound;
        } else {
          return normalMagicSound;
        }
    }
  }
  get sprite() {
    switch(this.type) {
      default:
        console.log("unhandled item type in Item.sprite");
        return null;
      case POTION:
        return potionSprites[this.subtype];
      case SWORD:
        return swordSprites[this.subtype];
      case HELMET:
        return helmetSprites[this.subtype];
      case ARMOUR:
        return armourSprites[this.subtype];
      case SHIELD:
        return shieldSprites[this.subtype];
      case STAFF:
        return staffSprites[this.subtype];
      case AXE:
        return axeSprites[this.subtype];
      case TREASURE:
        return treasureSprites[this.subtype];
    }
  }
}

class Weapon extends Item {
  constructor(type, subtype, power, range, energy, elemType) {
    super(type, subtype);
    this.power = power;
    this.range = range;
    this.elemType = elemType;
    this.energy = energy;
  }
}

class Armour extends Item {
  constructor(type, subtype, defense, elemType) {
    super(type, subtype);
    this.defense = defense;
    this.elemType = elemType;
  }
}
class Potion extends Item {
  constructor(kind, strength, duration) {
    super(POTION, kind);
    this.strength = strength;
    this.duration = duration;
  }
  use(actor) {
    // for potions which have a duration of multiple turns, we need to assign
    // an effect on the actor, which will take effect immediately and for the
    // this.duration - 1 turns. The effect can then be triggered on the actor
    // when their next action is calculated.
    switch(this.subtype) {
      case BASIC_HEALTH_POTION:
      case HEALTH_POTION:
      case BIG_HEALTH_POTION:
        break;
      case ENERGY_POTION:
        break;
      case DEFENSE_POTION:
        break;
      case AGILITY_POTION:
        break;
      case STRENGTH_POTION:
        break;
      case WISDOM_POTION:
        break;
    }
  }
}
class Treasure extends Item {
  constructor(kind, value) {
    super(TREASURE, kind);
    this.value = value;
  }
}

class Scroll extends Item {
  constructor(kind) {
    super(SCROLL, kind);
  }
  use(actor) {
    
  }
}
var potions = [ new Potion(BASIC_HEALTH_POTION, 40, 1),
                new Potion(ENERGY_POTION, 15, 1),
                new Potion(HEALTH_POTION, 80, 1),
                new Potion(DEFENSE_POTION, 15, 4),
                new Potion(AGILITY_POTION, 15, 4),
                new Potion(STRENGTH_POTION, 15, 4),
                new Potion(WISDOM_POTION, 15, 4),
                new Potion(BIG_HEALTH_POTION, 120, 1)
              ];

var armours = [ new Armour(ARMOUR, ARMOUR0, 8, NORMAL),
                new Armour(ARMOUR, ARMOUR1, 10, NORMAL),
                new Armour(ARMOUR, ARMOUR2, 12, NORMAL),
                new Armour(ARMOUR, ARMOUR3, 14, FIRE),
                new Armour(ARMOUR, ARMOUR4, 16, NORMAL),
                new Armour(ARMOUR, ARMOUR5, 18, ICE),
                new Armour(ARMOUR, ARMOUR6, 20, NORMAL),
                new Armour(ARMOUR, ARMOUR7, 22, ELECTRIC),
              ];
var helmets = [ new Armour(HELMET, HELMET0, 7, NORMAL),
                new Armour(HELMET, HELMET1, 9, NORMAL),
                new Armour(HELMET, HELMET2, 11, NORMAL),
                new Armour(HELMET, HELMET3, 13, FIRE),
                new Armour(HELMET, HELMET4, 15, NORMAL),
                new Armour(HELMET, HELMET5, 17, ICE),
                new Armour(HELMET, HELMET6, 19, NORMAL),
                new Armour(HELMET, HELMET7, 21, ELECTRIC),
              ];
var shields = [ new Armour(SHIELD, SHIELD0, 2, NORMAL),
                new Armour(SHIELD, SHIELD1, 4, NORMAL),
                new Armour(SHIELD, SHIELD2, 6, NORMAL),
                new Armour(SHIELD, SHIELD3, 8, FIRE),
                new Armour(SHIELD, SHIELD4, 10, NORMAL),
                new Armour(SHIELD, SHIELD5, 12, ICE),
                new Armour(SHIELD, SHIELD6, 14, NORMAL),
                new Armour(SHIELD, SHIELD7, 16, ELECTRIC),
              ];
var staffs = [ new Weapon(STAFF, STAFF0, 10, 6, 1, FIRE),
               new Weapon(STAFF, STAFF1, 20, 3, 2, ICE),
               new Weapon(STAFF, STAFF2, 30, 3, 2, ELECTRIC),
               new Weapon(STAFF, STAFF3, 50, 3, 3, FIRE),
               new Weapon(STAFF, STAFF4, 75, 3, 3, ICE),
               new Weapon(STAFF, STAFF5, 100, 3, 4, ELECTRIC),
               new Weapon(STAFF, STAFF6, 120, 3, 4, FIRE),
               new Weapon(STAFF, STAFF7, 150, 3, 5, ICE),
             ];

var swords = [ new Weapon(SWORD, SWORD0, 20, 3, 1, NORMAL),
               new Weapon(SWORD, SWORD1, 30, 3, 2, NORMAL),
               new Weapon(SWORD, SWORD2, 40, 3, 2, NORMAL),
               new Weapon(SWORD, SWORD3, 50, 3, 3, NORMAL),
               new Weapon(SWORD, SWORD4, 75, 3, 3, NORMAL),
               new Weapon(SWORD, SWORD5, 100, 3, 4, NORMAL),
               new Weapon(SWORD, SWORD6, 120, 3, 4, NORMAL),
               new Weapon(SWORD, SWORD7, 159, 3, 5, NORMAL),
             ];

var axes = [ new Weapon(AXE, AXE0, 3, 3, 2, NORMAL),
               new Weapon(AXE, AXE1, 5, 3, 3, NORMAL),
               new Weapon(AXE, AXE2, 7, 3, 3, NORMAL),
               new Weapon(AXE, AXE3, 12, 3, 4, NORMAL),
               new Weapon(AXE, AXE4, 17, 3, 4, NORMAL),
               new Weapon(AXE, AXE5, 22, 3, 5, NORMAL),
               new Weapon(AXE, AXE6, 28, 3, 5, NORMAL),
               new Weapon(AXE, AXE7, 34, 3, 6, NORMAL),
             ];
             
var bows = [ new Weapon(BOW, BOW0, 25, 8, 2, NORMAL),
             new Weapon(BOW, BOW1, 40, 7, 3, NORMAL),
             new Weapon(BOW, BOW2, 50, 8, 3, NORMAL),
             new Weapon(BOW, BOW3, 65, 7, 4, NORMAL),
             new Weapon(BOW, BOW4, 75, 8, 4, NORMAL)
           ];

// https://en.wikipedia.org/wiki/List_of_mythological_objects
// mimung - wudga inherits from his son Wayland the Smith
// skofnung - sword of Hrolf Kraki
// gram - sigurd used to slay Fafnir
// hrunting - sword lent to beowulf
// naegling - beowulfs sword
// Tyrfing - cursed sword of Odin's grandson
// Ridill - possessed by a dwarf named Regin
// Kusanagi - amaterasu sword


var potions = [ new Potion(BASIC_HEALTH_POTION, 40, 1),
                new Potion(ENERGY_POTION, 15, 1),
                new Potion(HEALTH_POTION, 80, 1),
                new Potion(DEFENSE_POTION, 15, 4),
                new Potion(AGILITY_POTION, 15, 4),
                new Potion(STRENGTH_POTION, 15, 4),
                new Potion(WISDOM_POTION, 15, 4),
                new Potion(BIG_HEALTH_POTION, 120, 1)
              ];
              
var treasures = [ new Treasure(TREASURE0, 50),
                  new Treasure(TREASURE1, 75),
                  new Treasure(TREASURE2, 100),
                  new Treasure(TREASURE3, 125),
                  new Treasure(TREASURE4, 150),
                  new Treasure(TREASURE5, 175),
                  new Treasure(TREASURE6, 200),
                  new Treasure(TREASURE7, 225)
                ];

var scrolls = [ new Scroll(SCROLL0),
                new Scroll(SCROLL1),
                new Scroll(SCROLL2),
                new Scroll(SCROLL3),
                new Scroll(SCROLL4),
                new Scroll(SCROLL5),
                new Scroll(SCROLL6),
                new Scroll(SCROLL7)
              ];