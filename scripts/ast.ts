
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