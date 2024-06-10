const bodyParser=require("body-parser");
const express= require('express');
const mongoose=require('mongoose');
const path=require('path');
const {Web3} = require("web3");//importing the web3.js library




mongoose.connect('mongodb://127.0.0.1:27017/crowdFund', { useNewUrlParser: true, useUnifiedTopology: true }).then(async()=>{
    console.log("connection to mongo successfull");
}).catch(async(err)=>{
    console.log("An error has occured while trying to connect to mongo");
    console.log(err);
})






const app=express();
const Proposal=require('./model/proposal');
const Investor=require('./model/investors');
let web3=new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
//const web3= new Web3("https://eth-sepolia.g.alchemy.com/v2/pXZcqkNcRsq5LqjDSRQp9ki46EPA3F9D")
const ABI=require("./build/contracts/funds.json")
const contractAddress=ABI.networks[5777].address;
const contract= new web3.eth.Contract(ABI.abi,contractAddress);






app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.static('bootstrap'))
app.use(express.static('images'))


let allList=[];
let investorId=0;
let proposalId=0;
let newObject;
let investorList=[];
let propList=[];
async function returnProposalList(username){
    let ino=await Investor.findOne({username:username});
    let list=[]
    if(ino.proposalList.length===0){
        return 'empty';
    }else{
        for(let p of ino.proposalList){
            let prop=await Proposal.findOne({Id:p});
            list.push(prop);
        }
        return list;
    }
}



async function returnPropList(address){
    let kikiki=await Proposal.find({ owner: address }).exec();
    return kikiki
}
async function returnAllList(){
    allList=await Proposal.find({}).exec();
}
returnAllList();

const sendMoneyToContract=async (amount,sender)=>{
    const weiValue=web3.utils.toWei(amount,"ether")
    const transactionObject = {
        from: sender,
        to: contractAddress,
        data:contract.methods.addToAmount(amount).encodeABI(),
        gas: 2000000, // Adjust gas limit as needed
        gasPrice: '1000000000',
      };
   
      try {
        const signedTx = await web3.eth.accounts.signTransaction(transactionObject, "0x3c3033f5afbec03fed98df9298feca98097d777591531a672b9027159b628cb7");
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction receipt: ", txReceipt);
   
        const prop = await contract.methods.showAmount().call();
        console.log("Property: ", prop.toString());
      } catch (error) {
        console.error("Error sending transaction: ", error);
      }
}
const takeMoneyFromContract=async (amount)=>{

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
let sendEther=async(x,y,value)=>{
    const weiValue=web3.utils.toWei(value,"ether")
    await web3.eth.sendTransaction({
        from:`${x}`,
        to:`${y}`,
        value:weiValue//generally transactions om etherium blockchiain occur in wei which is why it is recommended to convertthe vaue in wei
    })

        let balanceX= web3.utils.fromWei(await web3.eth.getBalance(`${x}`),"ether");
        let balanceY= web3.utils.fromWei(await web3.eth.getBalance(`${y}`),"ether")
        console.log(`Balance of ${x}=${balanceX}:   Balance of  ${y}=${balanceY}`)
}



app.get('/kilo',(req,res)=>{
    res.send('kilo king');
})
app.get('/Proposal',async (req,res)=>{
    const Proposal= await Proposal.find({});
    console.log(Proposal)
    res.render('product',{Proposal})
})
app.get('/signup',async (req,res)=>{
    res.render('signup')
})
app.get('/login',async(req,res)=>{
    res.render('login')
})
app.get('/Home',async (req,res)=>{
    res.render('Home',)
})
app.get('/main',async (req,res)=>{
    res.render('main',{newObject,allList});
})
app.get('/investors',async(req,res)=>{
    res.render('investors',{newObject,investorList,propList});
})
app.get('/createProposal',async (req,res)=>{
    res.render('createProposal',{newObject})
})
app.get('/givemoney',async(req,res)=>{
    res.render('givemoney',{newObject})
})



/*app.post('/giveMoney',async(req,res)=>{
    let {name,IDss,amount}=req.body;
    let newProo=Proposal.findOne({Id:IDss,name:name})
    newProo.amount+=amount;
    newObject.proposalList.push(IDss)
    newObject.save();
    investorList = await returnProposalList(newObject.username);
    res.redirect('/investors');
})*/




app.post('/giveMoney', async (req, res) => {
    try {
        const { name, IDss, amount } = req.body;

        // Find the proposal by ID and name
        const existingProposal = await Proposal.findOne({ Id: IDss, name: name });

        // Check if the proposal exists
        if (!existingProposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // Update the amount in the proposal
        await sendMoneyToContract(amount,newObject.address);
        await sendEther(newObject.address,"0xDb6B8E32cd42A7B5722d8191962aF9b2b003cC0C",amount)
        existingProposal.amount =existingProposal.amount+ amount;
        await existingProposal.save(); // Save the changes

        // Find the investor by username
        const existingInvestor = await Investor.findOne({ username: newObject.username });

        // Check if the investor exists
        if (!existingInvestor) {
            return res.status(404).json({ error: 'Investor not found' });
        }

        // Add the proposal ID to the investor's proposalList
        existingInvestor.proposalList.push(existingProposal.Id);
        await existingInvestor.save(); // Save the changes

        // Redirect to the investors page
        res.redirect('/investors');
    } catch (error) {
        console.error('Error in /giveMoney route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/createProposal',async(req,res)=>{
    let {name,description,owner,request}=req.body;
    console.log(name+' '+description+' '+owner+' '+request)
    let newProposal=new Proposal({Id:proposalId,name:name,description:description,request:request,amount:0,owner:owner,investorsList:[]});

    await newProposal.save().then((newProposal)=>{
        console.log(newProposal)
    }).catch((err)=>{
        console.log("error in saving of product");
        console.log(err);
    })
    propList.push(newProposal)
    const Proposals= await Proposal.find({});
    console.log(Proposals)
    proposalId++;
    res.redirect('/investors'); 
    //res.render('product',{Proposals})
})

app.post('/newinvestor',async(req,res)=>{
    let {username,password,address}=req.body;
    console.log(username+' '+password+' '+address)
    let NInvestor=new Investor({Id:investorId,username:username,password:password,address:address,balance:0,amountContributed:0,proposalList:[0]});
    await NInvestor.save().then((NInvestor)=>{
        console.log(NInvestor)
    }).catch((err)=>{
        console.log("error in saving of product");
        console.log(err);
    })
    newObject=NInvestor;
    res.redirect('/investors');;
    const InvestorsList= await Investor.find({});
    console.log(InvestorsList)
    investorId++;
    //res.render('product',{products})
})

app.post('/existinvestor', async (req, res) => {
    try {
        let { username, password } = req.body;
        console.log(username + ' ' + password);

        // Use findOne to get a single document
        let NInvestor = await Investor.findOne({ username: username, password: password });

        // Wait for returnProposalList to complete before rendering the response
        investorList = await returnProposalList(username);
        
        // Render the response after all asynchronous operations are 
        newObject=NInvestor;
        propList=await returnPropList(NInvestor.address)
        res.redirect('/investors');;

    } catch (error) {
        console.error("Error in /existinvestor:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(230,()=>{
    console.log("app is listening to the port");
})






