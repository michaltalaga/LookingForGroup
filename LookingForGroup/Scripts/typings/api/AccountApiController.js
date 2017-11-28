var AccountApiController = /** @class */ (function () {
    function AccountApiController($http) {
        var _this = this;
        this.$http = $http;
        this.getAccountDetails = function () {
            return _this.$http({
                url: "api/accountApi/",
                method: "get",
                data: null
            });
        };
        this.updateAccount = function (accountDetails) {
            return _this.$http({
                url: "api/accountApi/",
                method: "post",
                data: accountDetails
            });
        };
    }
    return AccountApiController;
}());
app.service("AccountApiService", ["$http", AccountApiController]);
