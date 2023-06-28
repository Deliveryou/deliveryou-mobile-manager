import { APIService } from "./APIService";
import { GraphQLService } from "./GraphQLService";

export namespace PromotionService {

    export function getPromotion(key: string, onSuccess: (list: GraphQLService.Type.Promotion[]) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/promo?search=${key}`)
            .then(response => response.data as GraphQLService.Type.Promotion[])
            .then(list => onSuccess(list))
            .catch(error => onError?.(error))
    }

}