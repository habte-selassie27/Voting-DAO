pragma solidity ^0.8.24;

contract ProposalManager {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 createdAt;
        bool active;
    }

    address public owner;
    uint256 public proposalCounter;
    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 id, string title, address creator);
    event ProposalClosed(uint256 id);
    event OwnerChanged(address oldOwner, address newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized (admin only)");
        _;
    }

    constructor() {
        owner = msg.sender; // deployer = admin
    }

    function createProposal(
        string memory title,
        string memory description
    ) external onlyOwner {
        proposalCounter++;

        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            title: title,
            description: description,
            creator: msg.sender,
            createdAt: block.timestamp,
            active: true
        });

        emit ProposalCreated(proposalCounter, title, msg.sender);
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
      return proposals[id];
    }

   function getAllProposals() external view returns (Proposal[] memory) {
       Proposal[] memory list = new Proposal[](proposalCounter);
       for (uint256 i = 1; i <= proposalCounter; i++) {
          list[i - 1] = proposals[i];
        }
        return list;
      } 


    function closeProposal(uint256 proposalId) external onlyOwner {
        require(proposals[proposalId].active, "Already closed");
        proposals[proposalId].active = false;

        emit ProposalClosed(proposalId);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }
}

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// contract ProposalManager {
//     struct Proposal {
//         uint256 id;
//         string title;
//         string description;
//         address creator;
//         uint256 createdAt;
//         bool active;
//     }

//     uint256 public proposalCounter;
//     mapping(uint256 => Proposal) public proposals;

//     event ProposalCreated(uint256 id, string title, address creator);
//     event ProposalClosed(uint256 id);

//     function createProposal(string memory title, string memory description) external {
//         proposalCounter++;

//         proposals[proposalCounter] = Proposal({
//             id: proposalCounter,
//             title: title,
//             description: description,
//             creator: msg.sender,
//             createdAt: block.timestamp,
//             active: true
//         });

//         emit ProposalCreated(proposalCounter, title, msg.sender);
//     }

//     function closeProposal(uint256 proposalId) external {
//         require(proposals[proposalId].creator == msg.sender, "Not creator");
//         require(proposals[proposalId].active, "Already closed");

//         proposals[proposalId].active = false;
//         emit ProposalClosed(proposalId);
//     }
// }
