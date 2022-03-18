import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

// eslint-disable-next-line import/no-unresolved
import glbModel from '../models/boombox.glb?url';

import './style.scss';

const renderCanvas = <HTMLCanvasElement>document.getElementById('renderCanvas');

const main = async (canvas: HTMLCanvasElement) => {
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    Math.PI / 2,
    0,
    0.2,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.target = BABYLON.Vector3.Zero();
  camera.attachControl(true);
  camera.minZ = 0;

  const light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-1, -3, -1.5), scene);
  light.intensity = 1.0;

  const rootFolder = glbModel.split('/').slice(0, -1).join('/').concat('/');
  const fileName = glbModel.split('/').slice(-1)[0];

  BABYLON.SceneLoader.AppendAsync(rootFolder, fileName, scene)
    .then((results) => {
      console.log('model loaded');
      var root = results.meshes[0];
      root.name = '__xyz3__';
      root.id = '__xyz3__';
      root.rotation.y = Math.PI; // we're backwards in import

      root.position = new BABYLON.Vector3(0, 250, 0);
      //root.position.addInPlaceFromFloats(0, 1.6, 0);
    })
    .catch(console.error);

  await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: 'immersive-ar',
    },
  });

  engine.runRenderLoop(() => {
    scene.render();
  });
};

main(renderCanvas);
