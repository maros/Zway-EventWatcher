# Zway-EventWatcher

This module allows to define logic to act upon events emitted by other
automation modules (eg. Rain, SecurityZone, Presence, Astronomy, Season,
ConditionSwitch, ...). It is possible to define multiple triggering events
and multiple actions to perform. Action steps may have arbitrary delays and
consist of multiple actions and custom JavaScript code.

The module ensures that at any given time only one event is processed. If the
same event is triggered while it is still processing (see actions.delay) then
the second event is silently discarded. Cancelling events that stop the
further processing of delayed events is also possible. (see eventsCancel)

# Configuration

## events

Events that trigger an action. Please refer to the documentation of the
event emitting modules for details. Commonly used events are:

* rain.start
* security.intrusion.alarm
* security.intrusion.delayAlarm
* security.smoke.alarm
* security.flood.alarm
* presence.home
* presence.vacation
* presence.away
* presence.night
* astronomy.sunset
* astronomy.sunrise
* Custom events emitted by the ConditionSwitch module
* ...

It is not possible to use EventWatcher to act upon generic level change events.

## eventsCancel

Events that can cancel the processing of another event action. This can be
useful to implement

* coming home/going away scenes that can be aborted when
inhabitants return shortly after leaving (eg. because they forgot something)
* aborting alarms (eg. turing off alarm devices)
* ...

Commonly used events are:

* rain.stop
* security.intrusion.cancel
* presence.home
* presence.vacation
* presence.away
* Custom events emitted by the ConditionSwitch module
* ...

## actions

Define multiple steps to run when an event was triggered.

## actions.delay

Delays the execution of the step for the given number of seconds.

## actions.switches, action.switches.device, action.switches.level

Define multiple switches to change. Possible levels are : On, off and toggle

## actions.multilevel, action.multilevel.device, action.multilevel.level

Define multiple multilevel devices to change

## action.scenes

Scenes to run

## actions.notifications.device, actions.notifications.message

Notifications to emit. Message is only used if the event does not have a message
of its own.

## actions.code

User code to run (expert only). The code can access the original event
via the variable event in its scope.

# Events

No events are emitted. Listens to events configured in events and
cancelEvents.

# Installation

The prefered way of installing this module is via the "Zwave.me App Store"
available in 2.2.0 and higher. For stable module releases no access token is
required. If you want to test the latest pre-releases use 'k1_beta' as
app store access token.

For developers and users of older Zway versions installation via git is
recommended.

```shell
cd /opt/z-way-server/automation/userModules
git clone https://github.com/maros/Zway-EventWatcher.git EventWatcher --branch latest
```

To update or install a specific version
```shell
cd /opt/z-way-server/automation/userModules/EventWatcher
git fetch --tags
# For latest released version
git checkout tags/latest
# For a specific version
git checkout tags/1.02
# For development version
git checkout -b master --track origin/master
```

# License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or any
later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
