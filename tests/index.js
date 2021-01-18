const assert = require("assert");
const myModule = require("..");
assert.strictEqual(myModule.getImageData(), 3);
console.log("ok");
