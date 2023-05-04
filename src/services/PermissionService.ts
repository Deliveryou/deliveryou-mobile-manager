import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export namespace PermissionService {

    export namespace Camera {
        export function checkPermission(onUsable: () => void, onUnusable: () => void, onError?: (error: any) => void) {
            check(PERMISSIONS.ANDROID.CAMERA)
                .then((result) => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            onUnusable()
                            break;
                        case RESULTS.DENIED:
                            onUnusable()
                            break;
                        case RESULTS.LIMITED:
                            onUnusable()
                            break;
                        case RESULTS.GRANTED:
                            onUsable()
                            break;
                        case RESULTS.BLOCKED:
                            onUnusable()
                            break;
                    }
                })
                .catch(error => onError?.(error))
        }

        export function requestPermission(onUsable: () => void, onUnusable: () => void, onError?: (error: any) => void) {
            request(PERMISSIONS.ANDROID.CAMERA)
                .then((result) => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            onUnusable()
                            break;
                        case RESULTS.DENIED:
                            onUnusable()
                            break;
                        case RESULTS.LIMITED:
                            onUnusable()
                            break;
                        case RESULTS.GRANTED:
                            onUsable()
                            break;
                        case RESULTS.BLOCKED:
                            onUnusable()
                            break;
                    }
                })
                .catch(error => onError?.(error))
        }
    }
}