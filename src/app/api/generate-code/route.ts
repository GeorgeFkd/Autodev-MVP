import fs from 'fs';
import archiver from 'archiver';



export async function POST(request: Request, response: Response) {
    //from openAPI url and the data we have to generate a zip with the code
    //the GET api/gen/clients can show us the available languages we can generate code for
    //the data also includes the language of choice for the code generated
    //we run an instance of: http://api.openapi-generator.tech/index.html
    //or hit the server above

    //Step 1: Hit the server with the user's data

    //Step 2: Get the response from the server and pipe it to our response

    //also the user will send his options(language of implementation, etc.)

}