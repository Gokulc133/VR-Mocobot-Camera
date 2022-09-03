var w = window.innerWidth;
var h = window.innerHeight;
var container;
var camera,controls,scene,renderer,boxes = [];
var cameraspeed = 1;
let mixer;
const clock = new THREE.Clock();


init();

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  // camera
  camera = new THREE.PerspectiveCamera(60, w / h, 1, 1000);
  camera.animAngle = 0;
  camera.position.x = Math.cos(camera.animAngle) * 400;
  camera.position.y = 180;
  camera.position.z = Math.sin(camera.animAngle) * 400;

  // world
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1E2630, 0.002);
  renderer.setClearColor(scene.fog.color);

  // helpers
  var gridXZ = new THREE.GridHelper(600, 50);
  scene.add(gridXZ);

  // lights
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(5, 5, 5);
  scene.add(light);
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-5 ,-5, -5);
  scene.add(light);
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(10, 10, 10);
  scene.add(light);
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 0, 0);
  scene.add(light);
  light = new THREE.AmbientLight(0x222222);
  scene.add(light);

  // Modal
  
  var loader = new THREE.GLTFLoader();
  loader.load("spiderman.glb", function(gltf){
    const model = gltf.scene
      model.scale.set( 1, 1, 1)
      scene.add(model);

      mixer = new THREE.AnimationMixer( model );
			mixer.clipAction( gltf.animations[ 0 ] ).play();

				animate();
  });

  // Dome
  var domeGeometry = new THREE.IcosahedronGeometry(700, 1);
  var domeMaterial = new THREE.MeshPhongMaterial({
    color: 0xfb3550,
    shading: THREE.FlatShading,
    side: THREE.BackSide });

  var dome = new THREE.Mesh(domeGeometry, domeMaterial);
  scene.add(dome);


  var planeGeometry = new THREE.PlaneGeometry(600, 600);
  var planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x222A38,
    transparent: true,
    opacity: 0.8,
    shading: THREE.FlatShading,
    side: THREE.DoubleSide });

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  // box
  // BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
  // var geometry = new THREE.BoxGeometry(10, 10, 10);
  // for (var i = 0; i < 100; i++) {
  //   var material = new THREE.MeshPhongMaterial({
  //     color: [00000000, 0xffffff, 61696][Math.random() * 3 |
  //     0],
  //     shading: THREE.FlatShading });

  //   boxes.push(new THREE.Mesh(geometry, material));
  //   scene.add(boxes[i]);
  // }

  window.addEventListener('resize', onWindowResize, false);

  (function grow() {
    boxes.forEach(box => {
      // var t = Math.random() * 0.6 + 0.3;
      // TweenMax.to(box.scale, t, {
      //   x: 1 + Math.random() * 3,
      //   y: 1 + Math.random() * 2 + (Math.random() < 0.1 ? 15 : 0),
      //   z: 1 + Math.random() * 3,
      //   ease: Power2.easeInOut });

      // TweenMax.to(box.position, t, {
      //   x: -200 + Math.random() * 400,
      //   z: -200 + Math.random() * 400,
      //   ease: Power2.easeInOut });

    });

    TweenMax.to(camera, cameraspeed , {
      animAngle: camera.animAngle + (2 * Math.random() - 1) * Math.PI,
      ease: Power1.easeInOut,
      onUpdate: function () {

        camera.position.x = Math.cos(camera.animAngle) * 440;
        camera.position.y = Math.sin(1) * 480;

        camera.position.z = Math.sin(camera.animAngle) * 440;

        camera.updateProjectionMatrix();
        camera.lookAt(scene.position);
      } });


    TweenMax.to(window, 3.5, {
      onComplete: grow });

  })();
}

function onWindowResize() {
  w = window.innerWidth;
  h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function animate() {
  
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

   mixer.update( delta );

  renderer.render(scene, camera);
}

