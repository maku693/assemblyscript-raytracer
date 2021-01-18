import { Material } from "./material";
import { Plane, Group, Shape, Sphere } from "./shape";
import { Vec3 } from "./vec3";
import { Camera } from "./camera";
import { Intersection } from "./intersection";
import { Ray } from "./ray";
import { Light } from "./light";

export function getImageData(): Uint8Array {
  const camera = new Camera(Vec3.back, Vec3.forward, 300, 150, 0.001, 0.028, 1);
  const shape = new Group([
    new Plane(
      Vec3.down,
      Vec3.up,
      new Material(new Vec3(0.5, 0.5, 0.5), 0, 1, Vec3.zero)
    ),
    new Sphere(
      Vec3.zero,
      0.1,
      new Material(new Vec3(1, 1, 1), 0, 1, Vec3.zero)
    ),
    new Sphere(
      Vec3.up,
      0.1,
      new Material(Vec3.zero, 0, 1, Vec3.scale(new Vec3(1, 1, 1), 10000))
    ),
  ]);

  return render(shape, camera, 5);
}

function render(shape: Shape, camera: Camera, depth: i32): Uint8Array {
  const traceProbability = 1 / depth;
  const data = new Uint8Array(camera.width * camera.height * 3);

  for (let y = 0; y < camera.height; y++) {
    for (let x = 0; x < camera.width; x++) {
      const intersections = new Array<Intersection>();

      const coordinate = {
        x: (x / camera.width) * 2 - 1,
        y: ((y / camera.height) * 2 - 1) * -1,
      };
      const initialRayDirection = Vec3.normalize(
        new Vec3(
          coordinate.x * camera.filmWidth,
          coordinate.y * camera.filmHeight,
          camera.focalLength
        )
      );

      let ray = new Ray(camera.position, initialRayDirection);
      while (true) {
        let intersection = shape.intersect(ray);
        if (!intersection) break;

        // Russian roulette
        if (Math.random() < traceProbability) break;

        // Sample based on material roughness
        let nextRayDirection: Vec3;
        if (Math.random() < intersection.material.roughness) {
          const randomDirection = Vec3.normalize(
            new Vec3(Math.random() * 2 - 1, 1, Math.random() * 2 - 1)
          );
          nextRayDirection = Vec3.project(randomDirection, intersection.normal);
        } else {
          nextRayDirection = Vec3.reflect(
            intersection.rayDirection,
            intersection.normal
          );
        }
        ray = new Ray(intersection.position, nextRayDirection);

        intersections.unshift(intersection);
      }

      if (intersections.length === 0) break;

      let light: Light | null;
      for (let i = 0; i < intersections.length; i++) {
        const intersection = intersections[i];
        const color = Vec3.scale(shade(intersection, null), depth);

        light = new Light(
          intersection.position,
          Vec3.scale(intersection.rayDirection, -1),
          color
        );
      }

      const color = light!.color;
      const di = (y * camera.width + x) * 3;
      data[di + 0] += u8(Math.pow(color.x, 1 / 2.2));
      data[di + 1] += u8(Math.pow(color.y, 1 / 2.2));
      data[di + 2] += u8(Math.pow(color.z, 1 / 2.2));
    }
  }

  return data;
}

function shade(intersection: Intersection, light: Light | null): Vec3 {
  if (light === null) {
    return Vec3.zero;
  }
  if (Vec3.equal(light.color, Vec3.zero)) {
    return Vec3.zero;
  }
  const material = intersection.material;

  const l = light.direction;
  const n = intersection.normal;
  const v = intersection.rayDirection;

  const nDotL = Vec3.dot(n, l);
  const diffuse = Vec3.scale(
    Vec3.mul(material.baseColor, Vec3.scale(light.color, nDotL)),
    1 / Math.PI
  );

  const h = Vec3.normalize(Vec3.add(l, v));
  const lightPower = Vec3.magnitude(light.color);
  const lightColor = Vec3.normalize(light.color);
  const distanceToLight = Vec3.sub(light.position, intersection.position);
  const m = 1 / (lightPower * Vec3.squareMagnitude(distanceToLight));
  const specColor = Vec3.add(
    Vec3.scale(material.baseColor, material.metalness),
    Vec3.scale(new Vec3(1, 1, 1), 1 - material.metalness)
  );
  const specular = Vec3.scale(
    Vec3.mul(Vec3.scale(specColor, Math.pow(Vec3.dot(h, v), m)), lightColor),
    (m + 2) / (Math.PI * 2)
  );

  const color = Vec3.add(
    Vec3.scale(diffuse, intersection.material.roughness),
    Vec3.scale(specular, 1 - intersection.material.roughness)
  );
  return Vec3.add(intersection.material.emission, color);
}
