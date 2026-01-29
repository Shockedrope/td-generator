# TD Generator Examples

This directory contains example Thing Description files compliant with W3C WoT Thing Description 1.1 and compatible with OPC UA EdgeTranslator.

## Standards Compliance

All examples follow:
- ✅ **W3C WoT Thing Description 1.1** (December 2023)
- ✅ **OPC UA EdgeTranslator** compatible format
- ✅ Observable properties for industrial IoT
- ✅ Proper unit definitions

## Examples

### 1. Smart Light Example (`smart-light-example.json`)

A smart LED light bulb with the following features:
- **Properties**: status (on/off), brightness (0-100), color (RGB)
  - All properties are observable
  - Brightness includes unit (percent)
- **Actions**: toggle, fadeIn, fadeOut
- **Events**: overheating alert
- **Security**: Basic authentication
- **Protocol**: HTTP

This example demonstrates a typical smart home device with multiple properties, actions, and event capabilities.

### 2. Temperature Sensor Example (`temperature-sensor-example.json`)

A simple environmental sensor with:
- **Properties**: temperature (Celsius), humidity (percentage)
  - Observable properties with units
  - Read-only sensor values
- **Events**: temperatureChange notification
- **Security**: No security (nosec)
- **Protocol**: HTTP

This example shows a read-only sensor device that monitors environmental conditions.

### 3. Industrial Power Meter Example (`industrial-power-meter-example.json`)

A three-phase industrial power meter (OPC UA EdgeTranslator-style):
- **Properties**: 
  - Voltage (L1, L2, L3) with unit: volt
  - Current (L1, L2, L3) with unit: ampere
  - Total active power (watt), reactive power (var)
  - Power factor
  - All properties observable for real-time monitoring
- **Events**: overload alert
- **Security**: No security (nosec)
- **Protocol**: Modbus TCP
- **Base URL**: modbus+tcp://192.168.1.100:502

This example demonstrates an industrial IoT device compatible with OPC UA EdgeTranslator, following patterns used in real industrial deployments.

## Using These Examples

### Test the Examples

You can validate these example files using the CLI:

```bash
td-generator validate examples/smart-light-example.json
td-generator validate examples/temperature-sensor-example.json
td-generator validate examples/industrial-power-meter-example.json
```

### Use as Templates

These examples can serve as templates for creating your own Thing Descriptions. You can:

1. Copy an example file and modify it manually
2. Use the TD Generator CLI to create similar devices with customized values
3. Study the structure to understand the W3C WoT Thing Description format

## Creating Your Own TD Files

To create custom TD files similar to these examples, use:

```bash
td-generator create
```

Follow the interactive prompts to specify your device characteristics.

## Thing Description Structure (v1.1)

Each TD file contains:

- **@context**: JSON-LD context - `https://www.w3.org/2022/wot/td/v1.1`
- **@type**: Semantic types - always includes "Thing" as base type
- **id**: Unique identifier (URN format)
- **title**: Human-readable name
- **name**: Machine-readable identifier
- **description**: Brief description of the device
- **securityDefinitions**: Available security mechanisms
- **security**: Applied security scheme(s)
- **base**: Base URL for all endpoints (supports various protocols)
- **properties**: Readable/writable device state
  - Can be marked as `observable` for subscriptions
  - Include `unit` for measurements
  - Support `readOnly` and `writeOnly` flags
- **actions**: Operations the device can perform
- **events**: Notifications the device can emit

### Forms Structure

Each interaction affordance (property, action, event) contains forms with:
- **href**: Endpoint path
- **op**: Operations (readproperty, writeproperty, observeproperty, invokeaction, subscribeevent)
- **contentType**: Media type (typically "application/json")

## References

- [W3C WoT Thing Description 1.1](https://www.w3.org/TR/wot-thing-description11/) - Official specification
- [OPC UA EdgeTranslator](https://github.com/OPCFoundation/UA-EdgeTranslator) - Industrial reference implementation
- [W3C WoT Documentation](https://www.w3.org/WoT/documentation/) - Additional resources
