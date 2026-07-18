import { R as REVISION, r as reactExports, C as Color, u as useFrame, A as AdditiveBlending, V as Vector3, S as Spherical, a as ShaderMaterial, j as jsxRuntimeExports, P as PlaneGeometry, M as MathUtils } from "./index-CCu5IWwU.js";
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
function GlassCluster() {
  const groupRef = reactExports.useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
      groupRef.current.rotation.z = time * 0.1;
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.1;
    }
  });
  const glassProps = {
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 1,
    thickness: 2
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { ref: groupRef, position: [0, 0, 0], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [-1.2, 0.2, 0], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("icosahedronGeometry", { args: [0.7, 0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meshPhysicalMaterial", { ...glassProps, color: "#00ffa6" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [1.2, -0.2, 0.5], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [0.5, 16, 16] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meshPhysicalMaterial", { ...glassProps, color: "#ffffff" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 0.3, 1], rotation: [Math.PI / 4, Math.PI / 4, 0], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("torusGeometry", { args: [0.4, 0.15, 16, 32] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meshPhysicalMaterial", { ...glassProps, color: "#5b00ff" })
    ] })
  ] });
}
function CyberpunkEarth() {
  const earthRef = reactExports.useRef();
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 1e-3;
      earthRef.current.rotation.x += 5e-4;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { ref: earthRef, position: [10, -5, -20], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [15, 32, 32] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "meshBasicMaterial",
      {
        color: "#5b00ff",
        wireframe: true
      }
    )
  ] });
}
function WireframeTerrain() {
  const [scrollProgress, setScrollProgress] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      setScrollProgress(scrollY / maxScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  const geometry = reactExports.useMemo(() => new PlaneGeometry(80, 80, 40, 40), []);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = Math.sin(x * 0.2 + time) * 0.4 + Math.cos(y * 0.2 + time * 0.8) * 0.4;
      positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, MathUtils.lerp(0, -1.5, scrollProgress), 0.1);
    state.camera.position.z = MathUtils.lerp(state.camera.position.z, MathUtils.lerp(5, 2.5, scrollProgress), 0.1);
    state.camera.rotation.x = MathUtils.lerp(state.camera.rotation.x, MathUtils.lerp(0, 0.2, scrollProgress), 0.1);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "mesh",
    {
      geometry,
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, -2, -5],
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshBasicMaterial",
        {
          color: "#1dbf73",
          wireframe: true
        }
      )
    }
  );
}
function Scene() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("fog", { attach: "fog", args: ["#000000", 5, 35] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stars, { radius: 100, depth: 50, count: 3e3, factor: 4, saturation: 0, fade: true, speed: 1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ambientLight", { intensity: 0.4 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("directionalLight", { position: [5, 10, 5], intensity: 1.5, color: "#ffffff" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("directionalLight", { position: [-5, -5, -5], intensity: 2, color: "#00ffa6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CyberpunkEarth, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCluster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WireframeTerrain, {})
  ] });
}
export {
  Scene as default
};
