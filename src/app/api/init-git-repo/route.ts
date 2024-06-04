
import { AppContext, Page } from "@/types/types";
import OpenAI from "openai"

interface IssueData {
    title: string;
    body: string;
    assignees?: string[],
    milestone?: number,
    labels?: string[],
}

interface GhCreateIssueRequest {
    data: IssueData
    user: string,
    repoUrl: string
}

async function createGhIssue(authToken: string, issue: GhCreateIssueRequest) {
    const url = `https://api.github.com/repos/${issue.user}/${issue.repoUrl}/issues`
    const headers = { "Authorization": `Bearer ${authToken}`, "X-Github-Api-Version": "2022-11-28", "Accept": "application/vnd.github+json" }
    const body = JSON.stringify({ title: issue.data.title, body: issue.data.body, labels: ["feature"] })
    console.log("Sending to github issues API: ", body)
    return fetch(url, {
        method: "POST",
        headers,
        body
    });
}

interface GhCreateRepoRequest {
    name: string;
    description: string;
    homepage: string;
    private: boolean;
    is_template: boolean;
}

async function createGhRepo(authToken: string, repoInfo: GhCreateRepoRequest) {
    //epistrefei ena html_url pou tha mporousa na xrhsimopoihsw gia na deiksw auto pou kanw
    //kai alla xrhsima pragmata
    const url = "https://api.github.com/user/repos"
    const headers = { "Authorization": `Bearer ${authToken}`, "X-Github-Api-Version": "2022-11-28", "Accept": "application/vnd.github+json" }
    const body = JSON.stringify(repoInfo)
    console.log("Sending to github api: ", body)
    return fetch(url, {
        method: "POST",
        headers,
        body
    })
}

function layoutDescriptionForIssueBody(pageData: Page) {
    return `
${pageData.associatedData.map(data => {
        return `
- Component: ${data.component.componentName}, Column: ${data.component.column} Row: ${data.component.row}, Width: ${data.component.sizeX} Height: ${data.component.sizeY}`
    }).join("\n")}
`
}



function contentForIssueBody(pageData: Page, openAPIUrl: string): string {
    //YYYY-MM-DD
    const formatDate = (obj: Date) => {
        return `${obj.getFullYear()}-${obj.getMonth()}-${obj.getDay()}-${obj.getHours()}`
    }

    return `
### Page Title: ${pageData.pageName}
The components that should be included are the following:
${pageData.associatedData.map(component => {
        const fromDate = component.data.range?.from;
        const toDate = component.data.range?.to;
        //this is a temporary fix, i aint getting proper date object from frontend
        //getting a string like: 2024-05-01T00:00:00.000Z
        const fromDateStr = fromDate?.toLocaleDateString ? formatDate(fromDate) : fromDate;
        const toDateStr = toDate?.toLocaleDateString ? formatDate(toDate) : toDate;
        return `
- Component Name: **${component.component.componentName}**
  - Component **Data** (OpenAPI Operation from this [OpenAPI Specification](${openAPIUrl})): ${component.data.description}
  - **Frequency** to be stored in the database: ${component.data.frequency}
  - The required **time range** is from: ${fromDateStr} to ${toDateStr}
  - We want it to be displayed in a **${component.data.graph}**.
  - Should be in the **Row** No${component.component.row} and **Column** No${component.component.column} with **width**: ${component.component.sizeX} and **height**: ${component.component.sizeY}
`})
.join("\n")}

The layout should be done as follows:
${layoutDescriptionForIssueBody(pageData)}
`
}


function createIssueFromPage(pageData: Page, openAPIUrl: string): IssueData {
    const title = `Implement ${pageData.pageName} page feature`

    const labels = ["feature"]
    const assignees = null
    const body = contentForIssueBody(pageData, openAPIUrl)
    return { title, labels, body }
}





function normalizeStringForGhRepoName(name: string) {
    //Might need to remove spaces and other stuff
    return name.replace(" ","");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })


function generatePromptContent(data:AppContext){
    return `
    We are creating software with a custom tool and we are helping the user create it from scratch.
    You will always answer with the json format you were provided.
    I will provide you with data from the user for the app he wants to create.
    I want you to provide me a good and concise description of the app he wants to create.
    The name of the app is: ${data.appName}
    The type of the app is: ${data.appType}
    Do not make it more than 2 sentences
    Return it in the form of {description:string}
    `
}

async function generateGithubRepoDescriptionFromAI(userInput:AppContext){
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { "type": "json_object" },
        messages: [{ role: "system", content: generatePromptContent(userInput) }]
    })

    const answer = completion.choices[0].message.content as string;
    const jsonAnswer = JSON.parse(answer)
    const finalAnswer = jsonAnswer.description
    return finalAnswer

}


export async function POST(request: Request) {
    //the widths and heights i get seem a bit big
    const authToken = getAuthToken();
    if (!authToken) {
        return Response.json({ success: false, msg: "Auth token was not provided" })
    }
    const user = getUser()
    if (!user) {
        return Response.json({ success: false, msg: "User was not provided" })
    }

    const data: AppContext = await request.json();
    console.log("Initializing Git Repo with: ", data)

    const ghRepoUrl = normalizeStringForGhRepoName(data.appName);
    const ghDescription = await generateGithubRepoDescriptionFromAI(data)
    const ghCreateRepoReq: GhCreateRepoRequest = { name: ghRepoUrl, description: ghDescription, homepage: "https://github.com", private: false, is_template: false }
    console.log("Creating GH Repo with name: ", ghRepoUrl)
    console.log("Description of the GH Repo: ",ghDescription)

    const result = await createGhRepo(authToken, ghCreateRepoReq)
    if (!result.ok) {
        const body = await result.text()
        return Response.json({ success: false, msg: "Github Repo creation was unsuccessfull",result:body })
    }
    const body = await result.json();
    console.log("Results from Repo Creation", body)

    const issues = data.pages.map((page) => createIssueFromPage(page, data.inputUrl))
    const issuesRequests = issues.map(issue => ({ user, repoUrl: ghRepoUrl, data: issue }))
    console.log(`Creating ${issuesRequests.length} gh issues`);
    issuesRequests.forEach(async (issue) => {
        const result = await createGhIssue(authToken, issue)
        const body = await result.json();
        console.log(body)
    })

    return Response.json({
        success: true,
        urlOfRepo:ghRepoUrl,
        msg: "Dev blueprints were created successfully you can see it in: "
    })

}

function getUser() {
    return process.env.GITHUB_USER;
}

function getAuthToken() {
    return process.env.GITHUB_TOKEN;
}