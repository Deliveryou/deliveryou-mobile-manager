import axios, { AxiosError, AxiosResponse } from "axios";
import { Global } from "../Global";
import { APIService } from "./APIService";
import { GraphQLService } from "../services/GraphQLService";

export namespace UserService {

    export type LooseObject = {
        [key: string]: any
    }

    export function phoneExists(phoneNumber: string, onResponse?: (exists: boolean) => void, onFailure?: (error: any) => void) {
        APIService.axios(`/api/user/can-use-phone/${phoneNumber}`)
            .then(response => response.data as { exists: boolean })
            .then(data => onResponse?.(data.exists))
            .catch(error => onFailure?.(error))
    }

    export function verifyPassword(userId: number, password: string, onResponse?: (matched: boolean) => void, onFailure?: (error: any) => void) {
        const body = {
            userId,
            password
        }
        const headers = {
            'Content-Type': 'application/json'
        }
        APIService.axios('/api/user/verify-password', 'post', body, headers)
            .then(response => response.data as { matched: boolean })
            .then(data => onResponse?.(data.matched))
            .catch(error => onFailure?.(error))
    }

    export function updateProfilePhoto(profilePhotoUrl: string, onResponse?: (updated: boolean) => void, onFailure?: (error: any) => void) {
        updateUser(
            {
                id: Global.User.CurrentUser.id,
                profilePictureUrl: profilePhotoUrl
            },
            onResponse,
            onFailure
        )
    }

    export function updateUser(updatedUser: GraphQLService.Type.User | LooseObject, onResponse?: (updated: boolean) => void, onFailure?: (error: any) => void) {
        const body = updatedUser
        const headers = {
            'Content-Type': 'application/json'
        }
        APIService.axios('/api/user/update-user', 'post', body, headers)
            .then(response => response.data as { updated: boolean })
            .then(data => onResponse?.(data.updated))
            .catch(error => onFailure?.(error))
    }
}