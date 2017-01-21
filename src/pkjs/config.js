// Author: Ed Dam

module.exports = [
  {
    "type": "heading",
    "defaultValue": "Rainfall v1.1"
  },
  {
    "type": "text",
    "defaultValue": "by Edward Dam"
  },
  { "type": "section", "items": [
    { "type": "heading", "defaultValue": "Temperature" },
    { "type": "text", "defaultValue": "Please Choose Celsius or Fahrenheit" },
    { "type": "radiogroup", "messageKey": "temp_degrees", "options": [
      { "label": "Celsius °C", "value": "celsius" },
      { "label": "Fahrenheit °F", "value": "fahrenheit" } ],
    "defaultValue": "celsius" } ]
  },
  {
    "type": "text",
    "defaultValue": "Powered by DarkSky.net"
  },
  {
    "type": "submit",
    "defaultValue": "Submit"
  }
];
