import SwaggerClient from "swagger-client"
import { DataFromOpenAPIUrl } from "@/types/types";


type ResultFromOpenAPIUrl = DataFromOpenAPIUrl[];

export async function POST(request: Request) {
    console.log("GET /api/fetch-file")
    let result: ResultFromOpenAPIUrl = [];
    const urlOfFile = await request.text();
    const parsedOpenAPI = await new SwaggerClient(urlOfFile)
    console.log("parsedOpenAPI: ", parsedOpenAPI)
    console.log("api for /rest/common/fetch/uploads: ", parsedOpenAPI["spec"]["paths"]["/rest/nsp/fetch/priority/pos"])

    //the OpenAPI logic could be extracted to a different function
    for (let key of Object.keys(parsedOpenAPI["spec"]["paths"])) {
        console.log("Path: ", key)
        const apiOperationDetails = parsedOpenAPI["spec"]["paths"][key]
        for (let operationKey of Object.keys(apiOperationDetails)) {
            console.log("Method is: ", operationKey)
            const summary = apiOperationDetails[operationKey]["summary"]
            const operationId = apiOperationDetails[operationKey]["operationId"]
            console.log("Summary: ", summary)
            console.log("Operation Id: ", operationId)
            result.push({ description: summary, identification: operationId })
        }

        console.log("The details are: ", apiOperationDetails)
    }

    console.log("Returning to client: ", result)
    const returnVal = Response.json(result)
    return returnVal
}