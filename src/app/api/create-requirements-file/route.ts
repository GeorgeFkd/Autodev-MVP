import type { AppContext } from "@/types/types"

function createRequirementsDocumentFromOpenAPISpec(data: AppContext): string {
    return `
# Creating Software using the Autodev tool
    
The url of the API we want to use is: **${data.inputUrl}**

## Software Requirements
The Pages we want to have in our application are:
${data.pages.map(page => {
        return `
### Page Title: ${page.pageName}
The components and their associated data are:
        ${page.associatedData.map(component => {
            const fromDate = component.data.range?.from;
            const toDate = component.data.range?.to;
            //this is a temporary fix, i aint getting proper date object from frontend
            //getting a string like: 2024-05-01T00:00:00.000Z
            const fromDateStr = fromDate?.toLocaleDateString ? fromDate?.toLocaleDateString() : fromDate;
            const toDateStr = toDate?.toLocaleDateString ? toDate?.toLocaleDateString() : toDate;
            return `
#### Component Name: ${component.component.componentName}
Component Data(OpenAPI Operation from the URL): ${component.data.description}
Frequency to be stored in the database: ${component.data.frequency}
The required time range is from: ${fromDateStr} to ${toDateStr}
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

