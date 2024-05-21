// https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28
// curl --request GET --url "https://api.github.com/octocat" --header "Authorization: Bearer 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"

import { AppContext, Layout, Page } from "@/types/types";



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

//
//curl -L -X POST -H "Accept: application/vnd.github_json" -H "Authorization: Bearer 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" -H "X-Github-Api-Version: 2022-11-28" https://api.github.com/repos/GeorgeFkd/FinDecisionMaker/issues -d '{"title":"Found a bug","body":"this app sucks"}'

async function createGhIssue(authToken: string, issue: GhCreateIssueRequest) {
    // {
    //     message: 'Bad credentials',
    //         documentation_url: 'https://docs.github.com/rest'
    // } i am getting this for some reason im doing sth wrong ^
    const url = `https://api.github.com/repos/${issue.user}/${issue.repoUrl}/issues`
    console.log("")
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
//this works, im doing sth wrong below
// curl -L -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer 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" -H "X-Github-Api-Version: 2022-11-28" https://api.github.com/user/repos -d '{"name":"FinDecisionMaker","description":"this is your first repo!","homepage":"https://github.com","private":false,"is_template":true}'
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
    //Βασικά να κάνω κάτι του τύπου Component X-> Row Y,Column Z,Size K*px
    //Then the developer translates it into proportions
    return `
${pageData.associatedData.map(data => {
        return `
- Component: ${data.component.componentName}, Column: ${data.component.column} Row: ${data.component.row}, Width: ${data.component.sizeX} Height: ${data.component.sizeY}`
    })}
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
`})}

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
    return name;
}



export async function POST(request: Request) {
    //the widths and heights i get seem a bit big
    const data: AppContext = await request.json();
    console.log("Initializing Git Repo with: ", data)
    const authToken = getAuthToken();
    const issues = data.pages.map((page) => createIssueFromPage(page, data.inputUrl))
    const ghRepoUrl = normalizeStringForGhRepoName(data.appName);
    const user = getUser()
    //also i can generate a description for the repo based on the general info i have
    const ghCreateRepoReq: GhCreateRepoRequest = { name: ghRepoUrl, description: "Insert your custom description here", homepage: "https://github.com", private: false, is_template: false }
    //i should be getting the data for this
    console.log("Creating GH Repo with name: ", ghRepoUrl)
    const result = await createGhRepo(authToken, ghCreateRepoReq)
    const body = await result.json();
    console.log("Results from Repo Creation", body)
    const issuesRequests = issues.map(issue => ({ user, repoUrl: ghRepoUrl, data: issue }))
    console.log(`Creating ${issuesRequests.length} gh issues`);
    // issuesRequests.forEach(async (issue) => {
    //     const result = await createGhIssue(authToken, issue)
    //     const body = await result.json();
    //     console.log(body)
    // })

    return Response.json({
        msg: "Dev blueprints were created successfully you can see it in: "
    })

}

function getUser() {
    return "GeorgeFkd"
}

function getAuthToken() {
    return "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"
}


//in the beginning i will do it on my own account and then for other's


