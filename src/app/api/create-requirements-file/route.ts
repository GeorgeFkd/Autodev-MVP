import { Resend } from "resend"
import { AppContext } from "@/types/types"
//TODO refactor this to be from a path variable
//this is all untested i will see those tomorrow
//should also probably do a download functionality
//eh email is more interesting
const resend = new Resend("re_MAX9g2WD_6sbcz3JkSbgyuRBC4KL8gSyQ")

function createRequirementsDocumentFromOpenAPISpec(data: AppContext): string {
    return `
# Creating Software by using the Autodev tool
    
The url of the API we want to use is: **${data.inputUrl}**

## Software Requirements
The Pages we want to have in our application are:
${data.pages.map(page => {
        return `
### Page Title: ${page.pageName}
The components and their associated data are:
        ${page.associatedData.map(component => {
            return `
#### Component Name: ${component.componentName}
Component Data(OpenAPI Operation from the URL): ${component.data.description}
Frequency to be stored in the database: ${component.data.frequency}
The required time range is from: ${component.data.range?.from} to ${component.data.range?.to}
We want it to be displayed in a ${component.data.graph} chart
`
        })}
`
    })}
    `
}

export async function POST(request: Request, response: Response) {
    // if (!request.headers.get("origin")) {
    //     return new Response("Bad Request", { status: 400 })
    // } else if (request.headers.get("origin") !== "myownwebsite") {
    //     return new Response("Unauthorized", { status: 401 })
    // }
    console.log("Sending Requirements documents:")
    const data = await request.json() as AppContext;
    const fileContent = Buffer.from(createRequirementsDocumentFromOpenAPISpec(data), "utf-8")

    console.log("Data is: ", data)
    // create a file and send it back
    return new Response(fileContent, {
        headers: {
            "Content-Disposition": 'attachment; filename="Requirements.md"',
            "Content-Type": "text/plain"
        }
    })

}

