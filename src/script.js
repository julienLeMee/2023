import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

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
        size: 0.5, // taille du texte
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
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
