/// <reference path="../../app/app.ts" />
interface IAccountApiController {
    getAccountDetails(id?: number): ng.IHttpPromise<LookingForGroup.Api.AccountApiController.AccountDetails>;
    updateAccount(accountDetails: LookingForGroup.Api.AccountApiController.AccountDetails): ng.IHttpPromise<void>;
    deleteAccount(): ng.IHttpPromise<void>;
}
class AccountApiController implements IAccountApiController {

    constructor(private $http: ng.IHttpService) { 
    } 
        
    public getAccountDetails = (id?: number): ng.IHttpPromise<LookingForGroup.Api.AccountApiController.AccountDetails> => {
            
        return this.$http<LookingForGroup.Api.AccountApiController.AccountDetails>({
            url: `/api/Account/GetAccountDetails?id=${id}`, 
            method: "get", 
            data: null
        });
    };
        
    public updateAccount = (accountDetails: LookingForGroup.Api.AccountApiController.AccountDetails): ng.IHttpPromise<void> => {
            
        return this.$http<void>({
            url: `/api/Account/UpdateAccout`, 
            method: "post", 
            data: accountDetails
        });
    };
        
    public deleteAccount = (): ng.IHttpPromise<void> => {
            
        return this.$http<void>({
            url: `/api/Account/DeleteAccount`, 
            method: "post", 
            data: null
        });
    };
}
app.service("AccountApiService", ["$http", AccountApiController]);