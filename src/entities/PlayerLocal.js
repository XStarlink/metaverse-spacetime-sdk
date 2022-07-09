import { CapsuleEntity } from "./CapsuleEntity.js";
import { PointerLockControls } from '../util/PointerLockControls.js'; // most recent version does not support pointerSpeedY
import { Vector3, Vector4, Matrix4, Raycaster } from 'three';
import { AvatarController } from './AvatarController.js';

const UP_VECTOR = new Vector3(0, 1, 0);

class PlayerLocal extends CapsuleEntity {
    constructor(params, controlObject, loadingManager) {
        super(0.25, 1.5);
        this.spawnPoint = typeof params.spawn === "undefined" ? {x: 0, y:0, z:0} : params.spawn;
        this.position.x = this.spawnPoint.x;
        this.position.y = this.spawnPoint.y;
        this.position.z = this.spawnPoint.z;


        this.controlObject = controlObject;
        this.fpsControls = new Vector4(0.01, Math.PI - 0.01, 0.01, 1);
        this.thirdPersonControls = new Vector4(Math.PI / 3, Math.PI / 2 - 0.01, 5, 0.2);
        this.controlVector = this.thirdPersonControls.clone();
        this.targetControlVector = this.thirdPersonControls;
        this.horizontalVelocity = new Vector3();
        this.playerDirection = new Vector3();
        this.positionChange = new Vector3();
        this.keys = {};

        this.visible = false;
        this.isRunning = false;
        
        this.avatarController = new AvatarController(loadingManager);
        this.avatarController.spawnAvatar(params);
        this.setupControls(this.controlObject);
    }

    setupControls() {
        this.controls = new PointerLockControls(this.controlObject, document.body);
        this.controls.sensitivityY = -0.002;
        this.controls.minPolarAngle = 0.01; 
        this.controls.maxPolarAngle = Math.PI - 0.25;
        MAIN_SCENE.add(this.controls.getObject());

        document.addEventListener('keyup', (event) => {
            delete this.keys[event.key.toLowerCase()];
        });
        document.addEventListener('keydown', (event) => {
            if(this.controls.isLocked) {
                if (event.key === "v") {
                    if (this.targetControlVector === this.thirdPersonControls) {
                        this.targetControlVector = this.fpsControls;
                        this.avatarController.setTransparency(true);
                    } else {
                        this.targetControlVector = this.thirdPersonControls;
                        this.avatarController.setTransparency(false);
                    }
                }
                if (event.key === "r") {
                    this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
                    this.velocity = new Vector3();
                }
                if (event.keyCode === 32 && event.target === document.body) {
                    event.preventDefault();
                }
                this.keys[event.key.toLowerCase()] = true;
            }
        });

        this.controls.addEventListener('unlock', () => {
            VIRTUAL_ENVIRONMENT.UI_CONTROLLER.handleControlsUnlock()
        });
    }
    
    getForwardVector() {
        this.controlObject.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }
    
    getSideVector() {
        this.controlObject.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(UP_VECTOR);
        this.playerDirection.multiplyScalar(-1);
        return this.playerDirection;
    }

    update(delta, collider) {

        if(Object.keys(this.keys).length > 0){
            // speedFactor depending on the run/walk state
            
            if(this.keys["shift"]) {
                this.isRunning = true;
            }
            this.speedFactor = this.isRunning ? 0.15 : 0.05;

            if (this.keys["w"]) {
                this.horizontalVelocity.add(this.getForwardVector(this.controlObject).multiplyScalar(this.speedFactor * delta));
            }

            if (this.keys["s"]) {
                this.horizontalVelocity.add(this.getForwardVector(this.controlObject).multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["a"]) {
                this.horizontalVelocity.add(this.getSideVector(this.controlObject).multiplyScalar(-this.speedFactor * delta));
            }

            if (this.keys["d"]) {
                this.horizontalVelocity.add(this.getSideVector(this.controlObject).multiplyScalar(this.speedFactor * delta));
            }
            if (this.keys[" "] && this.canJump) {
                this.velocity.y = 10.0;
                this.setAnimationParameters("jump", 0);
            }
        } else {
            this.isRunning = false;
            this.horizontalVelocity.multiplyScalar(0);
        }

        
        for(let i=0; i<5; i++){
            super.update(delta/5, collider);
        }
       

        if (this.position.y < -20) {
            this.position.set(this.spawnPoint.x, this.spawnPoint.y, this.spawnPoint.z);
            this.velocity = new Vector3();
        }

        this.updateCurrentAnimation()
        if(typeof this.avatarController !== "undefined"){
            this.avatarController.update(delta, this.position, this.horizontalVelocity, this.currentAnimation, this.currentAnimationTime);
        }

        this.controlVector.lerp(this.targetControlVector, 0.1);
    }

    updateCurrentAnimation() {
        if (this.lastPosition) {
            this.positionChange.multiplyScalar(0.8);
            this.positionChange.addScaledVector(this.position.clone().sub(this.lastPosition), 0.2);
        }
        this.lastPosition = this.position.clone();

        if(this.onGround) {
            if (this.keys["w"] || this.keys["s"] || this.keys["a"] || this.keys["d"]) {
                if(this.isRunning){ 
                    this.setAnimationParameters("run"); 
                } else { 
                    this.setAnimationParameters("walk"); 
                }
            } else {
                this.setAnimationParameters("idle");
            }
        } else {
            if(this.positionChange.y < -3) {
                this.setAnimationParameters("fall", 0.25);
            }
        }
    }

    setAnimationParameters(anim, time = 0.5) {
        this.currentAnimation = anim;
        this.currentAnimationTime = time;
    }
}

export { PlayerLocal }