//
//  converter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//



function DataConverter(nodeId) {

  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------

  this.nodeId                 = nodeId;
  this.node                   = $("#"+nodeId);

  this.outputDataTypes        = [
                                // {"text":"Actionscript",           "id":"as",               "notes":""},
                                // {"text":"ASP/VBScript",           "id":"asp",              "notes":""},
                                // {"text":"HTML",                   "id":"html",             "notes":""},
                                // {"text":"JSON - Properties",      "id":"json",             "notes":""},
                                // {"text":"JSON - Column Arrays",   "id":"jsonArrayCols",    "notes":""},
                                // {"text":"JSON - Row Arrays",      "id":"jsonArrayRows",    "notes":""},
                                // {"text":"JSON - Dictionary",      "id":"jsonDict",         "notes":""},
                                {"text":"JSON - Till",            "id":"jsonTill",         "notes":""}//,
                                // {"text":"MySQL",                  "id":"mysql",            "notes":""},
                                // {"text":"PHP",                    "id":"php",              "notes":""},
                                // {"text":"Python - Dict",          "id":"python",           "notes":""},
                                // {"text":"Ruby",                   "id":"ruby",             "notes":""},
                                // {"text":"XML - Properties",       "id":"xmlProperties",    "notes":""},
                                // {"text":"XML - Nodes",            "id":"xml",              "notes":""},
                                // {"text":"XML - Illustrator",      "id":"xmlIllustrator",   "notes":""}
                                ];
  this.outputDataType         = "jsonTill";

  this.columnDelimiter        = "\t";
  this.rowDelimiter           = "\n";

  this.inputTextArea          = {};
  this.outputTextArea         = {};

  this.inputHeader            = {};
  this.outputHeader           = {};
  this.dataSelect             = {};

  this.inputText              = "";
  this.outputText             = "";

  this.newLine                = "\n";
  this.indent                 = "  ";

  this.commentLine            = "//";
  this.commentLineEnd         = "";
  this.tableName              = "MrDataConverter"

  this.useUnderscores         = true;
  this.headersProvided        = true;
  this.downcaseHeaders        = true;
  this.upcaseHeaders          = false;
  this.includeWhiteSpace      = true;
  this.useTabsForIndent       = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(w,h) {
  var self = this;

  //build HTML for converter
  this.inputHeader = $('<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Input CSV or tab-delimited data. <span class="subhead"> Using Excel? Simply copy and paste. No data on hand? <a href="#" id="insertSample">Use sample</a></span></p></div>');
  this.inputTextArea = $('<textarea class="textInputs" id="dataInput"></textarea>');
  var outputHeaderText = '<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Output as <select name="Data Types" id="dataSelector" >';
    for (var i=0; i < this.outputDataTypes.length; i++) {

      outputHeaderText += '<option value="'+this.outputDataTypes[i]["id"]+'" '
              + (this.outputDataTypes[i]["id"] == this.outputDataType ? 'selected="selected"' : '')
              + '>'
              + this.outputDataTypes[i]["text"]+'</option>';
    };
    outputHeaderText += '</select><span class="subhead" id="outputNotes"></span></p></div>';
  this.outputHeader = $(outputHeaderText);
  this.outputTextArea = $('<textarea class="textInputs" id="dataOutput"></textarea>');

  this.node.append(this.inputHeader);
  this.node.append(this.inputTextArea);
  this.node.append(this.outputHeader);
  this.node.append(this.outputTextArea);

  this.dataSelect = this.outputHeader.find("#dataSelector");


  //add event listeners

  // $("#convertButton").bind('click',function(evt){
  //   evt.preventDefault();
  //   self.convert();
  // });

  this.outputTextArea.click(function(evt){this.select();});


  $("#insertSample").bind('click',function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    _gaq.push(['_trackEvent', 'SampleData','InsertGeneric']);
  });

  $("#dataInput").keyup(function() {self.convert()});
  $("#dataInput").change(function() {
    self.convert();
    _gaq.push(['_trackEvent', 'DataType',self.outputDataType]);
  });

  $("#dataSelector").bind('change',function(evt){
       self.outputDataType = $(this).val();
       self.convert();
     });

  this.resize(w,h);
}

DataConverter.prototype.resize = function(w,h) {

  var paneWidth = w;
  var paneHeight = (h-90)/2-20;

  this.node.css({width:paneWidth});
  this.inputTextArea.css({width:paneWidth-20,height:paneHeight});
  this.outputTextArea.css({width: paneWidth-20, height:paneHeight});

}

DataConverter.prototype.convert = function() {

  this.inputText = this.inputTextArea.val();
  this.outputText = "";


  //make sure there is input data before converting...
  if (this.inputText.length > 0) {

    if (this.includeWhiteSpace) {
      this.newLine = "\n";
      // console.log("yes")
    } else {
      this.indent = "";
      this.newLine = "";
      // console.log("no")
    }

    CSVParser.resetLog();
    var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);

    var dataGrid = parseOutput.dataGrid;
    var headerNames = parseOutput.headerNames;
    var headerTypes = parseOutput.headerTypes;
    var errors = parseOutput.errors;

    this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine, this.geocode);


    this.outputTextArea.val(errors + this.outputText);

  }; //end test for existence of input text
}


DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("name\taddress\tcity\tstate\tzip\tphone\nCROWN LIQUORS (AVON 2)\t10834 US 36 E\tAVON\tIN\t46123\t3176025268\nPayless Liquors #6\t2511 Albany Street\tBEECH GROVE\tIN\t46107\t\nB SQUARED BAR & GRILL\t1430 N. GREEN ST\tBROWNSBURG\tIN\t46112\t3178581569\nBRIDGEWATER CLUB\t16008 BRIDGEWATER CLUB BLVD\tCARMEL\tIN\t46033\t3178674653\nCALIENTE MEXICAN RESTAURANT\t1400 S. GUILFORD AVE\tCARMEL\tIN\t46032\t3175692223\nCROWN LIQUORS (W. 106TH)\t4000 W. 106TH STREET\tCARMEL\tIN\t46032\t3173442737\nPayless Liquors #14\t726 Adams Street\tCARMEL\tIN\t46032\t\nPayless Liquors #7\t445 S Rangeline Road\tCARMEL\tIN\t46032\t\nPayless Liquors #24\t14580 River Road\tCARMEL\tIN\t46033\t\nMANN'S MIDTOWN PACKAGE STORE\t251 WEST LINCOLN AVE\tCHANDLER\tIN\t47610\t8129253466");
}


