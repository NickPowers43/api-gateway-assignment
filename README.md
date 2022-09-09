

# API Gateway Assignment

## Running

Install dependencies
```shell
npm install --omit=dev
```
Ensure that the appropriate env variables are set (see [config.ts](./src/config.ts) for more details). Only IPStack API key is required. IP API can identify users of its API by only their IP so no key necessary.
Once they are set you can now run the server
```shell
export IPSTACK_API_ACCESS_KEY=...
npm start
```

## Testing (E2E and Unit)

Install dependencies
```shell
npm install --include=dev
```
Set appropriate env variables and start Jest
```shell
export IPSTACK_API_ACCESS_KEY=...
npm test
```