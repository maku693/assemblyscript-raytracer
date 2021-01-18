import { Vec3 } from "./vec3";

export class Material {
  constructor(
    readonly baseColor: Vec3,
    readonly metalness: f64,
    readonly roughness: f64,
    readonly emission: Vec3
  ) {}
}
