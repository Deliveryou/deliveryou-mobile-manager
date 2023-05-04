import { APIService } from "./APIService";
import { GraphQLService } from "./GraphQLService";

type DeliveryPackage = GraphQLService.Type.DeliveryPackage

export namespace PackageService {

    export function getAllDeliveryPackages(userId: number, onGetSuccess: (deliveryPackages: DeliveryPackage[]) => void, onFailure?: (error: any) => void) {
        APIService.axios(`/api/admin/get-all-delivery-packages/${userId}`)
            .then(response => response.data)
            .then(data => onGetSuccess(data as DeliveryPackage[]))
            .catch(error => onFailure?.(error))
    }
}