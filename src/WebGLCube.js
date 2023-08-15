import React, { useRef, useEffect, useState } from "react";
import {
    OrthographicCamera,
    Scene,
    WebGLRenderer,
    CircleGeometry,
    MeshBasicMaterial,
    Mesh,
    Vector3,
    Raycaster
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function WebGLCircles() {
    const containerRef = useRef(null);
    const [selectedData, setSelectedData] = useState(null);

    const data = {
        bigCircles: [
            { x: -4, size: 1.2, color: 0xff0000, data: "Big Circle 1" },
            { x: -2, size: 1.4, color: 0x00ff00, data: "Big Circle 2" },
            { x: 0, size: 1, color: 0x0000ff, data: "Big Circle 3" },
            { x: 2, size: 1.3, color: 0xff00ff, data: "Big Circle 4" },
            { x: 4, size: 1.1, color: 0x00ffff, data: "Big Circle 5" }
        ],
        smallCircles: [
            { parentX: -4, x: -0.6, size: 0.5, color: 0xffff00, data: "Small Circle 1-1" },
            { parentX: -4, x: 0.6, size: 0.5, color: 0xff00ff, data: "Small Circle 1-2" },
            { parentX: -2, x: -0.7, size: 0.6, color: 0x00ffff, data: "Small Circle 2-1" },
            { parentX: -2, x: 0.7, size: 0.6, color: 0xffff00, data: "Small Circle 2-2" },
            { parentX: 0, x: -0.8, size: 0.55, color: 0xff00ff, data: "Small Circle 3-1" },
            { parentX: 0, x: 0.8, size: 0.55, color: 0xffff00, data: "Small Circle 3-2" },
            { parentX: 2, x: -0.7, size: 0.5, color: 0x00ffff, data: "Small Circle 4-1" },
            { parentX: 2, x: 0.7, size: 0.5, color: 0xff00ff, data: "Small Circle 4-2" },
            { parentX: 4, x: 0, size: 0.7, color: 0xffff00, data: "Small Circle 5" }
        ]
    };

    useEffect(() => {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const aspect = width / height;

        const camera = new OrthographicCamera(-5 * aspect, 5 * aspect, 5, -5, 1, 1000);
        camera.position.set(0, 0, 5);

        const scene = new Scene();

        const raycaster = new Raycaster();
        const mouse = new Vector3();

        const circles = [];

        data.bigCircles.forEach((bigCircle) => {
            const geometry = new CircleGeometry(bigCircle.size, 32);
            const material = new MeshBasicMaterial({ color: bigCircle.color });
            const circle = new Mesh(geometry, material);
            circle.position.x = bigCircle.x;
            circle.userData = { data: bigCircle.data };
            circles.push(circle);
            scene.add(circle);

            data.smallCircles
                .filter((smallCircle) => smallCircle.parentX === bigCircle.x)
                .forEach((smallCircle) => {
                    const innerGeometry = new CircleGeometry(smallCircle.size, 32);
                    const innerMaterial = new MeshBasicMaterial({ color: smallCircle.color });
                    const innerCircle = new Mesh(innerGeometry, innerMaterial);
                    innerCircle.position.x = smallCircle.x;
                    innerCircle.userData = { data: smallCircle.data };
                    circles.push(innerCircle);
                    circle.add(innerCircle);
                });
        });

        const renderer = new WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        containerRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableRotate = false;
        controls.enableZoom = true;
        controls.panSpeed = 1;
        controls.mouseButtons = {
            LEFT: 0,
            MIDDLE: 1,
            RIGHT: 2
        };

        containerRef.current.addEventListener("click", (event) => {
            mouse.x = (event.clientX / width) * 2 - 1;
            mouse.y = -(event.clientY / height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(circles, true);
            if (intersects.length > 0) {
                const clickedCircle = intersects[0].object;
                setSelectedData(clickedCircle.userData.data);
            }
        });

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        animate();

        return () => {
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    return (
        <div>
            <div ref={containerRef} style={{ width: "100vw", height: "90vh" }}></div>
            {selectedData && <div style={{ textAlign: "center" }}>{selectedData}</div>}
        </div>
    );
}

export default WebGLCircles;
