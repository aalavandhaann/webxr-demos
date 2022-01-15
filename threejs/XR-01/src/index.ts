import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { Color, LineBasicMaterial, LineSegments} from 'three';
import { sRGBEncoding } from 'three';
import { Group } from 'three';
import { HemisphereLight, DirectionalLight } from 'three';
import { Clock, Vector3 } from 'three';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';


import { VRUtility } from './scripts/utils/VRUtils';

export class Index{
    count: number = 0;
    radius: number = 0.08;
    normal: Vector3;
    readonly relativeVelocity: Vector3 = new Vector3();
    readonly clock: Clock = new Clock();

    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    room: LineSegments;

    controller1: Group;
    controller2: Group;
    controllerGrip1: Group;
    controllerGrip2: Group;

    controls: OrbitControls;

    windowResizeEventHandler: any;

    constructor(){
        this.__initialize();
        this.__setupXRControllers();
        this.__setupEventsAndListeners();
        this.__configureCameraControls();
        this.renderer.setAnimationLoop(this.__renderVRScene.bind(this));
    }

    __initialize(): void
    {
        const light = new DirectionalLight(0xFFFFFF);

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
        this.renderer = new WebGLRenderer({antialias: true});
        this.room = new LineSegments(new BoxLineGeometry(6, 6, 6, 10, 10, 10), new LineBasicMaterial({color: 0x808080}));

        light.position.set( 1, 1, 1 ).normalize();

        this.scene.background = new Color(0x606060);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.xr.enabled = true;

        this.scene.add(this.room);
        this.scene.add(new HemisphereLight(0x606060, 0x404040));
        this.scene.add(light);

        document.body.appendChild(this.renderer.domElement);
    }

    __setupXRControllers(): void{
        const controllerModelFactory = new XRControllerModelFactory();

        this.controller1 = this.renderer.xr.getController(0);
        this.controller2 = this.renderer.xr.getController(1);

        this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
        this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);

        this.controllerGrip1.add(controllerModelFactory.createControllerModel(this.controllerGrip1));
        this.controllerGrip2.add(controllerModelFactory.createControllerModel(this.controllerGrip2));

        
        this.scene.add(this.controller1);
        this.scene.add(this.controller2);
        this.scene.add(this.controllerGrip1);
        this.scene.add(this.controllerGrip2);
    }    

    __setupEventsAndListeners(): void{
        this.windowResizeEventHandler = this.__resizeWindowEvent.bind(this);
        window.addEventListener('resize', this.windowResizeEventHandler);
    }

    __setupOrbitControls(): void{
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.controls.maxDistance = 5;
        this.controls.minDistance = 1;
        this.controls.screenSpacePanning = false;
        this.controls.enablePan = false;
    }

    __configureCameraControls(): void{
        VRUtility.deviceHasVRSupport().then(function(supported){
            if(supported){
                document.body.appendChild(VRUtility.createButton(this.renderer));
            }
            else{
                this.__setupOrbitControls();
            }            
        }.bind(this));        
    }


    __resizeWindowEvent(): void{
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    __renderVRScene(): void{
        if(this.controls){
            this.controls.update();
        }        
        this.renderer.render(this.scene, this.camera);
    }
}

let i:Index = new Index();