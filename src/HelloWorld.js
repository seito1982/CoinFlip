import React from "react";
import { useEffect, useState } from "react";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  // loadCurrentMessage,
  loadCurrentConsecutiveWins,
  getCurrentWalletConnected,
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [consecutiveWins, setConsecutiveWins] = useState("0"); //default message
  const [mySide, setMySide] = useState("1");

  //called only once
  useEffect(async () => {
    const consWins = await loadCurrentConsecutiveWins();
    setConsecutiveWins(consWins);

    // addSmartContractListener();

    // const { address, status } = await getCurrentWalletConnected();

    // setWallet(address);
    // setStatus(status);

    // addWalletListener();

  }, []);

  function addSmartContractListener() {
    // helloWorldContract.events.UpdatedMessages({}, (error, data) => {
    //   if (error) {
    //     setStatus("😥 " + error.message);
    //   } else {
    //     setMessage(data.returnValues[1]);
    //     setNewMessage("");
    //     setStatus("🎉 Your message has been updated!");
    //   }
    // });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Choose your side in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, mySide);
    setStatus(status);

    const consWins = await loadCurrentConsecutiveWins();
    setConsecutiveWins(consWins);
  };

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" src={alchemylogo}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>ConsecutiveWin:</h2>
      <p>{consecutiveWins}</p>

      <h2 style={{ paddingTop: "18px" }}>My Side:</h2>

      <div>
        <input
          type="text"
          placeholder="Input the coin's side (Front-1, Back-0)"
          onChange={(e) => setMySide(e.target.value)}
          value={mySide}
        />
        <p id="status">{status}</p>

        <button id="publish" onClick={onUpdatePressed}>
          Try
        </button>
      </div>
    </div>
  );
};

export default HelloWorld;
