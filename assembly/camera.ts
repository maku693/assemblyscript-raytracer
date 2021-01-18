import { Vec3 } from "./vec3";

export class Camera {
  constructor(
    readonly position: Vec3,
    readonly direction: Vec3,
    readonly width: i32,
    readonly height: i32,
    readonly dotsPerUnit: f32,
    readonly focalLength: f32,
    readonly exposure: f32
  ) {
    this.filmWidth = this.width * this.dotsPerUnit;
    this.filmHeight = this.height * this.dotsPerUnit;
  }

  readonly filmWidth: f32;
  readonly filmHeight: f32;
}
