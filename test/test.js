
const {app, BrowserWindow} = require('electron')
const PluginManager = require('../lib/plugin-manager')

var assert = require('assert');
describe('Peer Interface', function() {


  describe('PluginManager', function() {
    it('should copy files', async function() {

        PluginManager.copyPlugins();

        PluginManager.loadPlugins();


    });
  });








});
