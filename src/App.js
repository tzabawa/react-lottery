import "./App.css";
import lottery from "./lottery";
import { useEffect, useState } from "react";
import web3 from "./web3";

function App() {
  const [contractData, setContractData] = useState();
  const [lotteryCost, setLotteryCost] = useState("");
  const [transactionsMessage, setTransactionMessage] = useState("");

  const handleOnChange = (e) => setLotteryCost(e.target.value);

  const handleOnClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setTransactionMessage("Waiting on transaction success");

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
    } catch (err) {
      setTransactionMessage("");
    } finally {
      setTransactionMessage("A winner has been picked!");
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setTransactionMessage("Waiting on transaction success");

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(lotteryCost, "ether"),
      });
    } catch (err) {
    } finally {
      setTransactionMessage("");
    }
  };

  const initManager = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();

    setContractData({ balance, manager, players });
  };

  useEffect(() => {
    initManager();
  }, []);

  return (
    <div>
      <h2>This is our lottery contract</h2>
      {contractData ? (
        <>
          <p>This conract is managed by {contractData.manager}</p>
          <p>
            There are currently {contractData.players.length} people entered,
            competing to win {web3.utils.fromWei(contractData.balance, "ether")}{" "}
            ether!
          </p>
        </>
      ) : null}
      <hr />
      <form onSubmit={handleOnSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input onChange={handleOnChange} value={lotteryCost} />
        </div>
        <div>
          <button>Enter</button>
        </div>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={handleOnClick}>Pick a winner</button>
      <hr />
      {transactionsMessage ? <h1>{transactionsMessage}</h1> : null}
    </div>
  );
}

export default App;
