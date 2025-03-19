# Autodev-MVP
This is a proof of concept for the methodology presented in my BSc Thesis titled: **Towards a domain-speciﬁc automated software development process**,
at the Applied Informatics and Information Systems department of [University of Macedonia](https://uom.gr).

One can find the whole thesis [here](https://dspace.lib.uom.gr/bitstream/2159/31116/6/FakidisGeorgiosPe2024.pdf). 

The core idea of the thesis is about reusability, at a domain level and at a technical level. 

It proposes that existing software development processes are inadequate as they do not encapsulate existing knowledge about the domain in order to better streamline software development activities.  

This is live at [Autodev-MVP](https://autodev-mvp.vercel.app/)

## Features

For Data Services:
By selecting OpenAPI operations
from a specification file(a URL) and defining page layouts and the related UI elements the user can do the following:

- Generate requirements document
- Generate Code for any language (selecting OpenAPI operations and only generating their code is not implemented yet, but will be added in the future)

## Usage Guide

1. Follow the link at [Autodev-MVP](https://autodev-mvp.vercel.app/)
2. Click the type of software you want to create(for our example Data Services)
3. Name your Software (you can use the integrated LLM) and click "Continue Creating Software"
4. Fill your OpenAPI specification URL(json file, there is one already filled for showcase purposes) and click "Submit"(this also verifies if what you gave is an OpenAPI Specification)
5. Click on the operations that interest you.
6. Fill in the details for each data source(an LLM prefills the inputs, they can be changed afterwards). How often do you want to grab the data and for what dates do you want your database to have that data.
9. Here you get to the Layout Creator page. Click on "page 1" and fill a name
   of your preference. Then for each box fill in the label, resize it according to your needs and select data source(from the ones you have selected previously) and graph type.
10. To add another box in the layout click the square 'Add Chart +' button.
11. When you have finished you can press "Save Page" on the bottom right corner. If you want to you can repeat the process and click "New Page" to create another page(if you only want one page you can just click submit all immediately).
12. Now you are at the Non-Functional requirements page where you input the desired qualities of the software you want to create.
13. When you are finished click submit and you will be met with the two options below:
   - Generate Document will provide you a summary tailored to developers in order to implement the software.
   - Generate Code gets you to a page where you can select a programming language(the code is generated straight to the code platform of your choice).
