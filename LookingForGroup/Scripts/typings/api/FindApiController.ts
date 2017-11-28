/// <reference path="../../app/app.ts" />
interface IFindApiController {
    find(query: LookingForGroup.Api.FindApiController.FindPlayersQuery): ng.IHttpPromise<LookingForGroup.Api.FindApiController.PlayerDetails[]>;
}
class FindApiController implements IFindApiController {

    constructor(private $http: ng.IHttpService) { 
    } 
        
    public find = (query: LookingForGroup.Api.FindApiController.FindPlayersQuery): ng.IHttpPromise<LookingForGroup.Api.FindApiController.PlayerDetails[]> => {
            
        return this.$http<LookingForGroup.Api.FindApiController.PlayerDetails[]>({
            url: `/api/Find/Find`, 
            method: "post", 
            data: query
        });
    };
}
app.service("FindApiService", ["$http", FindApiController]);