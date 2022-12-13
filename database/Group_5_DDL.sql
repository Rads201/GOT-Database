-- phpMyAdmin SQL Dump
-- version 5.2.0-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 19, 2022 at 04:10 AM
-- Server version: 10.6.9-MariaDB-log
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_lirand`
--

-- --------------------------------------------------------

--
-- Table structure for table `battles`
--

CREATE TABLE `battles` (
  `battleID` int(11) NOT NULL,
  `battleName` varchar(225) NOT NULL,
  `regionID` int(11) NOT NULL,
  `winners` set('Baratheon','Stark','Arryn','Lannister','Tyrell','Greyjoy','Tully','Martell','Umber','Karstark') NOT NULL,
  `losers` set('Baratheon','Stark','Arryn','Lannister','Tyrell','Greyjoy','Tully','Martell','Umber','Karstark') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `battles`
--

INSERT INTO `battles` (`battleID`, `battleName`, `regionID`, `winners`, `losers`) VALUES
(1, 'Battle of the Blackwater', 6, 'Lannister,Tyrell', 'Baratheon'),
(3, 'Battle of the Whispering Wood', 3, 'Stark,Umber,Karstark', 'Lannister');

-- --------------------------------------------------------

--
-- Table structure for table `houses`
--

CREATE TABLE `houses` (
  `houseID` int(11) NOT NULL,
  `houseName` varchar(225) NOT NULL,
  `houseLord` varchar(225) NOT NULL,
  `armySize` int(11) DEFAULT NULL,
  `wealth` int(11) DEFAULT NULL,
  `regionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `houses`
--

INSERT INTO `houses` (`houseID`, `houseName`, `houseLord`, `armySize`, `wealth`, `regionID`) VALUES
(1, 'Stark', 'Robb Stark', 10000, 1000000, 1),
(2, 'Arryn', 'Lysa Arryn', 8000, 800000, 4),
(3, 'Lannister', 'Tywin Lannister', 12000, 4000000, 5),
(4, 'Tyrell', 'Mace Tyrell', 15000, 2000000, 7),
(5, 'Baratheon', 'Stannis Baratheon', 12000, 1200000, 8),
(6, 'Umber', 'Jon Umber', 5000, 300000, 1),
(7, 'Karstark', 'Rickard Karstark', 7000, 500000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `houses_battles`
--

CREATE TABLE `houses_battles` (
  `houseID` int(11) NOT NULL,
  `battleID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `houses_battles`
--

INSERT INTO `houses_battles` (`houseID`, `battleID`) VALUES
(5, 1),
(3, 1),
(4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `regionID` int(11) NOT NULL,
  `regionName` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`regionID`, `regionName`) VALUES
(1, 'The North'),
(2, 'The Iron Islands'),
(3, 'The Riverlands'),
(4, 'The Vale'),
(5, 'The Westerlands'),
(6, 'The Crownlands'),
(7, 'The Reach'),
(8, 'The Stormlands'),
(9, 'Dorne');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subjectID` int(11) NOT NULL,
  `subjectName` varchar(225) NOT NULL,
  `occupation` varchar(225) NOT NULL,
  `houseID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subjectID`, `subjectName`, `occupation`, `houseID`) VALUES
(1, 'Gilbert', 'mason', 1),
(2, 'Adame', 'farmer', 4),
(3, 'Ellyn', 'cook', 3),
(4, 'Matild', 'tanner', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `battles`
--
ALTER TABLE `battles`
  ADD PRIMARY KEY (`battleID`),
  ADD UNIQUE KEY `battleID` (`battleID`),
  ADD UNIQUE KEY `battleName` (`battleName`),
  ADD KEY `regionID` (`regionID`);

--
-- Indexes for table `houses`
--
ALTER TABLE `houses`
  ADD PRIMARY KEY (`houseID`),
  ADD UNIQUE KEY `houseID` (`houseID`),
  ADD KEY `regionID` (`regionID`);

--
-- Indexes for table `houses_battles`
--
ALTER TABLE `houses_battles`
  ADD KEY `houseID` (`houseID`),
  ADD KEY `battleID` (`battleID`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`regionID`),
  ADD UNIQUE KEY `regionID` (`regionID`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subjectID`),
  ADD UNIQUE KEY `subjectID` (`subjectID`),
  ADD KEY `houseID` (`houseID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `battles`
--
ALTER TABLE `battles`
  MODIFY `battleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `houses`
--
ALTER TABLE `houses`
  MODIFY `houseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `regionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `battles`
--
ALTER TABLE `battles`
  ADD CONSTRAINT `battles_ibfk_1` FOREIGN KEY (`regionID`) REFERENCES `regions` (`regionID`);

--
-- Constraints for table `houses`
--
ALTER TABLE `houses`
  ADD CONSTRAINT `houses_ibfk_1` FOREIGN KEY (`regionID`) REFERENCES `regions` (`regionID`);

--
-- Constraints for table `houses_battles`
--
ALTER TABLE `houses_battles`
  ADD CONSTRAINT `houses_battles_ibfk_1` FOREIGN KEY (`houseID`) REFERENCES `houses` (`houseID`) ON DELETE CASCADE,
  ADD CONSTRAINT `houses_battles_ibfk_2` FOREIGN KEY (`battleID`) REFERENCES `battles` (`battleID`);

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`houseID`) REFERENCES `houses` (`houseID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
