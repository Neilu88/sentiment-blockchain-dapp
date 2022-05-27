// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7; // Solidity Version

contract MarketSentiment { // Define Contract

  address public owner; // Address of Owner
  string[] public tickersArray; // Array of Tickers/Cryptocurrencies

  constructor() { // Runs at Contract Creation
    owner = msg.sender; // Deployer Becomes Owner
  }

  struct ticker { // Definition of Ticker
    bool exists; // Does Ticker Exist
    uint256 up; // Upvote Count
    uint256 down; // Downvote Count
    mapping(address => bool) Voters; // Dictionary of Voters
  }

  event tickerupdated ( 
    uint256 up,
    uint256 down,
    address voter,
    string ticker
  ); //Emits After Vote

  mapping(string => ticker) private Tickers; //Dictionary of Tickers

  // Add Tickers
  function addTicker(string memory _ticker) public {
    require(msg.sender == owner, "Only the owner can add tickers"); //Only Owner Can Add
    ticker storage newTicker = Tickers[_ticker]; //Add Ticker to Tickers
    newTicker.exists = true; // Exists is True
    tickersArray.push(_ticker); // Add Ticker to Array
  }

  // Vote
  function vote(string memory _ticker, bool _vote) public {
    require(Tickers[_ticker].exists, "Can't vote on coins that don't exist"); // Ticker Exists
    require(!Tickers[_ticker].Voters[msg.sender], "You voted on this coin already"); // One Vote Per Ticker


    ticker storage t = Tickers[_ticker]; // Ticker Struct
    t.Voters[msg.sender] = true; // Update Voters

    // Update Counts
    if(_vote) {
      t.up += 1;
    } else {
      t.down += 1;
    }

    // Emit Event
    emit tickerupdated(t.up, t.down, msg.sender, _ticker);
  }

  // Get Vote Counts
  function getVotes(string memory _ticker) public view returns (
    uint256 up,
    uint256 down
  ){
    require(Tickers[_ticker].exists, "Ticker Not Defined"); // Ticker Exists
    ticker storage t = Tickers[_ticker]; // Ticker Struct
    return(t.up, t.down); // Return Counts
  }

}