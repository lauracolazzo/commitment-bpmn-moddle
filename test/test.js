const assert = require('assert');
const chai = require('chai')
const expect = chai.expect;

const parser = require('../lib/parser');
const diagram = './resources/diagrams/diagram.bpmn';
const empty = './resources/diagrams/empty.bpmn';
const output = './resources/diagrams/output.bpmn';
const output1 = './resources/diagrams/output1.bpmn';
const output2 = './resources/diagrams/output2.bpmn';

describe('should change attribute\'s type of bpmn diagram\'s extension element', () => {
  it('should not contain the string \'Persisting\' yet', async function(){

    //do not mainpulate the diagram
    var definitions = await parser.objTreeFromXml(diagram, (root) => {
      //do nothing
    });

    //check that diagram does not contain the string 'Persisting'
    var result = await parser.xmlFromObjTree(definitions);
    expect(result).not.to.contain('Persisting');
  });

it('should now contain the string \'Persisting\'', async function(){
    //manipulate diagram
    definitions = await parser.objTreeFromXml(diagram, (root) => {
      root.extensionElements.values[0].type = 'Persisting';
    });

    //after manipulation it does contain the string 'Persisting'
    result = await parser.xmlFromObjTree(definitions,output1);
    expect(result).to.contain('Persisting');
  });
});


describe('should add extension elements to an empty diagram',async function(){
  describe('before', async function(){
    await it('should contain no extension elements ', async function(){

      //do not mainpulate the diagram
      let definitions = await parser.objTreeFromXml(empty);
      expect(definitions.extensionElements).not.to.have.property('values');
    });
  });

//seen by next test functions because of the closure
var result;

  describe('after: added commitment', async() => {

    await it('should now contain commitment', async function(){

      const definitions = await parser.objTreeFromXml(empty, async(root) => {

        //creates a new commitment element
        const commitment = await parser.create('tc:Commitment');
        const connectionPoint = await parser.create('tc:ConnectionPoint');

        //create new extension elements section with commitment inside
        const extensionElements = await parser.create('bpmn:ExtensionElements');
        extensionElements.values = [commitment,connectionPoint];
        root.extensionElements = extensionElements;
      });

      result = await parser.xmlFromObjTree(definitions,output2);
      expect(result).to.contain('tc:commitment');
    });
  });

  describe('after: added connection point', () => {

    it('should now contain connection point',  function(){

      expect(result).to.contain('tc:connectionPoint');
    });
  });

});

describe('should not recognize non-compliant elements', () => {
  it('should throw error', async function(){
    try {
      await parser.create('unknown:element');
    } catch(e){
      expect(e).to.be.an('error');
    }
  });
});
