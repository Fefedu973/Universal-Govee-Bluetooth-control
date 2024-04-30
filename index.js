const noble = require('@abandonware/noble');
const products = require('./devices');

const totalDevices = 3; // Update this with the actual number of devices

let connectedDevices = 0;
let discoveredDevices = [];

const deviceAdressToConnect = ['60:74:f4:9f:20:99', '60:74:f4:9a:04:dd', 'a4:c1:38:9a:46:21']; //update this with the actual device addresses

// Start scanning for BLE devices
noble.on('stateChange', function (state) {
    console.log('State changed: ' + state);
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

// Discover BLE devices
noble.on('discover', function (peripheral) {
    if (discoveredDevices.length < totalDevices) {
        // Check if the device is a supported product by checking the local name
        const supportedProduct = Object.keys(products).find(product => peripheral.advertisement.localName.includes(products[product].deviceName));
        if (supportedProduct && deviceAdressToConnect.includes(peripheral.address)) {
            console.log('Bluetooth address: ' + peripheral.address);
            console.log('Found device: ' + peripheral.advertisement.localName);
            productData = products[supportedProduct];
            discoveredDevices.push({
                peripheral: peripheral,
                productData: productData,
                characteristic: null
            });

            peripheral.connect(function (error) {
                console.log('\x1b[32m%s\x1b[0m', 'Connected to device: ' + peripheral.advertisement.localName);
                //discover only the services that match the productData.ServiceUUID
                peripheral.discoverServices([productData.ServiceUUID], function (error, services) {
                    services.forEach(function (service) {
                        //console.log('\x1b[90m%s\x1b[0m', 'Found service: ' + service.uuid);
                        //discover only the characteristics that match the productData.WriteCharacteristicUUID and productData.ReadCharacteristicUUID
                        service.discoverCharacteristics([productData.WriteCharacteristicUUID, productData.ReadCharacteristicUUID], function (error, characteristics) {
                            characteristics.forEach(function (characteristic) {
                                if (characteristic.uuid === productData.WriteCharacteristicUUID) {
                                    //update the characteristic in the discoveredDevices array for the device
                                    const deviceIndex = discoveredDevices.findIndex(device => device.peripheral === peripheral);
                                    discoveredDevices[deviceIndex].characteristic = characteristic;
                                    console.log("test");
                                    connectedDevices++;
                                    if (connectedDevices === totalDevices) {
                                        console.log('All devices discovered');
                                        noble.stopScanning();
                                        // Connect to all discovered devices
                                        //asynchronously execute the user script for each device    
                                        discoveredDevices.forEach(device => {
                                            executeUserScript(device.productData, device.characteristic, device.peripheral);
                                            keepAliveLoop(device.productData, device.characteristic, device.peripheral);
                                        });
                                    }
                                }
                            });
                        });
                    });
                });

            });

            // Check if all devices are discovered

        }
    }
});

//Connect to the device and set up the services
// function connect(peripheral, productData) {

// }


function keepAliveLoop(productData, characteristic, peripheral) {
    // Set up a variable to keep track of the interval ID
    let intervalId;

    // Define the keep alive function
    const sendKeepAlive = () => {
        // Send the keep alive command
        // Example: characteristic.write(...);
        keepAlive(productData, characteristic);
        console.log('Sending keep alive command');
    };

    // Start the keep alive loop
    const startKeepAlive = () => {
        // Call sendKeepAlive immediately
        sendKeepAlive();

        // Set up the interval to call sendKeepAlive every 2 seconds
        intervalId = setInterval(sendKeepAlive, 2000);
    };

    // Stop the keep alive loop
    const stopKeepAlive = () => {
        // Clear the interval
        clearInterval(intervalId);
    };

    // Start the keep alive loop
    startKeepAlive();

    // Listen for the disconnect event to stop the keep alive loop
    peripheral.once('disconnect', () => {
        console.log('Device disconnected, stopping keep alive');
        stopKeepAlive();
        connectedDevices--;
        if (connectedDevices === 0) {
            process.exit(0);
        }
    });
}


function executeUserScript(productData, characteristic, peripheral) {
    //add a 500ms delay at the beginning of the script if the device local name contains 'ihoment_H6159'
    if (peripheral.advertisement.localName.includes('ihoment_H6159')) {
        setTimeout(() => {
            //just continue after 500ms
            let delay = 0;
            const commandsQueue = [
                () => powerOn(productData, characteristic),
                () => brightness(productData, characteristic, 100),
                () => changeDeviceColor(productData, characteristic, 0xFF, 0x00, 0x00),
                () => changeDeviceColor(productData, characteristic, 0xFF, 0x7F, 0x00),
                () => changeDeviceColor(productData, characteristic, 0xFF, 0xFF, 0x00),
                () => changeDeviceColor(productData, characteristic, 0x7F, 0xFF, 0x00),
                () => changeDeviceColor(productData, characteristic, 0x00, 0xFF, 0x00),
                () => changeDeviceColor(productData, characteristic, 0x00, 0xFF, 0x7F),
                () => changeDeviceColor(productData, characteristic, 0x00, 0xFF, 0xFF),
                () => changeDeviceColor(productData, characteristic, 0x00, 0x7F, 0xFF),
                () => changeDeviceColor(productData, characteristic, 0x00, 0x00, 0xFF),
                () => changeDeviceColor(productData, characteristic, 0x7F, 0x00, 0xFF),
                () => changeDeviceColor(productData, characteristic, 0xFF, 0x00, 0xFF),
                () => changeDeviceColor(productData, characteristic, 0xFF, 0x00, 0x7F),
                () => changeDeviceColor(productData, characteristic, 0xFF, 0xFF, 0xFF),
                () => powerOff(productData, characteristic),
                () => peripheral.disconnect(),
            ];

            commandsQueue.forEach(command => {
                setTimeout(command, delay);
                delay += 500; // Increase delay for the next command
            });
        }, 250);
    } else {

        let delay = 0;
        const commandsQueue = [
            () => powerOn(productData, characteristic),
            () => brightness(productData, characteristic, 100),
            () => changeDeviceColor(productData, characteristic, 0xFF, 0x00, 0x00),
            () => changeDeviceColor(productData, characteristic, 0xFF, 0x7F, 0x00),
            () => changeDeviceColor(productData, characteristic, 0xFF, 0xFF, 0x00),
            () => changeDeviceColor(productData, characteristic, 0x7F, 0xFF, 0x00),
            () => changeDeviceColor(productData, characteristic, 0x00, 0xFF, 0x00),
            () => changeDeviceColor(productData, characteristic, 0x00, 0xFF, 0x7F),
            () => changeDeviceColor(productData, characteristic, 0x00, 0xFF, 0xFF),
            () => changeDeviceColor(productData, characteristic, 0x00, 0x7F, 0xFF),
            () => changeDeviceColor(productData, characteristic, 0x00, 0x00, 0xFF),
            () => changeDeviceColor(productData, characteristic, 0x7F, 0x00, 0xFF),
            () => changeDeviceColor(productData, characteristic, 0xFF, 0x00, 0xFF),
            () => changeDeviceColor(productData, characteristic, 0xFF, 0x00, 0x7F),
            () => changeDeviceColor(productData, characteristic, 0xFF, 0xFF, 0xFF),
            () => powerOff(productData, characteristic),
            () => peripheral.disconnect(),
        ];

        commandsQueue.forEach(command => {
            setTimeout(command, delay);
            delay += 500; // Increase delay for the next command
        });
    }
}

function sendCommand(characteristic, command) {
    //Write the command to the device
    characteristic.write(Buffer.from(command), true, function (error) {
        if (error) {
            console.log('\x1b[31m%s\x1b[0m', 'Error writing to characteristic: ' + error);
        } else {
            //console.log('\x1b[32m%s\x1b[0m', 'Wrote to characteristic: ' + characteristic.uuid);
        }
    }
    );
}


function changeDeviceColor(productData, characteristic, redValue, greenValue, blueValue) {
    // Retrieve the color command data
    const colorCommand = productData.commands.colors;

    const commandData = colorCommand.data.map(item => {
        if (item === 'red') {
            return redValue;
        } else if (item === 'green') {
            return greenValue;
        } else if (item === 'blue') {
            return blueValue;
        } else {
            return item;
        }
    }
    );

    // Calculate XOR checksum
    let checksum = 0;
    for (const byte of commandData) {
        checksum ^= byte;
    }

    // Replace 'checksum' in the array with the calculated checksum
    const checksumIndex = commandData.indexOf('checksum');
    if (checksumIndex !== -1) {
        commandData[checksumIndex] = checksum;
    }

    sendCommand(characteristic, commandData);
}

function powerOn(productData, characteristic) {
    // Retrieve the power on command data
    const powerOnCommand = productData.commands.power;

    // Replace 'value' with the on value
    const onValue = powerOnCommand.on;
    const commandData = powerOnCommand.data.map(item => item === 'state' ? onValue : item);

    // Calculate XOR checksum
    let checksum = 0;
    for (const byte of commandData) {
        checksum ^= byte;
    }

    // Replace 'checksum' in the array with the calculated checksum
    const checksumIndex = commandData.indexOf('checksum');
    if (checksumIndex !== -1) {
        commandData[checksumIndex] = checksum;
    }

    sendCommand(characteristic, commandData);
}

function powerOff(productData, characteristic) {
    // Retrieve the power off command data
    const powerOffCommand = productData.commands.power;

    // Replace 'value' with the off value
    const offValue = powerOffCommand.off;
    const commandData = powerOffCommand.data.map(item => item === 'state' ? offValue : item);

    // Calculate XOR checksum
    let checksum = 0;
    for (const byte of commandData) {
        checksum ^= byte;
    }

    // Replace 'checksum' in the array with the calculated checksum
    const checksumIndex = commandData.indexOf('checksum');
    if (checksumIndex !== -1) {
        commandData[checksumIndex] = checksum;
    }

    sendCommand(characteristic, commandData);
}

function brightness(productData, characteristic, brightnessPercentage) {
    // Retrieve the brightness command data
    const brightnessCommand = productData.commands.brightness;

    // scale the brightness percentage to the min-max range because the device min-max range is different from each other (sometimes from 0x00 to 0xfe, sometimes from 0x01 to 0xff)
    const min = brightnessCommand.min;
    const max = brightnessCommand.max;
    const brightnessValue = Math.round((max - min) * (brightnessPercentage / 100) + min);

    // Replace 'value' with the brightness value
    const commandData = brightnessCommand.data.map(item => item === 'brightness' ? brightnessValue : item);

    // Calculate XOR checksum
    let checksum = 0;
    for (const byte of commandData) {
        checksum ^= byte;
    }

    // Replace 'checksum' in the array with the calculated checksum
    const checksumIndex = commandData.indexOf('checksum');
    if (checksumIndex !== -1) {
        commandData[checksumIndex] = checksum;
    }

    sendCommand(characteristic, commandData);
}

function keepAlive(productData, characteristic) {
    const keepAliveCommand = productData.commands.keepAlive;

    sendCommand(characteristic, keepAliveCommand.data);
}