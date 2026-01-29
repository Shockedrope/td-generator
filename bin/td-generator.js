#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('td-generator')
  .description('CLI tool to generate Thing Description (TD) files for Web of Things')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new Thing Description file')
  .action(async () => {
    try {
      console.log('\n🌐 Welcome to TD Generator!\n');
      console.log('This tool will help you create a Thing Description file for your Web of Things device.\n');

      // Basic device information
      const basicAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the title of your device?',
          default: 'My IoT Device',
          validate: (input) => input.trim() !== '' || 'Title is required'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Provide a brief description:',
          default: 'A Web of Things device'
        },
        {
          type: 'list',
          name: 'deviceType',
          message: 'Select the device type:',
          choices: [
            { name: 'Sensor', value: 'sensor' },
            { name: 'Actuator', value: 'actuator' },
            { name: 'Smart Light', value: 'smartLight' },
            { name: 'Thermostat', value: 'thermostat' },
            { name: 'Camera', value: 'camera' },
            { name: 'Lock', value: 'lock' },
            { name: 'Other/Custom', value: 'custom' }
          ]
        }
      ]);

      // Network configuration
      const networkAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'ipAddress',
          message: 'Enter the IP address or hostname:',
          default: 'localhost',
          validate: (input) => input.trim() !== '' || 'IP address/hostname is required'
        },
        {
          type: 'input',
          name: 'port',
          message: 'Enter the port number:',
          default: '8080',
          validate: (input) => {
            const port = parseInt(input);
            return (port > 0 && port <= 65535) || 'Port must be between 1 and 65535';
          }
        },
        {
          type: 'list',
          name: 'protocol',
          message: 'Select the protocol:',
          choices: ['HTTP', 'HTTPS', 'CoAP', 'MQTT', 'WebSocket', 'Modbus TCP'],
          default: 'HTTP'
        }
      ]);

      // Security configuration
      const securityAnswers = await inquirer.prompt([
        {
          type: 'list',
          name: 'securityScheme',
          message: 'Select security scheme:',
          choices: [
            { name: 'No Security', value: 'nosec' },
            { name: 'Basic Authentication', value: 'basic' },
            { name: 'Bearer Token', value: 'bearer' },
            { name: 'API Key', value: 'apikey' },
            { name: 'OAuth2', value: 'oauth2' }
          ],
          default: 'nosec'
        }
      ]);

      // Properties configuration
      const propertiesAnswers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addProperties',
          message: 'Do you want to add properties (readable/writable state)?',
          default: true
        }
      ]);

      let properties = {};
      if (propertiesAnswers.addProperties) {
        let addMore = true;
        while (addMore) {
          const propertyDetail = await inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: 'Property name:',
              validate: (input) => input.trim() !== '' || 'Property name is required'
            },
            {
              type: 'input',
              name: 'description',
              message: 'Property description:',
              default: ''
            },
            {
              type: 'list',
              name: 'type',
              message: 'Property type:',
              choices: ['string', 'number', 'integer', 'boolean', 'object', 'array']
            },
            {
              type: 'confirm',
              name: 'readable',
              message: 'Is this property readable?',
              default: true
            },
            {
              type: 'confirm',
              name: 'writable',
              message: 'Is this property writable?',
              default: false
            },
            {
              type: 'confirm',
              name: 'observable',
              message: 'Is this property observable (supports subscriptions)?',
              default: false
            },
            {
              type: 'input',
              name: 'unit',
              message: 'Unit of measurement (leave empty if none):',
              default: ''
            }
          ]);

          // Ensure at least one of readable or writable is true
          if (!propertyDetail.readable && !propertyDetail.writable) {
            console.log('⚠️  Warning: A property must be either readable or writable. Setting as readable.');
            propertyDetail.readable = true;
          }

          // Build property object with metadata first, then forms
          const property = {
            type: propertyDetail.type,
            description: propertyDetail.description
          };

          // Add readOnly/writeOnly if property is exclusively one or the other
          if (propertyDetail.readable && !propertyDetail.writable) {
            property.readOnly = true;
          }
          if (!propertyDetail.readable && propertyDetail.writable) {
            property.writeOnly = true;
          }

          // Add observable if specified
          if (propertyDetail.observable) {
            property.observable = true;
          }

          // Add unit if provided
          if (propertyDetail.unit && propertyDetail.unit.trim() !== '') {
            property.unit = propertyDetail.unit.trim();
          }

          // Add forms with operations
          const operations = [];
          if (propertyDetail.readable) {
            operations.push('readproperty');
          }
          if (propertyDetail.writable) {
            operations.push('writeproperty');
          }
          if (propertyDetail.observable) {
            operations.push('observeproperty');
          }

          property.forms = [{
            href: `/${propertyDetail.name}`,
            op: operations,
            contentType: 'application/json'
          }];

          properties[propertyDetail.name] = property;

          const continueAdding = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'addAnother',
              message: 'Add another property?',
              default: false
            }
          ]);
          addMore = continueAdding.addAnother;
        }
      }

      // Actions configuration
      const actionsAnswers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addActions',
          message: 'Do you want to add actions (operations the device can perform)?',
          default: true
        }
      ]);

      let actions = {};
      if (actionsAnswers.addActions) {
        let addMore = true;
        while (addMore) {
          const actionDetail = await inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: 'Action name:',
              validate: (input) => input.trim() !== '' || 'Action name is required'
            },
            {
              type: 'input',
              name: 'description',
              message: 'Action description:',
              default: ''
            }
          ]);

          actions[actionDetail.name] = {
            description: actionDetail.description,
            forms: [{
              href: `/${actionDetail.name}`,
              op: 'invokeaction',
              contentType: 'application/json'
            }]
          };

          const continueAdding = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'addAnother',
              message: 'Add another action?',
              default: false
            }
          ]);
          addMore = continueAdding.addAnother;
        }
      }

      // Events configuration
      const eventsAnswers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addEvents',
          message: 'Do you want to add events (notifications from the device)?',
          default: false
        }
      ]);

      let events = {};
      if (eventsAnswers.addEvents) {
        let addMore = true;
        while (addMore) {
          const eventDetail = await inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: 'Event name:',
              validate: (input) => input.trim() !== '' || 'Event name is required'
            },
            {
              type: 'input',
              name: 'description',
              message: 'Event description:',
              default: ''
            }
          ]);

          events[eventDetail.name] = {
            description: eventDetail.description,
            forms: [{
              href: `/${eventDetail.name}`,
              op: 'subscribeevent',
              contentType: 'application/json'
            }]
          };

          const continueAdding = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'addAnother',
              message: 'Add another event?',
              default: false
            }
          ]);
          addMore = continueAdding.addAnother;
        }
      }

      // Build the base URL
      const protocolMap = {
        'HTTP': 'http',
        'HTTPS': 'https',
        'CoAP': 'coap',
        'MQTT': 'mqtt',
        'WebSocket': 'ws',
        'Modbus TCP': 'modbus+tcp'
      };
      const baseUrl = `${protocolMap[networkAnswers.protocol]}://${networkAnswers.ipAddress}:${networkAnswers.port}`;

      // Build security definitions
      let security;
      let securityDefinitions = {};
      
      if (securityAnswers.securityScheme === 'nosec') {
        security = ['nosec_sc'];
        securityDefinitions.nosec_sc = {
          scheme: 'nosec'
        };
      } else if (securityAnswers.securityScheme === 'basic') {
        security = ['basic_sc'];
        securityDefinitions.basic_sc = {
          scheme: 'basic',
          in: 'header'
        };
      } else if (securityAnswers.securityScheme === 'bearer') {
        security = ['bearer_sc'];
        securityDefinitions.bearer_sc = {
          scheme: 'bearer',
          in: 'header'
        };
      } else if (securityAnswers.securityScheme === 'apikey') {
        security = ['apikey_sc'];
        securityDefinitions.apikey_sc = {
          scheme: 'apikey',
          in: 'header',
          name: 'X-API-Key'
        };
      } else if (securityAnswers.securityScheme === 'oauth2') {
        security = ['oauth2_sc'];
        securityDefinitions.oauth2_sc = {
          scheme: 'oauth2',
          flow: 'client_credentials'
        };
      }

      // Create the Thing Description
      const td = {
        '@context': [
          'https://www.w3.org/2022/wot/td/v1.1',
          { '@language': 'en' }
        ],
        '@type': basicAnswers.deviceType !== 'custom' ? ['Thing', basicAnswers.deviceType] : ['Thing'],
        id: `urn:dev:ops:${basicAnswers.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Date.now()}`,
        title: basicAnswers.title,
        name: basicAnswers.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        description: basicAnswers.description,
        securityDefinitions: securityDefinitions,
        security: security,
        base: baseUrl
      };

      // Add properties if any
      if (Object.keys(properties).length > 0) {
        td.properties = properties;
      }

      // Add actions if any
      if (Object.keys(actions).length > 0) {
        td.actions = actions;
      }

      // Add events if any
      if (Object.keys(events).length > 0) {
        td.events = events;
      }

      // File output
      const outputAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'filename',
          message: 'Enter the filename for the TD:',
          default: `${basicAnswers.title.toLowerCase().replace(/\s+/g, '-')}-td.json`,
          validate: (input) => input.trim() !== '' || 'Filename is required'
        }
      ]);

      // Save the TD file
      const outputPath = path.resolve(process.cwd(), outputAnswers.filename);
      fs.writeFileSync(outputPath, JSON.stringify(td, null, 2));

      console.log('\n✅ Thing Description created successfully!\n');
      console.log(`📄 File saved to: ${outputPath}\n`);
      console.log('You can now use this TD file with Web of Things clients and platforms.\n');

    } catch (error) {
      if (error.isTtyError) {
        console.error('Prompt could not be rendered in the current environment');
      } else {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  });

