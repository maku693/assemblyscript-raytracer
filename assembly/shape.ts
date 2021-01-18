import { Intersection } from "./intersection";
import { Material } from "./material";
import { Ray } from "./ray";
import { Vec3 } from "./vec3";

export interface Shape {
  intersect(ray: Ray): Intersection | null;
}

export class Group {
  constructor(readonly shapes: Shape[]) {}

  intersect(ray: Ray): Intersection | null {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const intersection = shape.intersect(ray);
      if (intersection) return intersection;
    }
    return null;
  }
}

export class Plane implements Shape {
  constructor(
    readonly position: Vec3,
    readonly normal: Vec3,
    readonly material: Material
  ) {}

  intersect(ray: Ray): Intersection | null {
    const dn = Vec3.dot(ray.direction, this.position);
    if (dn > 0) return null;

    const v = Vec3.sub(ray.origin, this.position);
    const vn = Vec3.dot(v, this.normal);
    const t = (vn / dn) * -1;
    if (t < 0) return null;

    const position = Vec3.add(ray.origin, Vec3.scale(ray.direction, t));

    return new Intersection(
      position,
      this.normal,
      ray.direction,
      this.material
    );
  }
}

export class Sphere implements Shape {
  constructor(
    readonly position: Vec3,
    readonly diameter: f32,
    readonly material: Material
  ) {}

  intersect(ray: Ray): Intersection | null {
    return null;
  }
}
