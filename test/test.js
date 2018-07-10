
const {app, BrowserWindow} = require('electron')
const PadConfigManager = require('../lib/pad-config-manager')

var assert = require('assert');
describe('Pad Config', function() {


    it('populateCellWithAttributes', async function() {

        var cell = {
          cellId: 1
        }

        cell = PadConfigManager.populateCellWithAttributes(cell);

        console.log('cell',cell)


    });





});
