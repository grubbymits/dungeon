"use strict";

class Game {
  constructor(context, overlayContext, width, height) {
    console.log("Game.constructor");
    this.actors = [];
    this.heroes = [];
    this.monsters = [];
    this.currentEffects = new Map();
    this.objects = [];
    this.entitiesToRemove = [];
    this.entitiesToCreate = [];
    this.totalChests = 0;
    this.openChests = 0;
    this.totalMonsters = 0;
    this.monstersKilled = 0;
    this.expGained = 0;
    this.context = context;
    this.overlayContext = overlayContext;
    this.level = 1;
    this.isRunning = false;
    this.loading = false;
    this.skipTicks = 1000 / 60;
    this.nextGameTick = (new Date()).getTime();
    this.theMap = null; //new GameMap(width, height, this);
    this.width = width;
    this.height = height;
    this.audio = new Audio(this);
  }

  get isLoading() {
    return this.loading;
  }

  saveItems(itemMap, name) {
    let itemArray = [];
    for (let [key, value] of itemMap) {
      itemArray.push({ subtype: key.subtype, amount: value });
    }
    localStorage.setItem(name, JSON.stringify(itemArray));
  }

  saveGame() {
    localStorage.setItem("mapType", this.mapGenerator.type);
    localStorage.setItem("level", this.level);

    this.saveItems(this.player.helmets, "helmets");
    this.saveItems(this.player.armours, "armours");
    this.saveItems(this.player.swords, "swords");
    this.saveItems(this.player.staffs, "staffs");
    this.saveItems(this.player.bows, "bows");
    this.saveItems(this.player.axes, "axes");
    this.saveItems(this.player.throwing, "throwing");
    this.saveItems(this.player.arrows, "arrows");
    this.saveItems(this.player.shields, "shields");
    this.saveItems(this.player.spells, "spells");

    localStorage.setItem("numHeroes", this.heroes.length);
    for (let i in this.heroes) {
      let hero = this.heroes[i];
      localStorage.setItem("hero" + i, JSON.stringify({
        subtype : hero.subtype,
        level : hero.level,
        exp : hero.currentExp,
        expToNext : hero.expToNextLvl,
        health : hero.maxHealth,
        energy : hero.maxEnergy,
        strength : hero.strength,
        agility : hero.agility,
        wisdom : hero.wisdom,
        will : hero.will,
        endurance : hero.endurance,
        vision : hero.vision,
        primaryType : hero.primary.type,
        primarySubtype : hero.primary.subtype,
        secondaryType : hero.secondary.type,
        secondarySubtype : hero.secondary.subtype,
        armourType : hero.equipArmour.type,
        armourSubtype : hero.equipArmour.subtype,
        helmetType : hero.equipHelmet.type,
        helmetSubtype : hero.equipHelmet.subtype }));  
    }
  }

  loadItems(itemMap, name, itemArray) {
    console.log("load items");
    let items = JSON.parse(localStorage.getItem(name));
    console.log(items);
    for (let item of items) {
      let newItem = itemArray[item.subtype];
      console.log("loading item, subtype:", item.subtype, newItem);
      itemMap.set(newItem, item.amount);
    }
  }

  loadGame(player) {
    console.log("loading game");
    this.loading = true;
    this.player = player;
    this.level = localStorage.getItem("level");
    let mapType = localStorage.getItem("mapType");
    let numHeroes = localStorage.getItem("numHeroes");
    this.mapGenerator = createGenerator(mapType, this.width, this.height);
    this.setupMap(numHeroes);
    if (this.mapGenerator.entryVecs.length === 0) {
      throw("entryVecs not populated");
    }

    this.loadItems(this.player.armours, "armours", armours);
    this.loadItems(this.player.helmets, "helmets", helmets);
    this.loadItems(this.player.swords, "swords", swords);
    this.loadItems(this.player.staffs, "staffs", staffs);
    this.loadItems(this.player.bows, "bows", bows);
    this.loadItems(this.player.axes, "axes", axes);
    this.loadItems(this.player.throwing, "throwing", throwing);
    this.loadItems(this.player.arrows, "arrows", arrows);
    this.loadItems(this.player.shields, "shields", shields);
    this.loadItems(this.player.spells, "spells", spells);

    console.log("numHeroes:", numHeroes);

    for (let i = 0; i < numHeroes; ++i) {
      let stats = JSON.parse(localStorage.getItem("hero" + i));
      console.log("hero stats:", stats);

      let pos = this.mapGenerator.entryVecs[i];
      let isFollowing = i == 0 ? false : true;
      let hero = this.createHero(pos, stats.subtype, isFollowing);

      hero.level = stats.level;
      hero.currentExp = stats.exp;
      hero.expToNextLevel = stats.expToNext;
      hero.maxHealth = stats.health;
      hero.maxEnergy = stats.energy;
      hero.strength = stats.strength;
      hero.agility = stats.agility;
      hero.wisdom = stats.wisdom;
      hero.will = stats.will;
      hero.endurance = stats.endurance;
      hero.vision = stats.vision;

      if (stats.primaryType == SWORD) {
        hero.equipPrimary = swords[stats.primarySubtype];
      } else if (stats.primaryType == BOW) {
        hero.equipPrimary = bows[stats.primarySubtype];
      } else if (stats.primaryType == STAFF) {
        hero.equipPrimary = staffs[stats.primarySubtype];
      } else {
        throw("unhandled primary type");
      }
      if (stats.secondaryType == SHIELD) {
        hero.equipSecondary = shields[stats.secondarySubtype];
      } else if (stats.secondaryType == ARROWS) {
        hero.equipSecondary = arrows[stats.secondarySubtype];
      } else if (stats.secondaryType == THROWING) {
        hero.equipSecondary = throwing[stats.secondarySubtype];
      } else if (stats.secondaryType == SPELL) {
        hero.equipSecondary = spells[stats.secondarySubtype];
      } else {
        throw("unhandled secondary type");
      }
      hero.equipArmour = armours[stats.armourSubtype];
      hero.equipHelmet = helmets[stats.helmetSubtype];
      if (i == 0) {
        this.player.init(hero);
      }
    }
    this.loading = false;
    this.renderMap();
  }

