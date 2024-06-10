// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract funds{
    address manager;
    uint256 amount; 
    address[] public AddressArray;
    constructor(){
        manager=msg.sender;
    }

    function returnManager()public view returns(address){
        return manager;
    }

    function showAmount()public view returns(uint256){
        return amount;
    }

    function addToAmount(uint256 a)public{
        amount=amount + a;
        emit addValue(amount);
    }
    function giveFromAmount(uint256 a)public{
        amount=amount-a;
        emit addValue(amount);
    }

    event addValue(uint256 amount);

/*
    // Function to add an address to the dynamic array
   function addAddress(address newAddress) public {
        AddressArray.push(newAddress);
    }

    // Function to get the length of the dynamic array
    function getArrayLength() public view returns (uint) {
        return AddressArray.length;
    }

    // Function to get an address at a specific index in the array
    function isAddressPresent(address _a) public view returns (bool) {
        for(uint256 i=0;i<AddressArray.length;i++){
            if(AddressArray[i]==_a){
                return true;
            }
        }
        return false;
    }
    */
}