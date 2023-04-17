// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {Course, CourseUnit, UnitLesson} from "./CourseBlockStructs.sol";

contract CourseBlock is ERC721, ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    mapping (uint256=>Course) private NftCoursesDetails;

    constructor() ERC721("CourseBlock", "CBK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        // createMockupCourse(msg.sender);
    }

    // Crear curso de prueba
    /* function createMockupCourse(address user) private {
        UnitLesson memory lesson1 = UnitLesson("Lesson 1", "Lesson 1 Description", "ARTICLE", "Lesson 1 IPFS address");
        UnitLesson memory lesson2 = UnitLesson("Lesson 2", "Lesson 2 Description", "ARTICLE", "Lesson 2 IPFS address");
        UnitLesson[] memory unit1Lessons = new UnitLesson[](2);
        unit1Lessons[0] = lesson1;
        unit1Lessons[1] = lesson2;
        CourseUnit memory unit1 = CourseUnit("Unit 1", "Unit 1 Description", block.timestamp, unit1Lessons);
        UnitLesson memory lesson3 = UnitLesson("Lesson 1", "Lesson 1 Description", "ARTICLE", "Lesson 1 IPFS address");
        UnitLesson memory lesson4 = UnitLesson("Lesson 2", "Lesson 2 Description", "ARTICLE", "Lesson 2 IPFS address");
        UnitLesson[] memory unit2Lessons = new UnitLesson[](2);
        unit2Lessons[0] = lesson3;
        unit2Lessons[1] = lesson4;
        CourseUnit memory unit2 = CourseUnit("Unit 2", "Unit 2 Description", block.timestamp, unit2Lessons);
        CourseUnit[] memory courseUnits = new CourseUnit[](2);
        courseUnits[0] = unit1;
        courseUnits[1] = unit2;
        Course memory mockupCourse = Course("Course Title", block.timestamp, 100, courseUnits);
        createCourseToken(user, mockupCourse);
    } */

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
    function createCourseToken(address user, uint256 courseTokenId) public view returns(Course memory) {
        require(_isApprovedOrOwner(user, courseTokenId), 'El usuario no tiene acceso al curso');
        return NftCoursesDetails[courseTokenId];
    }

    // Obtener cursos
    function getAllMyCourses(address owner) public view returns (uint256[] memory) {
        uint tokenCount = balanceOf(owner);

        uint256[] memory ownedTokens = new uint256[](tokenCount);
        for (uint i = 0; i < tokenCount; i++) {
            ownedTokens[i] = tokenOfOwnerByIndex(owner, i);
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