"use strict";

class Game {
  constructor(context, width, height) {
    console.log("Game.constructor");
    this.actors = [];
    this.context = context;
    this.level = 1;
    this.isRunning = false;
    this.skipTicks = 1000 / 5;
    this.nextGameTick = (new Date()).getTime();
    this.theMap = new GameMap(width, height);
    this.theMap.generate();
  }

  renderMap() {
    // draw everything
    for (var x = 0; x < this.theMap.xMax; x++) {
      for (var y = 0; y < this.theMap.yMax; y++) {
        let loc = this.map.getLocation(x,y);
        if (loc.dirty) {
          this.context.fillStyle = '#000000';
          this.context.fillRect(x * TILE_SIZE * UPSCALE_FACTOR,
                                y * TILE_SIZE * UPSCALE_FACTOR,
                                TILE_SIZE * UPSCALE_FACTOR,
                                TILE_SIZE * UPSCALE_FACTOR);
          var type = loc.type;
          tileSprites[type].render(x * TILE_SIZE, y * TILE_SIZE , this.context);
          loc.dirty = false;
        }
      }
    }
  }
  addPlayer(player) {
    this.player = player;
  }
  createHero(pos, type) {
    var hero;
    if (type == KNIGHT) {
      hero = new Knight(30, 6, pos, this);
    } else if (type == MAGE) {
      hero = new Mage(30, 6, pos, this);
    } else {
      throw("Hero type unrecognised!");
    }
    this.actors.push(hero);
    return hero;
  }

  createMonster(pos, type) {
    if (type == RAT) {
      this.actors.push(new Rat(pos, this));
    }
  }

  placeMonsters(number) {
  }

  killActor(actor) {
    for (let index in this.actors) {
      if (this.actors[index] == actor) {
        console.log("killing actor, index:", index);
        this.theMap.removeEntity(this.actors[index].position);
        delete this.actors[index];
        this.actors.splice(index, 1);
      }
    }
  }

  renderActors() {
    for (let actor of this.actors) {
      actor.render();
    }
  }

  get map() {
    return this.theMap;
  }

  /*
  update() {
    for (let actor in this.actors) {
      let action = this.actors[actor].action;
      console.log("update, actor:", actor);
      // this will only work if each non-player character always selects
      // a move (ie, restAction) and the players are the first elements of
      // the actors array;
      if (!action) {
        return false;
      }
      while(action) {
        action = action.perform();
      }
    }
    return true;
  }
  */
}
