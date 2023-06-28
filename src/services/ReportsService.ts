import { Global } from "../Global"
import { APIService } from "./APIService"

export namespace ReportsService {
    export type QuickReports = {
        onlineUsers: number
        onlineShippers: number
        totalShipper: number
        totalUsers: number
        allTimePackages: number
    }

    export type MonthlyRevenue = {
        month: string,
        value: number
    }

    export type DistributionData = {
        type: string
        count: number
    }

    export function revenuesOfMonths(months: string[], onSuccess: (list: MonthlyRevenue[]) => void, onError?: (error: any) => void) {
        const uploadObj = {
            userId: Global.User.CurrentUser.id,
            months
        }
        APIService.axios('/api/admin/package/reports/revenues-of-months', 'post', uploadObj)
            .then(response => response.data as MonthlyRevenue[])
            .then(list => onSuccess(list))
            .catch(error => onError?.(error))
    }

    export function quickReports(onSuccess: (reports: QuickReports) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/package/reports/quick-reports`)
            .then(response => response.data as QuickReports)
            .then(data => onSuccess(data))
            .catch(error => onError?.(error))
    }

    export function categoryDistribution(onSuccess: (list: DistributionData[]) => void, onError?: (error: any) => void) {
        APIService.axios(`/api/admin/package/reports/category-distribution`)
            .then(response => response.data as DistributionData[])
            .then(data => onSuccess(data))
            .catch(error => onError?.(error))
    }
}