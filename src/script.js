import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()

const matCapTexture = textureLoader.load('/textures/matcaps/8.png')
const matCapTexture2 = textureLoader.load('/textures/matcaps/9.png')
const matCapTexture3 = textureLoader.load('/textures/matcaps/10.png')
const matCapTexture4 = textureLoader.load('/textures/matcaps/11.png')


// Fonts
const fontLoader = new FontLoader()
fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      '2023',
      {
        font: font,
        size: 0.3, // taille du texte
        height: 0.2, // épaisseur du texte
        curveSegments: 16, // nombre de segments de courbe
        bevelEnabled: true, // activer le bevel
        bevelThickness: 0.03, // épaisseur du bevel
        bevelSize: 0.02, // taille du bevel
        bevelOffset: 0, // décalage du bevel
        bevelSegments: 8 // nombre de segments de bevel
        // le bevel est une sorte de bordure
      }
    )


    textGeometry.center()

    // Material
    const material = new THREE.MeshMatcapMaterial({
      matcap: matCapTexture4
    })


    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)
  }
)

// Bubbles
const bubbleGeometry = new THREE.SphereGeometry(0.1, 32, 32)
const bubbleMaterial = new THREE.MeshMatcapMaterial({
  matcap: matCapTexture,
  transparent: true, // rendre le matériau transparent
  opacity: 0.8,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending
})

// creer des baloons qui vont en boucle de haut en bas de l'ecran comme des bulles de savon
const bubbleCount = 50
const bubbles = new THREE.Group()
for (let i = 0; i < bubbleCount; i++) {
  const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial)
  bubble.position.x = (Math.random() - 0.5) * 1.5
  bubble.position.y = - (Math.random() * 1.5)
  bubble.position.z = (Math.random() - 0.5) * 1.5
  bubbles.add(bubble)
}
scene.add(bubbles)

// champagne glass
const glassGeometry = new THREE.CylinderGeometry(1.1, 1.1, 5, 32, 1, true) // rayon du haut, rayon du bas, hauteur, nombre de segments, nombre de segments de hauteur, ouverture du verre
const glassMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture2 })
const glass = new THREE.Mesh(glassGeometry, glassMaterial)
glass.position.y = -0.5
scene.add(glass)

const glassFootGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32)
const glassFootMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture3 })
const glassFoot = new THREE.Mesh(glassFootGeometry, glassFootMaterial)
glassFoot.position.y = -5
scene.add(glassFoot)

// socle du verre
const glassDiskGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.1, 32)
const glassDiskMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture3 })
const glassDisk = new THREE.Mesh(glassDiskGeometry, glassDiskMaterial)
glassDisk.position.y = -7.5
scene.add(glassDisk)

/**
 * Table
 */
const tableGeometry = new THREE.BoxGeometry(150, 0.1, 150) // largeur, hauteur, profondeur
const tableMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture3 })
const table = new THREE.Mesh(tableGeometry, tableMaterial)
table.position.y = -7.6
scene.add(table)

/**
 * Fog
 */
const fog = new THREE.Fog('#262837', 15, 40)
scene.fog = fog

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.minDistance = 1
controls.maxDistance = 15

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Animate
 */
const clock = new THREE.Clock()

// recuperer la position de la souris sur l'ecran
let mouseX = 0 // position de la souris sur l'axe x
let mouseY = 0 // position de la souris sur l'axe y
window.addEventListener('mousemove', e => {
  mouseX = e.clientX // récupère la position de la souris sur l'axe x
  mouseY = e.clientY // récupère la position de la souris sur l'axe y

  mouseX = Math.max(-1, Math.min(1, mouseX / sizes.width * 2 - 1))
  mouseY = Math.max(-1, Math.min(1, -mouseY / sizes.height * 2 + 1))
})

// recuperer la position du doigt sur l'ecran
let touchX = 0 // position du doigt sur l'axe x
let touchY = 0 // position du doigt sur l'axe y
window.addEventListener('touchmove', e => {
  touchX = e.touches[0].clientX // récupère la position du doigt sur l'axe x
  touchY = e.touches[0].clientY // récupère la position du doigt sur l'axe y
})

const btn = document.querySelector('button')

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    camera.position.x = mouseX * 0.3
    camera.position.y = mouseY * 0.3

    // faire bouger les baloons
    bubbles.children.forEach(bubble => {
      bubble.position.y += 0.001

      if (bubble.position.y > 1.5) {
        bubble.position.y = -1.5
      }
    })

    // se rapprocher lentement du verre quand on clique sur le bouton
    btn.addEventListener('click', () => {
      camera.position.z = 1
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
