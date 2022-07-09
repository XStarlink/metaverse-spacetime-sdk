import { Object3D, Scene, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, MeshBVHVisualizer } from '../util/three-mesh-bvh.js';
import { TerrainGenerator } from './TerrainGenerator.js';

export class TerrainController {
    
    constructor(manager){
        this.FBXLoader = new FBXLoader(manager);
        this.GLTFLoader = new GLTFLoader(manager);
        this.terrain = new Object3D();
        this.collider;
        this.bloomScene = new Scene();
        this.geometries = [];
        
    }

    generateTerrain(seed) {
        this.terrainGenerator = new TerrainGenerator(seed);
        this.terrain = this.terrainGenerator.generateTerrain();
    }

    loadTerrain(URL, scene, x, y, z, format, scaleFactor){
        switch (format) {
            case "fbx":
                this.FBXLoader.load(URL, (responseObject) => {
                    this.handleLoadedTerrain(responseObject, scene, x, y, z, scaleFactor);
                })
                break;
        
            case "glb":
                this.GLTFLoader.load(URL, (responseObject) => {
                    this.handleLoadedTerrain(responseObject.scene, scene, x, y, z, scaleFactor);
                })
                break;
        }
    }

    handleLoadedTerrain(terrain, scene, x, y, z, scaleFactor) {
        this.terrain = terrain;
        this.terrain.position.set(x, y, z);
        this.terrain.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.terrain.traverse(object => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.roughness = 1;
                if (object.material.map) {
                    object.material.map.anisotropy = 16;
                    object.material.map.needsUpdate = true;
                }
                const cloned = new Mesh(object.geometry, object.material);
                object.getWorldPosition(cloned.position);
                if (object.material.emissive && (object.material.emissive.r > 0 || object.material.emissive.g > 0 || object.material.color.b > 0)) {
                    this.bloomScene.attach(cloned);
                }
            }
            if (object.isLight) {
                object.parent.remove(object);
            }
        });

        scene.add(this.terrain);
        this.generateCollider(scene);
        MAIN_SCENE.buildInteractives();
    }

    generateCollider(scene){
        this.terrain.traverse(object => {
            if (object.geometry && object.visible) {
                const cloned = object.geometry.clone();
                cloned.applyMatrix4(object.matrixWorld);
                for (const key in cloned.attributes) {
                    if (key !== 'position') { cloned.deleteAttribute(key); }
                }
                this.geometries.push(cloned);
            }
        });
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(this.geometries, false);
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, { lazyGeneration: false });
        this.collider = new Mesh(mergedGeometry);
        this.collider.bvh = mergedGeometry.boundsTree;
        this.collider.material.wireframe = true;
        this.collider.material.opacity = 0.5;
        this.collider.material.transparent = true;
        this.collider.visible = false; // toggle this value to see the collider
        scene.add(this.collider);

        /* The following lines of code are used to debug the BVH collider. 
         * Uncomment these lines to visualize the BVH collider. 
         * More information on Bounding Volume Hierarchy (BVH):
         * https://en.wikipedia.org/wiki/Bounding_volume_hierarchy
        */
       
        // const visualizer = new MeshBVHVisualizer(this.collider, 10);
        // visualizer.visible = true;
        // visualizer.update();
        // scene.add(visualizer);
    }

    toggleViewCollider() {
        this.collider.visible = !this.collider.visible;
    }

    newSolidGeometriesFromSource(scene, url, x, y, z, scaleFactor) {
        this.GLTFLoader.load(url, (responseObject) => {
            setTimeout(() => {   
                responseObject.scene.scale.set(scaleFactor, scaleFactor, scaleFactor)
                responseObject.scene.position.set(x,y,z)
                scene.add(responseObject.scene)
    
                responseObject.scene.traverse((object) => {
                    if(object.geometry && object.visible && object.position) {
                        const cloned = object.geometry.clone();
                        cloned.scale(scaleFactor, scaleFactor, scaleFactor)
                        cloned.translate(x, y ,z)
                        object.updateMatrixWorld();
                        cloned.applyMatrix4(object.matrixWorld);
                        for (const key in cloned.attributes) {
                            if (key !== 'position') { cloned.deleteAttribute(key); }
                        }
                        
                        this.geometries.push(cloned);
                    }
                })
                
                this.generateCollider(scene)
            }, 2000);
        })
    }
}