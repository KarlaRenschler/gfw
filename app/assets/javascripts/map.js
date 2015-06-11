/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'chosen',
  'map/utils',
  'enquire',
  'introJs',
  'mps',
  'map/router',
  'views/SourceWindowView',
  'views/SourceMobileFriendlyView',
  'map/presenters/ExperimentsPresenter',
  'map/services/AnalysisService',
  'map/services/CountryService',
  'map/services/DataService',
  'map/views/MapView',
  'map/views/MapControlsView',
  'map/views/MapControlsMobileView',
  'map/views/TabsView',
  'map/views/analysis/AnalysisResultsView',
  'map/views/LayersNavView',
  'map/views/LegendView',
  'map/views/TimelineView',
  'views/HeaderView',
  'views/FooterView',
  'views/NotificationsView',
  'views/DownloadView',

  '_string'
], function($, _, Class, Backbone, chosen, utils, enquire, introJs, mps, Router, SourceWindowView, SourceMobileFriendlyView, ExperimentsPresenter, AnalysisService, CountryService, DataService, MapView,
    MapControlsView, MapControlsMobileView, TabsView, AnalysisResultsView, LayersNavView, LegendView, TimelineView, HeaderView, FooterView, NotificationsView, DownloadView) {

  'use strict';

  var MapPage = Class.extend({

    $el: $('body'),

    init: function() {
      var router = new Router(this);
      this._cartodbHack();
      this._initViews();
      this._initApp();

      // For dev
      window.router = router;
      window.mps = mps;
      window.analysis = AnalysisService;
      window.countryService = CountryService;
      window.ds = DataService;
      this.startIntro();
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
      }
    },

    /**
     * Initialize Application Views.
     * CAUTION: Don't change the order of initanciations if
     * you are not completely sure.
     */
    _initViews: function() {
      // Google Experiments
      new ExperimentsPresenter();


      var mapView = new MapView();

      new MapControlsView(mapView.map);
      new MapControlsMobileView();
      new TabsView(mapView.map);
      new AnalysisResultsView();
      new LayersNavView();
      new LegendView();
      new TimelineView();
      new FooterView();
      new HeaderView();
      new SourceWindowView();
      new SourceMobileFriendlyView();
      new NotificationsView();

    },

    /**
     * Cartodb Handlebars hack.
     */
    _cartodbHack: function() {
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      });
    },

    startIntro: function(){
      window.intro = introJs();
      intro.setOptions({
        steps: [{
            intro: "Hello world!"
          },{
            element: '#layers-menu',
            intro: "Here you have the layers.",
            position: 'bottom'
          },{
            element: '#module-legend',
            intro: "This is the legend.",
            position: 'right'
          },{
            element: '#module-tabs',
            intro: "This is the tab",
            position: 'left'
          },{
            element: '#module-map-controls',
            intro: 'Those are the map controls.',
            position: 'right'
          },{
            element: '.timeline-container',
            intro: 'This is the timeline.',
            position: 'top'
          }]
      });
      intro.start();
    }


  });

  new MapPage();

});
