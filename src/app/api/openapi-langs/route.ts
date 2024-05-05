

export async function GET(request: Request) {
    const availableLanguages = await fetch("http://api.openapi-generator.tech/api/gen/clients").then((response) => {
        return response.json() as Promise<string[]>
    })
    if (!availableLanguages) {
        return Response.json(["Error fetching data"])
    }
    return Response.json(availableLanguages.filter(lang => lang.startsWith("scala") || lang.startsWith("java") || lang.startsWith("csharp")))
}