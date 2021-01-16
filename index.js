var _ = require("underscore");
var data = require("./data")
const { isUndefined } = require("underscore");
const { PrintSortedIdNameList, PrintAreaData } = require("./functions");

let parameters = process.argv.slice(2);

switch (parameters[0]) {
  case "-L":
    PrintSortedIdNameList(data.geoJsonObject);
    break;
    
  case "-A":
    let argLine = parameters[1];
    if (isUndefined(argLine)){
      console.log("Dla opcji -A podaj argumenty w postaci x:y");
      break;
    }
    
    let arguments = argLine.split(":");
    let idStart = arguments[0];
    let idEnd   = arguments[1];
    PrintAreaData(idStart,idEnd,data.geoJsonObject);    
    break;

  default:
    console.log("Możliwe opcje: ");
    console.log("'-L' - Posortowana lista powiatów ");
    console.log("'-A x:y' - Powierzchnia powiatów od id x do id y ");
    break;
}




