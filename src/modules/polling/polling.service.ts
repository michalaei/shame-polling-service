import {DbConnector} from '../db/db-connector';
import axios from 'axios';

export interface IReality {
    warriorReality: number;
    ng: number;
    attackDemands: number;
    operationalPlans: number;
    name: string;
}

export interface IServer {
    id: number;
    name: string;
    url: string;
}

export class PollingService {
    private static realities: IReality[];
    private static servers: IServer[];

    static async init() {
        let realities = await PollingService.getRealities();
        setInterval(async () => {
            for (let reality of realities) {
                let servers = await PollingService.setServers(reality);
                for (let server of servers) {
                    await PollingService.setPoll(server, reality);
                }
            }
        }, 5000);
    }

    static async getRealities() {
        let realitiesData = await DbConnector.query(`SELECT * from public.realities`);
        this.realities = realitiesData.rows;
        return this.realities;
    }

    static async setServers(reality: IReality) {
        let serversData = await DbConnector.query(`SELECT id, name, url from reality${reality.warriorReality}.servers`);
        this.servers = serversData.rows;
        return this.servers;
    }

    static async setPoll(server: IServer, reality: IReality) {
        try {
            let startTime = Date.now();
            let response = await axios.get(server.url);
            let endTime = Date.now();
            let duration = endTime - startTime;
            console.log(`Polling stage - Reality : ${reality.name}, to Server: ${server.name}`);
            await DbConnector.query(`INSERT INTO reality${reality.warriorReality}.statistics (server_id, request_time, duration_ms) 
                                    values (${server.id},now(),${duration} ) `);
        } catch (error) {
            console.error(`Error occurred - ${error}`);
        }
    }
}
