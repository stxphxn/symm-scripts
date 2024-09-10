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

const ADDRESS = "0x169833EBB85FBD3cb67eeC73Ed02f738c0017951";

const MAX_UINT256 =
  "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const VAULT_ADDRESS = "0xbccc4b4c6530F82FE309c5E845E50b5E9C89f2AD";

const vaultContract = new ethers.Contract(VAULT_ADDRESS, VaultABI, WALLET);

const vaultInterface = new ethers.Interface(VaultABI);

const POOL_ID =
  "0x9a77bd2edbbb68173275cda967b76e9213949ace000000000000000000000008"; //STLOS/WTLOS
const TOKEN_1 = "0xB4B01216a5Bc8F1C8A33CD990A1239030E60C905"; //STLOS
const TOKEN_2 = "0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E"; //WTLOS

const TOKEN_1_DECIMALS = 18;
const TOKEN_2_DECIMALS = 18;

const TOKEN_1_AMOUNT = ethers.parseUnits("70", TOKEN_1_DECIMALS);
const TOKEN_2_AMOUNT = ethers.parseUnits("85", TOKEN_2_DECIMALS);

const NUMBER_OF_SWAPS = 10;

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
  // await (
  //   await vaultContract.batchSwap(
  //     0,
  //     swaps,
  //     [TOKEN_1, TOKEN_2],
  //     funds,
  //     limits,
  //     MAX_UINT256,
  //     { value: 0 }
  //   )
  // ).wait();
  const data = vaultInterface.encodeFunctionData("batchSwap", [
    0,
    swaps,
    [TOKEN_1, TOKEN_2],
    funds,
    limits,
    MAX_UINT256,
  ]);

  console.log("Data", data);
  //console.log("Swapped", swaps.length, "times");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
