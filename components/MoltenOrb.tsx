"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec3 vP;
varying vec3 vN;
varying vec3 vV;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vP = position;
  vN = normalize(normalMatrix * normal);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uPointer;
varying vec3 vP;
varying vec3 vN;
varying vec3 vV;

float hash(vec3 p){
  p = fract(p * 0.1031);
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float noise(vec3 p){
  vec3 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1.,0.,0.)),f.x),
    mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)),f.x),f.y),
    mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)),f.x),
    mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);
}
float fbm(vec3 p){
  float v=0., a=.5;
  for(int i=0;i<4;i++){v+=noise(p)*a;p*=2.03;a*=.5;}
  return v;
}
void main(){
  vec3 n=normalize(vN), viewDir=normalize(vV);
  float t=uTime*.12;
  vec3 p=normalize(vP)*2.5;
  p.xy+=uPointer*.1;
  vec3 warp=vec3(fbm(p+vec3(t,1.7,0.)),fbm(p+vec3(2.4,-t,1.3)),fbm(p+vec3(-1.4,.4,t)));
  vec3 q=p+(warp-.5)*1.55;
  float flow=sin((q.x*.95+q.y*.62-q.z*.48)*4.7+fbm(q*1.9)*5.6);
  float vein=sin((q.x*1.1-q.y*.88+q.z*.72)*8.7+fbm(q*3.2)*5.0);
  float molten=smoothstep(-.58,.72,flow+(fbm(q*2.4)-.48)*1.5);
  float gold=smoothstep(.57,.98,vein+fbm(q*5.)*.5);
  float dark=smoothstep(.65,.95,-vein+fbm(q*4.3)*.45);
  vec3 color=mix(vec3(.004,.004,.004),vec3(.23,.025,.002),molten*.8);
  color=mix(color,vec3(1.,.105,.002),smoothstep(.2,.9,molten)*.9);
  color=mix(color,vec3(.003,.002,.002),dark*.75);
  color=mix(color,vec3(1.,.47,.06),gold*molten*.9);
  vec3 lightDir=normalize(vec3(-.65,.72,.78));
  float diffuse=max(dot(n,lightDir),0.);
  float spec=pow(max(dot(reflect(-lightDir,n),viewDir),0.),48.);
  float rim=pow(1.-max(dot(n,viewDir),0.),3.6);
  color*=.44+diffuse*.56;
  color+=vec3(1.,.72,.4)*spec*1.35;
  color+=vec3(1.,.16,.02)*rim*.7;
  color+=vec3(1.,.35,.03)*gold*molten*.13;
  gl_FragColor=vec4(color,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export default function MoltenOrb() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector2());
  useFrame(({ clock, pointer: cursor }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime();
      target.current.set(cursor.x, cursor.y);
      pointer.current.lerp(target.current, .035);
      material.current.uniforms.uPointer.value.copy(pointer.current);
    }
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime()*.13)*.08;
      group.current.rotation.x = Math.cos(clock.getElapsedTime()*.11)*.045;
    }
  });
  return <group ref={group}>
    <mesh>
      <sphereGeometry args={[1.28, 128, 128]}/>
      <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={{uTime:{value:0},uPointer:{value:new THREE.Vector2()}}}/>
    </mesh>
    <mesh scale={1.012}>
      <sphereGeometry args={[1.28, 96, 96]}/>
      <meshBasicMaterial color="#ff741f" transparent opacity={.035} side={THREE.BackSide}/>
    </mesh>
  </group>;
}
