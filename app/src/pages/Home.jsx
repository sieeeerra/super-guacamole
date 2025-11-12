// Home - hero 섹션과 WebGL 효과
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Footer from '../components/Footer.jsx';

// WebGL 효과를 위한 셰이더 코드
const vertexShader = `void main() {
    gl_Position = vec4(position, 1.0);
  }
  `

const fragmentShader = `
  uniform vec2 uResolution;
  uniform vec4 uMouse;
  uniform float uTime;
  
  const float PIXEL_SIZE = 4.0; // Size of each pixel in the Bayer matrix
  const float CELL_PIXEL_SIZE = 8.0 * PIXEL_SIZE; // 8x8 Bayer matrix
  
  
  
  
  // Bayer 8×8 dithering shader with **direction‑free** fBm animation
  // The noise mutates in‑place (no visible drift) by sampling 3‑D value noise
  // where time is treated as the third dimension.
  
  out vec4 fragColor;
  
  
  // ─────────────────────────────────────────────────────────────
  // Bayer matrix helpers (ordered dithering thresholds)
  // ─────────────────────────────────────────────────────────────
  float Bayer2(vec2 a) {
      a = floor(a);
      return fract(a.x / 2. + a.y * a.y * .75);
  }
  
  #define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
  #define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))
  
  
  #define FBM_OCTAVES     5
  #define FBM_LACUNARITY  1.25
  #define FBM_GAIN        1.
  #define FBM_SCALE       4.0          // master scale for uv
  
  /*-------------------------------------------------------------
    1-D hash and 3-D value-noise helpers (unchanged)
  -------------------------------------------------------------*/
  float hash11(float n) { return fract(sin(n)*43758.5453); }
  
  float vnoise(vec3 p)
  {
      vec3 ip = floor(p);
      vec3 fp = fract(p);
  
      float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
      float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
      float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
      float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
      float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
      float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
      float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
      float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  
      vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);   // smootherstep
  
      float x00 = mix(n000, n100, w.x);
      float x10 = mix(n010, n110, w.x);
      float x01 = mix(n001, n101, w.x);
      float x11 = mix(n011, n111, w.x);
  
      float y0  = mix(x00, x10, w.y);
      float y1  = mix(x01, x11, w.y);
  
      return mix(y0, y1, w.z) * 2.0 - 1.0;         // [-1,1]
  }
  
  /*-------------------------------------------------------------
    Stable fBm – no default args, loop fully static
  -------------------------------------------------------------*/
  float fbm2(vec2 uv, float t)
  {
      vec3 p   = vec3(uv * FBM_SCALE, t);
      float amp  = 1.;
      float freq = 1.;
      float sum  = 1.;
  
      for (int i = 0; i < FBM_OCTAVES; ++i)
      {
          sum  += amp * vnoise(p * freq);
          freq *= FBM_LACUNARITY;
          amp  *= FBM_GAIN;
      }
      
      return sum * 0.5 + 0.5;   // [0,1]
  }
  
  
  
  
  
  void main() {
  
      float pixelSize = PIXEL_SIZE; // Size of each pixel in the Bayer matri
      vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  
      // Calculate the UV coordinates for the grid
      float aspectRatio = uResolution.x / uResolution.y;
  
      vec2 pixelId = floor(fragCoord / pixelSize); // integer Bayer cell
      vec2 pixelUV = fract(fragCoord / pixelSize); 
  
      float cellPixelSize =  8. * pixelSize; // 8x8 Bayer matrix
      vec2 cellId = floor(fragCoord / cellPixelSize); // integer Bayer cell
      
      vec2 cellCoord = cellId * cellPixelSize;
      
      
      vec2 uv = ((cellCoord / (uResolution) )) * vec2(aspectRatio, 1.0);
  
      float feed = fbm2(uv, uTime * 0.1);
          
      float brightness = -.65;
      float contrast = .5;
      feed = feed * contrast + brightness; // Apply contrast and brightness adjustments
  
  
      float bayerValue = Bayer8(fragCoord / pixelSize) - .5;
      
  
      float bw = step(0.5, feed + bayerValue);
      
      fragColor = vec4(vec3(bw), 1.0);
      
  }
  `

