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
    
    this.eventCallback  = undefined;
    this.callbackCancel = undefined;
    this.timeout        = undefined;
}

inherits(EventWatcher, AutomationModule);

_module = EventWatcher;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

EventWatcher.prototype.init = function (config) {
    EventWatcher.super_.prototype.init.call(this, config);

    var self = this;
    
    self.callbackEvent  = _.bind(self.handleEvent,self);
    self.callbackCancel = _.bind(self.handleCancel,self);
    
    _.each(self.config.eventCancel,function(event) {
        self.controller.on(event, self.callbackCancel);
    });
    _.each(self.config.event,function(event) {
        self.controller.on(event, self.callbackEvent);
    });
    
};

EventWatcher.prototype.stop = function () {
    var self = this;
    
    _.each(self.config.eventCancel,function(event) {
        self.controller.off(event, self.eventCancel);
    });
    _.each(self.config.event,function(event) {
        self.controller.off(event, self.callbackEvent);
    });
    
    self.handleCancel();
    
    self.callbackEvent  = undefined;
    self.callbackCancel = undefined;
    
    EventWatcher.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

EventWatcher.prototype.handleCancel = function() {
    var self = this;
    
    if (typeof(action) !== 'undefined') {
        console.log('[EventWatcher] Got cancel event');
        clearTimeout(self.timeout);
        self.timeout = undefined;
    };
};

EventWatcher.prototype.handleEvent = function() {
    var self = this;
    
    if (typeof(self.timeout) === 'undefined') {
        console.log('[EventWatcher] Got event');
        self.processAction(0);
    } else {
        console.log('[EventWatcher] Ignoring event. Already running');
    }
};

EventWatcher.prototype.processAction = function(index) {
    var self = this;
    
    var action = self.config.actions[index];
    if (typeof(action) === 'undefined') {
        return;
    }
    
    if (typeof(action.delay) === 'integer'
        && action.delay > 0) {
        self.timeout = setTimeout(
            _.bind(self.performAction,self,index),
            (action.delay * 1000)
        );
    } else {
        self.performAction(index);
    }
};

EventWatcher.prototype.performAction = function(index) {
    console.log('[EventWatcher] Running action index '+index);
    
    // Always reset timeout
    self.timeout = undefined;
    
    _.each(action.switches,function(element) {
        var deviceObject = self.controller.devices.get(element.device);
        if (typeof(deviceObject) !== 'undefined') {
            if (element.status === 'toggle') {
                var level = deviceObject.get('metrics:level');
                level = (level === 'on') ? 'off':'on'; 
                deviceObject.performCommand(level);
            } else {
                deviceObject.performCommand(element.status);
            }
        }
    });
    
    _.each(action.multilevels,function(element) {
        var deviceObject = self.controller.devices.get(element.device);
        var level = parseInt(level);
        if (typeof(deviceObject) !== 'undefined') {
            deviceObject.performCommand('exact',{ level: level });
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
    
    self.processAction(index+1);
};