  init(player, playerType, mapType) {
    this.loading = true;
    this.player = player;
    this.mapGenerator = createGenerator(mapType, this.width, this.height);
    this.setupMap(1);

    if (this.mapGenerator.entryVecs.length == 0) {
      throw("entryVecs not populated");
    }
    let character = this.createHero(this.mapGenerator.entryVecs[0], playerType, false);
    this.player.init(character);
    this.loading = false;
    this.renderMap();
  }

  loadNextMap() {
    console.log("loadNextMap");
    this.saveGame();
    this.loading = true;
    this.pause();

    // reset stuff
    this.actors = [];
    this.monsters = [];
    this.objects = [];
    this.entitiesToRemove = [];
    this.entitiesToCreate = [];
    this.totalChests = 0;
    this.openChests = 0;
    this.totalMonsters = 0;
    this.monstersKilled = 0;
    this.expGained = 0;
    this.currentEffects.clear();


    this.setupMap(this.heroes.length);
    // re-add the heroes
    for (let hero of this.heroes) {
      hero.reset();
      hero.pos = this.mapGenerator.entryVecs.pop();
      this.theMap.placeEntity(hero.pos, hero);
      //this.theMap.addVisibleTiles(hero.pos, hero.vision);
      this.actors.push(hero);
    }
    this.player.UI.centreCamera();

    this.renderMap();
    this.clearOverlay();
    this.renderChanges();
    this.loading = false;
  }

  setupMap(numHeroes) {
    this.mapGenerator.generate(this.level, MAP_WIDTH_PIXELS, MAP_HEIGHT_PIXELS,
                               numHeroes);
    this.theMap = this.mapGenerator.map;

    let stair = new Stair(this.mapGenerator.exitStairLoc.vec, true, this);
    this.addObject(stair, this.mapGenerator.exitStairLoc);
    stair = new Stair(this.mapGenerator.entryStairLoc.vec, false, this);
    this.addObject(stair, this.mapGenerator.entryStairLoc);

    this.mapGenerator.placeChests();

    for (let resEntity of this.mapGenerator.reservedLocs) {
      let loc = resEntity.loc;
      switch(resEntity.type) {
      case CHEST:
        this.createChest(loc);
        break;
      case SKULL:
        let skull = new Skull(loc.vec, this);
        this.addObject(skull, loc);
        break;
      case TOMBSTONE:
        let tombstone = new Tombstone(loc.vec, this);
        this.addObject(tombstone, loc);
        break;
      case SIGN:
        let sign = new Sign(loc.vec, this);
        this.addObject(sign, loc);
        break;
      case MAGICAL_OBJ:
        let object = new MagicalObject(loc.vec, this);
        this.addObject(object, loc);
        break;
      case ALLY:
        let newAllies = new Set([ARCHER, ROGUE, MAGE, KNIGHT]);; 
        for (let hero of this.heroes) {
          console.log("Hero subtype:", hero.subtype);
          newAllies.delete(hero.subtype);
        }
        do {
          var allyType = getBoundedRandom(ROGUE, BLACK_MAGE);
          var found = newAllies.has(allyType);
          console.log("found", found, "allType:", allyType);
        } while (!found);

        let ally = new Ally(loc.vec, allyType, this);
        this.addObject(ally, loc);
        break;
      }
    }

    this.mapGenerator.placeMonsters(this.level, 32);
    for (let monster of this.mapGenerator.monsterPlacements) {
      this.createMonster(monster.vec, monster.type);
    }

    ++this.level;
  }
  
