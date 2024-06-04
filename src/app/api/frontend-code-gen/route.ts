//this is where i will generate the frontend
import { readdirSync,readFileSync } from "fs";
import path from "path"
import { ApiDataComponent, AppContext, CodegenInput, CodegenResult, Page } from "@/types/types";
import unzipper from 'unzipper';
import { Readable } from 'stream';





function changeSrcPathTo(pathStr:string,newPath:string){
    const pathSegments = pathStr.split(path.sep)
    pathSegments[0] = newPath
    const totalNewPath = pathSegments.join(path.sep)
    return totalNewPath
}

interface FileInfoToGenerate {
    path:string,
    content:string
}


function readFilesRecursivelySync(directoryPath:string):FileInfoToGenerate[] {
    //ChatGPT generated
    let filesArray:FileInfoToGenerate[] = [];

    try {
        // Read all files and subdirectories in the directory
        const entries = readdirSync(directoryPath, { withFileTypes: true });

        // Iterate through each entry
        entries.forEach(entry => {
            // Get the full path of the entry
            const entryPath = path.join(directoryPath, entry.name);

            // Check if the entry is a directory
            if (entry.isDirectory()) {
                // If it's a directory, recursively read its contents
                console.log("Directory Path: ",entry.path)
                filesArray = filesArray.concat(readFilesRecursivelySync(entryPath));
            } else {
                // If it's a file, read its content and add it to the array
                console.log("File Path: ",entryPath)
                const content = readFileSync(entryPath, {encoding:'base64'});
                filesArray.push({ path: entryPath, content: content });
            }
        });
    } catch (error) {
        console.error('Error reading directory:', error);
    }

    return filesArray;
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


function getFilesFromTemplateDir() : FileInfoToGenerate[] {
    console.log("In current directory: ",readdirSync("."))
    const templatePath = path.resolve("./public/template-react")
    console.log("Template Path has:\n",readdirSync(templatePath))
    //TODO this is probably not correct
    return readFilesRecursivelySync(templatePath)
}

interface PageFileFromUser {
    pageName:string,
    content:string
}




function createPageReactComponent(forPage:Page) {
    return `
import * as API from "../apis/api"

function ${forPage.pageName.replace(" ","")}(){
    return (<div>
    <span>This is the page: ${forPage.pageName}<span>
    ${forPage.associatedData.map(val=>{
        return `<${val.component.componentName} />
        `
    }).join("\n")}
    )
}

${forPage.associatedData.map(val=>WriteReactComponentForGraph({component:val})).join("\n")}
`
}

function WriteReactComponentForGraph({component}:{component:ApiDataComponent}){
    return `function ${component.component.componentName.replace(" ","")}() {
    return (<div>
        <span>Component: ${component.component.componentName}</span>
        <span>Column: ${component.component.column}</span>
        <span>Row: ${component.component.row}</span>
        <span>Width: ${component.component.sizeX}</span>
        <span>Height: ${component.component.sizeY}</span>
    </div>)
}
    `
}

function createFilesFromUserInput(userApp:AppContext):PageFileFromUser[] {
    return userApp.pages.map((page)=>{
        return { content: createPageReactComponent(page),pageName:page.pageName.replace(" ","")}
    })
}

interface FrontendGenInput {
    userInput:AppContext
}

function trimTemplateFilesPath(filepath:string):string{
    const positionOfTemplate = filepath.indexOf("template-react")
    const restOfPath = filepath.substring(positionOfTemplate)
    return restOfPath
}

export async function POST(request:Request){
    const requestData:FrontendGenInput & {ghRepoUrl:string} = await request.json();
    const {userInput,ghRepoUrl} = requestData;
    const openAPIUrl = userInput.inputUrl;
    
    //uploading the vite part to github
    let templatesGen:string[] = []
    try {
        const templateFiles = getFilesFromTemplateDir()
        console.log("The template files are:",templateFiles)
        for(const file of templateFiles){
            //does not need the trailing / in dir in this situation
            const customPath = changeSrcPathTo(trimTemplateFilesPath(file.path),"frontend")
            console.log("Custom path is: ",customPath)
            templatesGen.push(customPath)
            //kapou apla petaei 409 kai den katalavainw giati
            const result = await uploadFileToGithub(customPath,file.content,ghRepoUrl)
            console.log("API Response code: ",result.status,result.statusText)

    }
    } catch (e){
        return Response.json({success:false,msg:"Loading the templates failed",info:e})
    }

    //all the files here are properly fetched, the uploading does not work properly
    console.log("Finished uploading the template files -> ",templatesGen)
    
    setTimeout(()=>{console.log("waiting")},2000)


    //uploading the api code of the library
    let filesGen:string[] = []
    try {
        const language = "typescript-fetch"
        
        const resultOfCodegen = await GetFilesFromOASCodegenOnlineAnd({language,openAPIUrl,options:{},spec:{}},true,async (filepath,filecontent)=>{
            filesGen.push(filepath)
            const customPath = changeSrcPathTo(filepath,"frontend/src/api")
            const result = await uploadFileToGithub(customPath, filecontent,ghRepoUrl)
            console.log("For Api Code Api returned: ", result.status,result.statusText)
        })

    }catch (e){
        return Response.json({success:false,msg:"Loading the API code from OpenAPI Codegen failed",info:e})
    }

    setTimeout(()=>{console.log("waiting")},2000)

    //the OpenAPI is bringing all of the files in, for some reason some do not make it to github
    console.log("Finished uploading the api code for files: ",filesGen)
    //uploading my react code to github
    try{
        const reactPagesGenerated = createFilesFromUserInput(userInput)
        for(const file of reactPagesGenerated){
            //i have seen it go live without the .jsx extension
            const customPath = "frontend/src/pages/"+file.pageName+".jsx"
            const result = await uploadFileToGithub(customPath,btoa(file.content),ghRepoUrl)
            console.log("API Response code: ",result.status,result.statusText)

        }
    }catch (e){
        return Response.json({success:false,msg:"Loading My React API code from in-house codegen failed",info:e})
    }

    console.log("Finished Uploading the custom react code")
    return Response.json({
        success:true,
        msg:"Completed the whole process"
    })
}

function getAuthToken() {
    return process.env.GITHUB_TOKEN as string;
}

async function uploadFileToGithub(path: string, content: string,ghRepoUrl:string) {
    await new Promise(resolve => {
        console.log("-----")
        setTimeout(resolve, 1000)
    });
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

function getUser() {
    return process.env.GITHUB_USER as string;
}

function getEmail() {
    return process.env.GITHUB_EMAIL as string;
}
function getDefaultCommitMsg() {
    return "Initializing Github Repository with DevAutom and OpenAPI online"
}