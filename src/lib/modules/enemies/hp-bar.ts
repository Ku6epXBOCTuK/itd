import * as THREE from "three";
import { GEOMETRY } from "$lib/core/game-config";

const vertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform float uHpPercent;
    
    void main() {
        vec4 greenColor = vec4(0.2, 0.8, 0.2, 1.0);
        vec4 redColor = vec4(0.8, 0.2, 0.2, 1.0);
        
        float barWidth = 0.8;
        float barStart = (1.0 - barWidth) * 0.5;
        float barEnd = barStart + barWidth;
        
        float x = vUv.x;
        
        float isInBar = step(barStart, x) * step(x, barEnd);
        float fillEnd = barStart + barWidth * uHpPercent;
        
        vec4 color = (x <= fillEnd) ? greenColor : redColor;
        float alpha = isInBar;
        
        gl_FragColor = vec4(color.rgb, color.a * alpha);
    }
`;

const hpBarMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uHpPercent: { value: 1.0 },
	},
	vertexShader,
	fragmentShader,
	transparent: true,
	depthTest: false,
});

export const createHpBarSprite = (scene: THREE.Scene) => {
	const sprite = new THREE.Sprite(
		hpBarMaterial as unknown as THREE.SpriteMaterial,
	);
	sprite.scale.set(
		GEOMETRY.hpBar.width,
		GEOMETRY.hpBar.height,
		GEOMETRY.hpBar.depth,
	);
	sprite.renderOrder = 1;
	sprite.layers.set(1);
	scene.add(sprite);
	return sprite;
};
