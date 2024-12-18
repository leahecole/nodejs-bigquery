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
    output = output.concat(variableDecl, "\n", constructorInitializers, "\n}")
    return output  
}

function surfaceMethods(clients){
    let output = `\n`
    clients.forEach((client) =>{
        // TODO get the dynamic import working
        // const statement = eval(`const {${client}} = require(\"@google-cloud/bigquery\");`)
        const clientVar = eval(client)
        const methodSuffix = client.split('ServiceClient')[0]
        Object.getOwnPropertyNames(clientVar.prototype).forEach((name) => {
            // possible TODO - change to denylist
            // one of the crud methods
            if(name.search(methodSuffix)>0){
                // TODO - parameters wrt multiple overloads
                console.log(Object.getOwnPropertyDescriptor(clientVar.prototype, name)?.value)


            }

        })
    } )

}

function buildOutput(){
    let newoutput;
    newoutput = output.concat(makeImports(clients))
    newoutput = newoutput.concat(buildClientConstructor(clients))
    surfaceMethods(clients)
    return newoutput

}


const finaloutput = buildOutput();
fs.writeFile('../src/bigquery.ts', finaloutput, (err) => {
    if (err) throw err;

});

//USAGE
// compile with tsc, then run node ast_sdb.js
// this is for secure by default

// inspired by https://dev.to/bilelsalemdev/abstract-syntax-tree-in-typescript-25ap
// inspired by https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
function traverse(node: ts.Node, depth = 0, fileName:string, sourceFile: ts.SourceFile) {
    // these printer is probs not efficient
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    // we care about classes, interfaces, types and functions
    function getKind(node: ts.Node) {
      return ts.SyntaxKind[node.kind]
    }
    const kind = getKind(node)

    const thingsWeCareAbout = ["ClassDeclaration", "InterfaceDeclaration", "TypeAliasDeclaration", "MethodDeclaration", "MethodSignature" ]
    if(thingsWeCareAbout.includes(kind)){
      if(ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node) || ts.isTypeAliasDeclaration(node)){
        console.log(fileName + "," + kind + "," + 
          node.name?.escapedText)
      }
      if(ts.isMethodDeclaration(node)){
        // this typecasting has to be done because the name of a MethodDeclaration
        // can be one of a few different types but in our use case we know it's an identifier
        // and can therefore safely make this assumption to get the human readable name
        const name = node.name as ts.Identifier;
        if(node.body){ // not an overload, has an actual function body
            console.log(fileName + "," + kind+ "," + name.escapedText)
        }
        if(sourceFile){
            console.log('hi')
            printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
        }

      }

  
    }

    ts.forEachChild(node, (childNode) => traverse(childNode, depth + 1, fileName, sourceFile));
  
  
  }
   

// let fileNames = ['../src/v2/dataset_service_client.ts', '../src/v2/table_service_client.ts']
  let fileNames = ['../src/v2/dataset_service_client.ts']
  // const fileNames = process.argv.slice(2);
  if (fileNames.length===0){
    throw new Error("Must pass a filename")
  }
  fileNames.forEach(fileName => {
    // Parse a file
    const sourceFile = ts.createSourceFile(
      fileName,
      readFileSync(fileName).toString(),
      ts.ScriptTarget.ES2015,
      /*setParentNodes */ true
    );

  
    traverse(sourceFile, undefined, fileName, sourceFile);
  });
