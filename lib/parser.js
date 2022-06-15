const BpmnModdle = require('bpmn-moddle');
const tcPackage = require('../resources/json/timedCommitment.json');
const fs = require('fs');

const moddle = new BpmnModdle({tc: tcPackage});

/**
  * Utility method for reading an xml
  * @param inputFile is the path of the xml file to read the input from
  * @return the xml string read from the input file
*/
const readFromFile = function(inputFile){

  try {
    var xml = fs.readFileSync(inputFile, { encoding: 'utf8' });
  } catch(err) {
    console.error(err);
  }

  return xml;
};

/**
  * Utility method to write an xml diagram back to file
  * @param outputFile is the path of the file to write the xml to
  * @param updatedXml is the string containing the xml to write on file
*/
const writeOnFile = function(outputFile,updatedXml){

  try {
    fs.writeFileSync(outputFile,updatedXml);
  } catch (err) {
    console.error(err);
  }
};


/**
  * Takes an xml and turns it into an object tree.
  * It can edit the object tree according to the edit function that can be passed as argument
  * @param xmlFile is the xml string to turn into an object tree
  * @param editFunction is the function used to edit the object tree generated from the xml
  * @return the root of the object tree
*/
exports.objTreeFromXml = async function(xmlFile,editFunction){

  const {
    rootElement: definitions
  } = await moddle.fromXML(readFromFile(xmlFile));

  if (editFunction != undefined)
    await editFunction(definitions);

  return definitions;
};

/**
  * Takes an object tree and turns and brings it back to an xml document
  * @param updatedObjTree is an object tree
  * @param outputFile is the path of the file to write the file to
  * @return the xml generated from the object tree
*/
exports.xmlFromObjTree = async function(updatedObjTree,outputFile){

  const {
    xml: updatedXml
  } = await moddle.toXML(updatedObjTree);

  if (outputFile != undefined)
    writeOnFile(outputFile,updatedXml);

  return updatedXml;
};

/**
 * Creates a new object of the specified type
 * @param type is the type that the new object should have
 * @return the object of the specified type
 */
exports.create = async function(type){
  return await moddle.create(type);
}
