# TD Generator

A CLI tool to generate Thing Description (TD) files for Web of Things (WoT) devices.

## Overview

This tool helps you create W3C Web of Things Thing Description files through an interactive command-line interface. Thing Descriptions are JSON-LD documents that describe the metadata and interfaces of IoT devices, making them discoverable and interoperable.

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

The tool generates JSON-LD Thing Descriptions that conform to the W3C WoT Thing Description specification. Example output:

```json
{
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    { "@language": "en" }
  ],
  "@type": ["smartLight"],
  "id": "urn:dev:ops:smart-light-1738113000000",
  "title": "Smart Light",
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
      "forms": [{
        "href": "/status",
        "op": ["readproperty", "writeproperty"]
      }],
      "readOnly": false,
      "writeOnly": false
    },
    "brightness": {
      "type": "integer",
      "description": "Brightness level (0-100)",
      "forms": [{
        "href": "/brightness",
        "op": ["readproperty", "writeproperty"]
      }],
      "readOnly": false,
      "writeOnly": false
    }
  },
  "actions": {
    "toggle": {
      "description": "Toggle the light on/off",
      "forms": [{
        "href": "/toggle",
        "op": "invokeaction"
      }]
    }
  }
}
```

## Features

- ✅ Interactive CLI prompts for easy TD creation
- ✅ Support for multiple protocols (HTTP, HTTPS, CoAP, MQTT, WebSocket)
- ✅ Configurable security schemes
- ✅ Support for properties, actions, and events
- ✅ W3C WoT TD specification compliant
- ✅ Built-in validation command
- ✅ JSON-LD format with proper context

## Resources

- [W3C Web of Things](https://www.w3.org/WoT/)
- [Thing Description Specification](https://www.w3.org/TR/wot-thing-description/)
- [WoT Architecture](https://www.w3.org/TR/wot-architecture/)

## License

ISC
