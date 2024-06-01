import OpenAI from "openai"


function generatePromptContent(openAPIrouteDescriptions: UserInputToGenerateAnalyticsTypesForRoutes) {
    return `
    We are creating software with a custom tool and we are helping the user create it from scratch.
    You will always answer with the json format you were provided
    I will provide you a list of OpenAPI routes descriptions.
    I want you to provide me a list of the values true/false  depending on what type of data you think that description of data corresponds to..
    true -> if you think it is "REALTIME"
    false -> if you think it is "HISTORICAL" 
    Return it in the form of {routes:boolean[]}
    Route descriptions from user: ${openAPIrouteDescriptions.descriptions.map(r => {
        return `
- ${r}
`
    })}
    `
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

interface UserInputToGenerateAnalyticsTypesForRoutes {
    descriptions: string[]
}

export async function POST(request: Request) {
    const userInput: UserInputToGenerateAnalyticsTypesForRoutes = await request.json();

    console.log("Generating analytics data types")
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { "type": "json_object" },
        messages: [{ role: "system", content: generatePromptContent(userInput) }]
    })

    const answer = completion.choices[0].message.content as string;
    const jsonAnswer = JSON.parse(answer)
    const finalAnswer = jsonAnswer.routes
    console.log("Input | Output")
    console.log(userInput, " | ", answer)

    return Response.json(finalAnswer)
}