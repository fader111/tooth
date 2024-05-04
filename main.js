// import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {
// 	requestAnimationFrame( animate );

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

// 	renderer.render( scene, camera );
// }

// animate();

const scene = new THREE.Scene();
scene.background = new THREE.Color("lightblue");//0x808080); // Установка серого цвета
const camera = new THREE.PerspectiveCamera(75/*75*/, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.STLLoader();

const objectsToLoad = [];
if (0) { // загрузка в цикле зубов из папки
    for (let j = 1; j <= 4; j++) {
        for (let i = j * 10 + 1; i <= j * 10 + 8; i++) {
            const fileName = `meshes/tooth${i}.stl`;
            const position = new THREE.Vector3(0, 0, 0);
            objectsToLoad.push({ file: fileName, position: position });
        }
    }
} else {
    const fileName = `uploads_files_4841856_vampire+dental+model_STL.stl`;
    const fileName2 = `jaw.stl`;
    const position = new THREE.Vector3(0, 0, 0);
    objectsToLoad.push({ file: fileName2, position: position });
}

console.log("stl fnames: ", objectsToLoad);
const meshes = [];

const checkFileExists = async (url) => { // Этоне работает надо исправлять
    try {
        const response = await fetch(url, { method: 'HEAD' });

        if (response.status !== 404) {
            return response.ok;
        } else {
            return false;
        }
    } catch (error) {
        // Проверяем, является ли ошибка ошибкой сети (например, ошибка 404)
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            return false; // Возвращаем false, если файл не найден
        } else {
            // Если это другая ошибка, вы можете обработать ее или вывести в консоль
            // console.error('Error checking file existence:', error);
            return false;
        }
    }
};

// Создание текстуры
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(`textures/teeth.png`);

objectsToLoad.forEach(async object => {
    // const fileExists = await checkFileExists(object.file);

    // if (fileExists) {
    if (true) {
        loader.load(object.file, function (geometry) {
            // const material = new THREE.MeshNormalMaterial();
            // const material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 255 });
            /////Создание материала с текстурой и базовым цветом
            const material = new THREE.MeshStandardMaterial({
                map: texture, // Установка текстуры
                roughness: 1.0, // Настройка степени отражения света
                metalness: 0.5, // Настройка металличности материала
                color: 0xffffff, // Базовый цвет объекта
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(0.1, 0.1, 0.1);
            // mesh.scale.set(1, 1.01, 1.01);
            mesh.rotation.x = -1;
            mesh.position.copy(object.position);

            meshes.push(mesh);
            scene.add(mesh);
        });
    } else {
        console.log(`File ${object.file} not found.`);
    }
});

console.log("stl's: ", meshes);

camera.position.z = 5;

//Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add spotlight to the scene
const pointLight = new THREE.PointLight(0xffffff, 250);
pointLight.position.set(1, 1, 8);
scene.add(pointLight);

// const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
// const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry2, material2 );
// scene.add( cube );


let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

renderer.domElement.addEventListener('mousedown', (event) => {
    isDragging = true;
});

renderer.domElement.addEventListener('mousemove', (event) => {
    const deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y
    };

    if (isDragging) {
        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));

        meshes.forEach(mesh => {
            mesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, mesh.quaternion);
        });
    }

    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener( 'mousewheel', (event) => {
    camera.position.z +=event.deltaY/100;
});

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

const animate = function () {
    requestAnimationFrame(animate);
    // meshes[0].rotation.x += 0.01;
    // console.log(meshes[0].rotation);
    // cube.rotation.x += .01;
	// cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};

animate();