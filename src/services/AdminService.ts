import { APIService } from "./APIService";
import { GraphQLService } from "./GraphQLService";

type ChargeAdvisorConfig = GraphQLService.Type.ChargeAdvisorConfig

export namespace AdminService {

    export function getChargeAdvisorConfig(onGetSuccess: (config: ChargeAdvisorConfig) => void, onFailure?: (error: any) => void) {
        APIService.axios('/api/admin/server-config/charge-advisor/get-config')
            .then(response => response.data)
            .then(data => onGetSuccess(data as ChargeAdvisorConfig))
            .catch(error => onFailure?.(error))
    }
}