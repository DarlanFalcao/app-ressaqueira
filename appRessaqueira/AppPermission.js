import {check,request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { Platform } from 'react-native';

const PLATAFORM_ACCESS_COARSE_LOCATION = {
    android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
}


const PLATAFORM_FINE_LOCATION = {
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
}

const PLATAFORM_PHOTO_PERMISSIONS = {
    android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
}

const PLATAFORM_CAMERA_PERMISSION = {
    android: PERMISSIONS.ANDROID.CAMERA
}

const REQUEST_PERMISSION_TYPE = {
    localCoarse : PLATAFORM_ACCESS_COARSE_LOCATION,
    localFine: PLATAFORM_FINE_LOCATION,
    camera:PLATAFORM_CAMERA_PERMISSION,
    photo:PLATAFORM_PHOTO_PERMISSIONS
}


const PERMISSION_TYPE = {
   localCoarse:'localCoarse',
   localFine:'localFine',
   camera: 'camera',
   photo:'photo'

}


class AppPermission{

    checkPermission = async (type): Promise<boolean>=>{
        console.log("AppPermission - checkPermission type : ",type)
        const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS]
        console.log("AppPermission -checkPermission permissions  : ",permissions)
        if(!permissions){
            return true
        }
        try{

            const result = await check(permissions)
            console.log("AppPermission -checkPermission result  : ",result)
            if(result === RESULTS.GRANTED)return true
            return this.requestPermission(permissions)
        }catch(error){
            console.log("AppPermission -checkPermission error  : ",error)
            return false
        }
    }

        requestPermission = async (permissions): Promise<boolean> =>{
            console.log("AppPermission - requestPermission permissions  : ",permissions)
            try{
                const result = await request(permissions)
                return result === RESULTS.GRANTED
            }catch (error){
                console.log("AppPermission - requestPermission error  : ",error)
                return false
            }
        }

        requestMultiple = async(types): Promise<boolean> =>{
            console.log('AppPermission requestMultiple types: ',types)
            const results = []
            for(const type of types){
                const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS]
                if(permission){
                    const result = await this.requestPermission(permission)
                    results.push(result)
                }
            }
            for(const result of results){
                if(!result){
                    return false
                }
            }
            return true

        }
  


}

const Permission = new AppPermission()
export {Permission, PERMISSION_TYPE}