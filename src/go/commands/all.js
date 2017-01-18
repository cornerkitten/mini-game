
import * as RESOURCES from '../resources';
import CHANGE_SCENE from '../commands/ChangeSceneCommand';
import CREATE_ENTITY from '../commands/CreateEntityCommand';
import WALK from '../commands/WalkCommand';
import OPEN from '../commands/OpenCommand';

export default {
  [RESOURCES.COMMAND_ID.CHANGE_SCENE]: CHANGE_SCENE,
  [RESOURCES.COMMAND_ID.CREATE_ENTITY]: CREATE_ENTITY,
  [RESOURCES.COMMAND_ID.WALK]: WALK,
  [RESOURCES.COMMAND_ID.OPEN]: OPEN,
};