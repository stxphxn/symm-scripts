import { ethers } from "ethers";
import SwapRouterABI from "./SwapRouterABI.json";

require("dotenv").config();

const PROVIDER = new ethers.JsonRpcProvider(process.env.RPC_URL as string);

const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY as string, PROVIDER);

const ADDRESS = WALLET.address;

const MAX_UINT256 =
  "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const APPROVE_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
];

const SWAPROUTER_ADDRESS = "0xc96afc666A4195366a46E4ca8C4f10f3C39Ee363";

const POOL_ADDRESS = "0xf58abc74b15421d6ec93726ef7f6cba522da3495"; //SLUSH/WTLOS

const TOKEN_1 = "0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E"; //WTLOS
const TOKEN_2 = "0xaC45EDe2098bc989Dfe0798B4630872006e24c3f"; //SLUSH

const TOKEN_1_DECIMALS = 18;
const TOKEN_2_DECIMALS = 18;

const TOKEN_1_AMOUNT = ethers.parseUnits("268", TOKEN_1_DECIMALS);
const TOKEN_2_AMOUNT = ethers.parseUnits("65.2", TOKEN_2_DECIMALS);

const NUMBER_OF_SWAPS = 4;

const swapRouterContract = new ethers.Contract(
  SWAPROUTER_ADDRESS,
  SwapRouterABI,
  WALLET
);

const approveContract = new ethers.Contract(TOKEN_1, APPROVE_ABI, WALLET);
const approveContract2 = new ethers.Contract(TOKEN_2, APPROVE_ABI, WALLET);

async function main() {
  // await (await approveContract.approve(SWAPROUTER_ADDRESS, MAX_UINT256)).wait();
  // console.log("Approved token 1");
  // await (
  //   await approveContract2.approve(SWAPROUTER_ADDRESS, MAX_UINT256)
  // ).wait();
  // console.log("Approved token 2");
  const calls = [];
  for (let i = 0; i < NUMBER_OF_SWAPS; i++) {
    const isEven = i % 2 === 0;
    const swap = {
      tokenIn: isEven ? TOKEN_1 : TOKEN_2,
      tokenOut: isEven ? TOKEN_2 : TOKEN_1,
      fee: 1000,
      limitSqrtPrice: "0",
      recipient: ADDRESS,
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      amountIn: isEven ? TOKEN_1_AMOUNT : TOKEN_2_AMOUNT,
      amountOutMinimum: 0,
    };
    const encodeSwap = swapRouterContract.interface.encodeFunctionData(
      "exactInputSingle",
      [swap]
    );
    calls.push(encodeSwap);
  }
  const encMultiCall = swapRouterContract.interface.encodeFunctionData(
    "multicall",
    [calls]
  );
  const txArgs = {
    to: SWAPROUTER_ADDRESS,
    from: ADDRESS,
    data: encMultiCall,
  };
  const estimate = await WALLET.estimateGas(txArgs);
  console.log("Estimate", estimate.toString());
  const tx = await WALLET.sendTransaction(txArgs);
  console.log("Multicall tx", tx.hash);
}

main();
