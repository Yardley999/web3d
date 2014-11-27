if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var container, stats;
var FLOOR = -250;
var camera, controls, scene, renderer , controls2;

var zmesh;

var clock = new THREE.Clock();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var scalar = 100;

//var modelSample = 'model/livingroom/spit/new_livingroom.obj';
//var mtlSample = 'model/livingroom/spit/new_livingroom.mtl';
var modelSample = 'model/center1.obj';
var mtlSample = 'model/center1.mtl';
//var modelSample = 'model/t001/aaaaaaaaa.obj'
//var mtlSample = 'model/t001/aaaaaaaaa.mtl';
//var modelSample = 'model/a.obj';
//var mtlSample = 'model/a.mtl';
//var JSSample = 'model/livingroom/spit/livingroom.js';
//var JSSample = 'model/simple/CenterOneSimple.js';
//var JSSample = 'model/5.js';


init();
animate();


function init() {

    container = document.getElementById('container');
    //document.body.appendChild(container);

    // scene

    scene = new THREE.Scene();

    //camera

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000 * scalar);
    //camera.lookAt(new THREE.Vector3(1, 0, 1));
    camera.position.set(-453, 246, 122);
    camera.up.set(0, 1, 0);
    //camera.lookAt({ x: -3286, y: 180, z: 0 });
    //camera.rotation.y = -Math.PI / 2;
    

    scene.add(camera);

    //controls
    controls = new THREE.FirstPersronControls(camera);
    
    controls.movementSpeed = 300;
    controls.lookSpeed = 0.05;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.1;
    controls.verticalMax = 2.2;

    //controls2 = new THREE.OrbitControls(camera);

    var ambient = new THREE.AmbientLight(0xcccccc);//464646
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 0.5).normalize();
    scene.add(directionalLight);

    //var spotLight = new THREE.spotLight(0xffffff, 0.5);
    //spotLight.position.set(-10000, 12940, -5683);
    //scene.add(spotLight);
    
    //skybox
    skyBox = new THREE.Mesh(
    new THREE.CubeGeometry(10000 * scalar, 10000 * scalar, 10000 * scalar),
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

    //var loader = new THREE.JSONLoader();
    ////var callbackMale = function (geometry, materials) { createScene(geometry, materials, 90, FLOOR, 50, 105) };
    //var callbackLivingHouse = function (geometry, materials) { createScene(geometry, materials, 0, 0, 0, 0) };

    ////loader.load("obj/male02/Male02_dds.js", callbackMale);
    //loader.load(JSSample, callbackLivingHouse);

    //

    renderer = new THREE.WebGLRenderer({ antialias: false });
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
    //controls2.update();
    renderer.render(scene, camera);

}

function createScene(geometry, materials, x, y, z, b) {

    zmesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    zmesh.position.set(x, y, z);
    zmesh.scale.set(1, 1, 1);
    scene.add(zmesh);

    //createMaterialsPalette(materials, 100, b);

}
function createMaterialsPalette(materials, size, bottom) {

    for (var i = 0; i < materials.length; i++) {

        // material

        mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size, size), materials[i]);
        mesh.position.x = i * (size + 5) - ((materials.length - 1) * (size + 5) / 2);
        mesh.position.y = FLOOR + size / 2 + bottom;
        mesh.position.z = -100;
        scene.add(mesh);

        // number

        var x = document.createElement("canvas");
        var xc = x.getContext("2d");
        x.width = x.height = 128;
        xc.shadowColor = "#000";
        xc.shadowBlur = 7;
        xc.fillStyle = "orange";
        xc.font = "50pt arial bold";
        xc.fillText(i, 10, 64);

        var xm = new THREE.MeshBasicMaterial({ map: new THREE.Texture(x), transparent: true });
        xm.map.needsUpdate = true;

        mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size, size), xm);
        mesh.position.x = i * (size + 5) - ((materials.length - 1) * (size + 5) / 2);
        mesh.position.y = FLOOR + size / 2 + bottom;
        mesh.position.z = -99;
        scene.add(mesh);

    }

}