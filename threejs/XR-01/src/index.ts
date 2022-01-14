import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { Color, LineBasicMaterial, LineSegments} from 'three';
import { sRGBEncoding } from 'three';
import { Group } from 'three';
import { HemisphereLight, DirectionalLight } from 'three';
import { Clock, Vector3 } from 'three';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';


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

    windowResizeEventHandler: any;

    constructor(){
        this.__initialize();
        this.__setupXRControllers();
        this.__setupEventsAndListeners();
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

        this.scene.background = new Color(0x505050);

        this.camera.position.set(0, 1.6, 3);

        this.room.geometry.translate(0, 3, 0);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.xr.enabled = true;

        console.log(this.renderer.xr);


        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));


        this.scene.add(this.room);
        this.scene.add(new HemisphereLight(0x606060, 0x404040));
        this.scene.add(light);
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


    __resizeWindowEvent(): void{
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    __renderVRScene(): void{
        this.renderer.render(this.scene, this.camera);
    }
}

let i:Index = new Index();