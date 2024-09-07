/*
  The code below is a simple script that swaps between two tokens eg(USDC and USDT) in a loop. It uses the  batchSwap  function from the  Vault  contract. 
  The script is using the  ethers.js  library to interact with the blockchain. It reads the private key and RPC URL from the  .env  file. 
  To run the script, you need to install the dependencies: 
  npm install
  
  Then, create a  .env  file in the root directory with the following content: 
  RPC_URL=https://mainnet15.telos.net/evm
  PRIVATE_KEY=0xYOUR_PRIVATE_KEY

  Run the script:
  npx ts-node index.ts
*/
import { ethers } from "ethers";
import VaultABI from "./VaultABI.json";

require("dotenv").config();

const PROVIDER = new ethers.JsonRpcProvider(process.env.RPC_URL as string);

const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY as string, PROVIDER);

const ADDRESS = WALLET.address;

const MAX_UINT256 =
  "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const VAULT_ADDRESS = "0xbccc4b4c6530F82FE309c5E845E50b5E9C89f2AD";

const vaultContract = new ethers.Contract(VAULT_ADDRESS, VaultABI, WALLET);

const POOL_ID =
  "0x058d4893efa235d86cceed5a7eef0809b76c8c66000000000000000000000004"; //USDC/USDT
const TOKEN_1 = "0x8D97Cea50351Fb4329d591682b148D43a0C3611b"; //USDC
const TOKEN_2 = "0x975Ed13fa16857E83e7C493C7741D556eaaD4A3f"; //USDT

const TOKEN_1_DECIMALS = 6;
const TOKEN_2_DECIMALS = 6;

const TOKEN_1_AMOUNT = ethers.parseUnits("1", TOKEN_1_DECIMALS);
const TOKEN_2_AMOUNT = ethers.parseUnits("1", TOKEN_2_DECIMALS);

const NUMBER_OF_SWAPS = 2;

async function main() {
  const funds = {
    sender: ADDRESS,
    recipient: ADDRESS,
    fromInternalBalance: false,
    toInternalBalance: false,
  };

  const limits = Array(2).fill(MAX_UINT256);

  const swaps: any[] = [];
  for (let i = 0; i < NUMBER_OF_SWAPS; i++) {
    const isEven = i % 2 === 0;
    swaps.push({
      poolId: POOL_ID,
      amount: isEven ? TOKEN_1_AMOUNT : TOKEN_2_AMOUNT,
      assetInIndex: isEven ? 0 : 1,
      assetOutIndex: isEven ? 1 : 0,
      userData: "0x",
    });
  }

  await (
    await vaultContract.batchSwap(
      0,
      swaps,
      [TOKEN_1, TOKEN_2],
      funds,
      limits,
      MAX_UINT256,
      { value: 0 }
    )
  ).wait();
  console.log("Swapped", swaps.length, "times");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
