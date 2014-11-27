if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var container, stats;

var camera,controls, scene, renderer;

var clock = new THREE.Clock();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var modelSample = 'model/livingroom/spit/new_livingroom.obj';
var mtlSample = 'model/livingroom/spit/new_livingroom.mtl';
//var modelSample = 'model/centerone.obj';
//var mtlSample = 'model/centerone.mtl';
//var modelSample = 'model/1108_obj.obj'
//var mtlSample = 'model/1108_obj.mtl';
//var modelSample = 'model/a.obj';
//var mtlSample = 'model/a.mtl';


init();
animate();


function init() {

    container = document.getElementById('container');
    //document.body.appendChild(container);

    //camera

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.z = 100;

    //controls
    controls = new THREE.FirstPersonControls(camera);

    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.1;
    controls.verticalMax = 2.2;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0xcccccc);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 0.5).normalize();
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

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    //document.addEventListener('mousemove', onDocumentMouseMove, false);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    
    stats.update();

}

function render() {

    controls.update(clock.getDelta());
    renderer.render(scene, camera);

}
