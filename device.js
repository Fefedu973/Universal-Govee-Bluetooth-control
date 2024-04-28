const products = {
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
    // 'ihoment': {
    //     deviceName: 'ihoment',
    // },
    // 'GBK': {
    //     deviceName: 'GBK',
    // },
};

module.exports = products;
