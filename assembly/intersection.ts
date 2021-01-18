import { Material } from "./material";
import { Vec3 } from "./vec3";

export class Intersection {
  constructor(
    readonly position: Vec3,
    readonly normal: Vec3,
    readonly rayDirection: Vec3,
    readonly material: Material
  ) {}
}
