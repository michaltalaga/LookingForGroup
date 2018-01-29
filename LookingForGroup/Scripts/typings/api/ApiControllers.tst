${
    using Typewriter.Extensions.WebApi;

    string ServiceName(Class c) => c.Name.Replace("Controller", "Service");

    string JavaScriptType(Type type) {
        if (type.FullName == "System.Void") return "void";
        if (!type.IsEnum && type.IsPrimitive) return type.Name;
		if (type.IsEnumerable) return type.TypeArguments.First().FullName + "[]";
		return FullNamespace(type) + "." + type.Name;
    }
    string FullNamespace(Type type)
	{
		return type.FullName.Substring(0, type.FullName.LastIndexOf("."));
	}
    string Optional(Parameter parameter)
    {
        
        return parameter.Type.IsNullable ? "?" : "";
    }
    string CustomUrl(Method method)
    {
        var url = method.Url();
        foreach(var parameter in method.Parameters)
        {
            url = url.Replace($"${{{parameter.Name}}}", $"${{{parameter.Name}?{parameter.Name}:''}}");
        }

        return url;
    }
}/// <reference path="../../app/app.ts" />
$Classes(:ApiController)[interface I$Name {$Methods[
    $name($Parameters[$name$Optional: $Type[$JavaScriptType]][, ]): ng.IHttpPromise<$Type[$JavaScriptType]>;]
}
class $Name implements I$Name {

    constructor(private $http: ng.IHttpService) { 
    } $Methods[
        
    public $name = ($Parameters[$name$Optional: $Type[$JavaScriptType]][, ]): ng.IHttpPromise<$Type[$JavaScriptType]> => {
            
        return this.$http<$Type[$JavaScriptType]>({
            url: `/$CustomUrl`, 
            method: "$HttpMethod", 
            data: $RequestData
        });
    };]
}
app.service("$ServiceName", ["$http", $Name]);]