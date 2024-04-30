const products = {
    'Govee H6008': {
        deviceName: 'ihoment_H6008_',
        commands: {
            mainCommands: {
                HexValue: 0x33,
                subCommands: {
                    power: {
                        HexValue: 0x01,
                        values: {
                            on: {
                                HexValue: 0x01,
                                data: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                                checksum: {
                                    type: 'Fixed',
                                    value: 0x33
                                }
                            },
                            off: {
                                HexValue: 0x00,
                                data: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                                checksum: {
                                    type: 'Fixed',
                                    value: 0x32
                                }
                            },
                        },
                    },
                    brightness: {
                        HexValue: 0x04,
                        values: {
                            min: 0x00,
                            max: 0xfe,
                            data: ['brightness', 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                            checksum: {
                                type: 'XOR',
                            }
                        },
                    },
                    colors: {
                        HexValue: 0x05,
                        subCommands: {
                            manual: {
                                HexValue: 0x0d,
                                values: {
                                    data: ['red', 'green', 'blue', 0X00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                                    checksum: {
                                        type: 'XOR',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            keepAlive: {
                HexValue: 0xaa,
                data: [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                checksum: {
                    type: 'Fixed',
                    value: 0xab
                }
            },
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