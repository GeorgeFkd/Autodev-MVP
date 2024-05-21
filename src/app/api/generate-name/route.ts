import OpenAI from "openai"


interface UserInputToGenerateSoftwareTitle {
    description: string,
    softwareType: string
}

function generatePromptContent(userinput: UserInputToGenerateSoftwareTitle) {
    return `
    We are creating software with a custom tool and we are helping the user create it from scratch.
    You will always answer with the json format you were provided
    I will provide you a type of software and the user's description.
    I want you to provide me a list of words(with the structure {titles: string[] } ) that could be used as Application Names considering the information below.
    Description from user: ${userinput.description}
    Software type the user wants: ${userinput.softwareType}
    `
}
//put this in a path variable
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })
export async function POST(request: Request) {
    const userInput: UserInputToGenerateSoftwareTitle = await request.json();
    console.log("User input: ", userInput)
    const fakeUserInput: UserInputToGenerateSoftwareTitle = { description: "We are doing financial trading for the renewable energy markets", softwareType: "Big Data System" }

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { "type": "json_object" },
        messages: [{ role: "system", content: generatePromptContent(fakeUserInput) }]
    })

    const answer = completion.choices[0].message.content;
    console.log("Input | Output")
    console.log(fakeUserInput, " | ", answer)

    return Response.json(answer)
}