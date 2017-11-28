${
    // Enable extension methods by adding using Typewriter.Extensions.*
    using Typewriter.Extensions.Types; 
	static List<string> visitedTypes = new List<string>();
    static List<Type> enums = new List<Type>();
    Type[] AllEnums(File f)
    {
        return enums.ToArray();
    }
	IEnumerable<Type> AllDataContracts(Type hubType)
	{
		var parameterAndReturnTypes = hubType.Methods.SelectMany(method => method.Parameters).Select(parameter => parameter.Type).Union(hubType.Methods.Select(method => method.Type));

		foreach	(var t in Flatten(parameterAndReturnTypes))
		{
            if (t.IsEnum)
            {
                if (!enums.Any(e => e.FullName == t.FullName)) enums.Add(t);
                continue;
            }
            if (t.IsPrimitive || t.FullName == "System.Void") continue;
			if (visitedTypes.Contains(t.FullName)) continue;
			visitedTypes.Add(t.FullName);
            if (t.IsEnumerable)
            {
                yield return t.TypeArguments.First();
            }
            else
            {
			    yield return t;
            }   
		}
	}
    static List<string> flattenedTypes = new List<string>(); // prevent circular reference
    IEnumerable<Type> Flatten(IEnumerable<Type> types)
    {
        if (types == null || types.Count() == 0) return new Type[0];
        types = types.Select(t => ExtractTypeFromEnumerable(t)).ToArray();
        var typesToFlatten = types.Where(t => (t.IsEnum || !t.IsPrimitive) && t.FullName != "System.Void" && !flattenedTypes.Contains(t.FullName)).ToArray();
        flattenedTypes.AddRange(typesToFlatten.Select(t=>t.FullName));
        var propertiesTypes = typesToFlatten.SelectMany(t=>t.Properties).Select(p=>p.Type).Where(t=>!flattenedTypes.Contains(t) && (t.IsEnum || !t.IsPrimitive));
        return typesToFlatten.Union(Flatten(propertiesTypes));
    }
    Type ExtractTypeFromEnumerable(Type type)
    {
        if (type.IsEnumerable) return type.TypeArguments.First();
        return type;
    }
    
	string FullNamespace(Type type)
	{
		return type.FullName.Substring(0, type.FullName.LastIndexOf("."));
	}
	string JavaScriptType(Property property) {
		var type = property.Type;
		if (!type.IsEnum && type.IsPrimitive) return type.Name;
		if (type.IsEnumerable) return type.TypeArguments.First().FullName + "[]";
		return FullNamespace(type) + "." + property.Type.Name;
	}
}
$Classes(DataContracts)[$Properties[$Type[
$AllDataContracts[
namespace $FullNamespace {
	export interface $Name {$Properties[
		$Name?: $JavaScriptType;]
	}
}]]]]
$AllEnums[
namespace $FullNamespace {
    export enum $Name {
        $Constants[$Name= $Value][,
        ]
    }
}]