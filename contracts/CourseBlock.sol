// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CourseBlock is ERC721, ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    // Estructura para almacenar el detalle de los cursos
    struct Course {
        string title;
        string description;
        uint price;
        string content;
        uint creationDate;
    }
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    mapping (uint256=>Course) private NftCoursesDetails;

    constructor() ERC721("CourseBlock", "CBK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // Permitir añadir usuarios al rol de MINTER
    function grantMinterRole(address _address) public {
     _grantRole(MINTER_ROLE, _address);
    }

    // Permitir únicamente a los usuarios con el rol de MINTER crear los NFTs de los cursos
    function safeMint(address to) private onlyRole(MINTER_ROLE) returns(uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }

    // Crear curso
    function createCourseToken(address courseOwner, Course memory course) public {
        uint256 courseNftId = safeMint(courseOwner);
        NftCoursesDetails[courseNftId] = course;
    }

    // Obtener dellate del curso
    function getCourseDetail(address user, uint256 courseTokenId) public view returns(Course memory) {
        require(_isApprovedOrOwner(user, courseTokenId), 'El usuario no tiene acceso al curso');
        return NftCoursesDetails[courseTokenId];
    }

    // Obtener cursos
    function getAllMyCourses(address owner) public view returns (Course[] memory) {
        uint tokenCount = balanceOf(owner);
        Course[] memory ownedTokens = new Course[](tokenCount);
        for (uint i = 0; i < tokenCount; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            ownedTokens[i] = getCourseDetail(owner, tokenId);
        }
        return ownedTokens;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}