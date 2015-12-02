/*** EventWatcher Z-Way HA module *******************************************

Version: 1.01
(c) Maroš Kollár, 2015
-----------------------------------------------------------------------------
Author: Maroš Kollár <maros@k-1.com>
Description:
    This module listens to a selected event, and performs certain tasks when
    this event fires.

******************************************************************************/

/* jshint evil:true */

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
    
    _.each(self.config.eventsCancel,function(event) {
        self.controller.on(event, self.callbackCancel);
    });
    _.each(self.config.events,function(event) {
        self.controller.on(event, self.callbackEvent);
    });
    
};

EventWatcher.prototype.stop = function () {
    var self = this;
    
    _.each(self.config.eventsCancel,function(event) {
        self.controller.off(event, self.callbackCancel);
    });
    _.each(self.config.events,function(event) {
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
    
    if (typeof(self.timeout) !== 'undefined') {
        console.log('[EventWatcher] Got cancel event');
        clearTimeout(self.timeout);
        self.timeout = undefined;
    }
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
    
    if (typeof(action.delay) === 'number'
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
    var self = this;
    console.log('[EventWatcher] Running action index '+index);
    
    // Always reset timeout
    self.timeout = undefined;
    
    var action = self.config.actions[index];
    
    _.each(action.switches,function(element) {
        var deviceObject = self.controller.devices.get(element.device);
        if (deviceObject !== null) {
            if (element.status === 'toggle') {
                var level = deviceObject.get('metrics:level');
                level = (level === 'on') ? 'off':'on'; 
                deviceObject.performCommand(level);
            } else {
                deviceObject.performCommand(element.level);
            }
        }
    });
    
    _.each(action.multilevels,function(element) {
        var deviceObject = self.controller.devices.get(element.device);
        var level = parseInt(element.level,10);
        if (deviceObject !== null) {
            deviceObject.performCommand('exact',{ level: level });
        }
    });
    
    _.each(action.scenes,function(element) {
        var deviceObject = self.controller.devices.get(element);
        if (deviceObject !== null) {
            deviceObject.performCommand('on');
        }
    });
    
    if (typeof(action.code) !== 'undefined') {
        try {
            eval(action.code);
        } catch(e) {
            console.error('[EventWatcher] Error running custom code in index '+index+': '+e);
        }
    }
    
    self.processAction(index+1);
};
