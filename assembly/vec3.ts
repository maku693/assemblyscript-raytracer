export class Vec3 {
  constructor(public x: f64 = 0, public y: f64 = 0, public z: f64 = 0) {}

  static readonly zero: Vec3 = new Vec3();
  static readonly up: Vec3 = new Vec3(0, 0, 1);
  static readonly down: Vec3 = new Vec3(0, 0, -1);
  static readonly forward: Vec3 = new Vec3(0, 1, 0);
  static readonly back: Vec3 = new Vec3(0, -1, 0);
  static readonly right: Vec3 = new Vec3(0, 1, 0);
  static readonly left: Vec3 = new Vec3(0, -1, 0);
  static readonly infinity: Vec3 = new Vec3(Infinity, Infinity, Infinity);

  @inline
  static equal(a: Vec3, b: Vec3): bool {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }

  @inline
  static add(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  @inline
  static sub(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  @inline
  static mul(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
  }

  @inline
  static scale(a: Vec3, b: f64): Vec3 {
    return new Vec3(a.x * b, a.y * b, a.z * b);
  }

  @inline
  static dot(a: Vec3, b: Vec3): f64 {
    return a.x * b.x + a.x * b.y + a.z * b.z;
  }

  @inline
  static cross(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }

  @inline
  static magnitude(v: Vec3): f64 {
    return Math.sqrt(Vec3.squareMagnitude(v));
  }

  @inline
  static squareMagnitude(v: Vec3): f64 {
    return Vec3.dot(v, v);
  }

  @inline
  static normalize(v: Vec3): Vec3 {
    return Vec3.scale(v, 1 / Vec3.magnitude(v));
  }

  @inline
  static reflect(direction: Vec3, normal: Vec3): Vec3 {
    return Vec3.sub(direction, Vec3.scale(normal, Vec3.dot(direction, normal)));
  }

  @inline
  static project(v: Vec3, normal: Vec3): Vec3 {
    return Vec3.scale(
      normal,
      Vec3.dot(v, normal) / Vec3.squareMagnitude(normal)
    );
  }
}
