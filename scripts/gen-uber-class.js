"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var fs = require('fs');
// TODO: maintainer - if a new client is added, add it to this list
var clients = ["DatasetServiceClient", "TableServiceClient"];
var files = ["../src/v2/dataset_service_client.ts", "../src/v2/table_service_client.ts"];
// TODO: automate construction of methods list
var output = "\n// /*!\n//  * Copyright 2024 Google LLC\n//  *\n//  * Licensed under the Apache License, Version 2.0 (the \"License\");\n//  * you may not use this file except in compliance with the License.\n//  * You may obtain a copy of the License at\n//  *\n//  *      http://www.apache.org/licenses/LICENSE-2.0\n//  *\n//  * Unless required by applicable law or agreed to in writing, software\n//  * distributed under the License is distributed on an \"AS IS\" BASIS,\n//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n//  * See the License for the specific language governing permissions and\n//  * limitations under the License.\n//  */\n";
var foundNodes = [];
function extract(node, depth, client) {
    // Create a Program to represent the project, then pull out the
    // source file to parse its AST.
    if (depth === void 0) { depth = 0; }
    function getKind(node) {
        return ts.SyntaxKind[node.kind];
    }
    var thingsWeCareAbout = ["MethodDeclaration"];
    var kind = getKind(node);
    if (thingsWeCareAbout.includes(kind)) {
        if (ts.isMethodDeclaration(node)) {
            // this typecasting has to be done because the name of a MethodDeclaration
            // can be one of a few different types but in our use case we know it's an identifier
            // and can therefore safely make this assumption to get the human readable name
            var name_1 = node.name;
            var nameEscapedText = name_1.escapedText;
            // full implementation (not overload) of crud method for client
            if (node.body && nameEscapedText.search(client) > 0) {
                // type is the node.type and we can deal with union types later
                foundNodes.push([node.name, node]);
            }
        }
    }
    // Loop through the root AST nodes of the file
    ts.forEachChild(node, function (childNode) {
        extract(childNode, depth + 1, client);
    });
}
function ast(file, client) {
    var output = '';
    var program = ts.createProgram([file], { allowJs: true });
    var sourceFile = program.getSourceFile(file);
    // Run the extract function with the script's arguments
    extract(sourceFile, undefined, client);
    // Either print the found nodes, or offer a list of what identifiers were found
    var checker = program.getTypeChecker();
    foundNodes.map(function (f) {
        var name = f[0], node = f[1];
        // create function name
        var functionName = "".concat(name.escapedText);
        output = output.concat("\n\t".concat(functionName, "("));
        // add parameters
        var parametersList = "";
        var argumentsList = "";
        for (var i = 0; i < node.parameters.length; i++) {
            var name_2 = node.parameters[i].name.escapedText;
            var typeString = node.parameters[i].type.getFullText();
            var parameter = "".concat(name_2, ": ").concat(typeString);
            parametersList = parametersList.concat(name_2);
            // this has to do with function overloading - we will later surface code
            // that does type checking for options and callback
            if (name_2 === "optionsOrCallback") {
                argumentsList = argumentsList.concat("options");
            }
            else {
                argumentsList = argumentsList.concat(name_2);
            }
            if (i !== node.parameters.length - 1) {
                parameter += ", ";
                parametersList += ", ";
                argumentsList += ", ";
            }
            output = output.concat("\n\t\t".concat(parameter));
        }
        output = output.concat(")");
        // add return type
        var returnType = node.type.getFullText();
        output = output.concat(":".concat(returnType));
        // call underlying client function
        if (node.body) {
            // this logic needs to be surfaced from underlying clients
            // to make sure our parameters play nicely with underlying overloads
            // otherwise you will run into issues similar to https://github.com/microsoft/TypeScript/issues/1805
            var optionsOrCallback = "\n            let options: CallOptions;\n            if (typeof optionsOrCallback === 'function' && callback === undefined) {\n                callback = optionsOrCallback;\n                options = {};\n            }\n            else {\n                options = optionsOrCallback as CallOptions;\n            }";
            output = output.concat("{\n".concat(optionsOrCallback, "\n\t\tthis.").concat(client.toLowerCase(), "Client.").concat(functionName, "(").concat(argumentsList, ")\n\t}"));
        }
    });
    return output;
}
function astHelper(files, clients) {
    var output = "";
    for (var f in files) {
        foundNodes = [];
        var client = clients[f].split("Service")[0];
        output = output.concat(ast(files[f], client));
    }
    return output;
}
function makeImports(clients) {
    var imports = "import {protos";
    for (var client in clients) {
        imports = imports.concat(", ".concat(clients[client]));
    }
    imports = imports.concat("} from \".\";\n");
    imports = imports.concat("import {Callback, CallOptions} from \"google-gax\";\n");
    return imports;
}
// convert client types to the names we'll use for variables
function parseClientName(client) {
    return (client.split('ServiceClient')[0].toLowerCase() + 'Client');
}
// TODO modify to be able to pass option to subclients
function buildClientConstructor(clients) {
    var variableDecl = '';
    var constructorInitializers = "\tconstructor(options:any){\n";
    for (var client in clients) {
        var clientName = parseClientName(clients[client]);
        variableDecl = variableDecl.concat("\t".concat(clientName, ": ").concat(clients[client], ";\n"));
        constructorInitializers = constructorInitializers.concat("\t\tthis.".concat(clientName, " = options?.").concat(clientName, " ?? new ").concat(clients[client], "();\n"));
    }
    constructorInitializers = constructorInitializers.concat('\t}');
    var output = "export class BigQueryClient{\n";
    output = output.concat(variableDecl, "\n", constructorInitializers);
    return output;
}
function buildOutput() {
    var newoutput;
    newoutput = output.concat(makeImports(clients));
    newoutput = newoutput.concat(buildClientConstructor(clients));
    newoutput = newoutput.concat(astHelper(files, clients));
    newoutput = newoutput.concat("\n}");
    return newoutput;
}
var finaloutput = buildOutput();
fs.writeFile('../src/bigquery.ts', finaloutput, function (err) {
    if (err)
        throw err;
});