// 새로운 WebGL 효과를 위한 셰이더 코드
const vertexShader2 = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader2 = `
  uniform vec2 uResolution;
  uniform float uTime;
  
  out vec4 fragColor;
  
  // 간단한 노이즈 함수
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;
    
    // 간단한 웨이브 패턴
    float wave1 = sin(st.x * 10.0 + uTime * 2.0) * 0.5 + 0.5;
    float wave2 = sin(st.y * 8.0 + uTime * 1.5) * 0.5 + 0.5;
    float wave3 = sin((st.x + st.y) * 6.0 + uTime * 3.0) * 0.5 + 0.5;
    
    // 노이즈 추가
    float noiseValue = noise(st * 4.0 + uTime * 0.5);
    
    // 색상 조합
    vec3 color1 = vec3(0.1, 0.3, 0.8); // 파란색
    vec3 color2 = vec3(0.8, 0.2, 0.4); // 빨간색
    vec3 color3 = vec3(0.2, 0.8, 0.3); // 초록색
    
    vec3 finalColor = mix(color1, color2, wave1);
    finalColor = mix(finalColor, color3, wave2 * 0.5);
    finalColor = mix(finalColor, vec3(1.0), noiseValue * 0.3);
    
    // 투명도 조절
    float alpha = 0.6 + noiseValue * 0.4;
    
    fragColor = vec4(finalColor, alpha);
  }
`

// WebGL 초기화 및 렌더링 설정
function initWebGLEffect(canvas) {
  if (!canvas) return;

  // Use WebGL 2 so the fragment shader can stay `#version 300 es`
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.warn('WebGL2 not supported, falling back to WebGL');
    const fallbackGl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!fallbackGl) {
      console.error('WebGL not supported');
      return;
    }
  }

  const renderer = new THREE.WebGLRenderer({ canvas, context: gl });

  // ---------- scene & camera ----------
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // ---------- uniforms ----------
  const uniforms = {
    uResolution: { value: new THREE.Vector2() },
    uTime: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms,
    glslVersion: THREE.GLSL3
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  // ---------- resize ----------
  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);   // `false` = don't clear canvas
    uniforms.uResolution.value.set(width, height);
  }
  window.addEventListener('resize', resize);
  resize();   // initial size

  // ---------- render loop ----------
  const clock = new THREE.Clock();

  function render() {
    uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}

// 두 번째 WebGL 효과 초기화
function initWebGLEffect2(canvas) {
  if (!canvas) {
    console.error('Second canvas not found');
    return;
  }

  // 별도의 WebGL 컨텍스트 생성
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // 투명도 지원
    antialias: true
  });

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uResolution: { value: new THREE.Vector2() },
    uTime: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader2,
    fragmentShader: fragmentShader2,
    uniforms,
    glslVersion: THREE.GLSL3
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width, height);
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();

  function render() {
    uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}

// WebGL 기반 파동 효과
class WaveEffect {
  constructor(container, canvas) {
    this.container = container;
    this.canvas = canvas;
    this.gl = null;
    this.program = null;
    this.startTime = Date.now();
    this.MAX_CLICKS = 10;
    this.clickIndex = 0;
    this.clickPositions = Array.from({ length: this.MAX_CLICKS }, () => ({ x: -1, y: -1 }));
    this.clickTimes = new Float32Array(this.MAX_CLICKS);

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupShaders();
    this.setupBuffers();
    this.setupEventListeners();
    this.animate();
  }

