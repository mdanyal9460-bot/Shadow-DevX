import { V as Vector2, a as Vector3, Q as Quaternion, M as Matrix4, S as Spherical, b as Vector4, C as Color, E as Euler, u as useThree, r as reactExports, c as useFrame, d as useLoader, T as TextureLoader, e as Texture, R as REVISION, A as AdditiveBlending, f as ShaderMaterial, j as jsxRuntimeExports, B as BackSide, g as MathUtils } from "./index-BY-C1cvz.js";
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
new Vector2();
new Vector2();
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function repeat(t, length) {
  return clamp(t - Math.floor(t / length) * length, 0, length);
}
function deltaAngle(current, target) {
  var delta = repeat(target - current, Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  return delta;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var Grad = function Grad2(x, y, z) {
  var _this = this;
  _classCallCheck(this, Grad2);
  _defineProperty(this, "dot2", function(x2, y2) {
    return _this.x * x2 + _this.y * y2;
  });
  _defineProperty(this, "dot3", function(x2, y2, z2) {
    return _this.x * x2 + _this.y * y2 + _this.z * z2;
  });
  this.x = x;
  this.y = y;
  this.z = z;
};
var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0), new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1), new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
var p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
var perm = new Array(512);
var gradP = new Array(512);
var seed = function seed2(_seed) {
  if (_seed > 0 && _seed < 1) {
    _seed *= 65536;
  }
  _seed = Math.floor(_seed);
  if (_seed < 256) {
    _seed |= _seed << 8;
  }
  for (var i = 0; i < 256; i++) {
    var v;
    if (i & 1) {
      v = p[i] ^ _seed & 255;
    } else {
      v = p[i] ^ _seed >> 8 & 255;
    }
    perm[i] = perm[i + 256] = v;
    gradP[i] = gradP[i + 256] = grad3[v % 12];
  }
};
seed(0);
function normalizeSeed(seed3) {
  if (typeof seed3 === "number") {
    seed3 = Math.abs(seed3);
  } else if (typeof seed3 === "string") {
    var string = seed3;
    seed3 = 0;
    for (var i = 0; i < string.length; i++) {
      seed3 = (seed3 + (i + 1) * (string.charCodeAt(i) % 96)) % 2147483647;
    }
  }
  if (seed3 === 0) {
    seed3 = 311;
  }
  return seed3;
}
function lcgRandom(seed3) {
  var state = normalizeSeed(seed3);
  return function() {
    var result = state * 48271 % 2147483647;
    state = result;
    return result / 2147483647;
  };
}
var Generator = function Generator2(_seed) {
  var _this = this;
  _classCallCheck(this, Generator2);
  _defineProperty(this, "seed", 0);
  _defineProperty(this, "init", function(seed3) {
    _this.seed = seed3;
    _this.value = lcgRandom(seed3);
  });
  _defineProperty(this, "value", lcgRandom(this.seed));
  this.init(_seed);
};
new Generator(Math.random());
var rsqw = function rsqw2(t) {
  var delta = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0.01;
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  var f = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1 / (2 * Math.PI);
  return a / Math.atan(1 / delta) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
};
var exp = function exp2(t) {
  return 1 / (1 + t + 0.48 * t * t + 0.235 * t * t * t);
};
var linear = function linear2(t) {
  return t;
};
var sine = {
  "in": function _in(x) {
    return 1 - Math.cos(x * Math.PI / 2);
  },
  out: function out(x) {
    return Math.sin(x * Math.PI / 2);
  },
  inOut: function inOut(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }
};
var cubic = {
  "in": function _in2(x) {
    return x * x * x;
  },
  out: function out2(x) {
    return 1 - Math.pow(1 - x, 3);
  },
  inOut: function inOut2(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
};
var quint = {
  "in": function _in3(x) {
    return x * x * x * x * x;
  },
  out: function out3(x) {
    return 1 - Math.pow(1 - x, 5);
  },
  inOut: function inOut3(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }
};
var circ = {
  "in": function _in4(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  },
  out: function out4(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  },
  inOut: function inOut4(x) {
    return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }
};
var quart = {
  "in": function _in5(t) {
    return t * t * t * t;
  },
  out: function out5(t) {
    return 1 - --t * t * t * t;
  },
  inOut: function inOut5(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  }
};
var expo = {
  "in": function _in6(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  },
  out: function out6(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  },
  inOut: function inOut6(x) {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  }
};
function damp(current, prop, target) {
  var smoothTime = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0.25;
  var delta = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0.01;
  var maxSpeed = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : Infinity;
  var easing2 = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : exp;
  var eps = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : 1e-3;
  var vel = "velocity_" + prop;
  if (current.__damp === void 0) current.__damp = {};
  if (current.__damp[vel] === void 0) current.__damp[vel] = 0;
  if (Math.abs(current[prop] - target) <= eps) {
    current[prop] = target;
    return false;
  }
  smoothTime = Math.max(1e-4, smoothTime);
  var omega = 2 / smoothTime;
  var t = easing2(omega * delta);
  var change = current[prop] - target;
  var originalTo = target;
  var maxChange = maxSpeed * smoothTime;
  change = Math.min(Math.max(change, -maxChange), maxChange);
  target = current[prop] - change;
  var temp = (current.__damp[vel] + omega * change) * delta;
  current.__damp[vel] = (current.__damp[vel] - omega * temp) * t;
  var output = target + (change + temp) * t;
  if (originalTo - current[prop] > 0 === output > originalTo) {
    output = originalTo;
    current.__damp[vel] = (output - originalTo) / delta;
  }
  current[prop] = output;
  return true;
}
var isCamera = function isCamera2(v) {
  return v && v.isCamera;
};
var isLight = function isLight2(v) {
  return v && v.isLight;
};
var vl3d = /* @__PURE__ */ new Vector3();
var _q1 = /* @__PURE__ */ new Quaternion();
var _q2 = /* @__PURE__ */ new Quaternion();
var _m1 = /* @__PURE__ */ new Matrix4();
var _position = /* @__PURE__ */ new Vector3();
function dampLookAt(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (typeof target === "number") vl3d.setScalar(target);
  else if (Array.isArray(target)) vl3d.set(target[0], target[1], target[2]);
  else vl3d.copy(target);
  var parent = current.parent;
  current.updateWorldMatrix(true, false);
  _position.setFromMatrixPosition(current.matrixWorld);
  if (isCamera(current) || isLight(current)) _m1.lookAt(_position, vl3d, current.up);
  else _m1.lookAt(vl3d, _position, current.up);
  dampQ(current.quaternion, _q2.setFromRotationMatrix(_m1), smoothTime, delta, maxSpeed, easing2, eps);
  if (parent) {
    _m1.extractRotation(parent.matrixWorld);
    _q1.setFromRotationMatrix(_m1);
    dampQ(current.quaternion, _q2.copy(current.quaternion).premultiply(_q1.invert()), smoothTime, delta, maxSpeed, easing2, eps);
  }
}
function dampAngle(current, prop, target, smoothTime, delta, maxSpeed, easing2, eps) {
  return damp(current, prop, current[prop] + deltaAngle(current[prop], target), smoothTime, delta, maxSpeed, easing2, eps);
}
var v2d = /* @__PURE__ */ new Vector2();
var a2, b2;
function damp2(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (typeof target === "number") v2d.setScalar(target);
  else if (Array.isArray(target)) v2d.set(target[0], target[1]);
  else v2d.copy(target);
  a2 = damp(current, "x", v2d.x, smoothTime, delta, maxSpeed, easing2, eps);
  b2 = damp(current, "y", v2d.y, smoothTime, delta, maxSpeed, easing2, eps);
  return a2 || b2;
}
var v3d = /* @__PURE__ */ new Vector3();
var a3, b3, c3;
function damp3(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (typeof target === "number") v3d.setScalar(target);
  else if (Array.isArray(target)) v3d.set(target[0], target[1], target[2]);
  else v3d.copy(target);
  a3 = damp(current, "x", v3d.x, smoothTime, delta, maxSpeed, easing2, eps);
  b3 = damp(current, "y", v3d.y, smoothTime, delta, maxSpeed, easing2, eps);
  c3 = damp(current, "z", v3d.z, smoothTime, delta, maxSpeed, easing2, eps);
  return a3 || b3 || c3;
}
var v4d = /* @__PURE__ */ new Vector4();
var a4, b4, c4, d4;
function damp4(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (typeof target === "number") v4d.setScalar(target);
  else if (Array.isArray(target)) v4d.set(target[0], target[1], target[2], target[3]);
  else v4d.copy(target);
  a4 = damp(current, "x", v4d.x, smoothTime, delta, maxSpeed, easing2, eps);
  b4 = damp(current, "y", v4d.y, smoothTime, delta, maxSpeed, easing2, eps);
  c4 = damp(current, "z", v4d.z, smoothTime, delta, maxSpeed, easing2, eps);
  d4 = damp(current, "w", v4d.w, smoothTime, delta, maxSpeed, easing2, eps);
  return a4 || b4 || c4 || d4;
}
var rot = /* @__PURE__ */ new Euler();
var aE, bE, cE;
function dampE(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (Array.isArray(target)) rot.set(target[0], target[1], target[2], target[3]);
  else rot.copy(target);
  aE = dampAngle(current, "x", rot.x, smoothTime, delta, maxSpeed, easing2, eps);
  bE = dampAngle(current, "y", rot.y, smoothTime, delta, maxSpeed, easing2, eps);
  cE = dampAngle(current, "z", rot.z, smoothTime, delta, maxSpeed, easing2, eps);
  return aE || bE || cE;
}
var col = /* @__PURE__ */ new Color();
var aC, bC, cC;
function dampC(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (target instanceof Color) col.copy(target);
  else if (Array.isArray(target)) col.setRGB(target[0], target[1], target[2]);
  else col.set(target);
  aC = damp(current, "r", col.r, smoothTime, delta, maxSpeed, easing2, eps);
  bC = damp(current, "g", col.g, smoothTime, delta, maxSpeed, easing2, eps);
  cC = damp(current, "b", col.b, smoothTime, delta, maxSpeed, easing2, eps);
  return aC || bC || cC;
}
var qt = /* @__PURE__ */ new Quaternion();
var v4result = /* @__PURE__ */ new Vector4();
var v4velocity = /* @__PURE__ */ new Vector4();
var v4error = /* @__PURE__ */ new Vector4();
var aQ, bQ, cQ, dQ;
function dampQ(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  var cur = current;
  if (Array.isArray(target)) qt.set(target[0], target[1], target[2], target[3]);
  else qt.copy(target);
  var multi = current.dot(qt) > 0 ? 1 : -1;
  qt.x *= multi;
  qt.y *= multi;
  qt.z *= multi;
  qt.w *= multi;
  aQ = damp(current, "x", qt.x, smoothTime, delta, maxSpeed, easing2, eps);
  bQ = damp(current, "y", qt.y, smoothTime, delta, maxSpeed, easing2, eps);
  cQ = damp(current, "z", qt.z, smoothTime, delta, maxSpeed, easing2, eps);
  dQ = damp(current, "w", qt.w, smoothTime, delta, maxSpeed, easing2, eps);
  v4result.set(current.x, current.y, current.z, current.w).normalize();
  v4velocity.set(cur.__damp.velocity_x, cur.__damp.velocity_y, cur.__damp.velocity_z, cur.__damp.velocity_w);
  v4error.copy(v4result).multiplyScalar(v4velocity.dot(v4result) / v4result.dot(v4result));
  cur.__damp.velocity_x -= v4error.x;
  cur.__damp.velocity_y -= v4error.y;
  cur.__damp.velocity_z -= v4error.z;
  cur.__damp.velocity_w -= v4error.w;
  current.set(v4result.x, v4result.y, v4result.z, v4result.w);
  return aQ || bQ || cQ || dQ;
}
var spherical = /* @__PURE__ */ new Spherical();
var aS, bS, cS;
function dampS(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  if (Array.isArray(target)) spherical.set(target[0], target[1], target[2]);
  else spherical.copy(target);
  aS = damp(current, "radius", spherical.radius, smoothTime, delta, maxSpeed, easing2, eps);
  bS = dampAngle(current, "phi", spherical.phi, smoothTime, delta, maxSpeed, easing2, eps);
  cS = dampAngle(current, "theta", spherical.theta, smoothTime, delta, maxSpeed, easing2, eps);
  return aS || bS || cS;
}
var mat = /* @__PURE__ */ new Matrix4();
var mPos = /* @__PURE__ */ new Vector3();
var mRot = /* @__PURE__ */ new Quaternion();
var mSca = /* @__PURE__ */ new Vector3();
var aM, bM, cM;
function dampM(current, target, smoothTime, delta, maxSpeed, easing2, eps) {
  var cur = current;
  if (cur.__damp === void 0) {
    cur.__damp = {
      position: new Vector3(),
      rotation: new Quaternion(),
      scale: new Vector3()
    };
    current.decompose(cur.__damp.position, cur.__damp.rotation, cur.__damp.scale);
  }
  if (Array.isArray(target)) mat.set.apply(mat, _toConsumableArray(target));
  else mat.copy(target);
  mat.decompose(mPos, mRot, mSca);
  aM = damp3(cur.__damp.position, mPos, smoothTime, delta, maxSpeed, easing2, eps);
  bM = dampQ(cur.__damp.rotation, mRot, smoothTime, delta, maxSpeed, easing2, eps);
  cM = damp3(cur.__damp.scale, mSca, smoothTime, delta, maxSpeed, easing2, eps);
  current.compose(cur.__damp.position, cur.__damp.rotation, cur.__damp.scale);
  return aM || bM || cM;
}
var easing = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  rsqw,
  exp,
  linear,
  sine,
  cubic,
  quint,
  circ,
  quart,
  expo,
  damp,
  dampLookAt,
  dampAngle,
  damp2,
  damp3,
  damp4,
  dampE,
  dampC,
  dampQ,
  dampS,
  dampM
});
const context = /* @__PURE__ */ reactExports.createContext(null);
function useScroll() {
  return reactExports.useContext(context);
}
function ScrollControls({
  eps = 1e-5,
  enabled = true,
  infinite,
  horizontal,
  pages = 1,
  distance = 1,
  damping = 0.25,
  maxSpeed = Infinity,
  prepend = false,
  style = {},
  children
}) {
  const {
    get,
    setEvents,
    gl,
    size,
    invalidate,
    events
  } = useThree();
  const [el] = reactExports.useState(() => document.createElement("div"));
  const [fill] = reactExports.useState(() => document.createElement("div"));
  const [fixed] = reactExports.useState(() => document.createElement("div"));
  const target = gl.domElement.parentNode;
  const scroll = reactExports.useRef(0);
  const state = reactExports.useMemo(() => {
    const state2 = {
      el,
      eps,
      fill,
      fixed,
      horizontal,
      damping,
      offset: 0,
      delta: 0,
      scroll,
      pages,
      // 0-1 for a range between from -> from + distance
      range(from, distance2, margin = 0) {
        const start = from - margin;
        const end = start + distance2 + margin * 2;
        return this.offset < start ? 0 : this.offset > end ? 1 : (this.offset - start) / (end - start);
      },
      // 0-1-0 for a range between from -> from + distance
      curve(from, distance2, margin = 0) {
        return Math.sin(this.range(from, distance2, margin) * Math.PI);
      },
      // true/false for a range between from -> from + distance
      visible(from, distance2, margin = 0) {
        const start = from - margin;
        const end = start + distance2 + margin * 2;
        return this.offset >= start && this.offset <= end;
      }
    };
    return state2;
  }, [eps, damping, horizontal, pages]);
  reactExports.useEffect(() => {
    el.style.position = "absolute";
    el.style.width = "100%";
    el.style.height = "100%";
    el.style[horizontal ? "overflowX" : "overflowY"] = "auto";
    el.style[horizontal ? "overflowY" : "overflowX"] = "hidden";
    el.style.top = "0px";
    el.style.left = "0px";
    for (const key in style) {
      el.style[key] = style[key];
    }
    fixed.style.position = "sticky";
    fixed.style.top = "0px";
    fixed.style.left = "0px";
    fixed.style.width = "100%";
    fixed.style.height = "100%";
    fixed.style.overflow = "hidden";
    el.appendChild(fixed);
    fill.style.height = horizontal ? "100%" : `${pages * distance * 100}%`;
    fill.style.width = horizontal ? `${pages * distance * 100}%` : "100%";
    fill.style.pointerEvents = "none";
    el.appendChild(fill);
    if (prepend) target.prepend(el);
    else target.appendChild(el);
    el[horizontal ? "scrollLeft" : "scrollTop"] = 1;
    const oldTarget = events.connected || gl.domElement;
    requestAnimationFrame(() => events.connect == null ? void 0 : events.connect(el));
    const oldCompute = get().events.compute;
    setEvents({
      compute(event, state2) {
        const {
          left,
          top
        } = target.getBoundingClientRect();
        const offsetX = event.clientX - left;
        const offsetY = event.clientY - top;
        state2.pointer.set(offsetX / state2.size.width * 2 - 1, -(offsetY / state2.size.height) * 2 + 1);
        state2.raycaster.setFromCamera(state2.pointer, state2.camera);
      }
    });
    return () => {
      target.removeChild(el);
      setEvents({
        compute: oldCompute
      });
      events.connect == null || events.connect(oldTarget);
    };
  }, [pages, distance, horizontal, el, fill, fixed, target]);
  reactExports.useEffect(() => {
    if (events.connected === el) {
      const containerLength = size[horizontal ? "width" : "height"];
      const scrollLength = el[horizontal ? "scrollWidth" : "scrollHeight"];
      const scrollThreshold = scrollLength - containerLength;
      let current = 0;
      let disableScroll = true;
      let firstRun = true;
      const onScroll = () => {
        if (!enabled || firstRun) return;
        invalidate();
        current = el[horizontal ? "scrollLeft" : "scrollTop"];
        scroll.current = current / scrollThreshold;
        if (infinite) {
          if (!disableScroll) {
            if (current >= scrollThreshold) {
              const damp5 = 1 - state.offset;
              el[horizontal ? "scrollLeft" : "scrollTop"] = 1;
              scroll.current = state.offset = -damp5;
              disableScroll = true;
            } else if (current <= 0) {
              const damp5 = 1 + state.offset;
              el[horizontal ? "scrollLeft" : "scrollTop"] = scrollLength;
              scroll.current = state.offset = damp5;
              disableScroll = true;
            }
          }
          if (disableScroll) setTimeout(() => disableScroll = false, 40);
        }
      };
      el.addEventListener("scroll", onScroll, {
        passive: true
      });
      requestAnimationFrame(() => firstRun = false);
      const onWheel = (e) => el.scrollLeft += e.deltaY / 2;
      if (horizontal) el.addEventListener("wheel", onWheel, {
        passive: true
      });
      return () => {
        el.removeEventListener("scroll", onScroll);
        if (horizontal) el.removeEventListener("wheel", onWheel);
      };
    }
  }, [el, events, size, infinite, state, invalidate, horizontal, enabled]);
  let last = 0;
  useFrame((_, delta) => {
    last = state.offset;
    easing.damp(state, "offset", scroll.current, damping, delta, maxSpeed, void 0, eps);
    easing.damp(state, "delta", Math.abs(last - state.offset), damping, delta, maxSpeed, void 0, eps);
    if (state.delta > eps) invalidate();
  });
  return /* @__PURE__ */ reactExports.createElement(context.Provider, {
    value: state
  }, children);
}
const IsObject = (url) => url === Object(url) && !Array.isArray(url) && typeof url !== "function";
function useTexture(input, onLoad) {
  const gl = useThree((state) => state.gl);
  const textures = useLoader(TextureLoader, IsObject(input) ? Object.values(input) : input);
  reactExports.useLayoutEffect(() => {
    onLoad == null || onLoad(textures);
  }, [onLoad]);
  reactExports.useEffect(() => {
    if ("initTexture" in gl) {
      let textureArray = [];
      if (Array.isArray(textures)) {
        textureArray = textures;
      } else if (textures instanceof Texture) {
        textureArray = [textures];
      } else if (IsObject(textures)) {
        textureArray = Object.values(textures);
      }
      textureArray.forEach((texture) => {
        if (texture instanceof Texture) {
          gl.initTexture(texture);
        }
      });
    }
  }, [gl, textures]);
  const mappedTextures = reactExports.useMemo(() => {
    if (IsObject(input)) {
      const keyed = {};
      let i = 0;
      for (const key in input) keyed[key] = textures[i++];
      return keyed;
    } else {
      return textures;
    }
  }, [input, textures]);
  return mappedTextures;
}
useTexture.preload = (url) => useLoader.preload(TextureLoader, url);
useTexture.clear = (input) => useLoader.clear(TextureLoader, input);
const getVersion = () => parseInt(REVISION.replace(/\D+/g, ""));
const version = /* @__PURE__ */ getVersion();
class StarfieldMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: {
          value: 0
        },
        fade: {
          value: 1
        }
      },
      vertexShader: (
        /* glsl */
        `
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`
      ),
      fragmentShader: (
        /* glsl */
        `
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${version >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
      }`
      )
    });
  }
}
const genStar = (r) => {
  return new Vector3().setFromSpherical(new Spherical(r, Math.acos(1 - Math.random() * 2), Math.random() * 2 * Math.PI));
};
const Stars = /* @__PURE__ */ reactExports.forwardRef(({
  radius = 100,
  depth = 50,
  count = 5e3,
  saturation = 0,
  factor = 4,
  fade = false,
  speed = 1
}, ref) => {
  const material = reactExports.useRef();
  const [position, color, size] = reactExports.useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = Array.from({
      length: count
    }, () => (0.5 + 0.5 * Math.random()) * factor);
    const color2 = new Color();
    let r = radius + depth;
    const increment = depth / count;
    for (let i = 0; i < count; i++) {
      r -= increment * Math.random();
      positions.push(...genStar(r).toArray());
      color2.setHSL(i / count, saturation, 0.9);
      colors.push(color2.r, color2.g, color2.b);
    }
    return [new Float32Array(positions), new Float32Array(colors), new Float32Array(sizes)];
  }, [count, depth, factor, radius, saturation]);
  useFrame((state) => material.current && (material.current.uniforms.time.value = state.clock.elapsedTime * speed));
  const [starfieldMaterial] = reactExports.useState(() => new StarfieldMaterial());
  return /* @__PURE__ */ reactExports.createElement("points", {
    ref
  }, /* @__PURE__ */ reactExports.createElement("bufferGeometry", null, /* @__PURE__ */ reactExports.createElement("bufferAttribute", {
    attach: "attributes-position",
    args: [position, 3]
  }), /* @__PURE__ */ reactExports.createElement("bufferAttribute", {
    attach: "attributes-color",
    args: [color, 3]
  }), /* @__PURE__ */ reactExports.createElement("bufferAttribute", {
    attach: "attributes-size",
    args: [size, 1]
  })), /* @__PURE__ */ reactExports.createElement("primitive", {
    ref: material,
    object: starfieldMaterial,
    attach: "material",
    blending: AdditiveBlending,
    "uniforms-fade-value": fade,
    depthWrite: false,
    transparent: true,
    vertexColors: true
  }));
});
function GalaxyBackground() {
  const texture = useTexture("/textures/milky_way.jpg");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [100, 64, 64] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meshBasicMaterial", { map: texture, side: BackSide })
  ] });
}
function CameraRig() {
  const scroll = useScroll();
  useFrame((state) => {
    const startZ = 15;
    const endZ = 5;
    state.camera.position.z = MathUtils.lerp(startZ, endZ, scroll.offset);
    state.camera.position.x = 0;
    state.camera.position.y = 0;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}
function PhotorealisticEarth() {
  const groupRef = reactExports.useRef(null);
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    "/textures/earth_day.jpg",
    "/textures/earth_normal.jpg",
    "/textures/earth_specular.jpg",
    "/textures/earth_clouds.jpg"
  ]);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { ref: groupRef, position: [0, 0, 0], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [2, 64, 64] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          map: colorMap,
          normalMap,
          roughnessMap: specularMap,
          roughness: 0.8,
          metalness: 0.1
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [2.02, 64, 64] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          map: cloudsMap,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
          blending: AdditiveBlending
        }
      )
    ] })
  ] });
}
function Scene() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stars, { radius: 150, depth: 50, count: 1e4, factor: 6, saturation: 0, fade: true, speed: 1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ambientLight", { intensity: 1.5 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "directionalLight",
      {
        position: [5, 3, 5],
        intensity: 2.5,
        color: "#ffffff"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(GalaxyBackground, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollControls, { pages: 3, damping: 0.25, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CameraRig, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhotorealisticEarth, {}) })
    ] })
  ] });
}
export {
  Scene as default
};
