import { Global } from "../Global";
import { APIService } from "./APIService";
import { GraphQLService } from "./GraphQLService";
import { ImageUploadService } from "./ImageUploadService";

type ChargeAdvisorConfig = GraphQLService.Type.ChargeAdvisorConfig

export namespace AdminService {

    export function getChargeAdvisorConfig(onGetSuccess: (config: ChargeAdvisorConfig) => void, onFailure?: (error: any) => void) {
        APIService.axios('/api/admin/server-config/charge-advisor/get-config')
            .then(response => response.data)
            .then(data => onGetSuccess(data as ChargeAdvisorConfig))
            .catch(error => onFailure?.(error))
    }

    export function canUsePromoCode(code: string, onSuccess: () => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/promo/can-use-code/${code}`)
            .then(response => onSuccess())
            .catch(error => onError?.(error))
    }

    export function addPromotion(promotion: any, onSuccess: (id: number) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/promo/add`, 'post', promotion)
            .then(response => response.data as number)
            .then(id => onSuccess(id))
            .catch(error => onError?.(error))
    }

    export function getWallet(shipperId: number, onSuccess: (wallet: GraphQLService.Type.Wallet) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/get-wallet/${shipperId}`)
            .then(response => response.data as GraphQLService.Type.Wallet)
            .then(data => onSuccess(data))
            .catch(onError)
    }

    export function getHistory(walletId: number, onSuccess: (list: GraphQLService.Type.TransactionHistory[]) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/wallet/shared/transaction-history-by-wallet-id/${walletId}`)
            .then(response => response.data as GraphQLService.Type.TransactionHistory[])
            .then(data => onSuccess(data))
            .catch(onError)
    }

    export function getWalletInfo(shipperId: number, onSuccess: (wallet: GraphQLService.Type.Wallet) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/wallet/shared/get-info/${shipperId}`)
            .then(response => response.data as GraphQLService.Type.Wallet)
            .then(wallet => onSuccess(wallet))
            .catch(onError)
    }

    export function getPeningWithdraw(onSuccess: (list: GraphQLService.Type.Withdraw[]) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/get-pending-withdraw`)
            .then(response => response.data as GraphQLService.Type.Withdraw[])
            .then(list => onSuccess(list))
            .catch(onError)
    }


    export function confirmWithdraw(withdrawId: number, onSuccess: () => void, onError?: (error: any) => void) {
        const uploadObj = {
            withdrawId,
            adminId: Global.User.CurrentUser.id
        }
        APIService.axios(`/api/admin/confirm-withdraw`, 'post', uploadObj)
            .then(list => onSuccess())
            .catch(onError)
    }

    export function deposit(param: { photoUrl: string, amount: number, walletId: number }, onSuccess: () => void, onError?: (error: any) => void) {
        ImageUploadService.upload(
            param.photoUrl,
            {
                onUploaded(url) {
                    const uploadObj = {
                        amount: param.amount,
                        adminId: Global.User.CurrentUser.id,
                        walletId: param.walletId,
                        photoUrl: url
                    }
                    APIService.axios('/api/admin/deposit-wallet', 'post', uploadObj)
                        .then(response => onSuccess())
                        .catch(onError)
                },
                onUploadFailure(error) {
                    onError?.(error)
                },
            }
        )
    }

    export function getRatingList(onSuccess: (list: GraphQLService.Type.Rating[]) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/get-rating-list`)
            .then(response => response.data as GraphQLService.Type.Rating[])
            .then(list => onSuccess(list))
            .catch(onError)
    }


    export function markRating(ratingId: number, marked: boolean, onSuccess: () => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/mark-rating/${ratingId}`, 'post', { marked })
            .then(list => onSuccess())
            .catch(onError)
    }

    export function changeCommissionrate(rate: number, onSuccess: () => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/set-commission-rate/aid=${Global.User.CurrentUser.id}&sr=${rate}`)
            .then(onSuccess)
            .catch(onError)
    }

    export function getLogs(date: Date, onSuccess: (list: GraphQLService.Type.SystemLog[]) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/get-system-logs/${date.getTime()}`)
            .then(response => response.data as GraphQLService.Type.SystemLog[])
            .then(list => onSuccess(list))
            .catch(onError)
    }

}