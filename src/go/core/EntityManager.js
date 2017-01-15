
/* eslint no-debugger: "off" */

import * as Pixi from 'pixi.js';

// TODO Consider if any dependencies should be removed
import { COMPONENT, DISPLAY_TYPE } from '../core/constants';
import { BEHAVIOR } from '../resources';
// Behaviors
import Character from '../behaviors/Character';
import Door from '../behaviors/Door';

const stage_ = Symbol('stage');
const entities_ = Symbol('entities');

function createDisplay(config) {
  const type = config.type || DISPLAY_TYPE.CONTAINER;
  let display;

  switch (type) {
    case DISPLAY_TYPE.SPRITE:
      display = Pixi.Sprite.from(config.texture);
      if (config.anchor) {
        display.anchor.x = config.anchor.x || 0;
        display.anchor.y = config.anchor.y || 0;
      }
      if (config.position) {
        display.position.x = config.position.x || 0;
        display.position.y = config.position.y || 0;
      }
      break;
    case DISPLAY_TYPE.CONTAINER:
      display = new Pixi.Container();
      break;
    default:
      break;
  }
  display.alpha = config.alpha || 1;

  return display;
}

function createBehaviorParam(param) {
  if (param.component === undefined) {
    return param;
  }

  switch (param.component) {
    case COMPONENT.DISPLAY:
      return createDisplay(param);
    default:
      // TODO Throw exception
      return null;
  }
}

// TODO Protect the passed in services
function createBehavior(config, services) {
  const params = {};

  if (config.params) {
    const paramKeys = Object.keys(config.params);
    paramKeys.forEach((paramKey) => {
      params[paramKey] = createBehaviorParam(config.params[paramKey]);
    });
  }

  // TODO Generalize process
  // TODO Watch our for when config.component is undefined
  //      (e.g. using a constant which isn't defined)
  switch (config.component) {
    case BEHAVIOR.CHARACTER:
      return new Character(params, services);
    case BEHAVIOR.DOOR:
      return new Door(params, services);
    default:
      // TODO Throw exception
      debugger;
      return null;
  }
}

export default class EntityManager {
  constructor(stage) {
    this[stage_] = stage;
    this[entities_] = [];
  }

  // TODO Update so created entities are queued to be added until between
  //      calls to engine update()
  createEntity(config) {
    const entity = {};

    // TODO If no display component is described,
    //      create container by default
    let display;
    if (config.display) {
      display = createDisplay(config.display);
      this[stage_].addChild(display);
      entity.display = display;
    }

    const services = {
      component: (componentId) => {
        switch (componentId) {
          case COMPONENT.DISPLAY:
            return display;
          default:
            return null;
        }
      },
    };
    entity.services = services;

    if (config.behaviors) {
      entity.behaviors = [];

      for (let i = 0; i < config.behaviors.length; i += 1) {
        const behavior = createBehavior(config.behaviors[i], services);
        entity.behaviors.push(behavior);
      }
    }

    this[entities_].push(entity);

    return entity;
  }

  clearEntities() {
    this[stage_].removeChildren();
    this[entities_] = [];
  }
}
