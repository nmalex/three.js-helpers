'use strict';
import Demo from './Demo'
import { RayysWebColorsDemo } from './RAYYS.WebColors.demo'
import { RayysLinearDimensionDemo } from './RAYYS.LinearDimension.demo'
import { RayysBox3HelperDemo } from './RAYYS.Box3Helper.demo'
import { RayysMouseDemo } from './RAYYS.Mouse.demo'
import { RayysMouseMoveDemo } from './RAYYS.MouseMove.demo'
import { RayysFacingCameraDemo } from './RAYYS.FacingCamera.demo'
import { RayysObjectDecoratorDemo } from './RAYYS.ObjectDecorator.demo'
import { RayysRotationGizmoDemo } from './RAYYS.RotationGizmo.demo'
import { RayysTooltipDemo } from './RAYYS.Tooltip.demo'

const params = getJsonFromUrl(window.location.search)

switch (params.demo) {
    case 'RAYYS.WebColors':
        Demo.run(new RayysWebColorsDemo())
        break;
    case 'RAYYS.LinearDimension':
        Demo.run(new RayysLinearDimensionDemo());
        break;
    case 'RAYYS.Box3Helper':
        Demo.run(new RayysBox3HelperDemo());
        break;
    case 'RAYYS.Mouse':
        Demo.run(new RayysMouseDemo());
        break;
    case 'RAYYS.MouseMove':
        Demo.run(new RayysMouseMoveDemo());
        break;
    case 'RAYYS.FacingCamera':
        Demo.run(new RayysFacingCameraDemo());
        break;
    case 'RAYYS.ObjectDecorator':
        Demo.run(new RayysObjectDecoratorDemo());
        break;
    case 'RAYYS.RotationGizmo':
        Demo.run(new RayysRotationGizmoDemo());
        break;
    case 'RAYYS.Tooltip':
        Demo.run(new RayysTooltipDemo());
        break;
    default:
        break;
}

function getJsonFromUrl(url) {
    var query = url.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}