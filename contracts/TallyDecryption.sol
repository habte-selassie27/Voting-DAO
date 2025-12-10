// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {euint8, FHE} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract TallyDecryption is ZamaEthereumConfig {
    mapping(uint256 => bool) public isFinalized;
    mapping(uint256 => uint256) public clearTallies;

    event TallyFinalized(uint256 proposalId, uint256 clearTally);

    // Step 3: Finalize after off-chain decryption
    function finalizeTally(
        uint256 proposalId,
        uint256 clearTally,
        bytes memory decryptionProof,
        euint8 encryptedTally
    ) external {
        require(!isFinalized[proposalId], "Tally already finalized");

        // Verify proof from Zama Relayer
        bytes32[] memory handles = new bytes32[](1);
        handles[0] = FHE.toBytes32(encryptedTally);

        // ABI encode the clear value
        bytes memory abiClear = abi.encode(clearTally);

        FHE.checkSignatures(handles, abiClear, decryptionProof);

        // Store clear tally
        clearTallies[proposalId] = clearTally;
        isFinalized[proposalId] = true;

        emit TallyFinalized(proposalId, clearTally);
    }
}
