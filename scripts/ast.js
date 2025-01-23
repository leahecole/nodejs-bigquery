"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 * @param identifiers top level identifiers available
 */
function extract(file) {
    // Create a Program to represent the project, then pull out the
    // source file to parse its AST.
    var program = ts.createProgram([file], { allowJs: true });
    var sourceFile = program.getSourceFile(file);
    // To print the AST, we'll use TypeScript's printer
    var printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    var foundNodes = [];
    // Loop through the root AST nodes of the file
    ts.forEachChild(sourceFile, function (node) {
        var name = "";
        // This is an incomplete set of AST nodes which could have a top level identifier
        // it's left to you to expand this list, which you can do by using
        // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
        // as below
        if (ts.isFunctionDeclaration(node)) {
            name = node.name.text;
            // Hide the method body when printing
            // node.body = undefined;
        }
        else if (ts.isVariableStatement(node)) {
            name = node.declarationList.declarations[0].name.getText(sourceFile);
        }
        else if (ts.isInterfaceDeclaration(node)) {
            name = node.name.text;
        }
        foundNodes.push([name, node]);
    });
    // Either print the found nodes, or offer a list of what identifiers were found
    foundNodes.map(function (f) {
        var name = f[0], node = f[1];
        console.log("### " + name + "\n");
        console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)) + "\n";
    });
}
// Run the extract function with the script's arguments
extract('../src/v2/dataset_service_client.ts');
