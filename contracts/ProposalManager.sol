pragma solidity ^0.8.24;

contract ProposalManager {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address creator;
        uint64 startTime;
        uint64 endTime;
        bool finalized;
        uint256 createdAt;
        bool active;
    }

    address public owner;
    uint256 public proposalCounter;
    mapping(uint256 => Proposal) public proposals;

    // Events

    //event ProposalCreated(uint256 id, string title, address creator);
    event ProposalCreated(uint256 id, string title, address creator, uint64 startTime, uint64 endTime);
    event ProposalClosed(uint256 id);
    event ProposalFinalized(uint256 id);
    event OwnerChanged(address oldOwner, address newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized (admin only)");
        _;
    }

    constructor() {
        owner = msg.sender; // deployer = admin
    }

    /**
     * @dev Create a new proposal with a voting period.
     * @param title Proposal title
     * @param description Proposal description
     * @param startTime Timestamp when voting starts
     * @param endTime Timestamp when voting ends
     */

    function createProposal(
        string memory title,
        string memory description,
        uint64 startTime,
        uint64 endTime
    ) external onlyOwner {
         require(endTime > startTime, "End must be after start");

        proposalCounter++;

        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            title: title,
            description: description,
            creator: msg.sender,
            startTime: startTime,
            endTime: endTime,
            finalized: false,
            createdAt: block.timestamp,
            active: true
        });

        //emit ProposalCreated(proposalCounter, title, msg.sender);
        emit ProposalCreated(proposalCounter, title, msg.sender, startTime, endTime);
    
    }

     // Get a single proposal
    function getProposal(uint256 id) external view returns (Proposal memory) {
       return proposals[id];
    }

    // Get all proposals
   function getAllProposals() external view returns (Proposal[] memory) {
       Proposal[] memory list = new Proposal[](proposalCounter);
       for (uint256 i = 1; i <= proposalCounter; i++) {
          list[i - 1] = proposals[i];
        }
        return list;
      } 

    // Close a proposal manually (before finalization)
    function closeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage p = proposals[proposalId];
        require(p.active,"Already closed");
        //require(proposals[proposalId].active, "Already closed");
        // proposals[proposalId].active = false;
        p.active = false;

        emit ProposalClosed(proposalId);
    }

    /**
     * @dev Finalize proposal after voting period ends
     * Once finalized, results can be decrypted off-chain
     */
    function finalizeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp > p.endTime, "Voting period not over");
        require(!p.finalized, "Already finalized");

        p.finalized = true;
        emit ProposalFinalized(proposalId);
    }
    

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function isVotingActive(uint256 proposalId) external view returns (bool) {
    Proposal memory p = proposals[proposalId];
    return block.timestamp >= p.startTime &&
           block.timestamp <= p.endTime &&
           p.active &&
           !p.finalized;
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
