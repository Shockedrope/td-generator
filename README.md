# TD Generator

A CLI tool to generate Thing Description (TD) files for Web of Things (WoT) devices, compliant with W3C WoT Thing Description 1.1 specification and OPC UA EdgeTranslator standards.

## Overview

This tool helps you create W3C Web of Things Thing Description files through an interactive command-line interface. Thing Descriptions are JSON-LD documents that describe the metadata and interfaces of IoT devices, making them discoverable and interoperable across different platforms and protocols.

### Standards Compliance

- ✅ **W3C WoT Thing Description 1.1** (December 2023)
- ✅ **OPC UA EdgeTranslator** compatible format
- ✅ Industrial IoT ready with observable properties
- ✅ Protocol-agnostic design

## Installation

### From Source

```bash
git clone https://github.com/Shockedrope/td-generator.git
cd td-generator
npm install
npm link
```

### Using npm (once published)

```bash
npm install -g td-generator
```

## Usage

### Create a New Thing Description

Run the interactive creation wizard:

```bash
td-generator create
```

The tool will guide you through the following steps:

1. **Basic Information**
   - Device title
   - Description
   - Device type (sensor, actuator, smart light, thermostat, camera, lock, or custom)

2. **Network Configuration**
   - IP address or hostname
   - Port number
   - Protocol (HTTP, HTTPS, CoAP, MQTT, WebSocket)

3. **Security Configuration**
   - Security scheme (none, basic auth, bearer token, API key, OAuth2)

4. **Properties** (optional)
   - Define readable/writable device properties
   - Specify data types (string, number, integer, boolean, object, array)
   - Mark properties as observable (supports subscriptions/polling)
   - Define units of measurement (celsius, percent, etc.)

5. **Actions** (optional)
   - Define operations the device can perform

6. **Events** (optional)
   - Define notifications the device can emit

7. **Output**
   - Specify the filename for your TD file

### Validate a Thing Description

Validate an existing TD file:

```bash
td-generator validate <filename>
```

Example:
```bash
td-generator validate my-device-td.json
```

### Show Help

```bash
td-generator --help
```

## Example

Here's an example of creating a simple smart light TD:

```bash
$ td-generator create

🌐 Welcome to TD Generator!

This tool will help you create a Thing Description file for your Web of Things device.

? What is the title of your device? Smart Light
? Provide a brief description: A smart LED light bulb
? Select the device type: Smart Light
? Enter the IP address or hostname: 192.168.1.100
? Enter the port number: 8080
? Select the protocol: HTTP
? Select security scheme: No Security
? Do you want to add properties? Yes
? Property name: status
? Property description: Current on/off status
? Property type: boolean
? Is this property readable? Yes
? Is this property writable? Yes
? Add another property? Yes
? Property name: brightness
? Property description: Brightness level (0-100)
? Property type: integer
? Is this property readable? Yes
? Is this property writable? Yes
? Add another property? No
? Do you want to add actions? Yes
? Action name: toggle
? Action description: Toggle the light on/off
? Add another action? No
? Do you want to add events? No
? Enter the filename for the TD: smart-light-td.json

✅ Thing Description created successfully!

📄 File saved to: /path/to/smart-light-td.json
```

## Generated TD Format

The tool generates JSON-LD Thing Descriptions that conform to the W3C WoT Thing Description 1.1 specification. Example output:

```json
{
  "@context": [
    "https://www.w3.org/2022/wot/td/v1.1",
    { "@language": "en" }
  ],
  "@type": ["Thing", "smartLight"],
  "id": "urn:dev:ops:smart-light-1738113000000",
  "title": "Smart Light",
  "name": "smart-light",
  "description": "A smart LED light bulb",
  "securityDefinitions": {
    "nosec_sc": {
      "scheme": "nosec"
    }
  },
  "security": ["nosec_sc"],
  "base": "http://192.168.1.100:8080",
  "properties": {
    "status": {
      "type": "boolean",
      "description": "Current on/off status",
      "observable": true,
      "forms": [{
        "href": "/status",
        "op": ["readproperty", "writeproperty", "observeproperty"],
        "contentType": "application/json"
      }]
    },
    "brightness": {
      "type": "integer",
      "description": "Brightness level (0-100)",
      "observable": true,
      "unit": "percent",
      "forms": [{
        "href": "/brightness",
        "op": ["readproperty", "writeproperty", "observeproperty"],
        "contentType": "application/json"
      }]
    }
  },
  "actions": {
    "toggle": {
      "description": "Toggle the light on/off",
      "forms": [{
        "href": "/toggle",
        "op": "invokeaction",
        "contentType": "application/json"
      }]
    }
  }
}
```

## Features

- ✅ Interactive CLI prompts for easy TD creation
- ✅ **W3C WoT Thing Description 1.1** compliant (December 2023 standard)
- ✅ **OPC UA EdgeTranslator** compatible format
- ✅ Support for multiple protocols (HTTP, HTTPS, CoAP, MQTT, WebSocket)
- ✅ Configurable security schemes (nosec, basic, bearer, apikey, oauth2)
- ✅ **Observable properties** for real-time monitoring and subscriptions
- ✅ **Unit definitions** for sensor values (celsius, percent, etc.)
- ✅ Support for properties, actions, and events
- ✅ **Content type negotiation** (application/json)
- ✅ Built-in validation with comprehensive checks
- ✅ JSON-LD format with proper @context

## Standards & References

This tool follows the latest Web of Things standards and is compatible with industrial IoT platforms:

- [W3C WoT Thing Description 1.1](https://www.w3.org/TR/wot-thing-description11/) - Official W3C Recommendation (Dec 2023)
- [OPC Foundation UA-EdgeTranslator](https://github.com/OPCFoundation/UA-EdgeTranslator) - Industrial connectivity reference
- [W3C Web of Things](https://www.w3.org/WoT/) - Overall WoT initiative
- [WoT Architecture](https://www.w3.org/TR/wot-architecture/) - Architecture specification

## License

ISC
