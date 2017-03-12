class Renderer {
  constructor(context, overlayContext, map, actors, objects) {
    this.context = context;
    this.overlayContext = overlayContext;
    this.map = map;
    this.actors = actors;
    this.objects = objects;
  }

  renderMap(symbolLocs) {
    // draw everything
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0,
                          this.map.width * TILE_SIZE * UPSCALE_FACTOR,
                          this.map.height * TILE_SIZE * UPSCALE_FACTOR);
    for (var x = 0; x < this.map.width; x++) {
      for (var y = 0; y < this.map.height; y++) {
        let type = this.map.getLocationType(x,y);
        if (type != CEILING) {
          let spriteIdx = this.map.getLocationSprite(x, y);
          tileSprites[spriteIdx].render(x * TILE_SIZE, y * TILE_SIZE,
                                        this.context);
        }
      }
    }
    for (let loc of symbolLocs) {
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
                                 this.map.width * TILE_SIZE,
                                 this.map.height * TILE_SIZE);
  }

  renderChanges() {
    for (let vec of this.map.newVisible.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
    }
    this.map.newVisible.clear();

    this.overlayContext.globalAlpha = 0.5;
    this.overlayContext.fillStyle = '#000000';
    for (let vec of this.map.newPartialVisible.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
      this.overlayContext.fillRect(vec.x * TILE_SIZE, vec.y * TILE_SIZE,
                                   TILE_SIZE, TILE_SIZE);
    }
    this.map.newPartialVisible.clear();
    this.overlayContext.globalAlpha = 1.0;

    for (let vec of this.map.newDirty.values()) {
      this.overlayContext.clearRect(vec.x * TILE_SIZE,
                                    vec.y * TILE_SIZE,
                                    TILE_SIZE, TILE_SIZE);
    }
    this.map.newDirty.clear();
  }
 
  renderEntities(currentHero) {
    for (let actor of this.actors) {
      let loc = this.map.getLocation(actor.pos.x, actor.pos.y);

      if (loc.isVisible) {
        if (actor.kind == HERO) {
          //this.overlayContext.clearRect(actor.drawX, actor.drawY,
            //                            TILE_SIZE, TILE_SIZE);
          if (actor == currentHero) {
            currentActorIdentifier.render(actor.drawX, actor.drawY,
                                          this.overlayContext);
          }
        }
        actor.render();
      }
    }
    for (let object of this.objects) {
      let loc = this.map.getLocation(object.pos.x, object.pos.y);
      if (loc.isVisible) {
        object.render();
      }
    }
  }
}
