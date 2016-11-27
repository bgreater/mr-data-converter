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

    this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine);


    this.outputTextArea.val(errors + this.outputText);

  }; //end test for existence of input text
}


DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("name\taddress\tcity\tstate\tzip\tphone\nCROWN LIQUORS (AVON 2)\t10834 US 36 E\tAVON\tIN\t46123\t3176025268\nPayless Liquors #6\t2511 Albany Street\tBEECH GROVE\tIN\t46107\t\nB SQUARED BAR & GRILL\t1430 N. GREEN ST\tBROWNSBURG\tIN\t46112\t3178581569\nBRIDGEWATER CLUB\t16008 BRIDGEWATER CLUB BLVD\tCARMEL\tIN\t46033\t3178674653\nCALIENTE MEXICAN RESTAURANT\t1400 S. GUILFORD AVE\tCARMEL\tIN\t46032\t3175692223\nCROWN LIQUORS (W. 106TH)\t4000 W. 106TH STREET\tCARMEL\tIN\t46032\t3173442737\nPayless Liquors #14\t726 Adams Street\tCARMEL\tIN\t46032\t\nPayless Liquors #7\t445 S Rangeline Road\tCARMEL\tIN\t46032\t\nPayless Liquors #24\t14580 River Road\tCARMEL\tIN\t46033\t\nMANN'S MIDTOWN PACKAGE STORE\t251 WEST LINCOLN AVE\tCHANDLER\tIN\t47610\t8129253466\nBROADWAY LIQUORS\t804 BROADWAY\tCHESTERTON\tIN\t46304\t2199264073\nLUCCHESE'S ITALIAN RESTAURANT\t655 CO RD 17 SUITE 9\tELKHART\tIN\t46516\t5745224137\nRODINO PARKMOR LIQUOR\t1520 EDWARDSBURG AVE.\tELKHART\tIN\t46514-2103\t5742646922\nSTERLING LIQUOR STORE\t1500 STERLING AVE\tELKHART\tIN\t46516\t5742933831\nACROPOLIS GREEK RESTAURANT\t501 NORTH GREEN RIVER ROAD\tEVANSVILLE\tIN\t47715\t8124759320\nLIQUOR LOCKER #9 FIRST AVE\t4008 N FIRST AVE\tEVANSVILLE\tIN\t47710\t8124796111\nCARROLL WINE & SPIRITS\t9880 E. 121ST STREET\tFISHERS\tIN\t46037\t\nDETOUR AMERICAN GRILLE & BAR\t10158 BROOKS SCHOOL RD\tFISHERS\tIN\t46038\t3176699333\nPayless Liquors #17\t7351 E 116th Street\tFISHERS\tIN\t46038\t\nPayless Liquors #19\t11416 Olio Road\tFISHERS\tIN\t46037\t\nAMORE FINE ITALIAN CUISINE\t730 HIGHLANDER POINT DR\tFLOYDS KNOBS\tIN\t47119\t8129030139\nHALL'S FACTORY\t5811 COLDWATER RD\tFORT WAYNE\tIN\t46825\t2604848693\nHALL'S GUESTHOUSE\t1313 WASHINGTON CENTER RD\tFORT WAYNE\tIN\t46825\t2602494326\nHALL'S TRIANGLE PARK\t3010 TRIER ROAD\tFORT WAYNE\tIN\t46805\t2604824342\nORCHARD RIDGE COUNTRY CLUB\t4531 LOWER HUNTINGTON RD\tFORT WAYNE\tIN\t46899-\t2607473117\nSHOW-GIRL LOUNGE\t2910 GOSHEN RD\tFORT WAYNE\tIN\t46808\t2604847813\nBelmont Beverages\t3309 N Anthony Blvd\tFORT WAYNE\tIN\t46805\t\nBelmont Beverages\t2799 Maplecrest Rd\tFORT WAYNE\tIN\t46809\t\nBelmont Beverages\t8225 Lima Rd\tFORT WAYNE\tIN\t46818\t\nBelmont Beverages\t3718 East Dupont Rd\tFORT WAYNE\tIN\t46825\t\nBelmont Beverages\t3237 St Joe Center Rd\tFORT WAYNE\tIN\t46835\t\nCOMMON SPIRITS\t111 E LINCOLN AVE\tGOSHEN\tIN\t46528\t5746077288\nMEGA LIQUOR & SMOKE (GRAPE)\t7106 GRAPE ROAD\tGRANGER\tIN\t46530\t5742772446\nPayless Liquors #20\t954 N. State Road 135\tGREENWOOD\tIN\t46142\t\nPayless Liquors #15\t1225 N Madison Ave\tGREENWOOD\tIN\t46142\t\nTWINCADE\t108 N. BROAD ST\tGRIFFITH\tIN\t46319\t6462415247\nLIQUOR STOP\t9218 INDIANAPOLIS BLVD.\tHIGHLAND\tIN\t46322\t2198386884\nCROWN LIQUORS (DOWNTOWN)\t150 N. DELAWARE ST\tINDIANAPOLIS\tIN\t46204\t3176383720\nRED SAKE JAPANESE BISTRO\t11228 FALL CREEK RD\tINDIANAPOLIS\tIN\t46256\t3179139272\nPayless Liquors #1\t2351 Lafayette Rd\tINDIANAPOLIS\tIN\t46222\t\nPayless Liquors #21\t5230 Rockville Road\tINDIANAPOLIS\tIN\t46224\t\nPayless Liquors#4\t1317 W 86th Street\tINDIANAPOLIS\tIN\t46260\t\nPayless Liquors #3\t5021 Kentucky Avenue\tINDIANAPOLIS\tIN\t46221\t\nPayless Liquors #25\t9310 North Michicgan Rd\tINDIANAPOLIS\tIN\t46268\t\nPayless Liquors #11\t3739 N Shadeland Ave\tINDIANAPOLIS\tIN\t46226\t\nPayless Liquors #16\t9609 N College\tINDIANAPOLIS\tIN\t46280\t\nPayless Liquors #18\t4901 E 82nd Street\tINDIANAPOLIS\tIN\t46250\t\nPayless Liquors #5\t4924 S. Emerson Avenue\tINDIANAPOLIS\tIN\t46203\t\nPayless Liquors #12\t7369 Madison Avue\tINDIANAPOLIS\tIN\t46227\t\nBREW (JASPER)\t408 MAIN ST\tJASPER\tIN\t47546\t8125560017\nHOLIDAY LIQUORS (N. JASPER)\t26TH & NEWTON ST\tJASPER\tIN\t47546\t8124822122\nHOLIDAY LIQUORS (S. JASPER)\t480 HWY 231 SOUTH\tJASPER\tIN\t47546\t8124822926\nWOODEN KEG LIQUORS\t513 3RD AVENUE\tJASPER\tIN\t47546\t8124821418\nCOTERIE, THE\t107 W SYCAMORE ST SUITE 2\tKOKOMO\tIN\t46901\t7654508380\nSOUPLEY'S, INC\t500 SOUTH REED RD\tKOKOMO\tIN\t46904-2263\t7654579396\nHESTON SUPPER CLUB\t2003 EAST 1000 N\tLA PORTE\tIN\t46350\t2197782938\nCATCH 22\t500 EAST LINCOLN HWY\tMERRILLVILLE\tIN\t46410\t2197939635\nGAMBA RISTORANTE\t455 EAST 84TH DRIVE\tMERRILLVILLE\tIN\t46410\t2197365000\nLIQUOR BUCKET\t409 W. 80TH PLACE\tMERRILLVILLE\tIN\t46410-\t2197692077\nTRAIL CREEK LIQUOR\t2000 E US20\tMICHIGAN CITY\tIN\t46360-\t2198746702\nCITY WIDE (BITTERSWEET)\t305 BITTERSWEET\tMISHAWAKA\tIN\t46544\t5742555793\nCITY WIDE (GRAPE)\t3825 N. GRAPE ROAD\tMISHAWAKA\tIN\t46601\t5742722274\nDELOCK'S DISCOUNT (MUNSTER #1)\t822 RIDGE RD\tMUNSTER\tIN\t46321\t2198362088\nPayless Liquors #10\t1743 E Main Street\tPLAINFILED\tIN\t46168\t\nParsley's Liquors\t1731 E Main Street\tPLAINFILED\tIN\t46168\t\nMILLEA PACKAGE STORE\t1533 N. MICHIGAN\tPLYMOUTH\tIN\t46563-\t5749362922\nPLYMOUTH PARTY PACK\t114 S MICHIGAN ST\tPLYMOUTH\tIN\t46563\t5749369536\nDUNESIDE LIQUORS\t2681 WILLOWCREEK\tPORTAGE\tIN\t46368\t2197637330\nBLARNEY STONE WINE & SPIRITS\t1818 SOUTH BEND AVE\tSOUTH BEND\tIN\t46637\t5742730200\nCARMELA'S AT MACRI'S\t214 N. NILES AVE\tSOUTH BEND\tIN\t46617\t5742804824\nSTABLES STEAKHOUSE\t939 POPLAR STREET\tTERRE HAUTE\tIN\t47807\t8122326677\nSERVICE LIQUORS EAST\t3720 LAKE CITY HIGHWAY\tWARSAW\tIN\t46580\t5742673651\nBULLDOG BREWING CO\t1409 119TH ST\tWHITING\tIN\t46394\t2196555284\nPayless Liquors #8\t180 W Sycamore\tZIONSVILLE\tIN\t46077\t\nPayless Liquors #13\t60 Brendon Way\tZIONSVILLE\tIN\t46077\t");
}


