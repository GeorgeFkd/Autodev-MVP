import { NextRequest } from "next/server"
import unzipper from 'unzipper';
import { Readable } from 'stream';
import path from "path"
import { CodegenInput, CodegenResult } from "@/types/types";
import OpenAI from "openai"
import SwaggerClient from "swagger-client"

function changeSrcPathTo(pathStr:string,newPath:string){
    const pathSegments = pathStr.split(path.sep)
    pathSegments[0] = newPath
    const totalNewPath = pathSegments.join(path.sep)
    return totalNewPath
}
async function GetFilesFromOASCodegenOnlineAnd(generatorInput:CodegenInput,willGenerateClient:boolean,doForEachFile:(filepath:string,filecontent:string)=>Promise<void>){
    const baseUrl = "http://api.openapi-generator.tech"
    const operationUrl = willGenerateClient ? "api/gen/clients" : "api/gen/servers"
    const completeUrl = `${baseUrl}/${operationUrl}/${generatorInput.language}`
    const resultOfCodegen:CodegenResult = await fetch(completeUrl,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            openAPIUrl:generatorInput.openAPIUrl,
            options:generatorInput.options,
            spec:generatorInput.spec
        })
    }).then((response)=> {
        console.log("Response received from API", response)
        return response.json() as Promise<CodegenResult>
    })

    const {link} = resultOfCodegen;
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
            await doForEachFile(path,content.toString("base64"))
        }
    } catch (e) {
        console.log("error that happened", e)
    }
    return resultOfCodegen
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

function generatePromptContent(titleOfOpenAPISpec:string){
    return `
    We are creating software with a custom tool and we are helping the user create it from scratch.
    You will always answer with the json format you were provided.
    I will provide you the title of the openAPI specification the user wants to consume.
    I want you to generate me a list of names, to be used as part of the path where the code will be generated on github.
    Just one word, no slashes backslashes etc. etc.
    Don't make it more than 20 characters.
    Return it in the form of {names:string[]}
    Title of openAPI Specification: ${titleOfOpenAPISpec}
`
}

async function generateFriendlyNameForClientCodeInBackend(openAPIUrl:string){
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { "type": "json_object" },
        messages: [{ role: "system", content: generatePromptContent(openAPIUrl) }]
    })

    const answer = completion.choices[0].message.content as string;
    const jsonAnswer = JSON.parse(answer)
    const finalAnswer = jsonAnswer.names
    return finalAnswer
}




export async function POST(request: NextRequest) {
    const userInput: CodegenInput & {ghRepoUrl:string} = await request.json();
    const {language,openAPIUrl,options,spec} = userInput
    const parsedOpenAPI = await new SwaggerClient(openAPIUrl)

    const title = parsedOpenAPI["spec"]["info"]["title"]
    console.log("The title is:",title)
    const namesFromChatGPT = await generateFriendlyNameForClientCodeInBackend(title)
    const randomName = namesFromChatGPT[Math.floor(Math.random() * namesFromChatGPT.length)]
    const backendSrc = "backend" + "/" + "third-party" + "/" + randomName.replace("/","")

    console.log("Everything will be put in: ",backendSrc)
    let generatedFiles:string[] = []
    let notUploaded:string[] = []
    const resultOfCodegen = GetFilesFromOASCodegenOnlineAnd({language,openAPIUrl,options,spec},true,async (filepath,filecontent)=>{
        const customPath = changeSrcPathTo(filepath,backendSrc)
        const result = await uploadFileToGithub(customPath, filecontent,userInput.ghRepoUrl)
        if(result.status !== 201){
            notUploaded.push(customPath)
        }
        // const response = await result.json()
        generatedFiles.push(filepath)
        // console.log("Api returned: ", response)
    })
    if(notUploaded.length > 0){
        console.log("The following files were not uploaded")
        console.log(notUploaded)
    }
    console.log("Backend files from OpenAPI generation are: ",generatedFiles)
    //https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=3.3.0&baseDir=demo&groupId=com.example&artifactId=demo&name=demo&description=Demo project for Spring Boot&packageName=com.example.demo&packaging=jar&javaVersion=21&dependencies=web,lombok,modulith,native,devtools,data-jpa,postgresql
    //TODO: Somehow like this i can also write the backend using this
    //but this is an extra feature for the future
    // i can also generate some custom backend files for each page
    // write the spring boot boilerplate and start a project 



    return Response.json(resultOfCodegen)
}

function getAuthToken() {
    // console.log(process.env.GITHUB_TOKEN)
    return process.env.GITHUB_TOKEN as string;
}

function getUser() {
    // console.log(process.env.GITHUB_USER)

    return process.env.GITHUB_USER as string;
}

function getEmail() {
    // console.log(process.env.GITHUB_EMAIL)

    return process.env.GITHUB_EMAIL as string;
}
function getDefaultCommitMsg() {
    return "Initializing Github Repository with DevAutom and OpenAPI online"
}
//content should be base64
async function uploadFileToGithub(path: string, content: string,ghRepoUrl:string) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Uploading file to github in path: ", path)
    const message = getDefaultCommitMsg()
    const authToken = getAuthToken();
    const email = getEmail();
    //also the owner
    const committer = getUser();
    const headers = { "Authorization": `Bearer ${authToken}`, "X-Github-Api-Version": "2022-11-28", "Accept": "application/json" }
    const request = { message, content, committer: { name: committer, email }, date: Date.now() }
    const body = JSON.stringify(request)
    return fetch(`https://api.github.com/repos/${committer}/${ghRepoUrl}/contents/${path}`, {
        method: "PUT",
        body,
        headers
    })

}