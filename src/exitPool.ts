import { ethers } from "ethers";
import VaultABI from "./VaultABI.json";

require("dotenv").config();

const PROVIDER = new ethers.JsonRpcProvider(process.env.RPC_URL as string);

const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY as string, PROVIDER);

const VAULT_ADDRESS = "0xbccc4b4c6530F82FE309c5E845E50b5E9C89f2AD";

const vaultContract = new ethers.Contract(VAULT_ADDRESS, VaultABI, WALLET);

const pools = [
  {
    id: "0x0",
    address: "0x0",
    tokens: ["0x0", "0x0"],
    singleSided: false,
  },
];

async function main() {
  const poolId = pools[0].id;
  const tokenIn = pools[0].tokens[0];
  const tokenOut = pools[0].tokens[1];
  const amount = ethers.parseUnits("100", 18);
  const userData = "0x";

  const request = {
    assets: [tokenIn, tokenOut],
    minAmountsOut: array(0),
    toInternalBalance: false,
    userData: encodeExit(),
  };

  await vaultContract.exitPool(
    poolId,
    WALLET.address,
    WALLET.address,
    amount,
    userData
  );
  console.log("Exited pool");
}

main();
