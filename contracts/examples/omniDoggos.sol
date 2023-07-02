// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/// @title Custom NFT Contract (ERC721 compliant)

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../token/onft/ONFT721.sol";

contract omniDoggos is Ownable, ERC721URIStorage, ERC721Burnable, ONFT721{
    address Owner;
    string _name = "OmniDoggos";
    string _ticker = "OD";
    uint public _minGasToStore = 10000;
    uint public mintRate;
    uint public nextMintId;
    uint public maxMintId;

    constructor(address _layerZeroEndpoint, uint _startMintId, uint _endMintId, uint _cost) ONFT721(_name, _ticker, _minGasToStore, _layerZeroEndpoint) {
      Owner = msg.sender;
      mintRate = _cost;
      nextMintId = _startMintId;
      maxMintId = _endMintId;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ONFT721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    mapping(address => bool) public whitelist;
    
    uint256 public openingTime = 1683064379;
    string public pngEndpoint = "https://ipfs.io/ipfs/QmSX92LbaRXJxDo1bkJLTtfQgNe4FAG1AuSaMZpXiUBwjX/";
    string public jsonEndpoint = "https://ipfs.io/ipfs/QmfSAXmHm6zK8ENKsQAR3DBMh1gBBrRDFhQN2DyhxP3XpK/";

    string public pngExtension = ".png";
    string public jsonExtension = ".json";


    
    event Sale(
        uint256 id,
        address indexed buyer,
        uint256 cost,
        string indexed tokenURIJSON,
        string indexed tokenURIPNG,
        uint256 timestamp
    );

    struct SaleStruct {
        uint256 id;
        address buyer;
        uint256 cost;
        string jsonURI;
        string imageURI;
        uint256 timestamp;
    }

    SaleStruct[] minted;

    function uint2strk(uint256 _i) internal pure returns (string memory str) {
      if (_i == 0)
      {
        return "0";
      }
      uint256 j = _i;
      uint256 length;
      while (j != 0)
      {
        length++;
        j /= 10;
      }
      bytes memory bstr = new bytes(length);
      uint256 k = length;
      j = _i;
      while (j != 0)
      {
        bstr[--k] = bytes1(uint8(48 + j % 10));
        j /= 10;
      }
      str = string(bstr);
    }

    function addToWhitelist(address _beneficiary) public onlyOwner {
      whitelist[_beneficiary] = true;
    }


    function addManyToWhitelist(address[] memory _beneficiaries) public onlyOwner {
      for (uint256 i = 0; i < _beneficiaries.length; i++) {
        whitelist[_beneficiaries[i]] = true;
      }
    }

    modifier buffer(address abc) {
      require(openingTime != 0);
      _;
    }

    modifier checkAmount(uint _mintAmt) {
      require(_mintAmt < 8 && _mintAmt > 0);
      _;
    }

    //buffer(to)
    function safeMint(address to, uint _amtOfTokensToMint) public payable checkAmount(_amtOfTokensToMint) {
        require(nextMintId + _amtOfTokensToMint - 1<= maxMintId, "Minted out on this chain!");
        for (uint i = 0; i < _amtOfTokensToMint; i++) {
          uint newId = nextMintId;
          nextMintId++;
          _safeMint(to, newId);
          string memory finalURI = uint2strk(newId);
          string memory finalURIpng = string(abi.encodePacked(pngEndpoint, finalURI, pngExtension));
          string memory finalURIjson = string(abi.encodePacked(jsonEndpoint, finalURI, jsonExtension));
          _setTokenURI(newId, finalURIjson);

    minted.push(
            SaleStruct(
                newId,
                msg.sender,
                msg.value,
                finalURIjson,
                finalURIpng,
                block.timestamp
            )
          );
        
          emit Sale(newId, msg.sender, msg.value, finalURIjson, finalURIpng, block.timestamp);
        }

    }

    function giveAway(address winner, uint256 _tokenIdToGiveaway) public onlyOwner {
      safeTransferFrom(msg.sender, winner, _tokenIdToGiveaway);
    }

    function getMintedTknsAmt() public view returns(uint256) {
      uint256 currentItem = nextMintId;
      return currentItem;
    }

    
    function getMintRate() public view returns(uint256) {
      return mintRate;
    }

    
    function getTokenIdsOfOwner(address _owner) public view returns(uint256[] memory) {
      uint256 numberOfTokens = balanceOf(_owner);
      uint[] memory ids = new uint256[](numberOfTokens);
      uint256 idsCounter = 0;
      for (uint256 i = 0; i < numberOfTokens; i++) {
        if (minted[i].buyer == _owner) {
          ids[idsCounter] = minted[i].id;
        }
      }
      return ids;
    }

    function getURIPNG(uint256 tokenid) public view returns(string memory) {
      require(tokenid-1 < minted.length);
      return minted[tokenid-1].imageURI;
    }

    function getURIJSON(uint256 tokenid) public view returns(string memory) {
      require(tokenid-1 < minted.length);
      return minted[tokenid-1].jsonURI;
    }

}