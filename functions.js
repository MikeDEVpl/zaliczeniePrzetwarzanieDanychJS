var _ = require("underscore");
const { isUndefined } = require("underscore");

//Wyświetlanie posortowanej listy powiatów
function PrintSortedIdNameList(data){

  var tab = _NameSorting(data);

  tab.forEach(element => {
    console.log(element);
  });
}

//Wyświetlanie powierzchni powiatów wg. zakresu id
function PrintAreaData(idStart,idEnd,data){
  // Mapowanie na obiekt z potrzebnymi polami
  // - id
  // - nazwa
  // - typ
  // - coordinates
  var transformedData = _.map(data.features, function(el){
    return {
      id: el.properties.id,
      nazwa: el.properties.nazwa,
      type: el.geometry.type,
      coordinates: el.geometry.coordinates
    }
  });

  //Zliczanie dla każdego znalezionego obiektu
  transformedData.forEach(element => {
    if(element.id >= idStart && element.id <= idEnd){
      _CheckAndCalculatePolygon(element);
    }  
  });

}


// Private functions ////////////////////////////////////////////////////////////////

//Funkcja sprawdza typ i liczy powierzchnię wg. typu
function _CheckAndCalculatePolygon(element) {
  if (element.type === "MultiPolygon") {
    console.log(
      element.nazwa + " ----- Area: " + _calculateMultiPolygonArea(element.coordinates)
    );
  }

  if (element.type === "Polygon") {
    var polygonVertexList = _.flatten(element.coordinates);
    console.log(
      element.nazwa.toUpperCase() + "  ----- Area: " + _calculatePolygonArea(polygonVertexList)
    );
  }
}

//Funkcja zwraca posortowane nazwy powiatów 
function _NameSorting(data) {
  // Mapowanie na obiekt z potrzebnymi polami
  // - id
  // - nazwa
  var transformedList = _.map(data.features, function(el){
    return {
      id: el.properties.id,
      nazwa: el.properties.nazwa,
    }
  });

  // Sortowanie stworzonego obiektu
  let result = _.sortBy(transformedList, function (line) {
    return line.nazwa.toLowerCase();
  });
  return result;
}

// Funkcja liczy pole MultiPolygonu
function _calculateMultiPolygonArea(coordinates) {
  let polyAreaList = [];

  //Tworzy pomocniczą listę z powierzchniami polygonów(zewnętrznego i wewnętrznego)
  _.each(coordinates, function (coordinatesData) {
    _.each(coordinatesData, function (singlePolyData) {
      let vertexList = _.flatten(singlePolyData);
      polyAreaList.push(_calculatePolygonArea(vertexList));
    });
  });

  //Odejmuje od zewnętrznego wewnętrzny polygon
  let area = _.reduce(polyAreaList, function (memo, num) {
    return Math.abs(memo) - Math.abs(num);
  }, 0);

  return area;
}

//Funkcja liczy pole Polygonu
function _calculatePolygonArea(vertexList) {
  let area = 0.0;
  let sum = 0.0;

  for (let i = 0; i < vertexList.length; i = i + 2) {

    let x1 = vertexList[i];
    let y1 = vertexList[i + 1];

    let x2 = vertexList[i + 2];
    let y2 = vertexList[i + 3];

    if (isUndefined(x1)) { x1 = 0; }
    if (isUndefined(y1)) { y1 = 0; }
    if (isUndefined(x2)) { x2 = vertexList[0]; }
    if (isUndefined(y2)) { y2 = vertexList[1]; }

    sum = sum + (x1 * y2) - (y1 * x2);
  }
  area = Math.abs(sum / 2);

  return area;
}

exports.PrintSortedIdNameList = PrintSortedIdNameList;
exports.PrintAreaData = PrintAreaData;
