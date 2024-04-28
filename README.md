# Universal-Govee-Bluetooth-control
The goal of this lib is to create an universal bluetooth api for govee devices (mostly lightning devices but also smart button and others) by setting up a simple and universal modular system to add support for your devices easy for devs and casual govee users

The the goal of this project is also to create a "lan api replacement" for devices that dosen't support this functionnalty

## How to use ?
Edit the device.js file to recreate the packet structure of your govee device (for now only on/off commands are supported), please specify the serviceUUID as well as the read and write UUIDs. You also need to enter the beginning of your device bluetooth name.

This is an example for govee H6008 light bulbs


```
'Govee H6008': {
        deviceName: 'ihoment_H6008_',
        commands: {
            mainCommands: {
                HexValue: 0x33,
                subCommands: {
                    power: {
                        HexValue: 0x01,
                        states: {
                            on: {
                                HexValue: 0x01,
                                //Fill remaining 16 bytes with 0x00
                                data: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                                checksum: {
                                    type: 'XOR',
                                    value: 0x33
                                }
                            },
                            off: {
                                HexValue: 0x00,
                                //Fill remaining 16 bytes with 0x00
                                data: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                                checksum: {
                                    type: 'XOR',
                                    value: 0x32
                                }
                            },
                        },
                    },
                },
            }
        },
        ServiceUUID: '00010203-0405-0607-0809-0a0b0c0d1910',
        WriteCharacteristicUUID: '00010203-0405-0607-0809-0a0b0c0d2b10',
        ReadCharacteristicUUID: '00010203-0405-0607-0809-0a0b0c0d2b11',
    },
```

The original packet structure was this:
```
20 bytes packet

0x33: Indicator
    0x01: Power
        0x00: Off
        0x01: On
bunch of 0
+ XOR checksum at the end
```
after filling in the infos my script will rebuild the packets to send them to the bluetooth device like this: 

```
0x33, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x33
3301010000000000000000000000000000000033 = on

0x33, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x32
3301000000000000000000000000000000000032 = off
```
