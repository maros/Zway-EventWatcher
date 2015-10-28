/*** EventWatcher Z-Way HA module *******************************************

Version: 1.01
(c) Maroš Kollár, 2015
-----------------------------------------------------------------------------
Author: Maroš Kollár <maros@k-1.com>
Description:
    This module listens to a selected event, and performs certain tasks when
    this event fires.

******************************************************************************/

function EventWatcher (id, controller) {
    // Call superconstructor first (AutomationModule)
    EventWatcher.super_.call(this, id, controller);
    
    this.callbackEvent = undefined;
}

inherits(EventWatcher, AutomationModule);

_module = EventWatcher;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

EventWatcher.prototype.init = function (config) {
    EventWatcher.super_.prototype.init.call(this, config);

    var self = this;
    
    self.callbackEvent = _.bind(self.callbackEvent,self);
    
    _.each(self.config.event,function(event) {
        self.controller.on(event, self.callbackEvent);
    });
};

EventWatcher.prototype.stop = function () {
    var self = this;
    
    _.each(self.config.event,function(event) {
        self.controller.off(event, self.callbackEvent);
    });
    
    self.callbackEvent = undefined;
    
    EventWatcher.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

EventWatcher.prototype.callbackEvent = function() {
    var self = this;
    
    console.log('[EventWatcher] Got event');
    
    self.runAction(0);
};

EventWatcher.prototype.runAction = function(index) {
    var self = this;
    
    var action = self.config.actions[index];
    if (typeof(action) === 'undefined') {
        return;
    }
    
    if (typeof(action.delay) === 'integer'
        && action.delay > 0) {
        setTimeout(
            _.bind(self.performAction,self,index),
            (action.delay * 1000)
        );
    } else {
        self.performAction(index);
    }
};

EventWatcher.prototype.performAction = function(index) {
    console.log('[EventWatcher] Running action index '+index);
    
    _.each(action.switches,function(element) {
        var deviceObject = self.controller.devices.get(element.device);
        if (typeof(deviceObject) !== 'undefined') {
            deviceObject.performCommand(element.status);
        }
    });
    
    _.each(action.dimmers,function(element) {
        var deviceObject = self.controller.devices.get(element.device);
        var status = parseInt(status);
        if (typeof(deviceObject) !== 'undefined') {
            deviceObject.performCommand('exact',status);
        }
    });
    
    _.each(action.scenes,function(element) {
        var deviceObject = self.controller.devices.get(element);
        if (typeof(deviceObject) !== 'undefined') {
            deviceObject.performCommand('on');
        }
    });
    
    if (typeof(action.code) !== 'undefined') {
        try {
            eval(action.code)
        } catch(e) {
            console.error('[EventWatcher] Error running custom code in index '+index+': '+e)
        }
    }
    
    self.runAction(index+1);
};
