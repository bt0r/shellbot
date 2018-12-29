import {Connection, createConnection, EntityManager} from "typeorm";
import {AutoWired, Inject, Singleton} from "typescript-ioc";
import {Logger} from "./Logger";

@Singleton
@AutoWired
export class Database {
    /**
     * Logger
     */
    @Inject
    private _logger: Logger;

    /**
     * TypeOrm Connection
     */
    private _connection: Connection;

    public constructor() {
        this.connect();
    }

    get logger() {
        return this._logger;
    }

    get connection() {
        return this._connection;
    }

    set connection(connection: any) {
        this._connection = connection;
    }

    public connect(): any {
        const _ = this;
        createConnection().then((connection) => {
            _.connection = connection;
            _.logger.info("Connected to database");
        }).catch((e) => {
            _.logger.error("Can't connect to the database, error: " + e.sqlMessage);
        });
    }

    public get manager(): EntityManager {
        return this.connection.manager;
    }
}
