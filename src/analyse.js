
var moment = require('moment');
var _ = require('underscore');

var CONST = {
	iEarthRadius: 6378137	
};

/**
 * @param {Number} fAngleInDegrees
 * @returns {Number}
 */
function DegreesToRadians (fAngleInDegrees)
{
	return fAngleInDegrees * Math.PI / 180;
}

/**
 * @param {Object} oCoordA
 * @param oCoordA.lat
 * @param oCoordA.lon
 * 
 * @param {Object} oCoordB
 * @param oCoordB.lat
 * @param oCoordB.lon
 * 
 * @returns {number}
 */
function CalculateHaversineDistanceOnEarth (oCoordA, oCoordB)
{
	var fLat1 = DegreesToRadians(oCoordA.lat);
	var fLat2 = DegreesToRadians(oCoordB.lat);
	var fDeltaLatBy2 = (fLat2 - fLat1) / 2;

	var fDeltaLonBy2 = DegreesToRadians(oCoordB.lon - oCoordA.lon) / 2;

	var f = Math.sin(fDeltaLatBy2) * Math.sin(fDeltaLatBy2) +
		Math.sin(fDeltaLonBy2) * Math.sin(fDeltaLonBy2) *
		Math.cos(fLat1) * Math.cos(fLat2);

	return 2 * CONST.iEarthRadius * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f));
};

function Analyse (oGpx)
{
	
	var fTotalLength = 0;	// In metres.
	var fTotalDuration = 0;	// In milliseconds.

	_.each(oGpx.gpx.trk, function (oTrk)
	{
		_.each(oTrk.trkseg, function (oTrkseg)
		{
			var oPrevTime;
			var oPrevCoord;
     
			_.each(oTrkseg.trkpt, function (oTrkpt)
			{
				var oCurrentTime = moment(oTrkpt.time[0]);
				var oCurrentCoord = {
					lat: oTrkpt.$.lat,
					lon: oTrkpt.$.lon
				};
			
			 
				if (oPrevTime) {
					
					fTotalLength += CalculateHaversineDistanceOnEarth(oPrevCoord, oCurrentCoord);
					// fElevation +=calcelevationvation(oPrevCoord, oCurrentCoord)
					fTotalDuration += oCurrentTime.diff(oPrevTime, 'milliseconds');
				}

				oPrevTime = oCurrentTime;
				oPrevCoord = oCurrentCoord;
			});
		});
	});

	return {
		'Total length, km': Math.round(fTotalLength) / 1000,
		'Total duration, min': Math.round(fTotalDuration / 600) / 100,
		'Average speed, km/h': Math.round(fTotalLength / fTotalDuration * 36000) / 10
	}
}

function calcelevationvation (points) {
  var dp = 0,
      dm = 0,
      ret = {};

  for (var i = 0; i < points.length - 1; i++) {
      var diff = parseFloat(points[i + 1].elevation) - parseFloat(points[i].elevation);

      if (diff < 0) {
          dm += diff;
      } else if (diff > 0) {
          dp += diff;
      }
  }

  var elevationvation = [];
  var sum = 0;

  for (var i = 0, len = points.length; i < len; i++) {
      var elevation = parseFloat(points[i].elevation);
      elevationvation.push(elevation);
      sum += elevation;
  }

  ret.max = Math.max.apply(null, elevationvation);
  ret.min = Math.min.apply(null, elevationvation);
  ret.pos = Math.abs(dp);
  ret.neg = Math.abs(dm);
  ret.avg = sum / elevationvation.length;

  return ret;
};
module.exports = {
	Analyse: Analyse
};
