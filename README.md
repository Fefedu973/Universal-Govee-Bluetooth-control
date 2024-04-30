# Universal-Govee-Bluetooth-control
The goal of this lib is to create an universal bluetooth api for govee devices (mostly lightning devices but also smart button and others) by setting up a simple and universal modular system to add support for your devices.

The the goal of this project is also to create a "lan api replacement" for devices that dosen't support this functionnality

The state if this project is currenlty in alpha/proof of concept. Not a lot of things are working and it is not an npm package but a js file you need to edit for now.

## How to use ?
Edit the devices.js file to recreate the packet structure of your govee device (for now only on/off, brightness, manual color and keepAlive commands are supported), You also need to set a device name which is the beggining of the bluetooth disaply name as well as ServiceUUID, Write and Read Characteristics UUID. You can gather all of thoses infos by enbling HCI bluetooth snoopingin the developer settings in your android phone, installing ADB on your windows machine, installing wireshark with extcap enabled, plugging your phone to your computer, starting an adb server "$adb start-server", opening wireshark and seleting bluetooth HCI in the capture list. Then open the govee app, click quickly on the device you want to add support and do actions like changing colors, powering on/off the device. Then you need to find the packets that match the actions that you are doing and understand how they are made (you can take a look at this repo where other devices were aleready reverse engineered to help you: https://github.com/egold555/Govee-Reverse-Engineering). Then create a new entry in the devices.js file and fill out the packet you found according to the desired format (right now only on/off, brightness, manual color and keepAlive commands are supported but more will be in the future). If you see that you cannot fit your packet in the currently established supported product object format please create an issue and I will update the code to support your packet structure (I can only test my code on few devices with similar packet structure so I made the devices object like this but if more people contribute to the project by requesting more various devices I can improve it to support a wider range of devices and add more functionnalities in the future aiming to support every govee device and every action that can be made in the govee app). Then you can create a pull request with your updated devices.js file and I will add your device to the project !

The index.js file handles device connection and packet reconstruction based on the device packet provided. It it not very elegant for now but the goal is to made an easy to use, well built npm package. (I'm not a professional dev and I am a beginner in javascript so the code can be messy I know, I will try to improve it in the future with the goal to make it the reference in the govee community)

Right now to control your devices you need to enter the total number of device that you want to control (you should know that it may be limited by you bluetooth hardware). Then run the script and you will see all the supported govee devices appearing in the console with their respective bluetooth adress. Put the bluetooth adresses off the devices you want to control in the deviceAdressToConnect array.

Once that's done, if you run the script your products should light up, do a rainbow animation and shutting down. If it works that means that you are all set !
Now you can edit the "executeUserScript" function to suits your needs. In the file give there is an added delay for specific devices, you can edit/remove it if you want, this was because some devices have a delay when applying the color (.5 sec fade animation) so the weren't in sync with other devices that apply colors direclty so it was to counter this difference and make the animation synced. In the future maybe I could add a delay entry in the device object to take the delay of each device in account (if we can see a specific fixed delay) and make avery device sync with the device with the most delay and compensate the delay for each devices to have a nice synced experience.

Right now all commands are exeuted by all device but you can filter them with if statments with the device adress so ecah device can follow a specific command sequence. 

In the exemple all the commands are delayed by 500ms or .5s which is almost the max we can do (we could do more but the it would mess up the devices with fade animation -that we cannot turn off by the way- and in general the max rate is 250ms)

What are the available commands right now ?

```
powerOn(productData, characteristic) //powers the device on
```

```
brightness(productData, characteristic, brightness) //brightness value on a scale of 0 to 100 with integer numbers only, changes the device brightness
```

```
changeDeviceColor(productData, characteristic, red, green, blue) //red, green and blue value are hexadecimal values from 0x00 to 0xff, changes all the device led colors to the specified color
```

```
powerOff(productData, characteristic) //powers the device off
```


This is an example of the object format and packet structure for the govee H6008 light bulbs:

```js
const products = {
    'Govee H6008': {
        deviceName: 'ihoment_H6008_',
        commands: {
            power: {
                on: 0x01,
                off: 0x00,
                data: [0x33, 0x01, 'state', 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 'checksum'],
                checksum: {
                    type: 'XOR',
                },
            },
            brightness: {
                min: 0x00,
                max: 0x64,
                data: [0x33, 0x04, 'brightness', 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 'checksum'],
                checksum: {
                    type: 'XOR',
                }
            },
            colors: {
                data: [0x33, 0x05, 0x0d, 'red', 'green', 'blue', 0X00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 'checksum'],
                checksum: {
                    type: 'XOR',
                },

            },
            keepAlive: {
                data: [0xaa, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xab],
            },
        },
        ServiceUUID: '000102030405060708090a0b0c0d1910',
        WriteCharacteristicUUID: '000102030405060708090a0b0c0d2b11',
        ReadCharacteristicUUID: '000102030405060708090a0b0c0d2b10',

    }
};

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
