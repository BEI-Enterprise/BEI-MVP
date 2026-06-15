// Minimal helper: load external script
function loadScript(src){
  return new Promise((res,rej)=>{
    const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);
  });
}

async function init(){
  // load Three.js from CDN
  await loadScript('https://unpkg.com/three@0.152.2/build/three.min.js');
  await loadScript('https://unpkg.com/three@0.152.2/examples/js/controls/OrbitControls.js');

  const THREE = window.THREE;
  const container = document.getElementById('earth-scene');
  if(!container) return;

  const w = container.clientWidth || window.innerWidth * 0.55; const h = container.clientHeight || window.innerHeight;
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(w,h); renderer.setClearColor(0x050505,1);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, w/h, 0.1, 2000);
  camera.position.set(0,0,420);

  // subtle directional light
  const dir = new THREE.DirectionalLight(0xffffff,0.6);dir.position.set(5,3,5);scene.add(dir);
  const amb = new THREE.AmbientLight(0xffffff,0.12);scene.add(amb);

  // Load textures (public domain / threejs examples)
  const loader = new THREE.TextureLoader();
  const dayMap = await loader.loadAsync('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg');
  const specMap = await loader.loadAsync('https://threejs.org/examples/textures/earthspec1k.jpg');
  let nightMap;
  try{ nightMap = await loader.loadAsync('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/earth_lights_lrg.jpg'); }
  catch(e){ nightMap = null; }

  // Earth geometry and material
  const geo = new THREE.SphereGeometry(200,64,64);
  const mat = new THREE.MeshStandardMaterial({
    map: dayMap,
    metalness:0.05,
    roughness:0.9,
    roughnessMap:specMap
  });
  const earth = new THREE.Mesh(geo,mat); scene.add(earth);

  // Night lights as second sphere with additive blending
  if(nightMap){
    const nightMat = new THREE.MeshBasicMaterial({map:nightMap,transparent:true,opacity:0.95,blending:THREE.AdditiveBlending});
    const nightSphere = new THREE.Mesh(new THREE.SphereGeometry(201,64,64), nightMat);
    nightSphere.material.side = THREE.FrontSide; scene.add(nightSphere);
  }

  // Atmospheric rim: a soft sprite generated from canvas
  const glowCanvas = document.createElement('canvas');glowCanvas.width=512;glowCanvas.height=512;
  const gctx = glowCanvas.getContext('2d');
  const grad = gctx.createRadialGradient(256,256,120,256,256,256);
  grad.addColorStop(0,'rgba(200,162,74,0.05)');
  grad.addColorStop(0.6,'rgba(200,162,74,0.02)');
  grad.addColorStop(1,'rgba(0,0,0,0)');
  gctx.fillStyle=grad; gctx.fillRect(0,0,512,512);
  const texGlow = new THREE.CanvasTexture(glowCanvas);
  const glowMat = new THREE.SpriteMaterial({map:texGlow,color:0xffffff,transparent:true,opacity:0.9,depthWrite:false});
  const sprite = new THREE.Sprite(glowMat); sprite.scale.set(520,520,1); scene.add(sprite);
  sprite.position.copy(earth.position);

  // Network connections: thousands of subtle points and lines
  const routeGroup = new THREE.Group(); scene.add(routeGroup);
  const routeMaterial = new THREE.LineBasicMaterial({color:0xC8A24A,linewidth:1,transparent:true,opacity:0.14});

  // Gold network nodes (subtle, premium)
  const nodesGroup = new THREE.Group(); scene.add(nodesGroup);
  const nodeMat = new THREE.MeshStandardMaterial({color:0xC8A24A,emissive:0xC8A24A,emissiveIntensity:0.8,metalness:0.2,roughness:0.6});
  for(let i=0;i<120;i++){
    const c = cities[Math.floor(Math.random()*cities.length)];
    const pos = latLonToVector3(c.lat,c.lon,202);
    const s = 1.6 + Math.random()*1.8;
    const node = new THREE.Mesh(new THREE.SphereGeometry(s,8,8), nodeMat);
    node.position.copy(pos);
    nodesGroup.add(node);
  }

  function latLonToVector3(lat,lon,radius){
    const phi = (90-lat) * (Math.PI/180);
    const theta = (lon+180) * (Math.PI/180);
    const x = - (radius) * Math.sin(phi) * Math.cos(theta);
    const z = (radius) * Math.sin(phi) * Math.sin(theta);
    const y = (radius) * Math.cos(phi);
    return new THREE.Vector3(x,y,z);
  }

  // generate pseudo-city coords (sampled distribution)
  const cities = [];
  for(let i=0;i<1200;i++){
    // biased towards land by random lat/lon distribution
    const lat = (Math.random()*160)-80;
    const lon = (Math.random()*360)-180;
    cities.push({lat,lon});
  }

  for(let i=0;i<400;i++){
    const a = cities[Math.floor(Math.random()*cities.length)];
    const b = cities[Math.floor(Math.random()*cities.length)];
    if(!a||!b) continue;
    const vA = latLonToVector3(a.lat,a.lon,200);
    const vB = latLonToVector3(b.lat,b.lon,200);
    const curve = new THREE.CatmullRomCurve3([
      vA,
      vA.clone().lerp(vB,0.5).multiplyScalar(1.08).add(new THREE.Vector3(0,8*Math.random(),0)),
      vB
    ]);
    const pts = curve.getPoints(64);
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geom, routeMaterial);
    routeGroup.add(line);
  }

  // small rotating particle cloud for stars/network depth
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(3000*3);
  for(let i=0;i<3000;i++){
    const r = 800+Math.random()*1200;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos(2*Math.random()-1);
    positions[i*3] = Math.sin(phi)*Math.cos(theta)*r;
    positions[i*3+1] = Math.sin(phi)*Math.sin(theta)*r;
    positions[i*3+2] = Math.cos(phi)*r;
  }
  particlesGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const particlesMat = new THREE.PointsMaterial({color:0xffffff,size:0.6,transparent:true,opacity:0.06});
  const particles = new THREE.Points(particlesGeo,particlesMat); scene.add(particles);

  // Orbit control but heavily constrained for a cinematic view
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan=false; controls.enableZoom=false; controls.minDistance=300; controls.maxDistance=900;
  controls.autoRotate=true; controls.autoRotateSpeed=0.06; controls.enableDamping=true; controls.dampingFactor=0.05;

  // Resize handling
  window.addEventListener('resize',()=>{
    const w2 = container.clientWidth || window.innerWidth * 0.55; const h2 = container.clientHeight || window.innerHeight;
    renderer.setSize(w2,h2); camera.aspect=w2/h2; camera.updateProjectionMatrix();
  });

  // subtle animation loop
  const clock = new THREE.Clock();
  function animate(){
    const elapsed = clock.getElapsedTime();
    earth.rotation.y += 0.0007; // slow rotation
    routeGroup.rotation.y += 0.00035;
    particles.rotation.y += 0.00008;
    nodesGroup.rotation.y += 0.0005;
    // pulse nodes subtly
    nodesGroup.children.forEach((n,idx)=>{
      const s = 1 + 0.06*Math.sin(elapsed*1.5 + idx);
      n.scale.setScalar(s);
    });
    controls.update();
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  animate();

  // Accessibility / fallback: simple cover image if WebGL unsupported
}

// run init
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();

// light UI helpers (menu toggle + smooth scroll + form)
document.addEventListener('DOMContentLoaded',function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  toggle && toggle.addEventListener('click',()=>{nav.style.display = nav.style.display==='flex'?'none':'flex'});
  document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const href=a.getAttribute('href'); if(href.length>1){e.preventDefault();const el=document.querySelector(href); if(el) el.scrollIntoView({behavior:'smooth'});}})});
  const form = document.getElementById('mri-form'); if(form){form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form);const required=['first','last','company','email'];for(const r of required){if(!fd.get(r)||fd.get(r).toString().trim()===''){alert('Please complete required fields.');return;}}form.querySelector('#form-success').hidden=false;form.reset();setTimeout(()=>{form.querySelector('#form-success').hidden=true},8000);});}
});
