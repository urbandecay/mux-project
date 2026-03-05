import React, { memo } from 'react';

const ICON_DATA = {
  arrow: {
    w: 14, h: 14,
    offsetY: -1,
    data: [
      [null, null, null, null, "#e2ecff34", "#e1ebff11", null, null, null, null, null, null, null, null],
      [null, null, null, null, "#e3ebff4d", "#e1ebffdc", "#e2ecff34", null, null, null, null, null, null, null],
      [null, null, null, null, "#e3ebff4d", "#e1ebffdc", "#e2ebffe2", "#e3ebff71", "#e2eeff04", null, null, null, null, null],
      [null, null, null, null, "#e3ebff4d", "#e2eaff9f", "#e4eeff1c", "#e2ebffc7", "#e1ebffb2", "#e1ebff11", null, null, null, null],
      ["#e4ebff0c", "#e3ebff4d", "#e3ebff4d", "#e3ebff4d", "#e1ebff98", "#e2eaff9f", null, "#e4ecff08", "#e2ecff8d", "#e1ebffdc", "#e2ecff34", null, null, null],
      ["#e4ebff1b", "#e2ebffe2", "#e1ebffa6", "#e2eaff9f", "#e2eaff9f", "#e3ebff71", null, null, "#daf5ff01", "#e3ebff4a", "#e2ebffe2", "#e3ebff71", "#e2eeff04", null],
      ["#e4ebff1b", "#e2ebffe2", "#e7f0ff06", null, null, null, null, null, null, null, "#e1ebff1c", "#e2ebffc5", "#e1ebffb2", "#e1ebff11"],
      ["#e4ebff1b", "#e2ebffe2", "#e7f0ff06", null, null, null, null, null, "#1e1f22", "#1e1f22", "#e4eeff1c", "#e2ebffc7", "#e1ebffb2", "#e1eaff11"],
      ["#e4ebff1b", "#e2ebffe2", "#e1ebffa6", "#e2eaff9f", "#e2eaff9f", "#e3ebff71", null, null, "#daf5ff01", "#e3ebff4b", "#e2ebffe2", "#e3ebff71", "#e2eeff04", null],
      ["#e4ebff0c", "#e3ebff4d", "#e3ebff4d", "#e3ebff4d", "#e1ebff98", "#e2eaff9f", null, "#e4ecff08", "#e2ebff8e", "#e1ebffdc", "#e2ecff33", null, null, null],
      [null, null, null, null, "#e3ebff4d", "#e2eaff9f", "#e4eeff1c", "#e2ebffc7", "#e1ebffb2", "#e1eaff11", null, null, null, null],
      [null, null, null, null, "#e3ebff4d", "#e1ebffdc", "#e2ebffe2", "#e3ebff71", "#e2eeff04", null, null, null, null, null],
      [null, null, null, null, "#e3ebff4d", "#e1ebffdc", "#e2ecff33", null, null, null, null, null, null, null],
      [null, null, null, null, "#e2ecff34", "#e1ebff11", null, null, null, null, null, null, null, null]
    ]
  },
  composer: {
    w: 10, h: 10,
    offsetY: 1,
    data: [
      ["#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", null, null, "#e2ebffe2", "#e2ebffe2"],
      ["#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", null, null, "#e2ebffe2", "#e2ebffe2"],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      ["#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2"],
      ["#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2"],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      ["#e2ebffe2", "#e2ebffe2", null, null, "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2"],
      ["#e2ebffe2", "#e2ebffe2", null, null, "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2"]
    ]
  },
  envelope: {
    w: 14, h: 14,
    offsetY: 0,
    data: [
      [null, null, null, "#e3ebff6f", "#e2ebff90", "#e1e4ff02", null, null, null, null, null, null, null, null],
      [null, null, null, "#e1ebffcd", "#e1ebffe0", "#e7f0ff06", null, null, null, null, null, null, null, null],
      [null, null, null, "#e3ecff7d", "#e3ebff9a", "#e3ecff13", null, null, null, null, null, null, null, null],
      [null, null, "#f2f5ff01", "#e2ebffb2", "#e4ecff15", "#e2ebff7e", null, null, null, null, null, null, null, null],
      [null, null, "#e7edff0f", "#e2ecff72", null, "#e2ebff80", "#e3ecff13", null, null, null, null, null, null, null],
      [null, null, "#e2eaff35", "#e2ecff34", null, "#e3ecff13", "#e2ebff81", "#f2f5ff01", null, "#e6e9ff02", null, null, null, null],
      [null, null, "#e2ecff74", "#e3e9ff0f", null, "#dee1ff01", "#e1ebffd5", "#e2ebffcb", "#e2ebff3d", "#e2ebffcb", "#e2eaff9f", null, null, null],
      [null, "#f2f5ff01", "#e2ebffb2", null, null, "#dee1ff01", "#e1ebffb2", "#e2ebffc7", "#e2ebff3d", "#e2eaffd3", "#e1ebffc9", null, null, null],
      [null, "#e7edff0f", "#e2ecff72", null, null, null, "#e5e8ff02", "#f2f5ff01", null, "#dcebff03", "#e1ebff98", "#e4ebff0b", null, null],
      [null, "#e2eaff35", "#e2ecff34", null, null, null, null, null, null, null, "#e3ecff1e", "#e2ecff65", null, null],
      [null, "#e2ecff74", "#e3e9ff0f", null, null, null, null, null, null, null, null, "#e1ebff98", "#e4ebff0b", null],
      ["#e7f0ff06", "#e1eaffb9", null, null, null, null, null, null, null, null, null, "#e3ecff1e", "#e2ecff77", "#e5efff05"],
      ["#e2ecffa1", "#e2ebffe2", "#e3efff0b", null, null, null, null, null, null, null, null, "#e4ebff0c", "#e2ebffe2", "#e2eaffa1"],
      ["#e3edff58", "#e2ebff9e", "#e1edff04", null, null, null, null, null, null, null, null, "#dfe9ff05", "#e3ebff9a", "#e2ecff53"]
    ]
  },
  input: {
    w: 13, h: 14,
    offsetY: -1,
    data: [
      [null, null, null, null, "#e5eeff11", "#e3ebff6c", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e2ecff5f"],
      [null, null, null, null, "#e3ebff13", "#e2ebff6b", "#e2ebff25", "#e2ebff25", "#e2ebff25", "#e2ebff25", "#e2ebff25", "#e3ecff36", "#e1ebff6f"],
      [null, null, null, null, "#e3ebff13", "#e2ecff65", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e2ebff12", "#dfe9ff05", null, null, "#e3ebff13", "#e2ecff65", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e1ebff57", "#e1ebffde", "#e3ebff71", "#e4eeff1c", "#e3ecff14", "#e2ecff65", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e1ebff57", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ecffc3", "#e2ecffa1", "#e2ebff25", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e1ebff57", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebff9e", "#e2ebff47", "#e3ebff19", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e1ebff57", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebff9c", "#e2ebff46", "#e3ebff19", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e1ebff57", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ecffc3", "#e2ecffa1", "#e2ebff25", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e1ebff57", "#e1ebffde", "#e3ebff6f", "#e1ebff1c", "#e3ecff14", "#e2ecff65", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      ["#e5ebff12", "#dfe9ff05", null, null, "#e3ebff13", "#e2ecff65", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      [null, null, null, null, "#e3ebff13", "#e2ecff65", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebff25", "#e1ebff6f"],
      [null, null, null, null, "#e3ebff13", "#e2ebff6b", "#e2ebff25", "#e2ebff25", "#e2ebff25", "#e2ebff25", "#e2ebff25", "#e3ecff36", "#e1ebff6f"],
      [null, null, null, null, "#e5eeff11", "#e3ebff6c", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e1ebff6f", "#e2ecff5f"]
    ]
  },
  instrument: {
    w: 14, h: 13,
    offsetY: 0,
    data: [
      ["#dee1ff01", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e1ecff0d", "#e6ecff0d", "#e4ecff08", null],
      ["#e1ecff28", "#e3ecff41", "#e3ebff38", "#e1ebff39", "#e1ebff39", "#e1ebff39", "#e1ebff39", "#e1ebff39", "#e1ebff39", "#e1ebff39", "#e1ebff39", "#e3ecff37", "#e1ebff4c", "#e4ecff08"],
      ["#e3ecff36", "#e2eaff18", "#e4eaff10", "#e1eaff11", "#e1eaff11", "#e1eaff11", "#e1eaff11", "#e1eaff11", "#e1eaff11", "#e1eaff11", "#e1ebff11", "#e2ecff0e", "#e3ecff37", "#e6ecff0d"],
      ["#e2ecff33", "#e3eaff18", "#e1eaff11", "#e5eeff11", "#e5eeff11", "#e5eeff11", "#e5eeff11", "#e5eeff11", "#e5eeff11", "#e5eeff11", "#e5eeff11", "#e3e9ff0f", "#e2ecff35", "#e1ecff0d"],
      ["#e2ebff3a", "#e2ebff3a", "#e4ecff2a", "#e5edff2d", "#e2ebff2d", "#e3edff2d", "#e3edff2d", "#e2ebff2c", "#e5edff2d", "#e2ebff2c", "#e5edff2d", "#e1ecff28", "#e1ebff56", "#e4ebff0c"],
      ["#e4ebff31", "#e3ebff2f", "#e2ebff86", "#e3ebff4a", "#e2ecff6a", "#e3ecff37", "#e3edff2d", "#e2ebff81", "#e1eaff42", "#e2ebff83", "#e3ebff4a", "#e2ebff6b", "#e3ecff37", "#e1ecff0d"],
      ["#e1eaff29", "#e4ebff0c", "#e2ecff65", "#e2ebff23", "#e2ebff46", "#e3ecff13", "#e5ecff0d", "#e3ecff60", "#e4ecff1c", "#e3ecff60", "#e2ebff24", "#e2ebff46", "#e3ecff14", "#e2edff0e"],
      ["#e4ecff29", "#e7edff0f", "#e1ebff6a", "#e3ecff27", "#e3ebff4a", "#e5edff17", "#e4edff10", "#e3ecff63", "#e3edff20", "#e3ecff63", "#e1ecff28", "#e3ebff4a", "#e2eaff18", "#e2ecff0e"],
      ["#e4ecff29", "#e7edff0f", "#e2ecff6a", "#e1ecff28", "#e3ebff4b", "#e5edff16", "#e4edff10", "#e3ecff64", "#e3edff20", "#e3ecff64", "#e1ecff28", "#e3ebff4a", "#e5edff17", "#e2ecff0e"],
      ["#e2ebff2c", "#e2ebff06", "#e2eaff35", "#e5ecff0d", "#e4edff22", "#e5edff16", "#e4ebff0c", "#e4ebff31", "#e1e8ff09", "#e2ecff34", "#e5ecff0d", "#e4edff22", "#e4ecff16", "#e2edff0e"],
      ["#e2ebff2d", "#e4efff04", "#e1eaff29", "#e5edff08", "#e3eeff1a", "#e4ecff16", "#e7eeff0a", "#e3ecff26", "#e4efff04", "#e1eaff29", "#e5edff08", "#e3eeff1a", "#e1e9ff16", "#e2edff0e"],
      ["#e3ebff2f", "#e7f0ff06", "#e3ebff2e", "#e2eeff0a", "#e2ecff1e", "#e3ebff19", "#e1ecff0d", "#e2ebff2c", "#e7f0ff06", "#e3ebff2e", "#e2eeff0a", "#e2ecff1e", "#e3eaff18", "#e3e9ff0f"],
      ["#e4eaff10", "#e3ecff36", "#e2ebff46", "#e3ebff38", "#e3ecff41", "#e3ecff3f", "#e2ebff3a", "#e2ebff45", "#e2ecff35", "#e2ebff46", "#e3ebff38", "#e3ecff43", "#e4ecff2a", "#dcebff03"]
    ]
  },
  "module slot": {
    w: 14, h: 10,
    offsetY: 1,
    data: [
      ["#e2ebff83", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff83"],
      ["#e2ebffb5", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e2ebffb5"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ebffae", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e3ebffae", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3edffd1", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#e3edffd1", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3edffd1", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#e3edffd1", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ebffae", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e3ebffae", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb5", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e2ebffb5"],
      ["#e2ebff83", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff83"]
    ]
  },
  "music note": {
    w: 11, h: 14,
    offsetY: -1,
    data: [
      [null, null, null, null, null, null, "#e1f6ff02", "#e3eeff04", "#e3e6ff04", "#e3e6ff04", "#e3f6ff02"],
      [null, null, null, null, null, "#e1f6ff02", "#e1ebff6f", "#e2ebffae", "#e2ebffb3", "#e1ebffcb", "#e1ebff39"],
      [null, null, null, null, null, "#e3eeff04", "#e2ecffb9", "#e2ecffd7", "#e1eaff89", "#e2ebff93", "#e2edff2b"],
      [null, null, null, null, null, "#e3e6ff04", "#e1ecffb7", "#e1ebffa6", "#dcebff03", null, null],
      [null, null, null, null, null, "#e3e6ff04", "#e1ecffb7", "#e1ebffa6", "#e3f6ff02", null, null],
      [null, null, null, null, null, "#e3e6ff04", "#e1ecffb7", "#e1ebffa6", "#e5e8ff02", null, null],
      [null, null, null, null, null, "#e3e6ff04", "#e1eaffb9", "#e1ebffa6", "#e5e8ff02", null, null],
      [null, null, null, null, null, "#e6e9ff02", "#e1ecffb7", "#e1ebffa6", "#e5e8ff02", null, null],
      [null, null, "#e6ecff0d", "#e1ebff1c", "#e4ebff1b", "#e5edff17", "#e3ecffbb", "#e1ebffa6", "#e5e8ff02", null, null],
      ["#e2eeff0a", "#e3ebff7a", "#e2ecffd5", "#e2ebffe2", "#e2ebffe2", "#e1ebffdc", "#e2ebffe2", "#e2eaffa1", "#e6e9ff02", null, null],
      ["#e2ebff7e", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffc1", "#e5efff05", null, null],
      ["#e2ebff5d", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e2ebffe2", "#e1ebff7d", "#f2f5ff01", null, null],
      ["#dcebff03", "#e2eaff43", "#e2eaff9f", "#e2ebffc1", "#e2ebffc1", "#e1ebffa8", "#e2eaff52", "#e6f0ff05", null, null, null],
      [null, null, "#e6e9ff02", "#e7f0ff06", "#e7f0ff06", "#e9ecff03", null, null, null, null, null]
    ]
  },
  "mux modular": {
    w: 12, h: 12,
    offsetY: 0,
    data: [
      [null, null, null, null, "#e1e8ff09", "#e3ecff8b", "#e3ecff8b", "#e3efff0b", null, null, null, null],
      [null, null, null, null, "#e2ebff5d", "#e2ebffe2", "#e2ebffe2", "#e2ebff5d", null, null, null, null],
      [null, null, null, null, "#e2ebff68", "#e2ebffe2", "#e2ebffe2", "#e2ebff67", null, null, null, null],
      [null, null, null, "#e3edff20", "#e1eaff9a", "#e1ebff30", "#e2ebff31", "#e1eaff9a", "#e3edff20", null, null, null],
      ["#e2e9ff0a", "#e2ebff5c", "#e2ebff68", "#e3ebff9a", "#e6e8ff05", null, null, "#e6e8ff05", "#e1eaff9a", "#e2ebff68", "#e2ecff5f", "#e3eaff0a"],
      ["#e3ecff8b", "#e2ebffe2", "#e2ebffe2", "#e3ebff2e", null, null, null, null, "#e2ebff31", "#e2ebffe2", "#e2ebffe2", "#e2ecff88"],
      ["#e3ecff8b", "#e2ebffe2", "#e2ebffe2", "#e3ebff2e", null, null, null, null, "#e2ebff31", "#e2ebffe2", "#e2ebffe2", "#e2ecff88"],
      ["#e2e9ff0a", "#e2ebff5b", "#e2ebff68", "#e3ebff9a", "#e6e8ff05", null, null, "#e6e8ff05", "#e1eaff9a", "#e2ebff68", "#e2ebff5d", "#e3eaff0a"],
      [null, null, null, "#e3edff20", "#e1eaff9a", "#e2ebff31", "#e2ebff31", "#e1eaff9a", "#e3edff20", null, null, null],
      [null, null, null, null, "#e2ebff68", "#e2ebffe2", "#e2ebffe2", "#e2ebff68", null, null, null, null],
      [null, null, null, null, "#e2ebff5d", "#e2ebffe2", "#e2ebffe2", "#e2ebff5d", null, null, null, null],
      [null, null, null, null, "#e1e8ff09", "#e1eaff8b", "#e3ecff8b", "#e3efff0b", null, null, null, null]
    ]
  },
  output: {
    w: 14, h: 14,
    offsetY: -1,
    data: [
      ["#e2ecff4e", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5b", "#e7edff0f", null, null, null, null, null],
      ["#e2ebff5d", "#e3edff2d", "#e3ecff1f", "#e3ecff1f", "#e3ecff1f", "#e3ecff1f", "#e3ecff1f", "#e2ebff5c", "#e4eaff10", null, null, null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e1ebff11", "#e1ebff11", "#e1ebff11", "#e1ebff56", "#e4eaff10", null, null, null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e5edff2d", "#e4ecff15", "#e1ebff11", "#e1ebff56", "#e4eaff10", null, null, null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e2ecff8d", "#e2ebffb5", "#e3ecff64", "#e3ebff6c", "#e4eaff10", null, null, null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e2ecff8d", "#e2ebffc1", "#e2ebffc1", "#e2ebffd1", "#e1ebff98", "#e3edff2d", "#e6e8ff05", null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e2ecff8d", "#e2ebffc1", "#e2ebffc1", "#e2ebffd1", "#e2ebffc1", "#e1eaffb9", "#e2ebffb3", "#e2ebff5d", "#e2eaff18", "#f2f5ff01"],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e2ecff8d", "#e2ebffc1", "#e2ebffc1", "#e2ebffd1", "#e2ebffc1", "#e1eaffb9", "#e2ebffb3", "#e2ebff5c", "#e2eaff18", "#f2f5ff01"],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e2ecff8d", "#e2ebffc1", "#e2ebffc1", "#e2ebffd1", "#e1ebff97", "#e5edff2d", "#e5efff05", null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e2ecff8d", "#e2ebffb5", "#e3ecff63", "#e3ebff6c", "#e4eaff10", null, null, null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e5edff2d", "#e4ecff15", "#e1ebff11", "#e1ebff56", "#e4eaff10", null, null, null, null, null],
      ["#e2ebff5d", "#e3ecff1f", "#e1ebff11", "#e1ebff11", "#e1ebff11", "#e1ebff11", "#e1ebff11", "#e1ebff56", "#e4eaff10", null, null, null, null, null],
      ["#e2ebff5d", "#e3edff2d", "#e3ecff1f", "#e3ecff1f", "#e3ecff1f", "#e3ecff1f", "#e3ecff1f", "#e2ebff5c", "#e4eaff10", null, null, null, null, null],
      ["#e2ecff4e", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5d", "#e2ebff5b", "#e7edff0f", null, null, null, null, null]
    ]
  },
  "rack slot": {
    w: 14, h: 10,
    offsetY: 1,
    data: [
      ["#e2ebff83", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff83"],
      ["#e2ebffb5", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e2ebffb5"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ebffae", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e3ebffae", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3edffd1", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#e3edffd1", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3edffd1", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#fefffffd", "#e3edffd1", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ebffae", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e4edffc3", "#e3ebffae", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb3", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e3ecff14", "#e2ebffb3"],
      ["#e2ebffb5", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e3ebff1a", "#e2ebffb5"],
      ["#e2ebff83", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff9e", "#e2ebff83"]
    ]
  },
  rack: {
    w: 14, h: 14,
    offsetY: -1,
    data: [
      [null, "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", null],
      ["#e3ebff4c", null, null, null, null, null, null, null, null, null, null, null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e1ebff7d", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e5e8ff02", null, "#e4edff23", null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e3ebff07", "#e3ecff07", "#e3ecff07", "#e3ecff07", "#e3ecff07", "#e3ecff07", null, null, "#e4ebff31", null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e1ebff7d", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e5e8ff02", "#e4efff04", "#e2ecff53", "#e5edff08", null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e3eaff18", "#e4ecff1c", "#e4ecff1c", "#e4ecff1c", "#e4ecff1c", "#e4ecff1c", "#f2f5ff01", "#e3edff19", "#e2ebffe2", "#e3ecff36", null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e3ecff40", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e1e4ff02", "#e6edff09", "#e2ecff74", "#e1ebff11", null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e3ecff40", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e1e4ff02", null, "#e4ebff31", null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e3eaff18", "#e4ecff1c", "#e4ecff1c", "#e4ecff1c", "#e4ecff1c", "#e4ecff1c", "#f2f5ff01", null, "#e4ebff31", null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e1ebff7d", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e5e8ff02", null, "#e4ebff31", null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e3ebff07", "#e3ecff07", "#e3ecff07", "#e3ecff07", "#e3ecff07", "#e3ecff07", null, null, "#e4ebff31", null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, "#e1ebff7d", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e1ebff98", "#e5e8ff02", null, "#e4edff23", null, null, "#e3ebff4c"],
      ["#e3ebff4c", null, null, null, null, null, null, null, null, null, null, null, null, "#e3ebff4c"],
      [null, "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", "#e3ebff4c", null]
    ]
  },
  send: {
    w: 8, h: 9,
    offsetY: 1,
    data: [
      [null, "#e3ecff14", "#e3edff2d", null, null, null, null, null],
      [null, "#e3eaff18", "#e1ebff39", null, null, "#e1f6ff02", null, null],
      [null, "#e2eaff18", "#e1ebff39", null, "#f2f5ff01", "#e3ecff40", "#e3e9ff0f", null],
      [null, "#e3ecff13", "#e1ebff7d", "#e3ecff54", "#e1ebff56", "#e1eaff89", "#e2ebff83", "#e5edff08"],
      [null, "#e5edff17", "#e2ebff3e", "#dee1ff01", "#e1edff04", "#e3ebff4d", "#e3eaff18", null],
      [null, "#e5edff17", "#e2ecff35", null, null, "#e2eeff04", null, null],
      ["#e3edff0f", "#e1ebff6e", "#e2ebff80", "#e3edff20", null, null, null, null],
      [null, "#e2ebff3e", "#e2ecff65", "#e6e9ff02", null, null, null, null],
      [null, "#e8f6ff03", "#e6f0ff05", null, null, null, null, null]
    ]
  },
  square: {
    w: 14, h: 14,
    offsetY: -1,
    data: [
      ["#e2eaffa1", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2eaffa1"],
      ["#e2ebffbf", "#e1ebffde", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e1ebffde", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e2ebffb5", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e1ebff22", "#e2ebffb5", "#e2ebffbf"],
      ["#e2ebffbf", "#e1ebffde", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e2ebffb5", "#e1ebffde", "#e2ebffbf"],
      ["#e2eaffa1", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2ebffbf", "#e2eaffa1"]
    ]
  },
  waveform: {
    w: 14, h: 14,
    offsetY: 0,
    data: [
      ["#e6e9ff02", null, null, null, null, "#e1e4ff02", "#f2f5ff01", null, null, null, null, "#e3f6ff02", null, null],
      ["#e5edff08", null, null, null, null, "#e6e8ff05", "#e9ecff03", null, null, null, null, "#e3ecff13", "#e1edff04", null],
      ["#e4ebff1b", null, null, null, null, "#e5ecff0d", "#e3eaff0a", null, null, null, null, "#e4ecff29", "#e4ecff08", null],
      ["#e2ebff59", null, "#e1f6ff02", "#e4ebff0c", null, "#e2ecff1d", "#e5edff2d", null, null, "#e1e8ff09", "#e2eeff04", "#e3ebff38", "#e7eeff0a", null],
      ["#e1ebffa8", "#e5e8ff02", "#e8f6ff03", "#e5edff2d", null, "#e3edff20", "#e2ebff86", null, null, "#e3edff19", "#e4edff10", "#e2eaff43", "#e2ebff25", "#dee1ff01"],
      ["#e2ebffe2", "#e3edff19", null, "#e1ebff7d", "#e6eeff09", "#e3eeff1a", "#e1ebffcd", "#e3ebff2f", "#e4eaff10", "#e1ecff28", "#e3ebff4c", "#e2ecff52", "#e1ebff6f", "#e3efff0b"],
      ["#e2ebffe2", "#e1eaffb9", "#e2ecff44", "#e1ebffcd", "#e2ebffac", "#e3ecff54", "#e2ebffe2", "#e2ebffe2", "#e2ebffa5", "#e3ecff8b", "#e2ecffde", "#e2ebffb5", "#e3ecffaa", "#e1ebff7b"],
      ["#e2ebffe2", "#e1ebff6f", "#e2eaff18", "#e2ebffb0", "#e3ebff4c", "#e2ebff31", "#e2ebffe2", "#e1ebff97", "#e1ecff61", "#e2ebff5d", "#e3ebff9a", "#e2ebff86", "#e1eaff89", "#e2eaff43"],
      ["#e2ebffb5", "#e4efff04", null, "#e2ecff52", null, "#e2ecff1d", "#e3ecff8b", "#e3ecff14", "#e9ecff03", "#e3ecff1f", "#e2ebff24", "#e3ecff41", "#e1ebff39", "#e3f6ff02"],
      ["#e2ecff5f", null, "#e5e8ff02", "#e3ecff14", null, "#e2ecff1e", "#e3ebff2e", null, null, "#e5ecff0d", "#e4ecff08", "#e2ecff35", "#e4ebff0b", null],
      ["#e4eaff21", null, null, "#e1f6ff02", null, "#e5eeff11", "#e3efff0b", null, null, "#e1e4ff02", "#daf5ff01", "#e1ebff22", "#e2eeff04", null],
      ["#e1ebff0c", null, null, null, null, "#e4ecff08", "#e3eeff04", null, null, null, null, "#e3ecff13", "#e1e4ff02", null],
      ["#e2ebff06", null, null, null, null, "#e3e6ff04", "#e6e9ff02", null, null, null, "#f2f5ff01", "#e1eaff06", null, null],
      ["#e2eeff04", null, null, null, null, "#dcebff03", "#e1e4ff02", null, null, null, null, "#e9ecff03", null, null]
    ]
  },
  notepad: {
    w: 18, h: 20,
    offsetY: 0,
    data: [
      ["#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1c1e1f", "#1b1d1e", null, null, null],
      ["#497088", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#7b878f", "#78868e", "#64535d", "#5d3838", "#241e1e", null],
      ["#4a718a", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#8b7e7e", "#893a39", "#8c4342", "#854a4a", "#312424"],
      ["#4a718a", "#919191", "#868889", "#858789", "#848687", "#8a8b8c", "#828586", "#828586", "#888a8a", "#919191", "#919191", "#919191", "#848b8d", "#66757a", "#853d3d", "#893736", "#8a3b3a", "#854241"],
      ["#4a718a", "#919191", "#8e8e8f", "#8e8f8f", "#8e8f8f", "#8d8e8e", "#8f8f8f", "#8f8f8f", "#8f8f90", "#919191", "#919191", "#919191", "#73807d", "#678084", "#68797d", "#7e4849", "#883736", "#3c2423"],
      ["#4a718a", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919191", "#918a6c", "#887530", "#69735f", "#5a7981", "#5b7980", "#565c61", null],
      ["#4a718a", "#909191", "#7e8183", "#828486", "#7d8082", "#7e8183", "#838687", "#919191", "#8d8e8e", "#7e8183", "#81827c", "#8f7d30", "#8e6c1f", "#8e6e13", "#726543", "#5b6e6a", "#2c3538", null],
      ["#4a718a", "#919191", "#919191", "#909191", "#919191", "#919191", "#919191", "#919191", "#919191", "#919190", "#90803b", "#8d6c26", "#906f11", "#8a6415", "#905e0d", "#3a2d18", null, null],
      ["#4a718a", "#919191", "#7d8082", "#7d8083", "#7c8081", "#898b8b", "#909090", "#7d8082", "#7e8283", "#8a835f", "#8f7827", "#8f6d16", "#8c6814", "#8b5b11", "#675d3c", "#1b1b1a", null, null],
      ["#4a718a", "#919191", "#919191", "#8f9090", "#919191", "#919191", "#919191", "#909090", "#8e8b7a", "#8f7a2b", "#8d671e", "#906f11", "#895c15", "#8b6624", "#446374", null, null, null],
      ["#4a718a", "#919191", "#8e8f8f", "#8e8e8f", "#86888a", "#8b8c8d", "#8c8d8e", "#8a8b8b", "#8f803b", "#8e6f22", "#917010", "#855b19", "#8f6012", "#7b817e", "#436478", null, null, null],
      ["#4a718a", "#909191", "#8a8b8c", "#8a8b8c", "#8c8d8e", "#8b8c8d", "#8b8c8c", "#8b804d", "#8e7127", "#906d14", "#8c6913", "#8d5c10", "#847655", "#78868e", "#436478", null, null, null],
      ["#4a718a", "#919191", "#898b8b", "#8b8d8d", "#8a8b8c", "#8c8d8d", "#918f88", "#907e31", "#8f6b1a", "#8e6c12", "#885815", "#856730", "#768288", "#7b878e", "#446478", null, null, null],
      ["#4a718a", "#8d8d8e", "#848687", "#7f8284", "#838586", "#8e8f8f", "#918f88", "#91876a", "#917521", "#896018", "#8f6215", "#777f7d", "#7b868b", "#8c8f91", "#456478", null, null, null],
      ["#4a718a", "#919191", "#919191", "#919191", "#919191", "#919191", "#87847d", "#918769", "#918666", "#8f7d57", "#7f7f75", "#848b8f", "#909191", "#8d8f91", "#456478", null, null, null],
      ["#4a718a", "#909090", "#868889", "#8d8e8e", "#87898a", "#8c8d8d", "#60605f", "#625e51", "#828378", "#848a8b", "#898e90", "#919191", "#919191", "#8d8f91", "#456478", null, null, null],
      ["#4a718a", "#8e8e8f", "#868889", "#7f8284", "#878889", "#808385", "#6e6f70", "#808385", "#909091", "#919191", "#919191", "#919191", "#919191", "#8d8f91", "#456478", null, null, null],
      ["#4a718a", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#898d90", "#456478", null, null, null],
      ["#4a718a", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#8c8f90", "#898d90", "#456478", null, null, null],
      ["#253037", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#27333b", "#242d32", "#50556002", null, null]
    ]
  }
};

const bakeIcon = (icon) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${icon.w}" height="${icon.h}">
      ${icon.data.flatMap((row, y) => 
        row.map((color, x) => 
          color ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${color.length === 9 ? color.slice(0, 7) : color}" fill-opacity="${color.length === 9 ? parseInt(color.slice(7, 9), 16) / 255 : 1}"/>` : ''
        )
      ).join('')}
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const BAKED_ICONS = Object.keys(ICON_DATA).reduce((acc, key) => {
  acc[key] = bakeIcon(ICON_DATA[key]);
  return acc;
}, {});

const ProceduralIcon = ({ name, style = {}, useOffset = false, width: manualWidth }) => {
  const lowerName = name.toLowerCase();
  const baked = BAKED_ICONS[lowerName];
  if (!baked) return null;

  const icon = ICON_DATA[lowerName];
  const offset = (useOffset && icon.offsetY) ? icon.offsetY : 0;
  const finalWidth = manualWidth || icon.w;

  return (
    <div style={{
      width: finalWidth,
      height: icon.h,
      backgroundImage: `url("${baked}")`,
      backgroundSize: '100% 100%',
      imageRendering: 'pixelated',
      flexShrink: 0,
      marginTop: offset,
      filter: 'brightness(1.2)', // Increased brightness
      ...style
    }} />
  );
};

export default memo(ProceduralIcon);