program
  .command('validate <file>')
  .description('Validate a Thing Description file')
  .action((file) => {
    try {
      const filePath = path.resolve(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
      }

      const tdContent = fs.readFileSync(filePath, 'utf8');
      let td;
      
      try {
        td = JSON.parse(tdContent);
      } catch (parseError) {
        console.error('❌ Invalid JSON format in TD file:', parseError.message);
        process.exit(1);
      }

      // Basic validation
      const requiredFields = ['@context', 'id', 'title', 'security', 'securityDefinitions'];
      const missingFields = requiredFields.filter(field => !td[field]);

      if (missingFields.length > 0) {
        console.error('❌ Validation failed. Missing required fields:', missingFields.join(', '));
        process.exit(1);
      }

      // Validate security references
      if (td.security && td.securityDefinitions) {
        for (const secScheme of td.security) {
          if (!td.securityDefinitions[secScheme]) {
            console.error(`❌ Validation failed. Security scheme '${secScheme}' referenced in 'security' array is not defined in 'securityDefinitions'.`);
            process.exit(1);
          }
        }
      }

      // Validate @context
      if (td['@context']) {
        const hasWoTContext = Array.isArray(td['@context']) 
          ? td['@context'].some(ctx => typeof ctx === 'string' && ctx.includes('w3.org') && ctx.includes('wot'))
          : (typeof td['@context'] === 'string' && td['@context'].includes('w3.org') && td['@context'].includes('wot'));
        
        if (!hasWoTContext) {
          console.warn('⚠️  Warning: @context should include W3C WoT TD context URL.');
        }
      }

      console.log('✅ Thing Description is valid!\n');
      console.log('📋 Summary:');
      console.log(`   Title: ${td.title}`);
      console.log(`   Description: ${td.description || 'N/A'}`);
      console.log(`   Properties: ${td.properties ? Object.keys(td.properties).length : 0}`);
      console.log(`   Actions: ${td.actions ? Object.keys(td.actions).length : 0}`);
      console.log(`   Events: ${td.events ? Object.keys(td.events).length : 0}`);
      console.log(`   Security: ${td.security.join(', ')}\n`);

    } catch (error) {
      console.error('❌ Error validating TD:', error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
if (process.argv.length === 2) {
  // No command provided, show help
  program.help();
} else {
  program.parse(process.argv);
}
