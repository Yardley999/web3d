if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//var modelSample = 'model/livingroom/spit/new_livingroom.obj';
//var mtlSample = 'model/livingroom/spit/new_livingroom.mtl';
var modelSample = 'model/a.obj';
var mtlSample = 'model/a.mtl';


init();
animate();


function init() {

    container = document.getElementById('container');
    //document.body.appendChild(container);

    //camera

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 100;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0).normalize();
    scene.add(directionalLight);

    //skybox
    skyBox = new THREE.Mesh(
    new THREE.CubeGeometry(10000, 10000, 10000),
    new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide })
);
    scene.add(skyBox);

    // model

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };


    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.OBJMTLLoader();
    loader.load(modelSample, mtlSample, function (object) {

        object.position.y = -80;
        scene.add(object);

    }, onProgress, onError);

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

}

//

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY - camera.position.y) * .05;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}
