const {Web3} = require("web3");//importing the web3.js library
let web3=new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
//const web3= new Web3("https://eth-sepolia.g.alchemy.com/v2/pXZcqkNcRsq5LqjDSRQp9ki46EPA3F9D")
const ABI=require("../build/contracts/funds.json")
const contractAddress=ABI.networks[5777].address;
const contract= new web3.eth.Contract(ABI.abi,contractAddress); 
const readContract=async (amount)=>{

    const transactionObject = {
        from: "0x6a38Fad37B8A9fE9d56635E98B5a65614d56f9eD",
        to: contractAddress,
        data:contract.methods.addToAmount(amount).encodeABI(),
        gas: 2000000, // Adjust gas limit as needed
        gasPrice: '1000000000',
      };
   
      try {
        const signedTx = await web3.eth.accounts.signTransaction(transactionObject, "0x73e2abfe0caefaaaec927a3a58acef9f9eda8c9391cbc9839d195e1f27b4065b");
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction receipt: ", txReceipt);
   
        const prop = await contract.methods.showAmount().call();
        console.log("Property: ", prop.toString());
      } catch (error) {
        console.error("Error sending transaction: ", error);
      }

}


const readContract2=async (amount)=>{

   const transactionObject = {
       from: "0x2570414060702916926aa56D60De016641ECc86B",
       to: contractAddress,
       data:contract.methods.giveFromAmount(amount).encodeABI(),
       gas: 2000000, // Adjust gas limit as needed
       gasPrice: '1000000000',
     };
  
     try {
       const signedTx = await web3.eth.accounts.signTransaction(transactionObject, "0xd3bf6f80a5086596af120535e5d7cd86c04100377c6ed27bf248aa2b3af8a549");
       const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
       console.log("Transaction receipt: ", txReceipt);
  
       const prop = await contract.methods.showAmount().call();
       console.log("Property: ", prop.toString());
     } catch (error) {
       console.error("Error sending transaction: ", error);
     }

}















/*let jiji=async()=>{
    const value1 =await contract.methods.returnManager().call()
    console.log(value1);
}*/




//==========================================
/*const sendiii=async()=>{
    const accounts=await web3.eth.getAccounts();
    const _from=accounts[0]
    const privateKey="0x2570414060702916926aa56D60De016641ECc86B";
    const tx={
        from:_from,
        to:contractAddress,
        gas:200000,
        data:contract.methods.addToAmount(5).encodeABI()
    }
    const signature= await web3.eth.accounts.signTransaction(tx,privateKey)
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt",async()=>{
            const events=await contract.getPastEvents("addValue",{fromBlock:0,toBlock:"latest"})
            console.log(events)
        }
    )
} 
//sendiii();
//==========================================
/*let sendEtherToContract=async(x,value)=>{
    const weiValue=web3.utils.toWei(value,"ether")
    await web3.eth.sendTransaction({
        from:`${x}`,
        to:`${"0xB2ab6c42bf3cA5342Aa2Cf7a30CC77F9f18E5c67"}`,
        value:weiValue,//generally transactions om etherium blockchiain occur in wei which is why it is recommended to convertthe vaue in wei
        gas:200000
    })

        let balanceX= web3.utils.fromWei(await web3.eth.getBalance(`${x}`),"ether");
        let balanceY= web3.utils.fromWei(await web3.eth.getBalance(`${"0xB2ab6c42bf3cA5342Aa2Cf7a30CC77F9f18E5c67"}`),"ether")
        console.log(`The balance of the contract is ${balanceY} the balance of the account is ${balanceX}`)
}
sendEtherToContract("0x6a38Fad37B8A9fE9d56635E98B5a65614d56f9eD",1);

let sendEtherFromContract=async(x,value)=>{
    const weiValue=web3.utils.toWei(value,"ether")
    await web3.eth.sendTransaction({
        from:`${"0xB2ab6c42bf3cA5342Aa2Cf7a30CC77F9f18E5c67"}`,
        to:`${x}`,
        value:weiValue//generally transactions om etherium blockchiain occur in wei which is why it is recommended to convertthe vaue in wei
    })

        let balanceX= web3.utils.fromWei(await web3.eth.getBalance(`${"0xB2ab6c42bf3cA5342Aa2Cf7a30CC77F9f18E5c67"}`),"ether");
        let balanceY= web3.utils.fromWei(await web3.eth.getBalance(`${x}`),"ether")
        console.log(`The balance of the account is ${balanceY} the balance of the contract is ${balanceX}`)
}

//createProposal("to test",200,"0xfe57297910B5C40df51D1EbFb8409C7b7cBE97DA");
/*let sendEther=async(x,y,value)=>{
    const weiValue=web3.utils.toWei(value,"ether")
    await web3.eth.sendTransaction({
        from:`${x}`,
        to:`${y}`,
        value:weiValue//generally transactions om etherium blockchiain occur in wei which is why it is recommended to convertthe vaue in wei
    })

        let balanceX= web3.utils.fromWei(await web3.eth.getBalance(`${x}`),"ether");
        let balanceY= web3.utils.fromWei(await web3.eth.getBalance(`${y}`),"ether")
}


let getBalanceOfAccount= async(x)=>{
    let balanceInEther
    let balanceInWei
    await web3.eth.getBalance(`${x}`).//takes the address of an account as parameter and returns its balance
    then((res)=>{
        balanceInEther=web3.utils.fromWei(res,"ether")
    //converts the value from wei to the the value stated in the parameter
        balanceInWei=web3.utils.toWei(res,"ether")
    //converts the value type stated in the parameter to wei value
    })
}
*/
//const ABI=require("../build/contracts/give.json")
