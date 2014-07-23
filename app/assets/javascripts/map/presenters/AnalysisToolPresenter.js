/**
 * The AnalysisToolPresenter class for the AnalysisToolView.
 *
 * @return AnalysisToolPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var AnalysisToolPresenter = Class.extend({

    datasets: {
      'umd_tree_loss_gain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'fires': 'nasa-active-fires',
      'modis': 'quicc-alerts'
    },

    init: function(view) {
      this.view = view;
      this.baselayer = null;
      this.currentGeom = null;
      this._subscribe();
    },

    _subscribe: function() {
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setBaselayer(layerSpec);
      }, this));

      mps.subscribe('Place/go', _.bind(function(place) {
        this._setBaselayer(place.params.layerSpec);
        if (place.params.geom) {
          this.publishAnalysis(place.params.geom);
          this.view.drawFromCoordinates(place.params.geom);
        }
      }, this));

      mps.subscribe('AnalysisResults/delete-analysis', _.bind(function() {
        this.view.deleteSelection();
        this.currentGeom = null;
      }, this));

      mps.publish('Place/register', [this]);
    },

    /**
     * Set current baselayer from any layer change.
     */
    _setBaselayer: function(layerSpec) {
      this.baselayer = _.first(_.intersection(
        _.pluck(layerSpec.getBaselayers(), 'slug'),
        _.keys(this.datasets)));

      this._setVisibility();
    },

    /**
     * Toggle hidden depending on active layers.
     */
    _setVisibility: function() {
      if (!this.baselayer) {
        this.view._onClickCancel();
        this.view.model.set('hidden', true);
      } else {
        this.view.model.set('hidden', false);
      }
    },

    /**
     * Used by AnalysisToolView to publish analysis.
     */
    publishAnalysis: function(geom) {
      this.currentGeom = geom;
      mps.publish('AnalysisService/get', [{
        dataset: this.datasets[this.baselayer],
        geojson: geom
      }]);
    },

    startDrawing: function() {
      mps.publish('AnalysisTool/start-drawing', []);
    },

    stopDrawing: function() {
      mps.publish('AnalysisTool/stop-drawing', []);
    },

    getPlaceParams: function() {
      var p = {};

      if (this.currentGeom) {
        p.geom = encodeURIComponent(this.currentGeom);
      }

      return p;
    }

  });

  return AnalysisToolPresenter;

});
