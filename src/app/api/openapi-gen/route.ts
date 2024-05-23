import { NextRequest } from "next/server"
import unzipper from 'unzipper';
import { Readable } from 'stream';
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

export async function POST(request: NextRequest) {
    const userInput: CodegenInput = await request.json();

    const baseUrl = "http://api.openapi-generator.tech"
    const operationUrl = "api/gen/clients"
    //might need this for the openapi-normalizer stuff to exclude paths
    const options = {}
    const resultOfCodegen: CodegenResult = await fetch(`${baseUrl}/${operationUrl}/${userInput.language}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            openAPIUrl: userInput.openAPIUrl,
            options,
            spec: {}
        })
    })
        .then((response) => {
            console.log("Response received from API", response)
            // dispatch({ type: "setGeneratedCode", payload: data })
            //"link":string,"code":string
            return response.json() as Promise<CodegenResult>
        })

    const { link } = resultOfCodegen;
    console.log("Getting file from OpenAPI online server")
    try {
        const response = await fetch(link, {
            method: "GET",
        })
        const buffer = await response.arrayBuffer();
        const stream = Readable.from(Buffer.from(buffer))
        const zipStream = stream.pipe(unzipper.Parse({ forceStream: true }))

        for await (const entry of zipStream) {
            const path = entry.props.path
            const content = await entry.buffer();
            console.log("Path:", path)
            const result = await uploadFileToGithub(path, content.toString("base64"))
            if (!result.body) continue
            const response = await result.json()
            console.log("Api returned: ", response)
        }

        //and add them to the github repo.
        //It is a zip i should process
        //ForEach(File in Zip) {sendToRepo()}

    } catch (e) {
        console.log("error that happened", e)
    }

    //now ideally i want to grab the files from there



    return Response.json(resultOfCodegen)
}

function getAuthToken() {
    console.log(process.env.GITHUB_TOKEN)
    return process.env.GITHUB_TOKEN as string;
}

function getUser() {
    console.log(process.env.GITHUB_USER)

    return process.env.GITHUB_USER as string;
}

function getEmail() {
    console.log(process.env.GITHUB_EMAIL)

    return process.env.GITHUB_EMAIL as string;
}
function getDefaultCommitMsg() {
    return "Initializing Github Repository with DevAutom and OpenAPI online"
}

const repo = "FinDecisionMaker"

async function uploadFileToGithub(path: string, content: string) {
    //if i want it to be on the root folder from the path i should remove the first name in the path
    // java-client/{path}.split() .....
    console.log("Uploading file to github in path: ", path)
    const message = getDefaultCommitMsg()
    const authToken = getAuthToken();
    const email = getEmail();
    //also the owner
    const committer = getUser();
    const headers = { "Authorization": `Bearer ${authToken}`, "X-Github-Api-Version": "2022-11-28", "Accept": "application/json" }
    //it has problems with serializing the content
    const request = { message, content, committer: { name: committer, email }, date: Date.now() }
    const body = JSON.stringify(request)
    return fetch(`https://api.github.com/repos/${committer}/${repo}/contents/${path}`, {
        method: "PUT",
        body,
        headers
    })

}