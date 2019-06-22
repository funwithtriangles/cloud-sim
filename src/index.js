import * as THREE from 'three'

import { scene, camera, composer, startAnimation } from './setup'
import { BloomEffect, OutlineEffect, EffectPass, BlendFunction } from 'postprocessing'

import { Cloud } from './Cloud'

// Scene
scene.background = new THREE.Color(0x5681cf)

const posLimit = 5
const randPos = () => Math.random() * posLimit - (posLimit / 2)
// Clouds
const numClouds = 1
const clouds = []

const group = new THREE.Group()
scene.add(group)

for (let i = 0; i < numClouds; i++) {
  const cloud = new Cloud()
  // cloud.root.position.set(randPos() * 2, randPos(), randPos() - posLimit / 2)

  group.add(cloud.root)
  clouds.push(cloud)
}

// light
const light0 = new THREE.DirectionalLight(0xffffff, 0.1)
light0.intensity = 0.3
light0.position.set(0, 1, 1)

scene.add(light0)

// Post processing
const bloomEffect = new BloomEffect({ distinction: 10 })
bloomEffect.blendMode.opacity.value = 0.8

const outlineEffect = new OutlineEffect(scene, camera, {
  blendFunction: BlendFunction.ALPHA,
  edgeStrength: 2.5,
  pulseSpeed: 0.0,
  visibleEdgeColor: 0x555555,
  // hiddenEdgeColor: 0xff0000,
  blur: false,
  xRay: true,
})

const puffMeshes = []

const updateOutlines = () => {
  clouds.forEach(cloud => {
    puffMeshes.push(...cloud.getPuffMeshes())
  })

  outlineEffect.setSelection(puffMeshes)
}

updateOutlines()

const effectPass = new EffectPass(camera, outlineEffect)
effectPass.renderToScreen = true

composer.addPass(effectPass)

setInterval(() => {
  clouds[0].destroy()
  clouds[0] = new Cloud()
  group.add(clouds[0].root)
  updateOutlines()
}, 3000)

// Animate
startAnimation((f, t) => {
  clouds.forEach(cloud => {
    cloud.update(f, t)

    // cloud.root.position.x -= 0.01

    // if (cloud.root.position.x < -posLimit) {
    //   cloud.root.position.set(posLimit, randPos(), randPos() - posLimit / 2)
    // }
  })

  // group.rotation.y += 0.008
})
