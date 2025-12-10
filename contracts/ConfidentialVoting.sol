// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {externalEuint8, euint8, FHE} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialVoting is ZamaEthereumConfig {
    struct Vote {
        bool exists;
        euint8 encryptedVote;
    }

    mapping(uint256 => mapping(address => Vote)) public proposalVotes;
    mapping(uint256 => euint8) public encryptedTallies;
    mapping(uint256 => bool) public isTallyFinalized;

    event VoteSubmitted(uint256 proposalId, address voter);
    event TallyDecryptRequested(uint256 proposalId);
    event TallyFinalized(uint256 proposalId, uint256 clearTally);

    function submitEncryptedVote(
        uint256 proposalId,
        externalEuint8 encryptedVote,
        bytes calldata inputProof
    ) external {
        require(!proposalVotes[proposalId][msg.sender].exists, "Already voted");
        require(!isTallyFinalized[proposalId], "Tally finalized");

        // Convert external ciphertext
        euint8 vote = FHE.fromExternal(encryptedVote, inputProof);

        // Allow homomorphic operations
        FHE.allowThis(vote);
        FHE.allow(vote, msg.sender);

        proposalVotes[proposalId][msg.sender] = Vote({
            exists: true,
            encryptedVote: vote
        });

        // Homomorphic addition
        if (FHE.isInitialized(encryptedTallies[proposalId])) {
            encryptedTallies[proposalId] = FHE.add(encryptedTallies[proposalId], vote);
        } else {
            encryptedTallies[proposalId] = vote;
        }

        emit VoteSubmitted(proposalId, msg.sender);
    }

    // Step 1: Request decryption (mark as publicly decryptable)
    function requestTallyDecryption(uint256 proposalId) external {
        require(FHE.isInitialized(encryptedTallies[proposalId]), "No votes yet");
        require(!isTallyFinalized[proposalId], "Tally already finalized");

        FHE.makePubliclyDecryptable(encryptedTallies[proposalId]);

        emit TallyDecryptRequested(proposalId);
    }
}



// pragma solidity ^0.8.24;

// import { FHE, euint8, externalEuint8 } from "@fhevm/solidity/lib/FHE.sol";
// import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

// /// @title Confidential Voting Contract with FHEVM
// /// @author Izzy
// /// @notice This contract allows users to submit encrypted votes and compute encrypted tallies using FHEVM.
// /// @dev All votes are homomorphically added on-chain. Decryption is only possible off-chain with proper permissions.
// contract ConfidentialVoting is ZamaEthereumConfig {
//     /// @dev Represents an individual vote
//     struct Vote {
//         bool exists;          // Whether the voter has already voted
//         euint8 encryptedVote; // The encrypted vote value
//     }

//     /// @notice Mapping of proposalId => voter => Vote
//     mapping(uint256 => mapping(address => Vote)) public proposalVotes;

//     /// @notice Mapping of proposalId => encrypted tally
//     mapping(uint256 => euint8) public encryptedTallies;

//     /// @notice Emitted when a vote is submitted
//     event VoteSubmitted(uint256 proposalId, address voter);

//     /// @notice Submit an encrypted vote for a proposal
//     /// @param proposalId The ID of the proposal being voted on
//     /// @param inputEncryptedVote The encrypted vote submitted off-chain
//     /// @param inputProof Zero-knowledge proof validating the encrypted vote
//     /// @dev Only allows one vote per address per proposal. Vote is added homomorphically to the tally.
//     function submitEncryptedVote(
//         uint256 proposalId,
//         externalEuint8 inputEncryptedVote,
//         bytes calldata inputProof
//     ) external {
//         require(!proposalVotes[proposalId][msg.sender].exists, "Already voted");

//         // Convert external encrypted vote into internal FHE type
//         euint8 vote = FHE.fromExternal(inputEncryptedVote, inputProof);

//         // Grant permissions for off-chain decryption
//         FHE.allowThis(vote);
//         FHE.allow(vote, msg.sender);

//         // Record the vote
//         proposalVotes[proposalId][msg.sender] = Vote({
//             exists: true,
//             encryptedVote: vote
//         });

//         // Homomorphic addition to tally
//         if (FHE.isInitialized(encryptedTallies[proposalId])) {
//             encryptedTallies[proposalId] = FHE.add(encryptedTallies[proposalId], vote);
//         } else {
//             encryptedTallies[proposalId] = vote;
//         }

//         emit VoteSubmitted(proposalId, msg.sender);
//     }

//     /// @notice Get the encrypted tally for a proposal, only authorized callers can decrypt
//     /// @param proposalId The ID of the proposal
//     /// @param outputProof Zero-knowledge proof proving the caller is authorized to decrypt
//     /// @return A sealed string representation of the encrypted tally
//     /// @dev Requires the caller to provide a valid ZK proof before returning the encrypted tally.
//     function getEncryptedTally(
//         uint256 proposalId,
//         bytes calldata outputProof
//     ) external view returns (string memory) {
//         // Verify that the caller is allowed to decrypt
//         require(
//             FHE.verify(outputProof, encryptedTallies[proposalId], msg.sender),
//             "Unauthorized decryption"
//         );

//         // Return sealed output tied to this contract
//         return FHE.sealoutput(encryptedTallies[proposalId], address(this));
//     }
// }
