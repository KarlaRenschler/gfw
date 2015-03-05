/**
 * Cartodb dark Matter Maptype.
 */
define([], function () {

  'use strict';

  var cdbdarkMaptype = function() {
    var config = {
      name: 'CartoDB Dark',
      alt: 'CartoDB Dark Matter Basemap',
      maxZoom: 17,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        return '//a.basemaps.cartocdn.com/dark_all/{0}/{1}/{2}.png'.format(z, x, ll.y);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return cdbdarkMaptype;
});
