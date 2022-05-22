import './App.css';

import web3 from './web3';
import lottery from './lottery';
import { useState } from 'react';
function  App () {

  
  const [manager,setManager]=useState('Manager')
  const [players,setPlayers]=useState([])
  //balance est un objet et il est wrapped to bignumber library of JS 
  const [balance,setBalance]=useState("Balance")

  const [value,setValue]=useState('Value')
  const ChangeValue=(event)=>{
    setValue(event.target.value)
    console.log(value)
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
    const players=await lottery.methods.getPlayers().call()
    setPlayers(players)
    console.log("les players sont :")
    console.log(players)
  }
  const getBalance=async()=>{
    const balance=await web3.eth.getBalance(lottery.options.address)
    setBalance(balance)
    // console.log("le montant est :")
    // console.log(balance)

  }
getManager()
// getPlayers()
getBalance()  


  return (
    <div>
      <h2> Lottery Contract</h2>
      <p> this contract is managed by  {manager} <br/>
        There are currently {players.length} people entered , <br/> 
        competting to win {balance} ether !
      </p>
      <hr/>
      <form>
        <h4> Want to try your luck </h4>
        <div>
          <label> Amount of ether to enter </label>
          <input 
          value={value}
          onChange={ChangeValue}/>
          
        </div>
        <button>
          Enter
        </button>
      </form>
    </div>
  );
  
} 

export default App;
