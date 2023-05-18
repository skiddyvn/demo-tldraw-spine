import { SpineCanvas } from "@esotericsoftware/spine-player";
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
} from "@esotericsoftware/spine-webgl";

export class Train implements SpineCanvasApp {
  skeleton: Skeleton | null;
  animationState: AnimationState | null;
  draggableBones: Bone[];
  draggedBone: Bone | null;
  selectedBone: Bone | null;
  selectedSkins: string[] = [];
  skeletonData: SkeletonData | null;
  offset: Vector2 | null = null;
  bounds: Vector2 | null = null;
  playTime = 0;

  cardWidth: number = 0;
  cardHeight: number = 0;
  listCards: number[] = [];

  selectedVocab = "";

  callback: (idx: number) => void;

  constructor({ callback }) {
    this.skeleton = null;
    this.skeletonCarriage = null;
    this.animationState = null;
    this.draggableBones = [];
    this.draggedBone = null;
    this.selectedBone = null;
    this.skeletonData = null;
    this.callback = callback;
  }

  loadAssets(canvas: SpineCanvas) {
    canvas.assetManager.loadJson("/spines/bitutrain/skeleton.json");
    canvas.assetManager.loadTextureAtlas(
      "/spines/bitutrain/skeleton.atlas.txt"
    );
  }

  loadSkeleton(assetManager: AssetManager) {
    var atlas = assetManager.require("/spines/bitutrain/skeleton.atlas.txt");
    var atlasLoader = new AtlasAttachmentLoader(atlas);
    var skeletonJson = new SkeletonJson(atlasLoader);
    skeletonJson.scale = 0.75;
    this.skeletonData = skeletonJson.readSkeletonData(
      assetManager.require("/spines/bitutrain/skeleton.json")
    );
    this.skeleton = new Skeleton(this.skeletonData);

    this.offset = new Vector2();
    this.bounds = new Vector2();
    this.skeleton.getBounds(this.offset, this.bounds, []);
  }

  startAnimation() {
    if (!this.animationState) return;
    this.animationState.setAnimation(0, "animation", true);
  }

  initialize(canvas: SpineCanvas) {
    let assetManager = canvas.assetManager;
    this.loadSkeleton(assetManager);

    this.cardWidth = 80;
    this.cardHeight = this.skeleton?.data.height / 2;

    for (let i of [2, 3, 4, 5, 6]) {
      this.listCards.push(100 * i);
    }

    this.skeleton.x =
      document.querySelector("#bitu")?.clientWidth * (-1 / 2) - 200;
    this.skeleton.y = -120;

    var animationStateData = new AnimationStateData(this.skeletonData);
    animationStateData.defaultMix = 0.1;
    this.animationState = new AnimationState(animationStateData);
    this.startAnimation();

    // Find the bones that should be draggable
    let interactiveBoneNames = [];
    for (let boneName of interactiveBoneNames) {
      let bone = this.skeleton.findBone(boneName);
      if (bone == null) throw Error("Couldn't find bone " + boneName);
      this.draggableBones.push(bone);
    }

    canvas.input.addListener({
      down: (x: number | undefined, y: number | undefined) => {
        // Calculate the mouse position in the coordinate space of the camera, aka world space.
        // The skeleton and its bones live in the same coordinate space.
        let mousePosition = new Vector3(x, y);
        canvas.renderer.camera.screenToWorld(
          mousePosition,
          canvas.htmlCanvas.clientWidth,
          canvas.htmlCanvas.clientHeight
        );

        for (let i = 0; i < this.listCards.length; i++) {
          const card = this.listCards[i];
          if (
            mousePosition.distance(
              new Vector3(
                this.skeleton.x - card + this.cardWidth / 2,
                this.skeleton.y + 15 + this.cardHeight / 2,
                0
              )
            ) < 20
          ) {
            this.selectedVocab = `card_${i}`;
            return;
          }
        }

        this.selectedVocab = "";

        // Find the first bone within a radius of 20 pixels to the mouse position
        this.selectedBone = null;
        for (let bone of this.draggableBones) {
          if (
            mousePosition.distance(new Vector3(bone.worldX, bone.worldY, 0)) <
            20
          ) {
            this.selectedBone = bone;
            break;
          }
        }
      },

      up: (x, y) => {
        if (this.selectedVocab) {
          if (this.callback) {
            this.callback(this.selectedVocab);
          }
        }
        if (this.selectedBone && this.selectedBone.data.name.match(/^(card)/)) {
          if (this.callback) {
            this.callback(this.selectedBone.data.name);
          }
        }
        this.selectedBone = null;
      },
    });
  }

  update(canvas: any, delta: any) {
    this.animationState?.update(delta);
    if (this.skeleton) {
      this.animationState?.apply(this.skeleton);

      if (
        this.skeleton.x <
        document.querySelector("#bitu")?.clientWidth / 2 - 200
      ) {
        this.skeleton.x += delta * 200;
      }
    }
    this.skeleton?.updateWorldTransform();
  }

  render(canvas: SpineCanvas) {
    let renderer = canvas.renderer;

    renderer.camera.position.x = 0;
    renderer.camera.position.y = 0;

    renderer.resize(ResizeMode.Expand);
    canvas.clear(0, 0, 0, 0);

    renderer.begin();
    renderer.drawSkeleton(this.skeleton, true);

    // Draw a circle with a radius of 20 pixels around each draggable bone
    let boneColor = new Color(1, 0, 0, 0.5);
    let selectedBoneColor = new Color(0, 1, 0, 0.5);
    for (let bone of this.draggableBones) {
      // renderer.circle(
      //   true,
      //   bone.worldX,
      //   bone.worldY,
      //   20,
      //   bone == this.selectedBone ? selectedBoneColor : boneColor
      // );
    }

    const yDistance = 15;
    for (let xDistance of this.listCards) {
      renderer.rect(
        true,
        this.skeleton?.x - xDistance,
        this.skeleton?.y + yDistance,
        this.cardWidth,
        this.cardHeight,
        Color.WHITE
      );
    }

    renderer.end();
  }

  addSkin(skinName) {
    this.skeleton.setSkinByName(skinName);
    this.skeleton.setToSetupPose();
    this.skeleton.updateWorldTransform();

    // Calculate the bounds so we can center and zoom
    // the camera such that the skeleton is in full view.
    let offset = new Vector2(),
      size = new Vector2();
    this.skeleton.getBounds(offset, size);
  }
}
