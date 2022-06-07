function ParseRoute(routeList) {
    const Routes = [];
    routeList.map(item => {
        Routes.push(JSON.parse(item.data.body));
    });
    return Routes;
}

function FormatRoute(route) {

    const jsonHdrStr = JSON.parse(JSON.stringify(route.Headers))
    const properties = jsonHdrStr.split(';');
    const headers = {};
    properties.forEach(function (property) {
        let tup = property.split(':');
        headers[tup[0].replace(/['"]+/g, '')] = tup[1].replace(/['"]+/g, '');
    });

    const jsonPrmStr = route.Params
    const propertis = jsonPrmStr.split(';');
    const params = {};
    propertis.forEach(function (property) {
        let tup = property.split(':');
        params[tup[0].replace(/['"]+/g, '')] = tup[1].replace(/['"]+/g, '');
    });

    const options = {
        method: route.Method,
        url: route.EndPoint,
        headers,
        params
    };

    return options;
}
module.exports = { ParseRoute, FormatRoute }