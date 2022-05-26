import { VirtualEnvironment } from '../../../js/VirtualEnvironment.js';

// start by creating a basic virtual environment
let virtualEnvironment = new VirtualEnvironment();

// fill your world with the stuff you want
init();
function init() {
    virtualEnvironment.loadTerrain('../../../resources/terrains/baseTemplate.fbx', 0, 0, 0, "fbx")
    virtualEnvironment.spawnPlayer('../../../resources/avatars/yBot.glb', 0, 0, 0)
}

// then start the animation
animate();
function animate() {
    virtualEnvironment.update();
    requestAnimationFrame(animate);
}
