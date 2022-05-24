import './App.css';
// import ipfs from './ipfs';
import web3 from './web3';
import lottery from './lottery';
import { useState } from 'react';
import { create } from 'ipfs-http-client'
const client = create('https://ipfs.infura.io:5001/api/v0')

function  App () {

  const [fileUrl, updateFileUrl] = useState(``)

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
    const account=await web3.eth.getAccounts()
    setMessage("waiting on transaction sucess...")
    await lottery.methods.pickWinner().send({
      from:account[0]
    })
  setMessage("A winner has been picked ")
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

const [buffer,setBuffer]=useState("")
const OnChooseFile=(event)=>{
  event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend=()=>convertToBuffer(reader)
}
const convertToBuffer = async(reader) => {
  //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
  //set this buffer -using es6 syntax
    setBuffer(buffer)
};
const [ethAddress,setEthAddress]=useState('')
const [ipfsHash,setIpfsHash]=useState('IPFS-HASH')
const [transactionHash,setTransactionHash]=useState("")
const onSendIt=async(event)=>{
  event.preventDefault();
  //bring in user's metamask account address
  const accounts = await web3.eth.getAccounts();
  console.log('Sending from Metamask account: ' + accounts[0]);
  //obtain contract address from lottery.js
  const ethAddress= await lottery.options.address;
  console.log("lottery address "+ethAddress)
  setEthAddress(ethAddress)
  try {
    const added = await client.add(buffer,(err,ipfshash)=>{
      console.log(err,ipfshash)
    })
    setIpfsHash(added.cid.toString())
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    updateFileUrl(url)
    
    console.log(url)
    lottery.methods.sendHash(added.cid.toString()).send({
      from:accounts[0]},
      (error, transactionHash) => {
        console.log(transactionHash);
        setTransactionHash(transactionHash)
    })
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
  
  //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

    // await ipfs.add(buffer,(err,ipfshash)=>{
    //   console.log(err,ipfshash)
    //   //setState by setting ipfsHash to ipfsHash[0].hash 
    //   setIpfsHash(ipfshash[0].hash)
    //   console.log(ipfsHash)
    // })

}
  return (
    <div>
      <h2> Lottery Contract</h2>
      <p> this contract is managed by  {manager} <br/>
        There are currently {players.length} people entered , <br/> 
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
      <hr/>
      <h3> Choose file to send to IPFS </h3>
          <form onSubmit={onSendIt}>
            <input 
              type = "file"
              onChange = {OnChooseFile}
            />
             <button 
             type="submit"> 
             Send it 
             </button>
          </form>
          <h1>URl est  {fileUrl}</h1>
          <hr/>

          <h1> Transaction hash :{transactionHash}</h1>
          <hr/>
          <h1> hash of ipfs est {ipfsHash} </h1>
    </div>
  );
  
} 

export default App;