  setupCanvas() {
    this.gl = this.canvas.getContext('webgl', { alpha: true }) || this.canvas.getContext('experimental-webgl', { alpha: true });
    if (!this.gl) {
      console.error('WebGL을 지원하지 않는 브라우저입니다.');
      return;
    }

    // 투명 배경 설정
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  setupShaders() {
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_clickPos[10];
      uniform float u_clickTimes[10];
      
      const float PIXEL_SIZE = 4.0;
      const float CELL_PIXEL_SIZE = 32.0;
      
      // Bayer matrix helpers
      float Bayer2(vec2 a) {
        a = floor(a);
        return fract(a.x / 2. + a.y * a.y * .75);
      }
      
      #define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
      #define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspectRatio = u_resolution.x / u_resolution.y;
        
        vec2 fragCoord = gl_FragCoord.xy - u_resolution * 0.5;
        float pixelSize = PIXEL_SIZE;
        float cellPixelSize = CELL_PIXEL_SIZE;
        
        vec2 cellId = floor(fragCoord / cellPixelSize);
        vec2 cellCoord = cellId * cellPixelSize;
        vec2 cellUV = cellCoord / u_resolution * vec2(aspectRatio, 1.0);
        
        float feed = 0.0;
        const float speed = 0.5;     // 조정된 파동 속도
        const float thickness = 0.07; // 더 얇은 파동 두께
        const float dampT = 0.8;     // 시간 감쇠 조정
        const float dampR = 1.5;     // 거리 감쇠 조정
        const float maxDistance = 0.5; // 최대 파동 거리
        const float maxTime = 2.0;    // 최대 지속 시간
        
        for (int i = 0; i < 10; ++i) {
          vec2 pos = u_clickPos[i];
          if (pos.x < 0.0 && pos.y < 0.0) continue;
          
          vec2 clickUV = (((pos - u_resolution * 0.5 - cellPixelSize * 0.5) / u_resolution)) * vec2(aspectRatio, 1.0);
          
          float t = max(u_time - u_clickTimes[i], 0.0);
          float r = distance(cellUV, clickUV);
          
          // 거리와 시간 제한
          if(r > maxDistance || t > maxTime) continue;
          
          // Tympanus 스타일 파동 계산
          float waveR = speed * t;
          float ring = exp(-pow((r - waveR) / thickness, 2.0));
          float atten = exp(-dampT * t) * exp(-dampR * r);
          
          // 더 부드러운 파동 효과
          float smoothWave = ring * atten * (1.0 - smoothstep(0.0, maxDistance, r));
          feed = max(feed, smoothWave);
        }
        
        float bayerValue = Bayer8(fragCoord / pixelSize) - 0.5;
        float bw = step(0.5, feed + bayerValue);
        
        // 파동이 있는 부분만 표시하고 배경은 투명하게
        float alpha = step(0.1, feed); // 파동이 있는 부분만 알파값 설정
        gl_FragColor = vec4(vec3(bw), alpha);
      }
    `;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    this.program = this.createProgram(vertexShader, fragmentShader);
    this.gl.useProgram(this.program);
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('셰이더 컴파일 오류:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('프로그램 링크 오류:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  setupBuffers() {
    const positions = [
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ];

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    const positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  setupEventListeners() {
    this.container.addEventListener('pointerdown', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // WebGL 좌표계로 변환
      const fragX = x * this.canvas.width / rect.width;
      const fragY = this.canvas.height - (y * this.canvas.height / rect.height);

      this.clickPositions[this.clickIndex] = { x: fragX, y: fragY };
      this.clickTimes[this.clickIndex] = (Date.now() - this.startTime) / 1000;
      this.clickIndex = (this.clickIndex + 1) % this.MAX_CLICKS;
    });
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  animate() {
    const currentTime = (Date.now() - this.startTime) / 1000;

    // 유니폼 설정
    const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');

    this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(timeLocation, currentTime);

    // 클릭 위치 설정
    for (let i = 0; i < this.MAX_CLICKS; i++) {
      const clickPosLocation = this.gl.getUniformLocation(this.program, `u_clickPos[${i}]`);
      const clickTimeLocation = this.gl.getUniformLocation(this.program, `u_clickTimes[${i}]`);

      this.gl.uniform2f(clickPosLocation, this.clickPositions[i].x, this.clickPositions[i].y);
      this.gl.uniform1f(clickTimeLocation, this.clickTimes[i]);
    }

    // 렌더링 (투명 배경)
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0); // 투명 배경
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(() => this.animate());
  }
}

export default function Home() {
  // canvas 참조
  const webglCanvasRef = useRef(null);
  const webglCanvas2Ref = useRef(null);
  const waveCanvasRef = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    // WebGL 효과 초기화
    if (webglCanvasRef.current) {
      initWebGLEffect(webglCanvasRef.current);
    }
    if (webglCanvas2Ref.current) {
      initWebGLEffect2(webglCanvas2Ref.current);
    }
    if (waveCanvasRef.current && heroImgRef.current) {
      new WaveEffect(heroImgRef.current, waveCanvasRef.current);
    }
  }, []);

  return (
    <>
    <main>
      <div className="hero">
        <div className="hero_img" ref={heroImgRef}>
          <span className="canvas_txt">scroll down</span>
          <canvas id="wave-canvas" ref={waveCanvasRef}></canvas>
          <canvas id="webgl-canvas" ref={webglCanvasRef}></canvas>
          <canvas id="webgl-canvas-2" ref={webglCanvas2Ref}></canvas>
        </div>
        <div className="hero_txt">
          2019년 피트니스 스타트업의 디자이너 커리어를 시작으로 크리에이티브 영역을 넓혀왔습니다. 2024년 핀테크 스타트업에서 복잡한 금융 정보를 사용자 중심의 간결한
          디자인으로 선보였습니다. 디자인을 구조화하는데 집중하여 토큰 단위로 디자인 시스템을 개선하였습니다. 2020년 브랜드에 관심있는 사람들과 도전 정신을 바탕으로 패션 브랜드 헤비도큐먼트를 만들었고
          웹 서비스의 사용자 경험을 설계했습니다. 창의적이고 진취적인 방향으로 꾸준히 성장하고 있습니다. 일을 사랑하고, 함께 성공을 만들어갈 만남을 소중히 생각합니다.
        </div>
      </div>
      <Footer />
    </main>
    </>
  );
}
