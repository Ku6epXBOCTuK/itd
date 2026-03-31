import type { Scene3D } from "./three-scene";

let scene3D: Scene3D | null = null;

export const RenderService = {
	init(scene: Scene3D) {
		scene3D = scene;
	},

	render() {
		if (!scene3D) return;
		scene3D.renderer.render(scene3D.scene, scene3D.camera);
	},

	resize(width: number, height: number) {
		if (!scene3D) return;
		scene3D.camera.aspect = width / height;
		scene3D.camera.updateProjectionMatrix();
		scene3D.renderer.setSize(width, height);
	},

	dispose() {
		if (!scene3D) return;
		scene3D.renderer.dispose();
		scene3D = null;
	},
};
