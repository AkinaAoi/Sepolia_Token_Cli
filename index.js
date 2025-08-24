const fs = require("fs");
const { ethers } = require("ethers");
require("dotenv").config();

// Đọc ABI từ file erc20.json
const abi = JSON.parse(fs.readFileSync("./erc20.json", "utf8"));

async function main() {
  const args = process.argv.slice(2);
  const tokenIndex = args.indexOf("--token");
  const addrIndex = args.indexOf("--addr");

  if (tokenIndex === -1 || addrIndex === -1) {
    console.error("Usage: node index.js --token <TOKEN_ADDRESS> --addr <WALLET_ADDRESS>");
    process.exit(1);
  }

  const tokenAddress = args[tokenIndex + 1];
  const walletAddress = args[addrIndex + 1];

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const token = new ethers.Contract(tokenAddress, abi, provider);

  const [symbol, decimals, totalSupplyRaw, balanceRaw] = await Promise.all([
    token.symbol(),
    token.decimals(),
    token.totalSupply(),
    token.balanceOf(walletAddress),
  ]);

  console.log(`Token: ${symbol}`);
  console.log(`Total Supply: ${ethers.formatUnits(totalSupplyRaw, decimals)}`);
  console.log(`Balance of ${walletAddress}: ${ethers.formatUnits(balanceRaw, decimals)}`);
}

main().catch(console.error);
