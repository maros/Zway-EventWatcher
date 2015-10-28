# Zway-EventWatcher

This module allows to define logic to act upon events emitted by other 
automation modules (eg. Rain, SecurityZone, Presence, Astronomy ...). It is 
possible to define multiple triggering events and multiple actions to perform.
Action steps may have arbitrary delays and consist of multiple actions.

The module ensures that at any given time only one event is processed. If the
same event is triggered while it is still processing (see actions.delay) then
the second event is silently discarded (see also eventsCancel)

# Configuration

## events

Events that trigger an action. Please refer to the documentation of the 
event emitting modules for details. Commonly used events are:

* rain.start
* security.intrusion.alarm
* presence.home
* presence.vacation
* presence.away
* presence.night
* astronomy.sunset
* astronomy.sunrise

## eventsCancel

Events that can cancel the processing of another event action. This can be 
useful to implement coming home/going away scenes that can be aborted when
inhabitants return shortly after leaving (eg. because they forgot something)
Commonly used events are:

* rain.stop
* security.intrusion.cancel
* presence.home
* presence.vacation
* presence.away

## actions

Define multiple steps to run when an event was triggered.

## actions.delay

Delays the execution of the step for the given number of seconds.

## actions.switches

Define multiple switches to change

## action.switches.device

## action.switches.level

Action to perform: On, off or toggle

## actions.multilevel

Define multiple multilevel devices to change

## action.switches.device

## action.switches.level

## action.scenes

Scenes to run

## code

User code to run (expert only)

# Events

No events are emitted

# Installation

```shell
cd /opt/z-way-server/automation/modules
git clone https://github.com/maros/Zway-EventWatcher.git EventWatcher --branch latest
```

To update or install a specific version
```shell
cd /opt/z-way-server/automation/modules/EventWatcher
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
