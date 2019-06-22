import * as THREE from 'three'
import { Puff } from './Puff'
// const mat = new THREE.MeshPhongMaterial({
//   color: 0xffffff,
//   flatShading: true,
//   emissive: 0xcccccc,
//   wireframe: false,
// })

export class Cloud {
  constructor () {
    this.root = new THREE.Group()
    this.numPuffs = 10

    this.puffs = []

    const ranPos = () => Math.random() * 0.5 - 0.25

    for (let i = 0; i < this.numPuffs; i++) {
      const rootPuff = new Puff({
        position: new THREE.Vector3(ranPos() * 3, ranPos(), ranPos() * 2),
      })
      this.root.add(rootPuff.root)
      this.recursivePuffs(rootPuff)

      this.puffs.push(rootPuff)
    }
  }

  recursivePuffs (puff) {
    this.recursivePuff(4, puff)
  }

  recursivePuff (step, prevPuff = new Puff({})) {
    const posFactor = prevPuff.posFactor * 0.75
    const scaleFactor = prevPuff.scaleFactor * 0.7
    const position = prevPuff.root.position
    const doesDissolve = step <= 1
    const puff = new Puff({ position, posFactor, scaleFactor, doesDissolve })
    this.root.add(puff.root)

    this.puffs.push(puff)

    step--

    if (step > -1) {
      const numPuffs = Math.floor(Math.random() * 3) + 1

      for (let i = 0; i < numPuffs; i++) {
        this.recursivePuff(step, puff)
      }
    }
  }

  getPuffMeshes () {
    return this.puffs.map(p => p.mesh)
  }

  destroy () {
    this.root.visible = false
  }

  update (f, t) {
    this.puffs.forEach(puff => {
      puff.update(f, t)
    })
  }
}
