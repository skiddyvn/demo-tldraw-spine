import { SpineCanvas } from '@esotericsoftware/spine-player'
/* eslint-disable no-var */
/* eslint-disable prefer-const */
import {
  Skeleton,
  AnimationState,
  Bone,
  AtlasAttachmentLoader,
  SkeletonBinary,
  AnimationStateData,
  Vector3,
  Vector2,
  ResizeMode,
  Color,
  SpineCanvasApp,
  SkeletonJson,
  Skin,
  SkeletonData,
  AssetManager,
} from '@esotericsoftware/spine-webgl'

export class Bitu implements SpineCanvasApp {
  skeleton: Skeleton | null
  animationState: AnimationState | null
  draggableBones: Bone[]
  draggedBone: Bone | null
  selectedBone: Bone | null
  selectedSkins: string[] = []
  skeletonData: SkeletonData | null
  offset: Vector2 | null = null
  bounds: Vector2 | null = null
  playTime = 0

  callback: (idx: number) => void

  constructor({ callback }) {
    this.skeleton = null
    this.animationState = null
    this.draggableBones = []
    this.draggedBone = null
    this.selectedBone = null
    this.skeletonData = null
    this.callback = callback
  }

  loadAssets(canvas: SpineCanvas) {
    canvas.assetManager.loadJson('/spines/bitu/skeleton.json')
    canvas.assetManager.loadTextureAtlas('/spines/bitu/skeleton.atlas.txt')
  }

  loadSkeleton(assetManager: AssetManager) {
    var atlas = assetManager.require('/spines/bitu/skeleton.atlas.txt')
    var atlasLoader = new AtlasAttachmentLoader(atlas)
    var skeletonJson = new SkeletonJson(atlasLoader)
    skeletonJson.scale = 0.34
    this.skeletonData = skeletonJson.readSkeletonData(
      assetManager.require('/spines/bitu/skeleton.json')
    )
    this.skeleton = new Skeleton(this.skeletonData)

		this.offset = new Vector2();
		this.bounds = new Vector2();
		this.skeleton.getBounds(this.offset, this.bounds, []);

    let mixAndMatchSkin = new Skin('custom-bitu')
    if (this.skeletonData) {
      mixAndMatchSkin.addSkin(this.skeletonData.findSkin('skin2'))
    }
    this.skeleton.setSkin(mixAndMatchSkin)
  }

  startAnimation() {
    if (!this.animationState) return
    this.animationState.addAnimation(0, 'RUN_START', false)
    this.animationState.addAnimation(0, 'RUN', true)
    this.animationState.addAnimation(0, 'RUN_END', false, 3)
    this.animationState.addAnimation(0, 'IDLE', true)
    this.animationState.addAnimation(0, 'LEVEL UP_WITH_EFFECT_START', false)
    this.animationState.addAnimation(0, 'LEVEL UP_WITH_EFFECT', false)
    this.animationState.addAnimation(0, 'LEVEL UP_WITH_EFFECT_END', false)
    this.animationState.addAnimation(0, 'IDLE', true)
    this.animationState.addAnimation(0, 'RUN', true)
  }

  initialize(canvas: SpineCanvas) {
    let assetManager = canvas.assetManager
    this.loadSkeleton(assetManager)

    var animationStateData = new AnimationStateData(this.skeletonData)
    animationStateData.defaultMix = 0.1
    animationStateData.setMix('RUN_START', 'RUN', 0.2)
    animationStateData.setMix('RUN', 'RUN_END', 0.4)
    animationStateData.setMix('LEVEL UP_WITH_EFFECT_START', 'LEVEL UP_WITH_EFFECT', 0.2)
    animationStateData.setMix('LEVEL UP_WITH_EFFECT', 'LEVEL UP_WITH_EFFECT_END', 0.4)
    this.animationState = new AnimationState(animationStateData)
    this.startAnimation()

    // Find the bones that should be draggable
    let interactiveBoneNames = []
    for (let boneName of interactiveBoneNames) {
      let bone = this.skeleton.findBone(boneName)
      if (bone == null) throw Error("Couldn't find bone " + boneName)
      this.draggableBones.push(bone)
    }

    canvas.input.addListener({
      down: (x: number | undefined, y: number | undefined) => {
        // Calculate the mouse position in the coordinate space of the camera, aka world space.
        // The skeleton and its bones live in the same coordinate space.
        let mousePosition = new Vector3(x, y)
        canvas.renderer.camera.screenToWorld(
          mousePosition,
          canvas.htmlCanvas.clientWidth,
          canvas.htmlCanvas.clientHeight
        )

        // Find the first bone within a radius of 20 pixels to the mouse position
        this.selectedBone = null
        for (let bone of this.draggableBones) {
          if (mousePosition.distance(new Vector3(bone.worldX, bone.worldY, 0)) < 20) {
            this.selectedBone = bone
            break
          }
        }
      },

      up: (x, y) => {
        if (this.selectedBone && this.selectedBone.data.name.match(/^(wheel-midRoot)\d/)) {
          if (this.callback) {
            this.callback(
              +this.selectedBone.data.name.charAt(this.selectedBone.data.name.length - 1)
            )
          }
        }
        this.selectedBone = null
      },

      dragged: (x, y) => {
        // If no bone was selected, bail.
        if (this.selectedBone == null) return

        // Calculate the mouse position in the coordinate space of the camera, aka world space.
        // The skeleton and its bones live in this coordinate space.
        let mousePosition = new Vector3(x, y)
        canvas.renderer.camera.screenToWorld(
          mousePosition,
          canvas.htmlCanvas.clientWidth,
          canvas.htmlCanvas.clientHeight
        )

        if (this.selectedBone.parent != null) {
          // If the bone to be dragged has a parent, transform the mouse world position to
          // the parent bone's coordinate system, and set the bone's position accordingly.
          let position = new Vector2(mousePosition.x, mousePosition.y)
          this.selectedBone.parent.worldToLocal(position)
          this.selectedBone.x = position.x
          this.selectedBone.y = position.y
        } else {
          // If the dragged bone has no parent, it's the root bone and we can simply set its
          // position to the mouse world position.
          this.selectedBone.x = mousePosition.x
          this.selectedBone.y = mousePosition.y
        }
      },
    })
  }

  update(canvas: any, delta: any) {
    this.animationState?.update(delta)
    if (this.skeleton) this.animationState?.apply(this.skeleton)
    this.skeleton?.updateWorldTransform()
  }

  render(canvas: SpineCanvas) {
    let renderer = canvas.renderer    

    renderer.camera.position.x = 0;
    renderer.camera.position.y = 300;

    renderer.resize(ResizeMode.Expand)
    canvas.clear(0, 0, 0, 0)

    renderer.begin()
    renderer.drawSkeleton(this.skeleton, true)

    // Draw a circle with a radius of 20 pixels around each draggable bone
    let boneColor = new Color(1, 0, 0, 0.5)
    let selectedBoneColor = new Color(0, 1, 0, 0.5)
    for (let bone of this.draggableBones) {
      renderer.circle(
        true,
        bone.worldX,
        bone.worldY,
        20,
        bone == this.selectedBone ? selectedBoneColor : boneColor
      )
    }

    renderer.end()
  }

  addSkin(skinName) {
    this.skeleton.setSkinByName(skinName)
    this.skeleton.setToSetupPose()
    this.skeleton.updateWorldTransform()

    // Calculate the bounds so we can center and zoom
    // the camera such that the skeleton is in full view.
    let offset = new Vector2(),
      size = new Vector2()
    this.skeleton.getBounds(offset, size)
  }
}
