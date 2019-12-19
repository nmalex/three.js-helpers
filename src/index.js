'use strict';
import Demo from './Demo'
import { RayysWebColorsDemo } from './RAYYS.WebColors.demo'

const params = (function getJsonFromUrl(url) {
    var query = url.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}(window.location.search))


switch (params.demo) {
    case 'RAYYS.WebColors':
        Demo.run(new RayysWebColorsDemo())
        break;
    default:
        break;
}
