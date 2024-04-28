const noble = require('@abandonware/noble');
const products = require('./device');

//Start scanning for BLE devices
noble.on('stateChange', function (state) {
    console.log('State changed: ' + state);
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

//Discover BLE devices
noble.on('discover', function (peripheral) {
    //console.log('Discovered device with local name: ' + peripheral.advertisement.localName);
    //console.log(peripheral);

    //Check if the device is a supported product by checking the local name and if it contains a product.deviceName
    if (Object.keys(products).some(product => peripheral.advertisement.localName.includes(products[product].deviceName))) {
        console.log('Found device: ' + peripheral.advertisement.localName);
        productData = products[Object.keys(products).find(product => peripheral.advertisement.localName.includes(products[product].deviceName))];
        connectAndSetUp(peripheral, productData);
    } else {
        //console.log('\x1b[31m%s\x1b[0m', 'Found unsupported device: ' + peripheral.advertisement.localName);
    }

});

//Connect to the device and set up the services
function connectAndSetUp(peripheral, productData) {
    peripheral.connect(function (error) {
        console.log('\x1b[32m%s\x1b[0m', 'Connected to device: ' + peripheral.advertisement.localName);
        //discover only the services that match the productData.ServiceUUID
        peripheral.discoverServices([productData.ServiceUUID], function (error, services) {
            services.forEach(function (service) {
                console.log('\x1b[90m%s\x1b[0m', 'Found service: ' + service.uuid);
                //discover only the characteristics that match the productData.WriteCharacteristicUUID and productData.ReadCharacteristicUUID
                service.discoverCharacteristics([productData.WriteCharacteristicUUID, productData.ReadCharacteristicUUID], function (error, characteristics) {
                    characteristics.forEach(function (characteristic) {
                        console.log('\x1b[90m%s\x1b[0m', 'Found characteristic: ' + characteristic.uuid);
                        let HexPowerOnCommand = [productData.commands.mainCommands.HexValue, productData.commands.mainCommands.subCommands.power.HexValue, productData.commands.mainCommands.subCommands.power.states.on.HexValue, ...productData.commands.mainCommands.subCommands.power.states.on.data, productData.commands.mainCommands.subCommands.power.states.on.checksum.value];
                        console.log(HexPowerOnCommand);

                        //Write the command to the device
                        characteristic.write(Buffer.from(HexPowerOnCommand), true, function (error) {
                            if (error) {
                                console.log('\x1b[31m%s\x1b[0m', 'Error writing to characteristic: ' + error);
                            } else {
                                console.log('\x1b[32m%s\x1b[0m', 'Wrote to characteristic: ' + characteristic.uuid);
                            }
                        });

                        let HexPowerOffCommand = [productData.commands.mainCommands.HexValue, productData.commands.mainCommands.subCommands.power.HexValue, productData.commands.mainCommands.subCommands.power.states.off.HexValue, ...productData.commands.mainCommands.subCommands.power.states.off.data, productData.commands.mainCommands.subCommands.power.states.off.checksum.value];
                        console.log(HexPowerOffCommand);

                        setTimeout(function () {
                            //Write the command to the device
                            characteristic.write(Buffer.from(HexPowerOffCommand), true, function (error) {
                                if (error) {
                                    console.log('\x1b[31m%s\x1b[0m', 'Error writing to characteristic: ' + error);
                                } else {
                                    console.log('\x1b[32m%s\x1b[0m', 'Wrote to characteristic: ' + characteristic.uuid);
                                }
                            });
                        }, 5000);
                    });
                });
            });
        });

    });
}