${
    using Typewriter.Extensions.WebApi;
	string ServerFullName(Class cls) => cls.Namespace + "." + ServerName(cls);
	string ServerName(Class cls) => cls.Name + "Server";
	string ClientFullName(Class cls) => cls.BaseClass.TypeArguments.Count == 0 ? "any" : cls.Namespace + "." + cls.BaseClass.TypeArguments[0].Name;
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
}
interface SignalR {$Classes(:Hub)[
	$name: $FullName]
}
$Classes(:Hub)[
declare module $Namespace {
	interface $Name {
		server: $ServerFullName;
		client: $ClientFullName;
	}

	interface $ServerName {$Methods[
		$name($Parameters[$name: $Type[$JavaScriptType]][, ]): JQueryPromise<$Type[$JavaScriptType]>
	]}

    $BaseClass[$TypeArguments[interface $Name { $Methods[
		$name: ($Parameters[$name: $Type[$JavaScriptType]][, ]) => JQueryPromise<$Type[$JavaScriptType]>;
	}]]
}]]