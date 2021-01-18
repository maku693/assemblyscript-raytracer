import { Vec3 } from "./vec3";

export class Light {
  constructor(
    readonly position: Vec3,
    readonly direction: Vec3,
    readonly color: Vec3
  ) {}
}
