import { VRButton } from "three/examples/jsm/webxr/VRButton";

export abstract class VRUtility extends VRButton{

    static async deviceHasVRSupport(): boolean{
        if ( 'xr' in navigator ) {
            let isSupported = true;
            await navigator.xr.isSessionSupported( 'immersive-vr' ).then( function ( supported ) {
				isSupported = supported;
			});
            return isSupported;
		}
        return false;
    }
}