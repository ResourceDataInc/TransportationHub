export class VehiclePositionApi {
    constructor() {}

    #root = 'http://localhost:38082/consumers/confluent-ksql-default_query_CTAS_JSON_TABLE_7';
    #instanceName = 'ci1';
    #baseUri;

    async createInstance() {
        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.kafka.v2+json',
            },
            body: JSON.stringify({
                name: `${this.#instanceName}`,
                format: 'json',
                'auto.offset.reset': 'latest'
            }),
        });

        //const json = await response.json();

        //this.#instanceName = json.instance_id;
        //this.#baseUri = json.base_uri;

        console.log(`Created instance ${this.#instanceName}`);
    }

    async subscribe() {
        await fetch(`${this.#root}/instances/${this.#instanceName}/subscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.kafka.v2+json',
            },
            body: JSON.stringify({
                topics: ['JSON_TABLE']
            }),
        });

        console.log(`Subscribed to instance ${this.#instanceName}`);
    }

    async getRecords() {
        const response = await fetch(`${this.#root}/instances/${this.#instanceName}/records?timeout=10000&max_bytes=300000`, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.kafka.json.v2+json',
            },
        });

        const json = await response.json();
        console.log(json);

        return json;
    }

    async deleteInstance() {
        await fetch(`${this.#root}/instances/${this.#instanceName}`, {
            method: 'DELETE',
        });

        console.log(`Deleted instance ${this.#instanceName}`);
    }
};