  renderMap() {
    // draw everything
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0,
                          this.theMap.width * TILE_SIZE * UPSCALE_FACTOR,
                          this.theMap.height * TILE_SIZE * UPSCALE_FACTOR);
    for (var x = 0; x < this.theMap.width; x++) {
      for (var y = 0; y < this.theMap.height; y++) {
        let type = this.theMap.getLocationType(x,y);
        if (type != CEILING) {
          let spriteIdx = this.theMap.getLocationSprite(x, y);
          tileSprites[spriteIdx].render(x * TILE_SIZE, y * TILE_SIZE,
                                        this.context);
        }
      }
    }
    for (let loc of this.mapGenerator.symbolLocs) {
      let spriteIdx = 0;
      if (Math.random() < 0.16) {
        spriteIdx = 0;
      } else if (Math.random() < 0.33) {
        spriteIdx = 1;
      } else if (Math.random() < 0.5) {
        spriteIdx = 2;
      } else if (Math.random() < 0.66) {
        spriteIdx = 3;
      } else if (Math.random() < 0.73) {
        spriteIdx = 4;
      } else if (Math.random() < 0.73) {
        spriteIdx = 5;
      }
      let sprite = symbolSprites[spriteIdx];
      sprite.render(loc.vec.x * TILE_SIZE, loc.vec.y * TILE_SIZE,
                    this.context);
    }
  }

  clearOverlay() {
    this.overlayContext.fillStyle = '#000000';
    this.overlayContext.fillRect(0, 0,
                                 this.theMap.width * TILE_SIZE,
                                 this.theMap.height * TILE_SIZE);
  }

  renderChanges() {
    for (let vec of this.theMap.newVisible.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
    }
    this.theMap.newVisible.clear();

    this.overlayContext.globalAlpha = 0.5;
    this.overlayContext.fillStyle = '#000000';
    for (let vec of this.theMap.newPartialVisible.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
      this.overlayContext.fillRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                   TILE_SIZE, TILE_SIZE);
    }
    this.theMap.newPartialVisible.clear();
    this.overlayContext.globalAlpha = 1.0;

    for (let vec of this.theMap.newDirty.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE,
                                    vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
    }
    this.theMap.newDirty.clear();
  }
 
  renderEntities() {
    for (let actor of this.actors) {
      let loc = this.theMap.getLocation(actor.pos.x, actor.pos.y);

      if (loc.isVisible) {
        if (actor.kind == HERO) {
          this.overlayContext.clearRect(actor.drawX, actor.drawY,
                                        TILE_SIZE, TILE_SIZE);
          if (actor == this.player.currentHero) {
            currentActorSprite.render(actor.drawX, actor.drawY,
                                      this.overlayContext);
          }
        }
        actor.render();
      }
    }
    for (let object of this.objects) {
      let loc = this.theMap.getLocation(object.pos.x, object.pos.y);
      if (loc.isVisible) {
        object.render();
      }
    }
  }

  addTextEvent(string) {
    this.player.UI.addEvent(new TextEvent(string));
  }

  addGraphicEvent(sprite, pos) {
    this.player.UI.addEvent(new GraphicEvent(this.overlayContext, pos,
                                             sprite));
  }

  addPathEvent(path) {
    this.player.UI.addEvent(new PathEvent(this.overlayContext, path));
  }

  createHero(pos, type, isFollowing) {
    var hero;
    if (type == KNIGHT) {
      hero = new Knight(pos, this);
      console.log("adding knight");
    } else if (type == MAGE) {
      hero = new Mage(pos, this);
      console.log("adding mage");
    } else if (type == ROGUE) {
      hero = new Rogue(pos, this);
      console.log("adding rogue");
    } else if (type == ARCHER) {
      hero = new Archer(pos, this);
      console.log("adding archer");
    } else if (type == WARLOCK) {
      hero = new Warlock(pos, this);
      console.log("adding warlock");
    } else {
      throw("Hero type unrecognised!");
    }
    if (isFollowing) {
      hero.follow(this.player.currentHero);
    }
    this.actors.push(hero);
    this.heroes.push(hero);
    this.currentEffects.set(hero, []);
    this.theMap.placeEntity(pos, hero);
    this.player.addHero(hero);
    return hero;
  }

  createMonster(pos, type) {
    let monster = null;
    console.log("create", ENEMY_NAMES[type]);
    switch(type) {
      case RAT:
        monster = new Rat(pos, this);
        break;
      case SPIDERS:
        monster = new Spiders(pos, this);
        break;
      case RABBIT:
        monster = new Rabbit(pos, this);
        break;
      case BAT:
        monster = new Bat(pos, this);
        break;
      case LIZARD:
        monster = new Lizard(pos, this);
        break;
      case MUSHROOM:
        monster = new Mushroom(pos, this);
        break;
      case SPIDER_CHAMPION:
        monster = new SpiderChampion(pos, this);
        break;
      case BAT_CHAMPION:
        monster = new BatChampion(pos, this);
        break;
      case TOAD:
        monster = new Toad(pos, this);
        break;
      case CENTIPEDE:
        monster = new Centipede(pos, this);
        break;
      case SNAKE:
        monster = new Snake(pos, this);
        break;
      case SCARAB:
        monster = new Scarab(pos, this);
        break;
      case ZOMBIE:
        monster = new Zombie(pos, this);
        break;
      case SCORPION:
        monster = new Scorpion(pos, this);
        break;
      case UNDEAD:
        monster = new Undead(pos, this);
        break;
      case WEREWOLF:
        monster = new Werewolf(pos, this);
        break;
      case SLIMES:
        monster = new Slimes(pos, this);
        break;
      case SLIME_CHAMPION:
        monster = new SlimeChampion(pos, this);
        break;
      case GOBLIN:
        monster = new Goblin(pos, this);
        break;
      case ORC:
        monster = new Orc(pos, this);
        break;
      default:
        throw("unhandled monster type!");
    }
    this.actors.push(monster);
    this.monsters.push(monster);
    this.theMap.placeEntity(pos, monster);
    this.currentEffects.set(monster, []);
    ++this.totalMonsters;
    this.map.getLocation(pos.x, pos.y).blocked = false;
    return monster;
  }


  createChest(loc) {
    let chest = new Chest(loc.vec, this);
    ++this.totalChests;
    this.addObject(chest, loc);
  }

  addObject(object, loc) {
    this.objects.push(object);
    this.theMap.placeEntity(object.pos, object);
    loc.blocked = false;
  }

  removeEntity(entity) {
    // TODO Having a single array for actors is only used because its
    // the way of stepping through actors in the game loop. The hero
    // and monster arrays are generally used but then we have duplicate
    // references. And maybe more useful to use a set for these.
    if (entity.kind == MONSTER) {
      ++this.monstersKilled;
      this.expGained += entity.exp;
      for (let i in this.monsters) {
        let monster = this.monsters[i];
        if (monster == entity) {
          this.monsters.splice(i, 1);
          break;
        }
      }
    }

    if (entity.kind == HERO) {
      if (this.heroes.length == 1) {
        // GAME OVER
      } else {
        for (let i in this.heroes) {
          let hero = this.heroes[i];
          if (hero == entity) {
            this.heroes.splice(i, 1);
            break;
          }
        }
      }
    }

    let entities;
    if (entity.kind != OBJECT) {
      entities = this.actors;
    } else {
      entities = this.objects;
    }

    for (let index in entities) {
      if (entities[index] == entity) {
        this.theMap.removeEntity(entity.position);
        delete entities[index];
        entities.splice(index, 1);
      }
    }
  }

  getAction(actor) {
    return this.actors[actor].action;
  }

  addEffect(actor, effect) {
    console.log("addEffect:", effect);
    this.currentEffects.get(actor).push(effect);
  }

  applyEffects(index) {
    let actor = this.actors[index];
    let effects = this.currentEffects.get(actor);
    for (let i in effects) {
      let expired = effects[i].cause(actor);
      if (expired) {
        delete this.currentEffects.get(actor)[i];
        this.currentEffects.get(actor).splice(i, 1);
      }
    }
    // Each actor receives some EP at the beginning of their turn.
    if (actor.currentEnergy < actor.maxEnergy - 1) {
      actor.currentEnergy = actor.currentEnergy + 2;
    } else if (actor.currentEnergy < actor.maxEnergy) {
      actor.currentEnergy++;
    }
  }

  update() {
    for (let entity of this.entitiesToRemove) {
      this.removeEntity(entity);
    }
    for (let entity of this.entitiesToCreate) {
      if (entity.type == HERO) {
        this.createHero(entity.pos, entity.subtype, true);
      }
    }
    this.entitiesToRemove = [];
    this.entitiesToCreate = [];
  }
  
  openChest() {
    ++this.openChests;
  }
  
  get map() {
    return this.theMap;
  }

  pause() {
    this.isRunning = false;
    this.audio.pauseMusic();
  }

  play() {
    this.isRunning = true;
    this.audio.playMusic();
  }
}
