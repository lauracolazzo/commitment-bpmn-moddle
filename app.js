const parser = require('./lib/parser');
const diagram = './resources/diagrams/diagram.bpmn';
const output = './resources/output.bpmn';
const fs = require('fs');
Yellow = "\x1b[33m";
Inverse = "\x1b[7m";
Default = "\x1b[0m";

const readFromFile = function(inputFile){

  try {
    var xml = fs.readFileSync(inputFile, { encoding: 'utf8' });
    console.log(xml);
  } catch(err) {
    console.error(err);
  }
};

const printJsonBeforChanges = async function(xml){
  console.log(Inverse,'JSON - Before:',Default);
  const json = await parser.objTreeFromXml(xml);
  console.log(JSON.stringify(json));
  console.log(Inverse,'-----------------------',Default,'\n\n');
}

const edit = function(root){
  root.extensionElements.values[0].type = 'Persisting';
};

app = async function (){
  console.log(Inverse,'XML - Before:',Default);
  readFromFile(diagram);
  console.log(Inverse,'----------------------',Default,'\n\n');

  printJsonBeforChanges(diagram);

  const definitions = await parser.objTreeFromXml(diagram,edit);

  console.log(Inverse,'JSON - After:',Default);
  console.log(JSON.stringify(definitions));
  console.log(Inverse,'-----------------------',Default,'\n\n');

  await parser.xmlFromObjTree(definitions,output);

  console.log(Inverse,'XML - After:',Default);
  readFromFile(output);
  console.log(Inverse,'-----------------------',Default,'\n\n');
}();
