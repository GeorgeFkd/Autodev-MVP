
type CodegenInput = {
    openAPIUrl: string,
    language: string,
    options: {},
    spec: {}
}

type CodegenResult = {
    link: string,
    code: string
}


export async function POST(request: Request) {
    const userInput: CodegenInput = await request.json();
    const resultOfCodegen: CodegenResult = await fetch(`http://api.openapi-generator.tech/api/gen/clients/${userInput.language}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            openAPIUrl: userInput.openAPIUrl,
            options: {},
            spec: {}
        })
    })
        .then((response) => {
            console.log("Response received from API", response)
            // dispatch({ type: "setGeneratedCode", payload: data })
            //"link":string,"code":string
            return response.json() as Promise<CodegenResult>
        })

    return Response.json(resultOfCodegen)
}