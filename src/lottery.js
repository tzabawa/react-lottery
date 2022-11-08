import web3 from "./web3";

const address = "REPLACE_WITH_YOUR_SMART_CONTRACT_ADDRESS";
const abi = "REPLACE_WITH_YOUR_SMART_CONTRACT_ABI";

export default new web3.eth.Contract(abi, address);
