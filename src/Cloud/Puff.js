import * as THREE from 'three'

const mat = new THREE.MeshToonMaterial({
  color: 0xffffff,
  flatShading: true,
  emissive: 0xababab,
})

const geom = new THREE.IcosahedronBufferGeometry(1, 1)

const posNeg = () => Math.random() > 0.5 ? 1 : -1

export class Puff {
  constructor ({ position = new THREE.Vector3(0, 0, 0), posFactor = 1, scaleFactor = 1, doesDissolve = false }) {
    this.scaleFactor = scaleFactor
    this.posFactor = posFactor
    this.doesDissolve = doesDissolve
    this.originalPos = new THREE.Vector3()
    this.position = position

    this.mesh = new THREE.Mesh(geom, mat)

    this.posGroup = new THREE.Group()
    this.posGroup.add(this.mesh)

    this.root = new THREE.Group()
    this.root.add(this.posGroup)

    this.scaleSeed = Math.random() * Math.PI * 2
    this.posYSeed = Math.random() * Math.PI * 2

    this.rejig()
  }

  rejig () {
    const ranPos = () => (Math.random() * 0.1 + 0.2) * posNeg() * this.posFactor
    const ranScl = () => (Math.random() * 0.4 + 0.4) * this.scaleFactor

    this.root.position.copy(this.position)

    this.posGroup.position.set(0, 0, 0)

    const newPos = new THREE.Vector3(ranPos() * 2, ranPos() + 0.1, ranPos() * 2)
    this.root.position.add(newPos)

    this.mesh.scale.set(ranScl(), ranScl(), ranScl())
    this.nextSc = 0
  }

  update (f, t) {
    let sc = Math.sin(t + this.scaleSeed) * 0.7

    if (this.doesDissolve) {
      this.posGroup.position.x += 0.002
      this.posGroup.position.y += 0.0005
      if (sc < 0) {
        this.rejig()
        this.scaleSeed += Math.PI
      }
    } else {
      sc = sc * 0.1 + 0.9 * this.scaleFactor
      this.posGroup.position.y = Math.sin(t + this.posYSeed) * 0.1
    }

    this.posGroup.scale.set(sc, sc, sc)
  }
}
