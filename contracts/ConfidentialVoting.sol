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
   // event TallyFinalized(uint256 proposalId, uint256 clearTally);

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
       // FHE.allow(vote, msg.sender);

        proposalVotes[proposalId][msg.sender] = Vote({
            exists: true,
            encryptedVote: vote
        });

        // Homomorphic addition
        if (FHE.isInitialized(encryptedTallies[proposalId])) {
            euint8 newTally = FHE.add(encryptedTallies[proposalId], vote);
            FHE.allowThis(newTally);
            encryptedTallies[proposalId] = vote;
            //encryptedTallies[proposalId] = FHE.add(encryptedTallies[proposalId], vote);
        } else {
            encryptedTallies[proposalId] = vote;
            FHE.allowThis(encryptedTallies[proposalId]);
        }

        emit VoteSubmitted(proposalId, msg.sender);
    }

    // Step 1: Request decryption (mark as publicly decryptable)
    function requestTallyDecryption(uint256 proposalId) external {
        require(FHE.isInitialized(encryptedTallies[proposalId]), "No votes yet");
        require(!isTallyFinalized[proposalId], "Tally already finalized");

        FHE.makePubliclyDecryptable(encryptedTallies[proposalId]);

        // freeze state
        isTallyFinalized[proposalId] = true;

        emit TallyDecryptRequested(proposalId);
    }
}