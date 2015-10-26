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
}

inherits(EventWatcher, AutomationModule);

_module = EventWatcher;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

EventWatcher.prototype.init = function (config) {
    EventWatcher.super_.prototype.init.call(this, config);

    var self = this;

};

EventWatcher.prototype.stop = function () {
    var self = this;
    
    if (self.vDev) {
        self.controller.devices.remove(self.vDev.id);
        self.vDev = undefined;
    }
    
    EventWatcher.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

