// 로딩 컴포넌트 - 0-100% 숫자 애니메이션 및 검은색이 위로 걷히는 효과
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function Loading({ isLoading }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const transitionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const duration = 2000; // 2초 동안 0-100% 진행

  // Three.js 전환 효과 초기화
  useEffect(() => {
    if (!containerRef.current) {
      console.error('containerRef.current is null');
      return;
    }
    
    console.log('Initializing Three.js transition, container:', containerRef.current);

    const bounds = {
      ww: window.innerWidth,
      wh: window.innerHeight
    };

    class Transition {
      constructor(container) {
        const { ww, wh } = bounds;
        
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setSize(ww, wh);
        this.renderer.setClearColor(0x000000, 0);
        
        // canvas 스타일 설정
        const canvas = this.renderer.domElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';
        // 초기 상태에서 검은색이 보이도록 배경 설정
        canvas.style.backgroundColor = 'transparent';
        // canvas가 제대로 표시되도록 설정
        canvas.style.display = 'block';
        
        // canvas를 container에 추가
        container.appendChild(this.renderer.domElement);
        console.log('Canvas added to container, canvas:', this.renderer.domElement);
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 1, 100);
        this.camera.lookAt(this.scene.position);
        this.camera.position.z = 1;

        this.geo = new THREE.BufferGeometry();
        const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
        const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
        this.geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        this.geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        this.mat = new THREE.ShaderMaterial({
          vertexShader: `
            precision highp float;
            varying vec2 vUv;
            void main(){
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
            }
          `,
          fragmentShader: `
            precision highp float;
            uniform float uProgress;
            uniform float uPower;
            uniform bool uOut;
            vec4 transparent = vec4(0., 0., 0., 0.);
            vec4 black = vec4(0., 0., 0., 1.);
            #define M_PI 3.1415926535897932384626433832795
            varying vec2 vUv;
            void main() {
              vec2 uv = vUv;
              uv.y -= ((sin(uv.x * M_PI) * uPower) * .25);
              if (!uOut) uv.y = 1. - uv.y;
              float t = smoothstep(uv.y - fwidth(uv.y), uv.y, uProgress);
              vec4 color = mix(transparent, black, t);
              gl_FragColor = color;
            }  
          `,
          uniforms: {
            uProgress: { value: 1 }, // 초기에는 검은색 화면 표시
            uPower: { value: 0 },
            uOut: { value: true }
          },
        });

        this.triangle = new THREE.Mesh(this.geo, this.mat);
        this.triangle.scale.set(ww / 2, wh / 2, 1);
        this.triangle.frustumCulled = false;
        this.scene.add(this.triangle);

        this.tl = gsap.timeline({ 
          paused: true,
          defaults: {
            duration: 1.25,
            ease: 'power3.inOut'
          }
        });

        this.animating = false;
        this.reverse = false;
      }

      render = () => {
        this.renderer.render(this.scene, this.camera);
      }

      out = () => {
        if (this.animating) return;
        this.animating = true;
        this.reverse = true;
        
        const { uProgress } = this.mat.uniforms;
        const bendTimeline = this.bend();
        
        this.tl.clear()
          .to(uProgress, {
            value: 1,
            onUpdate: () => this.render()
          }, 0)
          .add(bendTimeline, 0)
          .add(() => {
            this.animating = false;
          })
          .play();
      }

      in = () => {
        if (this.animating) return;
        this.animating = true;
        this.reverse = false;
        
        // 애니메이션 시작 플래그 설정
        if (this.setAnimating) {
          this.setAnimating(true);
        }
        
        const { uProgress, uPower, uOut } = this.mat.uniforms;
        
        // uOut을 false로 설정하여 위로 걷히는 효과
        uOut.value = false;
        this.render();
        
        // bend 애니메이션을 위한 객체 생성
        const powerObj = { value: 0 };
        const progressObj = { value: 1 };
        
        // bend 애니메이션
        const bendTl = gsap.timeline({
          defaults: {
            ease: 'linear',
            duration: 0.5
          }
        })
          .to(powerObj, { 
            value: 1,
            onUpdate: () => {
              uPower.value = powerObj.value;
              this.render();
            }
          })
          .to(powerObj, { 
            value: 0,
            onUpdate: () => {
              uPower.value = powerObj.value;
              this.render();
            }
          });
        
        // 메인 타임라인
        this.tl.clear()
          .to(progressObj, {
            value: 0,
            duration: 1.25,
            ease: 'power3.inOut',
            onUpdate: () => {
              uProgress.value = progressObj.value;
              this.render();
            }
          }, 0)
          .add(bendTl, 0)
          .set(uOut, { value: true })
          .add(() => {
            this.animating = false;
            // 애니메이션 완료 후 렌더링 루프 재개
            if (this.setAnimating) {
              this.setAnimating(false);
            }
            console.log('Animation completed, uProgress:', uProgress.value);
          })
          .play();
      }

      bend = () => {
        const { uPower } = this.mat.uniforms;
        
        return gsap.timeline({ 
          paused: true,
          defaults: {
            ease: 'linear',
            duration: 0.5        
          },
        })
          .to(uPower, { value: 1 })
          .to(uPower, { value: 0 });
      }

      resize = () => {
        const { ww, wh } = bounds;
        
        this.camera.left = ww / -2;
        this.camera.right = ww / 2;
        this.camera.top = wh / 2;
        this.camera.bottom = wh / -2;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(ww, wh);
        this.triangle.scale.set(ww / 2, wh / 2, 1);
      }

      dispose = () => {
        this.renderer.dispose();
        this.geo.dispose();
        this.mat.dispose();
      }
    }

    const transition = new Transition(containerRef.current);
    transitionRef.current = transition;

    // 초기 렌더링 (검은색 화면 표시)
    // 초기 상태: uProgress = 1이므로 검은색이 보여야 함
    // 여러 번 렌더링하여 확실히 표시
    for (let i = 0; i < 5; i++) {
      transition.render();
    }
    console.log('Transition initialized, uProgress:', transition.mat.uniforms.uProgress.value);
    console.log('Canvas element:', transition.renderer.domElement);
    console.log('Canvas size:', transition.renderer.domElement.width, transition.renderer.domElement.height);
    
    // 초기 상태 유지를 위한 렌더링 루프
    let animationFrameId;
    let isAnimating = false;
    
    const renderLoop = () => {
      transition.render(); // 항상 렌더링 (애니메이션 중에도 GSAP가 업데이트하므로 중복 렌더링은 문제 없음)
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();
    
    // 애니메이션 시작 플래그 설정 함수
    transition.setAnimating = (value) => {
      isAnimating = value;
    };

    const handleResize = () => {
      bounds.ww = window.innerWidth;
      bounds.wh = window.innerHeight;
      transition.resize();
      transition.render();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (transitionRef.current) {
        transitionRef.current.dispose();
      }
    };
  }, []);

  // 로딩 진행 애니메이션
  useEffect(() => {
    if (!isLoading) {
      // 로딩이 완료되면 즉시 100%로 설정하고 종료 애니메이션 시작
      setProgress(100);
      setIsExiting(true);
      // 숫자 페이드아웃 후 검은색이 위로 걷히는 효과 시작 (0.3초)
      setTimeout(() => {
        if (transitionRef.current) {
          console.log('Starting transition.in()');
          transitionRef.current.in(); // 검은색이 위로 걷히면서 사라지는 효과
        } else {
          console.error('transitionRef.current is null');
        }
      }, 300);
      return;
    }

    // 애니메이션 시작
    startTimeRef.current = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(newProgress);
      
      if (newProgress < 100 && isLoading) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading]);

  // 로딩이 false이고 아직 표시 중이 아닐 때는 렌더링하지 않음
  if (!isLoading && !isExiting) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="loading_container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundColor: '#000', // 초기 검은색 배경 (canvas가 로드되기 전까지)
      }}
    >
      {/* Three.js canvas는 containerRef에 자동으로 추가됨 */}
      <div 
        className="loading_number"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '16px',
          fontWeight: 500,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: '#fff',
          fontFamily: '"Inter", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
          transition: isExiting ? 'opacity 0.3s ease-out' : 'none',
          opacity: isExiting ? 0 : 1,
          pointerEvents: 'none',
          zIndex: 10, // canvas 위에 표시
        }}
      >
        {String(progress).padStart(2, '0')}
        <span className="loading_percent">%</span>
      </div>
    </div>
  );
}

