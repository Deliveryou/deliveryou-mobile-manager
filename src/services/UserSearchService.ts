import { APIService } from "./APIService";
import { GraphQLService } from "./GraphQLService";

type User = GraphQLService.Type.User

export enum FilterType {
    USER_ID = 0,
    PHONE = 1,
    NAME = 2,
    BIRTH_YEAR = 3,
    ALL = 4,
    CITIZEN_ID = 5
}

export namespace UserSearchService {

    export type SearchFilter = {
        type: number,
        value: string
    }

    export function getUsers(filter: { type: FilterType, value: string, startIndex: number, endIndex: number }, type: 'user' | 'shipper' = 'user', onGetSuccess?: (users: User[]) => void, onFailure?: (error: any) => void) {
        const endpoint = (type === "user") ? 'all-regular-users' : 'all-shippers'
        APIService.axios(`/api/admin/${endpoint}`, "post", filter)
            .then(response => response.data)
            .then(users => {
                if (Array.isArray(users)) {
                    const _users1 = users as any[]
                    _users1.forEach(user => {
                        const dob: number[] = user.dateOfBirth
                        if (dob && dob[0] && dob[1] && dob[2])
                            user.dateOfBirth = `${dob[0]}-${dob[1]}-${dob[2]}`
                    })
                }
                onGetSuccess?.(users as User[])
            })
            .catch(error => onFailure?.(error))
    }

    function markUserAsDeleted(userId: number, deleted: boolean = true, onSuccess?: () => void, onFailure?: (error: any) => void) {
        const endpoint = (deleted) ? 'ban-user' : 'unban-user'
        APIService.axios(`/api/admin/${endpoint}/${userId}`)
            .then(reponse => onSuccess?.())
            .catch(error => onFailure?.(error))
    }

    export function banUser(userId: number, onSuccess: () => void, onFailure?: (error: any) => void) {
        markUserAsDeleted(userId, true, onSuccess, onFailure)
    }

    export function unbanUser(userId: number, onSuccess: () => void, onFailure?: (error: any) => void) {
        markUserAsDeleted(userId, false, onSuccess, onFailure)
    }
}