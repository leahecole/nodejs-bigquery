import { readFileSync } from "fs";
import * as ts from "typescript";
const fs = require('fs')
// TODO: maintainer - if a new client is added, add it to this list
const clients = ["DatasetServiceClient", "TableServiceClient"]
// TODO: automate construction of methods list
const {DatasetServiceClient, TableServiceClient} = require("@google-cloud/bigquery")
let output = `
// /*!
//  * Copyright 2024 Google LLC
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *      http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
`
let foundNodes = []
function extract(node: ts.Node, depth = 0): void {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.

  function getKind(node: ts.Node) {
    return ts.SyntaxKind[node.kind]
  }
  const thingsWeCareAbout = ["MethodDeclaration"]
  const kind = getKind(node)
  if(thingsWeCareAbout.includes(kind)){

    if(ts.isMethodDeclaration(node)){
      // this typecasting has to be done because the name of a MethodDeclaration
      // can be one of a few different types but in our use case we know it's an identifier
      // and can therefore safely make this assumption to get the human readable name
      const name = node.name as ts.Identifier;
      const nameEscapedText = name.escapedText as string;

        // TODO update to be modular
      if(node.body && nameEscapedText.search("Dataset")>0){ // not an overload, has an actual function body
        
          // type is the node.type and we can deal with union types later
          foundNodes.push([node.name, node])

      }


    }


  }
  // Loop through the root AST nodes of the file
  ts.forEachChild(node, childNode => {
    extract(childNode, depth +1)
  });


}

function ast() {
    const file = '../src/v2/dataset_service_client.ts'
    let program = ts.createProgram([file], { allowJs: true });
    const sourceFile = program.getSourceFile(file);

    // To print the AST, we'll use TypeScript's printer
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    // Run the extract function with the script's arguments
    extract(sourceFile!);
  // Either print the found nodes, or offer a list of what identifiers were found
  let output = ''
  const checker = program.getTypeChecker();
  
  foundNodes.map(f => {
    const [name, node] = f;
    // create function name
    const functionName = `${name.escapedText}`

    // TODO - go through clients
    output = output.concat(`\n\t${functionName}(`)
    // add parameters
    let parametersList = ``
    for (let i=0; i<node.parameters.length; i++){
        const name = node.parameters[i].name.escapedText
        const typeNode = checker.getTypeFromTypeNode(node.parameters[i].type)
        // probably need to use some version of fully qualified name to get full path
        // like using getFullyQualifiedName on the symbol, or something
        const typeString = checker.typeToString(typeNode)
        let parameter = `${name}: ${typeString}`
        parametersList = parametersList.concat(name)
        if (i!==node.parameters.length-1){
            parameter += ", "
            parametersList += ", "
        }
        output = output.concat(`\n\t\t${parameter}`)        
    }
    output = output.concat(`)`)
    // add return type
    const typeNode = checker.getTypeFromTypeNode(node.type)
    // probably need to use some version of fully qualified name to get full path
    // like using getFullyQualifiedName on the symbol, or something
    const returnType = checker.typeToString(typeNode)
    output = output.concat(`:${returnType}{`)
    // call underlying client function
    // TODO make dynamic
    output = output.concat(`\n\t\tthis.datasetClient.${functionName}(${parametersList})\n\t}`)
    });
    return output

}


function makeImports(clients){
    let imports = `import {protos`
    for (let client in clients){
        imports = imports.concat(`, ${clients[client]}`)
    }

    imports = imports.concat(`} from ".";\n`)
    return imports
}

// convert client types to the names we'll use for variables
function parseClientName(client){
    return(client.split('ServiceClient')[0].toLowerCase() + 'Client')

}

// TODO modify to be able to pass option to subclients
function buildClientConstructor(clients){
    let variableDecl = ''
    let constructorInitializers = `\tconstructor(options:any){\n`
    for (let client in clients){
        const clientName = parseClientName(clients[client])
        variableDecl = variableDecl.concat(
            `\t${clientName}: ${clients[client]};\n`
        )
        constructorInitializers = constructorInitializers.concat(
            `\t\tthis.${clientName} = options?.${clientName} ?? new ${clients[client]}();\n`
        )
    }
    constructorInitializers = constructorInitializers.concat('\t}')
    let output = `export class BigQueryClient{\n`
    output = output.concat(variableDecl, "\n", constructorInitializers)
    return output  
}


function buildOutput(){
    let newoutput;
    newoutput = output.concat(makeImports(clients))
    newoutput = newoutput.concat(buildClientConstructor(clients))
    newoutput = newoutput.concat(ast())
    newoutput = newoutput.concat("\n}")
    return newoutput

}


const finaloutput = buildOutput();
fs.writeFile('../src/bigquery.ts', finaloutput, (err) => {
    if (err) throw err;

});


