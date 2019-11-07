var CMainPageAnimated = function(type) {

    var $this=this;
    this.type=type;

    this.triangles_three = function() {
        var container;
        var camera, scene, renderer;
        var geometry, group;
        var mouseX = 0, mouseY = 0;

        var windowHalfX = window.innerWidth/2;
        var windowHalfY = window.innerHeight/2;

        document.addEventListener('mousemove', onDocumentMouseMove, false);

        init();
        animate();

        function init(){
            container = document.createElement('div');
            container.id = "stage3d";
            document.body.appendChild(container);

            camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 1, 20000 );
            camera.position.z = 500;

            scene = new THREE.Scene();

            var geometry = new THREE.CylinderGeometry(0, 100, 100, 3);
            var materials = [
                new THREE.MeshPhongMaterial({
                    // light
                    specular: '#b03b2e',
                    // intermediate
                    color: '#a31a0b',
                    // dark
                    emissive: '#7d1409',
                    shininess: 50 ,
                    transparent: true,
                    opacity: 0.9,
                    overdraw: true
                }),
                new THREE.MeshPhongMaterial({
                    // light
                    specular: '#2fa4b1',
                    // intermediate
                    color: '#0b94a3',
                    // dark
                    emissive: '#0b7681',
                    shininess: 50 ,
                    transparent: true,
                    opacity: 0.9,
                    overdraw: true
                })];

                group = new THREE.Object3D();
                for ( var i = 0; i < 350; i ++ ) {
                    var mesh = new THREE.Mesh(geometry, materials[Math.floor(Math.random() * materials.length)]);
                        mesh.position.x = Math.random() * 2000 - 1000;
                        mesh.position.y = Math.random() * 2000 - 1000;
                        mesh.position.z = Math.random() * 2000 - 1000;
                        mesh.rotation.x = Math.random() * 2 * Math.PI;
                        mesh.rotation.y = Math.random() * 2 * Math.PI;
                        mesh.opacity = 50;
                        mesh.matrixAutoUpdate = false;
                        mesh.updateMatrix();
                        group.add( mesh );
                }
                scene.add( group );

                var directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(1, 1, 1).normalize();
                directionalLight.intensity = 0.2;
                scene.add(directionalLight);

                renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.sortObjects = false;
                renderer.setClearColor(0xffffff);
                container.appendChild(renderer.domElement);
                window.addEventListener('resize', onWindowResize, false);
            }

            function onWindowResize(){
                windowHalfX = window.innerWidth/4;
                windowHalfY = window.innerHeight/4;
                camera.aspect = window.innerWidth/window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            function onDocumentMouseMove(event){
                mouseX=(event.clientX - windowHalfX)*2;
                mouseY=(event.clientY - windowHalfY)*2;
            }

            function animate(){
                requestAnimationFrame(animate);
                render();
            }

            function render() {
                camera.position.x += (mouseX - camera.position.x)*.0080;
                camera.position.y += (- mouseY - camera.position.y)*.0080;
                camera.lookAt(scene.position);
                var currentSeconds = Date.now();
                group.rotation.x = Math.sin(currentSeconds * 0.0007)*0.5;
                group.rotation.y = Math.sin(currentSeconds * 0.0003)*0.5;
                group.rotation.z = Math.sin(currentSeconds * 0.0002)*0.5;
                renderer.render(scene, camera);
            }
    }

    this.buildings_three = function() {
        var renderer	= new THREE.WebGLRenderer({
            antialias	: false
        });
        renderer.setClearColor(new THREE.Color('#181525'), 1);
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMapEnabled = true;
        document.body.appendChild(renderer.domElement);
        //0xffffff

        var onRenderFcts= [];
        var scene  = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
        var step = 0;

        var randInt = function(min,max) {
            return (~~((Math.random()*max)+min));
        }

        var light = new THREE.PointLight(0xffffff, 0.3);
        light.position.x = 0;
        light.position.y = 10;
        light.position.z = 0;
        scene.add(light);

        var light2 = new THREE.PointLight(0xffffff, 1);
        light2.position.x = 200;
        light2.position.y = 200;
        light2.position.z = 200;
        scene.add(light2);

        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(450, 700, 450);
        spotLight.target.position = new THREE.Vector3(0,110,800);
        spotLight.intensity = 1;
        spotLight.shadowDarkness = 2;
        spotLight.castShadow = true;
        spotLight.shadowMapWidth = 32;
        spotLight.shadowMapHeight = 32;
        spotLight.shadowCameraFov = 30;
        spotLight.angle = 0.8;
        scene.add(spotLight);

        // Buildings
        var numBuild = 60;
        var diamBuild = 50;
        var tabBuildLeft = [];
        var tabBuildRight = [];
        var tabFaces = [4,8,15];

        var normalMaterial = new THREE.MeshPhongMaterial({
            color      :  new THREE.Color("rgb(176,64,0)"),
            emissive   :  new THREE.Color("rgb(175,25,95)"),
            specular   :  new THREE.Color("rgb(229,111,14)"),
            shininess  :  30,
            shading    :  THREE.FlatShading,
            transparent: 1,
            opacity    : 1
        });

        var blackMaterial = new THREE.MeshPhongMaterial({
            color      :  new THREE.Color("rgb(40,40,40)"),
            emissive   :  new THREE.Color("rgb(20,20,20)"),
            specular   :  new THREE.Color("rgb(160,160,160)"),
            shininess  :  30,
            shading    :  THREE.FlatShading,
            transparent: 1,
            opacity    : 1
        });

        var blueMaterial = new THREE.MeshPhongMaterial({
            color      :  new THREE.Color("rgb(40,40,140)"),
            emissive   :  new THREE.Color("rgb(2,7,22)"),
            specular   :  new THREE.Color("rgb(40,0,190)"),
            shininess  :  30,
            shading    :  THREE.FlatShading,
            transparent: 1,
            opacity    : 1
        });

        var tabMaterial = [normalMaterial,blueMaterial,blackMaterial];

        var groundMaterial = new THREE.MeshPhongMaterial({
            color     :  0x000000,
            emissive  :  0x050505,
            specular  :  0x222222,
            shininess  :  0,
            shading    :  THREE.FlatShading,
            transparent: 1,
            opacity    : 1
        });

        // Background Sky Sphere
        var backgroundSphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 10, 10 ), new THREE.MeshPhongMaterial( {
            color      :  new THREE.Color("rgb(30,80,40)"),
            emissive   :  new THREE.Color("rgb(20,2,35)"),
            specular   :  new THREE.Color("rgb(19,50,126)"),
            shininess  :  70,
            transparent: 1,
            opacity    : 1,
            side: THREE.BackSide
        }));
        scene.add( backgroundSphere );

        // Ground
        var circleGround = new THREE.Mesh( new THREE.CylinderGeometry( 250, 0, 0, 0 ), groundMaterial );
        circleGround.position.y = 0;
        circleGround.receiveShadow = true;
        circleGround.castShadow = true;
        scene.add(circleGround);

        function buildBoxLeft (inx){
            this.b = new THREE.Mesh(new THREE.BoxGeometry( randInt(3,4), randInt(10,80), randInt(3,4)), tabMaterial[randInt(0,tabMaterial.length)]);
            this.b.position.x = Math.cos(inx*(Math.PI*2)/numBuild)*diamBuild;
            this.b.position.y = 0;
            this.b.position.z = Math.sin(inx*(Math.PI*2)/numBuild)*diamBuild;
            this.b.lookAt(new THREE.Vector3(0,0,0));
            this.b.receiveShadow = true;
            this.b.castShadow = true;
        }

        function buildBoxRight (inx){
            this.b = new THREE.Mesh(new THREE.BoxGeometry( randInt(3,6), randInt(10,80), randInt(3,4)), tabMaterial[randInt(0,tabMaterial.length)]);
            this.b.position.x = Math.cos(inx*(Math.PI*2)/numBuild)*(diamBuild+15);
            this.b.position.y = 0;
            this.b.position.z = Math.sin(inx*(Math.PI*2)/numBuild)*(diamBuild+15);
            this.b.lookAt(new THREE.Vector3(0,0,0));
            this.b.receiveShadow = true;
            this.b.castShadow = true;
        }

        for(var i=0; i<numBuild; i++){
            tabBuildLeft.push(new buildBoxLeft(i));
            scene.add(tabBuildLeft[i].b);
        }

        for(var i=0; i<numBuild; i++){
            tabBuildRight.push(new buildBoxRight(i));
            scene.add(tabBuildRight[i].b);
        }

        window.addEventListener('resize', function(){
            renderer.setSize( window.innerWidth, window.innerHeight )
            camera.aspect	= window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }, false)
        // render the scene
        onRenderFcts.push(function(){
            renderer.render( scene, camera );
            camera.position.x = Math.cos(step)*60;
            camera.position.y = 4;
            camera.position.z = Math.sin(step)*60;
            camera.lookAt(new THREE.Vector3(Math.cos(step+1)*58,40,Math.sin(step+1)*58));
            step += 0.0025;
        })

        var lastTimeMsec= null
        requestAnimationFrame(function animate(nowMsec){
            requestAnimationFrame( animate );
            lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
            var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec	= nowMsec
            onRenderFcts.forEach(function(onRenderFct){
                onRenderFct(deltaMsec/1000, nowMsec/1000)
            })
        })
    }

    this.cubes_three = function() {
        var stageWidth = window.innerWidth;
        var stageHeight = 700;
        var xRows = 25;
        var zRows = 25;
        var cubeSize = 700;
        var cubeGap = 200;
        var cubeRow = cubeSize + cubeGap;

        var container = document.createElement('div');
        container.id = "stage3d";
        document.body.appendChild(container);
        var camera = new THREE.PerspectiveCamera(55, stageWidth/stageHeight, 1, 20000);
        camera.position.y = 5000;
        camera.lookAt( new THREE.Vector3(0,0,0) );

        var scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x000000, 5000, 10000 );

        var pointLight =  new THREE.PointLight(0xFF4040);
        pointLight.position.x = 0;
        pointLight.position.y = 1800;
        pointLight.position.z = -1800;
        scene.add(pointLight);

        group = new THREE.Object3D();
        scene.add( group );

        var cubes = [];
        var halfXRows = (cubeRow * -xRows / 2);
        var halfZRows = (cubeRow * -zRows / 2);

        for (var x = 0; x < xRows; x++) {
            cubes[x] = []
            for (var z = 0; z < zRows; z++) {
                var cubeHeight = 100 + Math.random() * 700;
                cubeHeight = 10 + (Math.sin(x / xRows * Math.PI) + Math.sin(z / zRows * Math.PI)) * 200 + Math.random() * 150;

                var geometry = new THREE.BoxGeometry(cubeSize, cubeHeight, cubeSize);

                var colours = [
                    0x4444ff, 0x4477ff, 0x7744ff, 0xff8080
                ];

                var material = new THREE.MeshPhongMaterial({
                    ambient: 0x030303,
                    //color: colours[~~(Math.random() * colours.length)],
                    color: ~~(Math.random() * 0xffffff),
                    //color: 0x4444ff,
                    specular: 0xffffff,
                    shininess: 10, //~~(Math.random() * 200),
                    shading: THREE.SmoothShading
                })

                var cube = new THREE.Mesh(geometry, material);
                cube.position.x = halfXRows + x * cubeRow;
                cube.position.y = cubeHeight / 2;
                cube.position.z = (cubeRow * -zRows / 2) + z * cubeRow;

                cube.height = cubeHeight;
                group.add(cube);

                cubes[x][z] = cube;
            }
        }
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(stageWidth, stageHeight);
        renderer.setClearColor(0xffffff);
        container.appendChild( renderer.domElement );

        var grid = { x: 0, z: 0};
        var position = { x: 0, y: 0, z: 0};

        function checkRow() {
            var xIndex = (position.x / cubeRow);
            var xLoops = Math.floor(xIndex / xRows);

            var zIndex = (position.z / cubeRow);
            var zLoops = Math.floor(zIndex / zRows);

            for (var x = 0; x < xRows; x++) {
                for (var z = 0; z < zRows; z++) {
                    var dx, dz = 0;
                    if ( x >= xIndex - xLoops * xRows ) {
                        dx = xRows * (1 - xLoops);
                    } else {
                        dx = xRows * (0 - xLoops)
                    }
                    if ( z >= zIndex - zLoops * zRows ) {
                        dz = zRows * (1 - zLoops);
                    } else {
                        dz = zRows * (0 - zLoops)
                    }
                    cubes[x][z].position.x = (x - dx) * cubeRow - halfXRows;
                    cubes[x][z].position.z = (z - dz) * cubeRow - halfZRows

                    var scale = (cubes[x][z].position.z + group.position.z) / 1500;
                    if (scale < 1 ) scale = 1;
                    scale = Math.pow(scale, 1.2);
                    cubes[x][z].scale.y = scale;
                    cubes[x][z].position.y = (cubes[x][z].height * scale) / 2;
                }
            }
        }
        var camPos = new THREE.Vector3(0,0,0);
        var mouse = {x:0,y:0}
        var isRunning = true;
        function render(t) {
            if (isRunning) requestAnimationFrame( render );
            position.x += (Math.sin(t * 0.001)) * 20;
            position.z += (Math.cos(t * 0.0008) + 5) * 20;
            group.position.x = -position.x;
            group.position.z = -position.z;
            checkRow();
            camera.position.x = Math.sin(t * 0.0003) * 1000;// + mouse.y;
            camera.position.z = -4000;
            camera.position.y = (Math.cos(t * 0.0004) + 1.3) * 3000;
            camera.lookAt(camPos);
            renderer.render( scene, camera );
        }
        render(0);
        window.addEventListener("mousedown", function() {
            //isRunning = false;
        })
        window.addEventListener("mousemove", function(event) {
            mouse = event;
        })
    }

    this.rays_of_light_three  = function() {

        var renderer, resizer, postprocessing, camera, scene, clock, mesh;
        function start() {
            //Create Engine Components
            renderer = new THREE.WebGLRenderer();
            camera = new THREE.PerspectiveCamera(45, 1.6, .001, 100);
            scene = new THREE.Scene();
            clock = new THREE.Clock();
            resizer = new THREE.WindowResizer(renderer, camera, 1.6, composer);
            resizer.trigger();
            //Camera
            camera.position.set(.33, .25, -.25);
            camera.lookAt(scene.position);
            scene.add(camera);

            //Canvas
            var container = document.createElement('div');
            container.id = "stage3d";
            document.body.appendChild(container);
            container.appendChild(renderer.domElement);
            //Post-Process
            postprocessing = {};
            var composer = new THREE.EffectComposer(renderer);
            composer.addPass(new THREE.RenderPass(scene, camera));
            var stelaEffect = new THREE.ShaderPass(THREE.StelaGradientShader);
            composer.addPass(stelaEffect);
            var bokehPass = new THREE.BokehPass(scene, camera, {
                focus: 1.0,
                aperture: 0.01,
                maxblur: 1.0,
                width: resizer.w,
                height: resizer.h
            });
            composer.addPass(bokehPass);
            bokehPass.renderToScreen = true;
            postprocessing.composer = composer;
            postprocessing.stela = stelaEffect;

            //Extra Components
            mesh = new THREE.HCloud(4);
            scene.add(mesh);
        }

        function animate() {
            mesh.rotation.y = clock.getElapsedTime() * 0.015;
            mesh.material.uniforms.time.value = 0.015 * clock.getElapsedTime();
            postprocessing.stela.uniforms.time.value = clock.getElapsedTime();
            postprocessing.composer.render();
            requestAnimationFrame(animate);
        }

        start();
        animate();
    }

    this.rectangles_d3  = function() {
        $('.cont_w').prepend('<div class="cont_w_bg_rectangles"></div>');
        var width = 765;
        var height = 518;
        var mouse = [width/2, height/2],
            count = 0;

        var svg = d3.select(".cont_w_bg_rectangles").append("svg")
            .attr("width", width)
            .attr("height", height);

        var g = svg.selectAll("g")
            .data(d3.range(25))
            .enter().append("g")
            .attr("transform", "translate(" + mouse + ")")
            .attr("transition", "");

        g.append("rect")
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x", -10.9)
            .attr("y", -10.9)
            .attr("width", 21.8)
            .attr("height", 21.8)
            .attr("transform", function(d, i) {return "scale(" + (1-d/25)*20 + ")";})
            .style("fill", d3.scale.category20c());

        g.datum(function(d) {
            return {center: [0, 0], angle: 0};
        });

        /*$('#main_page_image_content').on("mousemove", function(e) {
            mouse = [e.clientX, e.clientY];
        });
        d3.timer(function() {
            count++;
            g.attr("transform", function(d, i) {
                d.center[0] +=(mouse[0] - d.center[0]) / (i + 5);
                d.center[1] +=(mouse[1] - d.center[1]) / (i + 5);
                d.angle += Math.sin((count + i) / 10) * 7;
                return "translate(" + d.center + ")rotate(" + d.angle + ")";
            });
        });*/
        setInterval(function(){
            count++;
            g.attr("transform", function(d, i) {
                d.center[0] = width/2;
                d.center[1] = height/2;
                d.angle += Math.sin((count + i) / 10) * 7;
                return "translate(" + d.center + ")rotate(" + d.angle + ")";
            });
        }, 30)

    }

    this.spinner_three = function() {
        $('.cont_w').prepend('<div id="bg_animated_spiner" class="cont_w_bg_spiner"></div>');
        var width = 765;
        var height = 498;

        var camera = new THREE.PerspectiveCamera(70, (width-100)/height, 0.1, 5000);
        camera.position.z = 200;

        var controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];

        renderer = new THREE.WebGLRenderer({
            width: width,
            height: height,
            scale: 1,
            antialias: true,
            tonemapping: THREE.FilmicOperator,
            brightness: 2.5,
            alpha: true
        });

        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff);
        document.getElementById('bg_animated_spiner').appendChild(renderer.domElement);

        var scene = new THREE.Scene();
        var group = new THREE.Object3D();

        scene.add(group);

        var lastTimestamp = Number(new Date()) / 1000;
        var depthMaterial, depthTarget, composer;
        var light2 = new THREE.SpotLight('#fff');
        var light3 = new THREE.SpotLight('#fff');

        light3.intensity = light2.intensity = 20;
        light3.distance = light2.distance = 720;
        light3.exponent = light2.exponent = 100;

        scene.add(light2);
        scene.add(light3);

        var DisplaceMaterial = function ( parameters ) {
            THREE.MeshLambertMaterial.call( this );
            this.type = 'ShaderMaterial';
            this.setValues( parameters );

            this.uniforms = THREE.UniformsUtils.clone( THREE.ShaderLib.lambert.uniforms );

            this.uniforms.tail = {type: "f", value: 1.0};
            this.uniforms.minThickness = {type: "f", value: -20.0};
            this.uniforms.maxThickness = {type: "f", value: 50.0};
            this.uniforms.tailLength = {type: "f", value: 1.0};
            this.uniforms.angleRad = {type: "f", value: 0.0};
            this.uniforms.angleDec = {type: "f", value: 0.0};

            var strContains = R.curry(R.pipe(R.strIndexOf, R.lte(0)))

            var lines = THREE.ShaderLib.lambert.vertexShader.split('\n');
            var mainLine = R.findIndex(strContains('void main()'))(lines)
            lines[mainLine] = lines[mainLine].replace(/main/, 'mainOriginal');

            var newLines = document.getElementById('vertexShader').textContent;
            R.insert(
                R.findIndex(strContains('void main()'))(newLines) + 1,
                'mainOriginal();',
                newLines
            )

            lines.push(newLines);
            this.vertexShader = lines.join('\n');
            this.fragmentShader = THREE.ShaderLib.lambert.fragmentShader;
        }
        DisplaceMaterial.prototype = Object.create( THREE.MeshLambertMaterial.prototype );
        DisplaceMaterial.prototype.constructor = DisplaceMaterial;

        var colours = [];
        var materials = [];

        colours['pastelGreen']      = new THREE.Color().setHSL(0.35, 1, 0.5);
        colours['pastelBlueGreen']  = new THREE.Color().setHSL(0.36, 1, 0.5);
        colours['pastelYellow']     = new THREE.Color().setHSL(0.3,  1, 0.55);

        colours['purple']           = new THREE.Color().setHSL(0.73,    1,      0.5);
        colours['pink']             = new THREE.Color().setHSL(0.75,    1,      0.5);
        colours['green']            = new THREE.Color().setHSL(0.35,    1,      0.5);
        colours['yellow']           = new THREE.Color().setHSL(0.29,    1,      0.5);

        colours['lime']             = new THREE.Color().setHSL(0.325,   1,      0.5);
        colours['lightBlue']        = new THREE.Color().setHSL(0.55,    1,      0.54);
        colours['black']            = new THREE.Color().setHSL(0,       0,      0);
        colours['white']            = new THREE.Color().setHSL(0,       0,      1);
        colours['modelWhite']       = new THREE.Color().setHSL(0,       0,      0.5);
        colours['bgBlueGreen']      = new THREE.Color().setHSL(0.55,    0.8,    0.7);

        materials['pastelGreen']        = new DisplaceMaterial({color: colours['pastelGreen']       , emissive: colours['lime']});
        materials['pastelBlueGreen']    = new DisplaceMaterial({color: colours['pastelBlueGreen']   , emissive: colours['lime']});
        materials['pastelYellow']       = new DisplaceMaterial({color: colours['pastelYellow']      , emissive: colours['lime']});
        materials['purple']             = new DisplaceMaterial({color: colours['pink']              , emissive: colours['lime']});
        materials['lightBlue']          = new DisplaceMaterial({color: colours['lightBlue']         , emissive: colours['lime']});
        materials['black']              = new DisplaceMaterial({color: colours['black']             , emissive: colours['lime']});
        materials['white']              = new DisplaceMaterial({color: colours['white']             , emissive: colours['lime']});
        materials['modelWhite']         = new DisplaceMaterial({color: colours['modelWhite']        , emissive: colours['lime']});

        materials['pink']               = new DisplaceMaterial({    emissive: colours['purple'] , color: colours['pink']              });
        materials['lime']               = new DisplaceMaterial({    emissive: colours['green']   , color: colours['yellow']      });

        materials['bgBlueGreen']        = new THREE.MeshBasicMaterial({     color: colours['bgBlueGreen']       });
        materials['bgBlack']            = new THREE.MeshBasicMaterial({     color: colours['black']             });
        materials['bgYellow']           = new THREE.MeshBasicMaterial({     color: new THREE.Color().setHSL(0.17, 1, 0.5)             });
        materials['bgGreen']            = new THREE.MeshBasicMaterial({     color: new THREE.Color().setHSL(0.30, 1, 0.5)             });
        materials['bgPink']             = new THREE.MeshBasicMaterial({     color: colours['pink'] });
        materials['bgPurple']           = new THREE.MeshBasicMaterial({     color: colours['purple'] });

        var bgGeom = new THREE.PlaneGeometry(3000, 3000, 32);
        var bg = new THREE.Mesh(bgGeom, materials['bgYellow']);
        scene.add( bg );

        var ToroidalHelixCurve = THREE.Curve.create(
            function(circleRadius, radius, turns) {
                this.circleRadius = circleRadius;
                this.radius = radius;
                this.turns = turns;
            },

            function(position) {
                var p = 2 * position * Math.PI;
                var m = this.turns % 1;
                if (m !== 0) {
                    p *= 1 / m;
                }
                var x = this.circleRadius * Math.cos(p);
                var y = this.circleRadius * Math.sin(p);
                var z = 0;
                x += this.radius * Math.cos(this.turns * p) * Math.cos(p);
                y += this.radius * Math.cos(this.turns * p) * Math.sin(p);
                z += this.radius * Math.sin(this.turns * p);
                return new THREE.Vector3(x, y, z);
            }
        );

        var curveSpec = [
        {
            circleRadius: 100,
            radius: 20,
            turns: 6,
            thickness: 10,
            rotationSpeed: 0
        },{
            circleRadius: 100,
            radius: 20,
            turns: 6,
            thickness: 10,
            rotation: Math.PI / 6,
            rotationSpeed: 0
        }
        ]

        var tubes = [];

        var scenes = [
        {
        tubes: [
            {
                index: 0,
                material: materials.pink,
                tail: {
                    minThickness: -10,
                    maxThickness: 5,
                    speed: 0.25,
                    len: 0.8,
                    offset: (1/(6*2)) * -1,
                }
            },{
                index: 1,
                material: materials.lime,
                tail: {
                    minThickness: -10,
                    maxThickness: 5,
                    speed: 0.25,
                    len: 0.8,
                    offset: 0,
                }
            },
        ],
        bg: materials['bgBlack']
        }
        ]

        var animation = [
            {t: 0.0, scene: 0},
            {t: 1.0},
        ];

        var generate = function() {
            var curve, geom, tube;
            for (var i = 0; i < curveSpec.length; i++) {
                curve = new ToroidalHelixCurve(
                    curveSpec[i].circleRadius,
                    curveSpec[i].radius,
                    curveSpec[i].turns
                );

            geom = new THREE.TubeGeometry(
                curve,
                Math.round(curve.getLength()/5),
                curveSpec[i].thickness,
                40,
                true
            );

            tube = new THREE.Mesh(geom, curveSpec[i].material);
            tube.rotateOnAxis(
                new THREE.Vector3(0, 0, 1),
                curveSpec[i].rotation || 0
            );

            tubes.push(tube);
            group.add(tube);
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();

            var t = Number(new Date())/1000;
            var step = (t - lastTimestamp); // Seconds passed
            lastTimestamp = t;

            var normaliseTime = R.modulo(t, R.max(R.pluck('t', animation)));
            var currentFrame = R.compose(R.gte(normaliseTime), R.prop('t'));
            var frame = R.find(currentFrame)(R.reverse(animation));
            var scene = scenes[frame.scene];

            bg.material = scene.bg;

            var visible, spec, specOverride;
            tubes.forEach(function(tube, index) {
                specOverride = R.find(R.propEq('index', index))(scene.tubes);
                tube.visible = specOverride !== undefined;
                if (tube.visible) {
                    spec = R.merge(curveSpec[index], specOverride);
                    tube.rotateOnAxis(
                        new THREE.Vector3(0, 0, 1),
                        spec.rotationSpeed * step
                    );
                    tube.material = spec.material;
                    if (spec.tail) {
                        spec.material.uniforms['tail'].value = 2.0;
                        spec.material.uniforms['angleDec'].value = (t * spec.tail.speed + spec.tail.offset) % 1;
                        spec.material.uniforms['minThickness'].value = spec.tail.minThickness;
                        spec.material.uniforms['maxThickness'].value = spec.tail.maxThickness;
                        spec.material.uniforms['tailLength'].value = spec.tail.len;
                    }
                }
            });

            var dist = 500;
            var lerp = -0.3;

            light2.position.copy(camera.position).lerp(
                new THREE.Vector3(),
            lerp);
            light2.rotation.copy(camera.rotation);
            light2.translateX(dist);

            light3.position.copy(camera.position).lerp(
                new THREE.Vector3(),
            lerp);
            light3.rotation.copy(camera.rotation);
            light3.translateX(dist * -1);


            //bg.position.copy(new THREE.Vector3(0, 0, 0));
            //bg.rotation.copy(camera.rotation);
            //bg.translateZ(-500);

            render();
        }

        var start = Number(new Date());

        function render() {
            renderer.render(scene, camera);
        }

        function storeControls() {
            var state = JSON.stringify({
                target: controls.target.toArray(),
                position: controls.object.position.toArray(),
                up: controls.object.up.toArray()
            })
            sessionStorage.setItem('NqyQQecontrols', state);
        }

        function restoreControls() {
            var state = sessionStorage.getItem('NqyQQecontrols');if (!state) {
                state = '{"target":[0,0,0],"position":[-45.65772039330777,177.29588463296838,-144.5520121365038],"up":[0.7263024367675841,-0.3122337025726536,-0.6123682595657302]}';
            }
            state = JSON.parse(state);
            controls.target0.fromArray(state.target);
            controls.position0.fromArray(state.position);
            controls.up0.fromArray(state.up);
            controls.reset();
        }

        generate();

        controls.addEventListener('change', function() {
            render();
            storeControls();
        });

        restoreControls();
        animate();
    }

    this.setInterestsChart  = function(interestTitle, interestNumber) {
        $this.interestTitle = interestTitle;
        $this.interestNumber = interestNumber;
    }

    this.interests_chart_d3  = function() {
        $('.cont_w').prepend('<div class="cont_w_bg_interests_chart"></div>');

        var svg = d3.select(".cont_w_bg_interests_chart").append("svg").append("g")

        svg.append("g").attr("class", "slices");
        svg.append("g").attr("class", "labels");
        svg.append("g").attr("class", "lines");

        var width = 965,
            height = 518,
            radius = Math.min(width, height)/2;

        var pie = d3.layout.pie()
            .sort(null).value(function(d) {
                return d.value;
        });

        var arc = d3.svg.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
        var outerArc = d3.svg.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);
        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var key = function(d){ return d.data.label; };

        var color = d3.scale.ordinal()
            .domain($this.interestTitle)
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        function randomData (){
            var labels = color.domain();
            return labels.map(function(label){
                return { label: label, value:  $this.interestNumber[label]}
            });
        }

        change(randomData());

        /*d3.select(".randomize")
            .on("click", function(){
                change(randomData());
        });*/

        function change(data) {
            var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

            slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .attr("class", "slice");

            slice
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })

            slice.exit().remove();

            /* ------- TEXT LABELS -------*/
            var text = svg.select(".labels").selectAll("text")
                .data(pie(data), key);

            text.enter()
                .append("text")
                .attr("dy", ".35em")
                .attr("font-family", "Tahoma, Arial, Verdana, sans-serif")
                .attr("font-weight", "bold")
                .text(function(d) {
                    return d.data.label;
                });

            function midAngle(d){
                return d.startAngle + (d.endAngle - d.startAngle)/2;
            }

            text.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

            text.exit().remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/
            var polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(data), key);

                polyline.enter().append("polyline");

            polyline.transition().duration(1000)
                .attrTween("points", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };
                });

            polyline.exit().remove();
        };
    }

    this.bubble_planet_three  = function() {
        $('.cont_w').prepend('<div id="cont_w_bg_animated" class="cont_w_bg_bubble_planet"></div>');
        var renderer = new THREE.WebGLRenderer({alpha: true}),
            COLORS = [0x69D2E7, 0xA7DBD8, 0xE0E4CC, 0xF38630, 0xFA6900, 0xFF4E50, 0xF9D423],
            RADIUS = 500,
            spheres = [],
            camera, scene, geometry, material, mesh;

        Sketch.create({
            type: Sketch.WEBGL,
            element: renderer.domElement,
            context: renderer.context,
            container: document.getElementById('cont_w_bg_animated'),
            setup: function() {
                camera = new THREE.PerspectiveCamera(75, this.width/this.height, 1, 10000);
                camera.position.z = 1000;

                scene = new THREE.Scene();
                geometry = new THREE.SphereGeometry( RADIUS, 30, 30 );
                material = new THREE.MeshBasicMaterial({color: 0xdbd9d9});
                mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );

                for (var i = 0; i < 30; i++) {
                    geometry = new THREE.SphereGeometry( random(5, 20), 10, 10 );
                    material = new THREE.MeshBasicMaterial( { color: random(COLORS) } );
                    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, RADIUS, 0 ) );
                    mesh = new THREE.Mesh( geometry, material );
                    mesh.rotation.x = random(100);
                    mesh.rotation.y = random(100);
                    mesh.rotation.z = random(100);
                    scene.add( mesh );
                    spheres.push( mesh );
                }
            },
            resize: function() {
                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();
                renderer.setSize( this.width, this.height );
            },
            draw: function() {
                for (var i = 0; i < spheres.length; i++) {
                    spheres[i].rotation.x += 0.01;
                    spheres[i].rotation.y += 0.01;
                    spheres[i].rotation.z += 0.01;
                    renderer.render(scene, camera);
                }
            }
        });
    }

    this.zoomwall  = function() {

    }

    this.diamond  = function() {
        var $block=$('#diamondswrap').css({opacity: 0,transition:''}).diamonds({
            size:180,
            gap :2,
            hideIncompleteRow: true, // default: false
            autoRedraw: true, // default: true
            itemSelector: '.item'
        });
        $(window).resize(function(){
            $block.css({opacity: 0,transition:''});
            setTimeout(function(){
                var $row=$('.diamond-row-wrap');
                if($row[0]){
                    var $lower=$('.diamond-row-lower').show();
                    var w=$row[0].offsetWidth, wD=$block.width(),d=(wD-w)/2;
                    $('.diamonds').css({paddingLeft:d});
                    $lower.last().hide();
                    $block.css({opacity: 1, transition:'opacity .4s'});
                }
            },100)
        }).resize();
    }

    this.world_map  = function() {

    }

    this.world_globe  = function() {

    }

    $(function(){
        $this.mainContent=$('#main_page_image_content');
        if ($this.type && typeof $this[$this.type] == 'function') {
            $this[$this.type]();
        }
    })

    return this;
}