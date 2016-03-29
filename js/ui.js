"use strict";

class Interface {
  constructor(player) {
    //this.keysDown = {};
    this.player = player;
    this.hudVisible = false;

    this.hud = document.createElement("canvas");
    this.hud.style.position = 'absolute';
    this.desiredScreenWidth = TILE_SIZE * 6 * UPSCALE_FACTOR;
    this.desiredScreenHeight = TILE_SIZE * 10 * UPSCALE_FACTOR;
    this.hud.width = TILE_SIZE * 8 * UPSCALE_FACTOR;
    this.hud.height = TILE_SIZE * 10 * UPSCALE_FACTOR;
    this.hud.style.left = '50%';
    this.hud.style.top = '50%';
    //this.hud.style.bottom = '0px';
    //this.hud.style.top = '0px';
    //this.hud.style.margin = 'auto';
    this.hud.style.visibility = 'hidden';
    this.hud.style.transform = 'translate(-50%, -50%)';
    this.hud.style.background = "rgba(50, 75, 75, 0.7)";
    document.body.appendChild(this.hud);
    this.hudContext = this.hud.getContext("2d");

    document.getElementById("centre_camera").addEventListener("click", this.centreCamera.bind(this), false);
    document.getElementById("rest_button").addEventListener("click", event => player.setRest());
    document.getElementById("hud_button").addEventListener("click", this.controlHUD.bind(this), false);
    document.getElementById("gameCanvas").addEventListener("click", this.onCanvasClick.bind(this), false);
  }

  centreCamera(event) {
    let x = this.player.currentHero.pos.x * TILE_SIZE * UPSCALE_FACTOR;
    let y = this.player.currentHero.pos.y * TILE_SIZE * UPSCALE_FACTOR;
    x -= window.innerWidth / 2;
    y -= window.innerHeight / 2;
    window.scrollTo(x, y);
  }

  renderHUD() {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    console.log("hud, offsetX:", offsetX);
    console.log("hud, offsetY:", offsetY);
    var isSmallScreen = true; //this.desiredHUDWidth > window.innerWidth ? true : false;
    // if the screen is large, we could make the HUD two or three tiles wider.
    
    this.hudContext.clearRect(0, 0, this.hud.width, this.hud.height);
    this.hudContext.font = "16px Droid Sans";
    this.hudContext.fillStyle = "orange";
    this.hudContext.textAlign = "left";
    this.hud.style.left = offsetX + "px";
    this.hud.style.top = offsetY + "px";
    
    if (window.innerWidth >= this.desiredScreenWidth) {
      this.hud.width = this.desiredScreenWidth;
      if (window.innerWidth >= this.desiredScreenWidth * 2) {
        this.hud.style.left = (window.innerWidth / 2) + offsetX + "px";
      } else {
        this.hud.style.left = (this.hud.width / 2) + offsetX + "px";
      }
    } else {
      this.hud.width = window.innerWidth;
    }
    
    if (window.innerHeight >= this.desiredScreenHeight) {
      this.hud.height = this.desiredScreenHeight;
      if (window.innerWidth >= this.desiredScreenWidth * 2) {
        this.hud.style.top = (window.innerHeight / 2) + offsetY + "px";
      } else {
        this.hud.style.top = (this.hud.height / 2) + offsetY + "px";
      }
    } else {
      this.hud.height = window.innerHeight;
    }
    
    for (let i in this.player.heroes) {
      let hero = this.player.heroes[i];
      let offsetX = TILE_SIZE * UPSCALE_FACTOR;
      let offsetY = TILE_SIZE + (TILE_SIZE * 2 * i) * UPSCALE_FACTOR;
      let spacing = (TILE_SIZE / 4) + 8;

      hero.sprite.render(offsetX, offsetY, this.hudContext);

      if (hero.weapon) {
        hero.weapon.sprite.render(offsetX + 2 * spacing, offsetY, this.hudContext);
      }
      if (hero.shield) {
        hero.shield.sprite.render(offsetX + 4 * spacing, offsetY, this.hudContext);
      }
      else if (hero.arrows) {
        hero.arrows.sprite.render(offsetX + 4 * spacing, offsetY, this.hudContext);
      }
      if (hero.armour) {
        hero.armour.sprite.render(offsetX + 6 * spacing, offsetY, this.hudContext);
      }
      if (hero.helmet) {
        hero.helmet.sprite.render(offsetX + 8 * spacing, offsetY, this.hudContext);
      }
      if (isSmallScreen) {
        offsetY += TILE_SIZE * UPSCALE_FACTOR + (TILE_SIZE / 4);
      } else {
        offsetX = offsetX + 11 * spacing * UPSCALE_FACTOR;
      }
      this.hudContext.fillText("Lvl: " + hero.level, offsetX, offsetY);
      this.hudContext.fillText("Exp to next Lvl: " + (hero.expToNextLvl - hero.currentExp),
                               offsetX, offsetY + spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Health: " + hero.currentHealth + "/" + hero.maxHealth,
                               offsetX, offsetY + 2 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Energy: " + hero.currentEnergy + "/" + hero.maxEnergy,
                               offsetX, offsetY + 3 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Strength: " + hero.strength,
                               offsetX, offsetY + 4 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Agility: " + hero.agility,
                               offsetX, offsetY + 5 * spacing * UPSCALE_FACTOR);
      this.hudContext.fillText("Wisdom: " + hero.wisdom,
                               offsetX, offsetY + 6 * spacing * UPSCALE_FACTOR);
    }
  }

  onCanvasClick(event) {
    var offsetY = document.documentElement.scrollTop || document.body.scrollTop;
    var offsetX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let x = Math.floor((event.clientX + offsetX) / TILE_SIZE / UPSCALE_FACTOR);
    let y = Math.floor((event.clientY + offsetY) / TILE_SIZE / UPSCALE_FACTOR);
    this.player.setDestination(x, y);
  }

  controlHUD(event) {
    if (!this.hudVisible) {
      this.hud.style.visibility = 'visible';
      this.hudVisible = true;
    } else {
      this.hud.style.visibility = 'hidden';
      this.hudVisible = false;
    }
  }
}
