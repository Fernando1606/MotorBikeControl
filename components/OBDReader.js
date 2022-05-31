/**
 * Copyright (c) 2016-present JetBridge, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


'use strict';

import React, { useState } from 'react';
import {DeviceEventEmitter,} from 'react-native';


import MMKVStorage, { useMMKVStorage, MMKVLoader} from "react-native-mmkv-storage";

const obd2 = require('@furkanom/react-native-obd2');
const DbKeys = {
    STORAGE_KEY:
    '@screen_setup',
    STORAGE_KEY_SCREENS:
    '@screens',
    STORAGE_KEY_BTADDR:
    '@bt_address',
    STORAGE_KEY_READKEYS:
    '@read_obd_id_keys'
}
const storage = new MMKVStorage.Loader().initialize();


export default class OBDReader extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
          speed: '0km/h',
          rpm: '0RPM',
          engineRunTime: '00:00:00',
          isStartLiveData: false,
          gpsState: '-',
          btStatus : '-',
          btDeviceList: [],
          btSelectedDeviceAddress: '',
          obdStatus: 'disconnected',
          debug : '-',
          obd2Data : { } 
        };

        this.btStatus = this.btStatus.bind(this);
        this.obdStatus = this.obdStatus.bind(this);
        this.obdLiveData = this.obdLiveData.bind(this);
    }



    btStatus(data)
    {
        if(this.state.btSelectedDeviceAddress == "")
        {
            this.setState({btStatus : "Not Set"});
        }
        else if(this.state.btStatus != data.status)
        {
            this.setState({btStatus : data.status});
        }
    }

    obdStatus(data)
    {
        if(this.state.obdStatus != data.status)
        {
            this.setState({obdStatus : data.status});
        }
    }

    obdLiveData(data)
    {
        var stateUpdateObj = {};
        var haveData = false;
        
        let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
        if(copyData[data.cmdID] && data.cmdResult != "NODATA" && copyData[data.cmdID].cmdResult != data.cmdResult)
        {
            copyData[data.cmdID] = data;
            stateUpdateObj["obd2Data"] = copyData;
            haveData = true;
        }
        else if(copyData[data.cmdID] == null && data.cmdResult != "NODATA")
        {
            copyData[data.cmdID] = data;
            stateUpdateObj["obd2Data"] = copyData;
            haveData = true;
        }

        if (data.cmdID === 'ENGINE_RPM')
        {
            stateUpdateObj['rpm'] = data.cmdResult;
            haveData = true;
        }

        if (data.cmdID === 'SPEED')
        {
            stateUpdateObj['speed'] = data.cmdResult;
            haveData = true;
        }
        
        if(haveData)
        {
            this.setState(stateUpdateObj);
        }
    }

    componentDidMount()
    {
        this.btStatusListener = DeviceEventEmitter.addListener('obd2BluetoothStatus', this.btStatus);
        this.obdStatusListener = DeviceEventEmitter.addListener('obd2Status', this.obdStatus);

        this.setDeviceAddressListener = DeviceEventEmitter.addListener('setBTDeviceAddress', this.setDeviceAddress.bind(this));
        this.readBTDeviceFromStorage();

        this.onReady();
        this.startLiveData();

    }

    componentWillUnmount()
    {
        this.stopLiveData();
        this.btStatusListener.remove();
        this.obdStatusListener.remove();
    }

    onReady()
    {
        obd2.ready();
    }

    startLiveData()
    {
        
        this.obdLiveDataListener = DeviceEventEmitter.addListener('obd2LiveData', this.obdLiveData);
        obd2.setMockUpMode('true');
        obd2.startLiveData(this.state.btSelectedDeviceAddress);
        this.setState({isStartLiveData: true});
    }

    stopLiveData()
    {
        this.setState({
            isStartLiveData: false,
            direction: '-',
            bluetoothStatus: '-',
        });
        
        this.obdLiveDataListener && this.obdLiveDataListener.remove();
        obd2.stopLiveData();
        
        this.writeKnownKeys();
    }
    
    writeKnownKeys = async () => {
        try
        {
            var readKeysString = await storage.getItem(DbKeys.STORAGE_KEY_READKEYS);
            var readKeys = JSON.parse(readKeysString);
            if(readKeys && readKeys != "" && this.state.obd2Data && this.state.btSelectedDeviceAddress != "")
            {
                readKeys[this.state.btSelectedDeviceAddress] = this.state.obd2Data;
                console.log('write 1', readKeys);
                await storage.setItem(DbKeys.STORAGE_KEY_READKEYS, JSON.stringify(readKeys));
            }
            else if(this.state.obd2Data && this.state.btSelectedDeviceAddress != "")
            {
                var newAdaptorReadKeysObj = {};
                newAdaptorReadKeysObj[this.state.btSelectedDeviceAddress] = this.state.obd2Data;
                console.log('write all', newAdaptorReadKeysObj);
                await MMVK.setItem(DbKeys.STORAGE_KEY_READKEYS, JSON.stringify(newAdaptorReadKeysObj));
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }


    setDeviceAddress(aDeviceAddress)
    {
        console.log('Setting btSelectedDeviceAddress :' + aDeviceAddress);
        this.setState({
            btSelectedDeviceAddress : aDeviceAddress
        });
    }

    
    readBTDeviceFromStorage = async () => {
        
        try
        {
            var item = await storage.getItem(DbKeys.STORAGE_KEY_BTADDR);
            if(item != "0")
            {
                console.log('set', item);
                this.setState({btSelectedDeviceAddress : item});
            }
        }
        catch (e) 
        {
            console.log(e);
        }
    }

    actualizacionDatos(){
        const datosOBD = {
            velocidadOBD: this.state.speed,
            rpmOBD: this.state.rpm
        }
        return datosOBD
    }

}

