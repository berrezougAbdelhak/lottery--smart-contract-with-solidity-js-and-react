import './App.css';

import web3 from './web3';
import lottery from './lottery';
import { useState } from 'react';
function  App () {

  
  const [manager,setManager]=useState('Manager')
  const [players,setPlayers]=useState([])
  //balance est un objet et il est wrapped to bignumber library of JS 
  const [balance,setBalance]=useState("")

  const [value,setValue]=useState('Value')
  const [message,setMessage]=useState("")
  const OnChangeValue=(event)=>{
    setValue(event.target.value)
    console.log(value)
  }
  const onSubmit=async(event)=>{
    event.preventDefault()
    const accounts =await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...")
    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(value,"ether")
    })
    setMessage("You have been entered")
  }
  const onClickPickWinner=async()=>{

  }
  // window.ethereum.enable()
  const getManager=async()=>{
    //On va essayer de fetcher qlq données from our contract 
    const manager=await lottery.methods.manager().call()
    setManager(manager)
    
    // console.log(balance)
    
    // console.log("le manager est :")
    // console.log(manager)
  }
  const getPlayers=async()=>{
    const accounts=await web3.eth.getAccounts()
    const players=await lottery.methods.getPlayers().call({
      from:accounts[0]
    })
    setPlayers(players)
    // console.log("les players sont :")
    // console.log(players)
  }
  const getBalance=async()=>{
    const balance=await web3.eth.getBalance(lottery.options.address)
    setBalance(balance)
    // console.log("le montant est :")
    // console.log(balance)

  }
getManager()
getBalance()  
getPlayers()


  return (
    <div>
      <h2> Lottery Contract</h2>
      <p> this contract is managed by  {manager} <br/>
        There are currently {players[0]} people entered , <br/> 
        competting to win { web3.utils.fromWei(balance,"ether")   } ether
      </p>
      <hr/>
      <form onSubmit={onSubmit}>
        <h4> Want to try your luck </h4>
        <div>
          <label> Amount of ether to enter </label>
          <input 
          value={value}
          onChange={OnChangeValue}/>
          
        </div>
        <button>
          Enter
        </button>
      </form>
      <hr/>
      <h4> Ready to pick a winner </h4>
      <button onClick={onClickPickWinner}>Pick a winner  </button>
      <hr/>
      <h1>{message}</h1>
    </div>
  );
  
} 

export default App;
