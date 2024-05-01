This is live at [Autodev-MVP](https://autodev-mvp.vercel.app/)

## Features

For Data Services:
By selecting OpenAPI operations
from a specification file(a URL) and defining page layouts and the related UI elements the user can do the following:

- Generate requirements document
- Generate Code for any language (selecting OpenAPI operations and only generating their code is not implemented yet)

## Usage Guide

1. Follow the link at [Autodev-MVP](https://autodev-mvp.vercel.app/)
2. Click the type of software you want to create(for our example Data Services)
3. Fill your OpenAPI specification URL(json file, there is one already filled for showcase purposes) and click "Submit"
4. Then click Verify Url(to ensure the file is good to go), wait a bit this takes some time.
5. Tick the operations that interest you.
6. Fill in the details for each data source. How often do you want to grab the data and for what dates do you want your database to have that data.
7. Here you get to the Layout Creator page. Click on "page 1" and fill a name
   of your preference. Then for each box fill in the label, resize it according to your needs and select data source(from the ones you have selected previously) and graph type.
8. To add another box in the layout click the square '+' icon.
9. When you have finished you can press "Save Page" on the bottom right corner. If you want to you can repeat the process and click "New Page" to create another page.
10. If you are ready you can do submit all and now you have 2 options:
    - Generate Document
    - Generate Code
11. Generate Document will provide you a summary tailored to developers in order to implement the software.
12. Generate Code gets you to a page where you can select a programming language and download the code(a zip file).
