var FindApiController = /** @class */ (function () {
    function FindApiController($http) {
        var _this = this;
        this.$http = $http;
        this.find = function (query) {
            return _this.$http({
                url: "api/findApi/",
                method: "post",
                data: query
            });
        };
    }
    return FindApiController;
}());
app.service("FindApiService", ["$http", FindApiController]);
