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
  Shader,
} from "@esotericsoftware/spine-webgl";

export class Kien implements SpineCanvasApp {
  skeleton: Skeleton | null;
  skeletonCarriage: Skeleton | null;
  animationState: AnimationState | null;
  draggableBones: Bone[];
  draggedBone: Bone | null;
  selectedBone: Bone | null;
  selectedSkins: string[] = [];
  skeletonData: SkeletonData | null;
  offset: Vector2 | null = null;
  bounds: Vector2 | null = null;
  playTime = 0;
  shader: Shader | null = null;

  callback: (idx: number) => void;

  ants: Skeleton[] = [];

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
    canvas.assetManager.loadJson("/spines/kien/skeleton.json");
    canvas.assetManager.loadTextureAtlas("/spines/kien/skeleton.atlas.txt");
  }

  loadSkeleton(assetManager: AssetManager) {
    var atlas = assetManager.require("/spines/kien/skeleton.atlas.txt");
    var atlasLoader = new AtlasAttachmentLoader(atlas);
    var skeletonJson = new SkeletonJson(atlasLoader);
    skeletonJson.scale = 0.075;
    this.skeletonData = skeletonJson.readSkeletonData(
      assetManager.require("/spines/kien/skeleton.json")
    );
    this.skeleton = new Skeleton(this.skeletonData);

    this.offset = new Vector2();
    this.bounds = new Vector2();
    this.skeleton.getBounds(this.offset, this.bounds, []);

    for (let i = 0; i <= 5; i++) {
      const skel = new Skeleton(this.skeletonData);
      skel.getBounds(this.offset, this.bounds, []);
      if (i === 1) {
        // skel.setAttachment('default', 'ong_nhom')
      }
      this.ants.push(skel);
    }
  }

  startAnimation() {
    if (!this.animationState) return;
    this.animationState.addAnimation(0, "kien1", false);
    this.animationState.addAnimation(0, "kien1_move", true);
    this.animationState.addAnimation(0, "kien1_touch", false, 4);
    this.animationState.addAnimation(0, "kien1", true);

    // this.animationState.addAnimation(0, "kien2", false);
    // this.animationState.addAnimation(0, "kien2_move", true);
    // this.animationState.addAnimation(0, "kien2_touch", false, 4);
    // this.animationState.addAnimation(0, "kien2", true, 5);

    // this.animationState.addAnimation(0, "kien3", false);
    // this.animationState.addAnimation(0, "kien3_move", true);
    // this.animationState.addAnimation(0, "kien3_touch", false, 4);
    // this.animationState.addAnimation(0, "kien3", true, 5);

    // this.animationState.addAnimation(0, "kien4", false);
    // this.animationState.addAnimation(0, "kien4_move", true);
    // this.animationState.addAnimation(0, "kien4_touch", false, 4);
    // this.animationState.addAnimation(0, "kien4", true, 5);

    // this.animationState.addAnimation(0, "kien5", false);
    // this.animationState.addAnimation(0, "kien5_move", true);
    // this.animationState.addAnimation(0, "kien5_touch", false, 4);
    // this.animationState.addAnimation(0, "kien5", true, 5);

    // this.animationState.addAnimation(0, "kien6", false);
    // this.animationState.addAnimation(0, "kien6_move", true);
    // this.animationState.addAnimation(0, "kien6_touch", false, 4);
    // this.animationState.addAnimation(0, "kien6", true, 5);
  }

  initialize(canvas: SpineCanvas) {
    let assetManager = canvas.assetManager;
    this.loadSkeleton(assetManager);

    var animationStateData = new AnimationStateData(this.skeletonData);
    this.animationState = new AnimationState(animationStateData);
    this.startAnimation();
  }

  update(canvas: any, delta: any) {
    this.animationState?.update(delta);
    if (this.skeleton) this.animationState?.apply(this.skeleton);
    this.skeleton?.updateWorldTransform();

    this.ants.forEach((ant, index, arr) => {
      if (ant) this.animationState?.apply(ant);
      ant?.updateWorldTransform();
      ant.x -= delta * 200;
    });
  }

  render(canvas: SpineCanvas) {
    let renderer = canvas.renderer;

    renderer.resize(ResizeMode.Expand);
    canvas.clear(0, 0, 0, 0);

    renderer.begin();
    // if (this.skeleton) renderer.drawSkeleton(this.skeleton, true);

    this.ants.forEach((ant, index, arr) => {
      ant.x = 20 * index;
      renderer.drawSkeleton(ant, true);
    });

    // renderer.camera.position.x = -renderer.camera.viewportWidth;
    renderer.camera.position.y = renderer.camera.viewportHeight / 2;

    // Draw a circle with a radius of 20 pixels around each draggable bone
    // let boneColor = new Color(1, 0, 0, 0.5);
    // let selectedBoneColor = new Color(0, 1, 0, 0.5);
    // for (let bone of this.draggableBones) {
    //   renderer.circle(
    //     true,
    //     bone.worldX,
    //     bone.worldY,
    //     20,
    //     bone == this.selectedBone ? selectedBoneColor : boneColor
    //   );
    // }

    renderer.end();
  }
}
