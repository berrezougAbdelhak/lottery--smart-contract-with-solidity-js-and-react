//Contient tous les configuration de web3 
import Web3 from "web3";
//On va injecter du web3 ainsi qu'on va basculer vers le provider de meta-mask
//window.web3 est la copie de web3 fournis pas meta-mask
//CurrentProvider est celui fournis par web3 et il a accces a nos cclé public/private keys 
// l'instance web3 work with version 1 and the provider of meta-mask  
const web3 =new Web3(window.web3.currentProvider)


export default web3;