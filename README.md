# Smart Contract Verifier

Experimenting with smart contract verification

<https://smart-contract-verifier.vercel.app>

## Limitations

Vercel serverless functions currently have limited resources setup (including in pro account).
This make it difficult to dynamically download solc version and compile/verify a contract.
While this this working in local it's not in Vercel with current serverless specs.
In order to make it working, the smart contract compilation process had to be deployed on a custom lambda function with bigger resources, see <https://github.com/AndreMiras/smart-contract-verifier-lambda>

## Run

First, setup the environment variables:

```sh
cp .env.example .env.local
```

Then run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
