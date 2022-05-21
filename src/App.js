import logo from './logo.svg';
import './App.css';

import web3 from './web3';
import lottery from './lottery';
import { useState } from 'react';
function  App () {

  
  const [manager,setManager]=useState('aaa')

  // window.ethereum.enable()
  const componentDidMount=async()=>{
    //On va essayer de fetcher qlq données from our contract 
    const manager=await lottery.methods.manager().call()
    setManager(manager)

  }
  
  componentDidMount()

  return (
    <diV>
      <h2> Lottery Contract</h2>
      <p> this is contract is managed by  {manager}</p>
    </diV>
  );
  
} 

export default App;
