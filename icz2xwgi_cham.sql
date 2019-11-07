-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2019 at 06:09 PM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `icz2xwgi_cham`
--

-- --------------------------------------------------------

--
-- Table structure for table `20k_ww_elite`
--

CREATE TABLE IF NOT EXISTS `20k_ww_elite` (
`id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `gender` varchar(30) NOT NULL,
  `country` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `seek` varchar(255) NOT NULL,
  `ages` varchar(5) NOT NULL,
  `seek_where` varchar(255) NOT NULL,
  `PrimaryInterest` varchar(255) NOT NULL,
  `SecondaryInterests` varchar(255) NOT NULL,
  `RelationshipStatus` varchar(255) NOT NULL,
  `Height` varchar(255) NOT NULL,
  `Weight` varchar(255) NOT NULL,
  `Sexuality` varchar(255) NOT NULL,
  `Ethnicity` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `WantToMeet` text NOT NULL,
  `photos` smallint(6) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=411129 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `admin_login`
--

CREATE TABLE IF NOT EXISTS `admin_login` (
`id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `success` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N'
) ENGINE=MyISAM AUTO_INCREMENT=649 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_replier`
--

CREATE TABLE IF NOT EXISTS `admin_replier` (
`id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_cars`
--

CREATE TABLE IF NOT EXISTS `adv_cars` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `price` decimal(13,2) NOT NULL DEFAULT '0.00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_casting`
--

CREATE TABLE IF NOT EXISTS `adv_casting` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `age` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_cats`
--

CREATE TABLE IF NOT EXISTS `adv_cats` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `eng` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `rank` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_film`
--

CREATE TABLE IF NOT EXISTS `adv_film` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_housting`
--

CREATE TABLE IF NOT EXISTS `adv_housting` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `rent` decimal(13,2) NOT NULL DEFAULT '0.00',
  `br` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_images`
--

CREATE TABLE IF NOT EXISTS `adv_images` (
`id` bigint(20) NOT NULL,
  `adv_cat_id` bigint(20) NOT NULL DEFAULT '0',
  `adv_id` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_items`
--

CREATE TABLE IF NOT EXISTS `adv_items` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_jobs`
--

CREATE TABLE IF NOT EXISTS `adv_jobs` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `telecommute` tinyint(4) NOT NULL DEFAULT '0',
  `contract` tinyint(4) NOT NULL DEFAULT '0',
  `internship` tinyint(4) NOT NULL DEFAULT '0',
  `part_time` tinyint(4) NOT NULL DEFAULT '0',
  `non_profit` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_music`
--

CREATE TABLE IF NOT EXISTS `adv_music` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_myspace`
--

CREATE TABLE IF NOT EXISTS `adv_myspace` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `age` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_personals`
--

CREATE TABLE IF NOT EXISTS `adv_personals` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `age` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_razd`
--

CREATE TABLE IF NOT EXISTS `adv_razd` (
`id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `cat_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=128 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_sale`
--

CREATE TABLE IF NOT EXISTS `adv_sale` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `price` decimal(13,2) NOT NULL DEFAULT '0.00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adv_services`
--

CREATE TABLE IF NOT EXISTS `adv_services` (
`id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `razd_id` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cat_id` int(11) NOT NULL DEFAULT '0',
  `price` decimal(13,2) NOT NULL DEFAULT '0.00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audio_greeting`
--

CREATE TABLE IF NOT EXISTS `audio_greeting` (
  `user_id` bigint(20) NOT NULL,
  `hash` varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audio_invite`
--

CREATE TABLE IF NOT EXISTS `audio_invite` (
`id` int(11) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=830 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audio_reject`
--

CREATE TABLE IF NOT EXISTS `audio_reject` (
`id` int(11) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `go` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y'
) ENGINE=MyISAM AUTO_INCREMENT=340 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aux_embed_vids`
--

CREATE TABLE IF NOT EXISTS `aux_embed_vids` (
  `id` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `info` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE IF NOT EXISTS `banners` (
`id` int(5) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `place` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `type` enum('flash','graph','code') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'flash',
  `filename` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `alt` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `url` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` text COLLATE utf8_unicode_ci NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `langs` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `active` enum('1','0') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `templates` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners_places`
--

CREATE TABLE IF NOT EXISTS `banners_places` (
`id` int(5) NOT NULL,
  `place` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `type` enum('static','random') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'static',
  `active` enum('1','0') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs_comment`
--

CREATE TABLE IF NOT EXISTS `blogs_comment` (
`id` int(11) unsigned NOT NULL,
  `post_id` int(11) unsigned NOT NULL DEFAULT '0',
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `dt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM AUTO_INCREMENT=487 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs_hotsearch`
--

CREATE TABLE IF NOT EXISTS `blogs_hotsearch` (
`id` int(11) unsigned NOT NULL,
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `count` int(11) unsigned NOT NULL DEFAULT '0',
  `dt` datetime NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=4822 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs_post`
--

CREATE TABLE IF NOT EXISTS `blogs_post` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `dt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `count_comments` int(11) unsigned NOT NULL DEFAULT '0',
  `count_views` int(11) unsigned NOT NULL DEFAULT '0',
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `search_index` text COLLATE utf8_unicode_ci NOT NULL,
  `images` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=15472 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs_subscribe`
--

CREATE TABLE IF NOT EXISTS `blogs_subscribe` (
`id` int(11) unsigned NOT NULL,
  `subscriber_user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `blogger_user_id` int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_chair`
--

CREATE TABLE IF NOT EXISTS `chat_chair` (
`id` int(11) NOT NULL,
  `position` tinyint(4) NOT NULL DEFAULT '0',
  `joined` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `avatar` smallint(6) NOT NULL DEFAULT '0',
  `nick` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `lastbreath` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `bot` tinyint(4) NOT NULL DEFAULT '0',
  `asked` int(11) NOT NULL DEFAULT '0',
  `room` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_line`
--

CREATE TABLE IF NOT EXISTS `chat_line` (
`id` int(11) NOT NULL,
  `nick` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `fingerprint` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `line` varchar(150) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `timesaid` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `suborder` tinyint(4) NOT NULL DEFAULT '1',
  `room` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_room`
--

CREATE TABLE IF NOT EXISTS `chat_room` (
`id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `tag` varchar(60) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `password` varchar(60) CHARACTER SET utf8 NOT NULL DEFAULT '''''',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `position` int(5) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_avatar_face`
--

CREATE TABLE IF NOT EXISTS `city_avatar_face` (
`id` int(11) unsigned NOT NULL,
  `photo_id` int(11) unsigned NOT NULL DEFAULT '0',
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `head_color` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `params` text COLLATE utf8_unicode_ci NOT NULL,
  `hash` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_avatar_face_default`
--

CREATE TABLE IF NOT EXISTS `city_avatar_face_default` (
`id` int(5) NOT NULL,
  `gender` enum('M','F') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'M',
  `head_color` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `position` int(5) NOT NULL DEFAULT '0',
  `hash` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_custom_data`
--

CREATE TABLE IF NOT EXISTS `city_custom_data` (
`data_id` bigint(20) unsigned NOT NULL,
  `location` tinyint(4) NOT NULL DEFAULT '0',
  `pos_map` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `uid` bigint(20) NOT NULL DEFAULT '0',
  `counter` bigint(20) unsigned NOT NULL DEFAULT '0',
  `data` longtext COLLATE utf8_unicode_ci NOT NULL,
  `created` bigint(20) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_invite`
--

CREATE TABLE IF NOT EXISTS `city_invite` (
`id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL DEFAULT '0',
  `to_user` int(11) NOT NULL DEFAULT '0',
  `data` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_link`
--

CREATE TABLE IF NOT EXISTS `city_link` (
`id` bigint(20) unsigned NOT NULL,
  `hash` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `location` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `pos_map` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `platform` smallint(6) NOT NULL DEFAULT '0',
  `water_loc` smallint(6) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `temp` tinyint(1) NOT NULL DEFAULT '0',
  `system` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_moving`
--

CREATE TABLE IF NOT EXISTS `city_moving` (
`step` bigint(20) unsigned NOT NULL,
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `location` tinyint(4) NOT NULL DEFAULT '0',
  `move` longtext COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_msg`
--

CREATE TABLE IF NOT EXISTS `city_msg` (
`id` bigint(20) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `room` tinyint(4) NOT NULL DEFAULT '0',
  `send` bigint(20) unsigned NOT NULL DEFAULT '0',
  `born` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `msg` text COLLATE utf8_unicode_ci NOT NULL,
  `is_new` tinyint(1) NOT NULL DEFAULT '1',
  `from_user_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `to_user_deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_msg_backup`
--

CREATE TABLE IF NOT EXISTS `city_msg_backup` (
`id` bigint(20) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `room` tinyint(4) NOT NULL DEFAULT '0',
  `born` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `msg` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_open`
--

CREATE TABLE IF NOT EXISTS `city_open` (
`id` int(11) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `last_visit` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `room` tinyint(4) NOT NULL DEFAULT '0',
  `mid` int(11) unsigned NOT NULL DEFAULT '0',
  `z` int(11) unsigned NOT NULL DEFAULT '0',
  `session` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `session_date` datetime NOT NULL,
  `last_writing` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_photo`
--

CREATE TABLE IF NOT EXISTS `city_photo` (
`photo_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `photo_name` varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `visible` enum('Y','N','P','Nudity') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `default` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `private` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `votes` int(11) NOT NULL DEFAULT '0',
  `rating` int(11) NOT NULL DEFAULT '0',
  `average` float NOT NULL DEFAULT '0',
  `wall_id` bigint(20) NOT NULL,
  `published` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `users_reports` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_reject`
--

CREATE TABLE IF NOT EXISTS `city_reject` (
`id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL DEFAULT '0',
  `to_user` int(11) NOT NULL DEFAULT '0',
  `data` text COLLATE utf8_unicode_ci NOT NULL,
  `go` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_rooms`
--

CREATE TABLE IF NOT EXISTS `city_rooms` (
`id` int(11) NOT NULL,
  `name` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `video` tinyint(1) NOT NULL DEFAULT '0',
  `position` int(11) NOT NULL,
  `game` tinyint(1) NOT NULL DEFAULT '0',
  `hide` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_temp`
--

CREATE TABLE IF NOT EXISTS `city_temp` (
`id` bigint(20) unsigned NOT NULL,
  `params` longtext COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_users`
--

CREATE TABLE IF NOT EXISTS `city_users` (
`id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `location` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `face` int(11) NOT NULL DEFAULT '1',
  `default` tinyint(1) NOT NULL DEFAULT '1',
  `cap` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pos` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pos_map` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `platform` smallint(6) NOT NULL DEFAULT '0',
  `water_loc` smallint(6) NOT NULL DEFAULT '0',
  `rot` smallint(6) NOT NULL DEFAULT '0',
  `floor` smallint(6) NOT NULL DEFAULT '1',
  `last_visit` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `demo_last_step` bigint(20) NOT NULL DEFAULT '0',
  `sound` tinyint(1) NOT NULL DEFAULT '1',
  `gender` enum('M','F','') COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `city` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `hash` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `not_open_chats` text COLLATE utf8_unicode_ci NOT NULL,
  `invite` tinyint(1) NOT NULL DEFAULT '0',
  `demo` tinyint(1) NOT NULL DEFAULT '0',
  `manager` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_users_in_rooms`
--

CREATE TABLE IF NOT EXISTS `city_users_in_rooms` (
`id` bigint(20) unsigned NOT NULL,
  `cuid` bigint(20) unsigned NOT NULL DEFAULT '0',
  `location` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `pos` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pos_map` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `platform` smallint(6) NOT NULL DEFAULT '0',
  `water_loc` smallint(6) NOT NULL DEFAULT '0',
  `house` smallint(6) NOT NULL DEFAULT '1',
  `rot` smallint(6) NOT NULL DEFAULT '0',
  `floor` smallint(6) NOT NULL DEFAULT '1',
  `last_visit` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `demo_last_step` bigint(20) NOT NULL DEFAULT '0',
  `manager` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `col_order`
--

CREATE TABLE IF NOT EXISTS `col_order` (
`id` int(11) NOT NULL,
  `name` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `section` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `status` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y',
  `additional` tinyint(1) NOT NULL DEFAULT '0',
  `position` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=163 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE IF NOT EXISTS `config` (
`id` int(11) NOT NULL,
  `module` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `option` text COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL,
  `show_in_admin` tinyint(1) NOT NULL,
  `type` enum('text','checkbox','selectbox','password','separator','radio','textarea','section','color','file','label','select_multiple','number') COLLATE utf8_unicode_ci NOT NULL,
  `options` text COLLATE utf8_unicode_ci NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=1211 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `const_horoscope`
--

CREATE TABLE IF NOT EXISTS `const_horoscope` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `const_interests`
--

CREATE TABLE IF NOT EXISTS `const_interests` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `const_i_am_here_to`
--

CREATE TABLE IF NOT EXISTS `const_i_am_here_to` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `const_looking`
--

CREATE TABLE IF NOT EXISTS `const_looking` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `search` int(11) NOT NULL DEFAULT '0',
  `gender` enum('B','M','F') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'B',
  `free` enum('none','silver','gold','platinum') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'none'
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `const_orientation`
--

CREATE TABLE IF NOT EXISTS `const_orientation` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `search` int(11) NOT NULL DEFAULT '0',
  `gender` enum('M','F') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'M',
  `free` enum('none','silver','gold','platinum','super') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'none',
  `default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `const_relation`
--

CREATE TABLE IF NOT EXISTS `const_relation` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE IF NOT EXISTS `contact` (
`id` int(11) NOT NULL,
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `mail` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `comment` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=132 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_partner`
--

CREATE TABLE IF NOT EXISTS `contact_partner` (
`id` int(11) NOT NULL,
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `company` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `real_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `phone` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `mail` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `comment` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE IF NOT EXISTS `email` (
`id` int(11) unsigned NOT NULL,
  `mail` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=21369 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_auto`
--

CREATE TABLE IF NOT EXISTS `email_auto` (
`id` int(11) NOT NULL,
  `note` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `header` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `button` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_auto_settings`
--

CREATE TABLE IF NOT EXISTS `email_auto_settings` (
`id` int(11) NOT NULL,
  `option` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_queue`
--

CREATE TABLE IF NOT EXISTS `email_queue` (
`id` bigint(20) NOT NULL,
  `from` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `to` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `subject` text COLLATE utf8_unicode_ci NOT NULL,
  `message` text COLLATE utf8_unicode_ci NOT NULL,
  `added_at` datetime NOT NULL,
  `sending_time` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `encounters`
--

CREATE TABLE IF NOT EXISTS `encounters` (
`id` bigint(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `from_reply` enum('P','Y','N','M') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'P',
  `to_reply` enum('P','Y','N','M') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'P',
  `new` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y',
  `new_to` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y'
) ENGINE=MyISAM AUTO_INCREMENT=79680 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_category`
--

CREATE TABLE IF NOT EXISTS `events_category` (
`category_id` bigint(20) NOT NULL,
  `category_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_event`
--

CREATE TABLE IF NOT EXISTS `events_event` (
`event_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `event_private` tinyint(4) NOT NULL DEFAULT '0',
  `category_id` bigint(20) NOT NULL,
  `event_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `event_description` text COLLATE utf8_unicode_ci,
  `city_id` bigint(20) NOT NULL,
  `event_datetime` datetime NOT NULL,
  `event_address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `event_place` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `event_site` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `event_phone` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `event_n_comments` bigint(20) NOT NULL DEFAULT '0',
  `event_n_guests` bigint(20) NOT NULL DEFAULT '0',
  `event_has_images` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_event_comment`
--

CREATE TABLE IF NOT EXISTS `events_event_comment` (
`comment_id` bigint(20) NOT NULL,
  `event_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_event_comment_comment`
--

CREATE TABLE IF NOT EXISTS `events_event_comment_comment` (
`comment_id` bigint(20) NOT NULL,
  `parent_comment_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_event_guest`
--

CREATE TABLE IF NOT EXISTS `events_event_guest` (
`guest_id` bigint(20) NOT NULL,
  `event_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `guest_n_friends` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_event_image`
--

CREATE TABLE IF NOT EXISTS `events_event_image` (
`image_id` bigint(20) NOT NULL,
  `event_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_setting`
--

CREATE TABLE IF NOT EXISTS `events_setting` (
`setting_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flashchat_messages`
--

CREATE TABLE IF NOT EXISTS `flashchat_messages` (
`id` int(10) unsigned NOT NULL,
  `time` int(11) NOT NULL DEFAULT '0',
  `status` enum('system','mess') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'mess',
  `msgtext` text COLLATE utf8_unicode_ci NOT NULL,
  `user` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `room` int(5) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `send` bigint(20) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=3357 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flashchat_rooms`
--

CREATE TABLE IF NOT EXISTS `flashchat_rooms` (
`id` int(5) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `position` int(5) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flashchat_users`
--

CREATE TABLE IF NOT EXISTS `flashchat_users` (
`id` int(5) unsigned NOT NULL,
  `login` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `mess_color` varchar(6) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `time_out` int(11) NOT NULL DEFAULT '0',
  `status` int(3) NOT NULL DEFAULT '0',
  `sys_color` varchar(6) COLLATE utf8_unicode_ci NOT NULL DEFAULT '000099',
  `room` int(11) NOT NULL DEFAULT '0',
  `gender` enum('m','f') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'm',
  `user_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=821 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_category`
--

CREATE TABLE IF NOT EXISTS `forum_category` (
`id` bigint(20) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sort_rank` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_forum`
--

CREATE TABLE IF NOT EXISTS `forum_forum` (
`id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL DEFAULT '0',
  `parent_forum_id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `n_topics` bigint(20) NOT NULL DEFAULT '0',
  `n_messages` bigint(20) NOT NULL DEFAULT '0',
  `sort_rank` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_message`
--

CREATE TABLE IF NOT EXISTS `forum_message` (
`id` bigint(20) NOT NULL,
  `topic_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_read_marker`
--

CREATE TABLE IF NOT EXISTS `forum_read_marker` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `forum_id` bigint(20) NOT NULL DEFAULT '0',
  `topics_read` text COLLATE utf8_unicode_ci,
  `read_until` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_setting`
--

CREATE TABLE IF NOT EXISTS `forum_setting` (
`setting_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `sort_by` enum('last_post','thread','thread_starter','replies','views') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'last_post',
  `sort_by_dir` enum('asc','desc') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'desc'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_topic`
--

CREATE TABLE IF NOT EXISTS `forum_topic` (
`id` bigint(20) NOT NULL,
  `forum_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8_unicode_ci,
  `n_messages` bigint(20) NOT NULL DEFAULT '0',
  `n_views` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE IF NOT EXISTS `friends` (
`id` int(10) unsigned NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `fr_user_id` int(11) NOT NULL DEFAULT '0',
  `bookmark` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `visible_bookmark` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `DATA` date NOT NULL DEFAULT '0000-00-00',
  `featured` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friends_requests`
--

CREATE TABLE IF NOT EXISTS `friends_requests` (
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `friend_id` bigint(20) NOT NULL DEFAULT '0',
  `message` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `accepted` tinyint(1) NOT NULL DEFAULT '0',
  `featured` bigint(20) NOT NULL DEFAULT '0',
  `friend_featured` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `activity` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_albums`
--

CREATE TABLE IF NOT EXISTS `gallery_albums` (
`id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `parentid` int(11) unsigned DEFAULT NULL,
  `folder` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `desc` text COLLATE utf8_unicode_ci,
  `date` datetime DEFAULT NULL,
  `place` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `show` int(1) unsigned NOT NULL DEFAULT '1',
  `thumb` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sort_type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sort_order` int(11) unsigned DEFAULT NULL,
  `views` int(11) unsigned DEFAULT '0',
  `access` enum('public','friends','private') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'public'
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_comments`
--

CREATE TABLE IF NOT EXISTS `gallery_comments` (
`id` int(11) unsigned NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `imageid` int(11) unsigned NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `website` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `comment` text COLLATE utf8_unicode_ci NOT NULL,
  `inmoderation` int(1) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE IF NOT EXISTS `gallery_images` (
`id` int(11) unsigned NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `albumid` int(11) unsigned NOT NULL DEFAULT '0',
  `filename` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `desc` text COLLATE utf8_unicode_ci,
  `commentson` int(1) NOT NULL DEFAULT '1',
  `show` int(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) unsigned DEFAULT NULL,
  `height` int(10) unsigned DEFAULT NULL,
  `width` int(10) unsigned DEFAULT NULL,
  `datetime` datetime NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=76 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_chess`
--

CREATE TABLE IF NOT EXISTS `game_chess` (
`id` int(10) NOT NULL,
  `login` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `enemy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ingame` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `time_in` bigint(11) DEFAULT NULL,
  `active` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `hod_data` text COLLATE utf8_unicode_ci,
  `now_hod` enum('login','enemy') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'login'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_invite`
--

CREATE TABLE IF NOT EXISTS `game_invite` (
`id` int(11) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `game` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_morboy`
--

CREATE TABLE IF NOT EXISTS `game_morboy` (
`id` bigint(20) NOT NULL,
  `login` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `enemy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nowX` smallint(6) DEFAULT NULL,
  `nowY` smallint(6) DEFAULT NULL,
  `ingame` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `time_in` bigint(11) DEFAULT NULL,
  `active` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `massiv` text COLLATE utf8_unicode_ci,
  `popal` varchar(5) COLLATE utf8_unicode_ci DEFAULT NULL,
  `shodil` enum('y','n') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'n',
  `pokazal` enum('y','n') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'n'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_reject`
--

CREATE TABLE IF NOT EXISTS `game_reject` (
`id` int(11) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `game` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `go` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_shashki`
--

CREATE TABLE IF NOT EXISTS `game_shashki` (
`id` bigint(20) NOT NULL,
  `login` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `enemy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nowX` smallint(6) DEFAULT NULL,
  `nowY` smallint(6) DEFAULT NULL,
  `ingame` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `time_in` bigint(11) DEFAULT NULL,
  `active` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `srubil` text COLLATE utf8_unicode_ci,
  `num_shashka` smallint(6) DEFAULT NULL,
  `damka` enum('true','false') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `geo_city`
--

CREATE TABLE IF NOT EXISTS `geo_city` (
`city_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL DEFAULT '0',
  `country_id` int(11) NOT NULL DEFAULT '0',
  `city_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `lat` bigint(20) NOT NULL,
  `long` bigint(20) NOT NULL,
  `pop` int(10) unsigned NOT NULL,
  `hidden` tinyint(1) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=136736 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `geo_country`
--

CREATE TABLE IF NOT EXISTS `geo_country` (
`country_id` int(11) NOT NULL,
  `country_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` varchar(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `first` int(11) DEFAULT '0',
  `hidden` tinyint(1) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=244 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `geo_state`
--

CREATE TABLE IF NOT EXISTS `geo_state` (
`state_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL DEFAULT '0',
  `state_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` varchar(4) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `hidden` tinyint(1) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=4174 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gifts`
--

CREATE TABLE IF NOT EXISTS `gifts` (
`id` int(5) NOT NULL,
  `sent` int(11) NOT NULL DEFAULT '0',
  `credits` int(11) NOT NULL DEFAULT '0',
  `position` int(5) NOT NULL DEFAULT '0',
  `hash` int(11) NOT NULL DEFAULT '0',
  `set` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=53 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gifts_set`
--

CREATE TABLE IF NOT EXISTS `gifts_set` (
`id` int(5) NOT NULL,
  `alias` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_category`
--

CREATE TABLE IF NOT EXISTS `groups_category` (
`category_id` bigint(20) NOT NULL,
  `category_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_forum`
--

CREATE TABLE IF NOT EXISTS `groups_forum` (
`forum_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `forum_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `forum_description` text COLLATE utf8_unicode_ci,
  `forum_n_comments` bigint(20) NOT NULL DEFAULT '0',
  `forum_n_views` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_forum_comment`
--

CREATE TABLE IF NOT EXISTS `groups_forum_comment` (
`comment_id` bigint(20) NOT NULL,
  `forum_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_forum_comment_comment`
--

CREATE TABLE IF NOT EXISTS `groups_forum_comment_comment` (
`comment_id` bigint(20) NOT NULL,
  `parent_comment_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_group`
--

CREATE TABLE IF NOT EXISTS `groups_group` (
`group_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_private` tinyint(4) NOT NULL DEFAULT '0',
  `category_id` bigint(20) NOT NULL,
  `group_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `group_description` text COLLATE utf8_unicode_ci,
  `group_n_posts` bigint(20) NOT NULL DEFAULT '0',
  `group_n_comments` bigint(20) NOT NULL DEFAULT '0',
  `group_n_members` bigint(20) NOT NULL DEFAULT '0',
  `group_has_images` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_group_comment`
--

CREATE TABLE IF NOT EXISTS `groups_group_comment` (
`comment_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_group_comment_comment`
--

CREATE TABLE IF NOT EXISTS `groups_group_comment_comment` (
`comment_id` bigint(20) NOT NULL,
  `parent_comment_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_group_image`
--

CREATE TABLE IF NOT EXISTS `groups_group_image` (
`image_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_group_member`
--

CREATE TABLE IF NOT EXISTS `groups_group_member` (
`member_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_invite`
--

CREATE TABLE IF NOT EXISTS `groups_invite` (
`invite_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `invite_key` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups_setting`
--

CREATE TABLE IF NOT EXISTS `groups_setting` (
`setting_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `help_answer`
--

CREATE TABLE IF NOT EXISTS `help_answer` (
`id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `help_topic`
--

CREATE TABLE IF NOT EXISTS `help_topic` (
`id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `im_contact_replied`
--

CREATE TABLE IF NOT EXISTS `im_contact_replied` (
  `user_id` bigint(20) NOT NULL,
  `user_to` bigint(20) NOT NULL,
  `replied` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `im_msg`
--

CREATE TABLE IF NOT EXISTS `im_msg` (
`id` bigint(20) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `born` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `msg` text COLLATE utf8_unicode_ci NOT NULL,
  `ip` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `is_new` tinyint(1) NOT NULL DEFAULT '1',
  `system` tinyint(1) NOT NULL DEFAULT '0',
  `system_type` tinyint(1) NOT NULL DEFAULT '0',
  `from_user_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `to_user_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `msg_translation` text COLLATE utf8_unicode_ci NOT NULL,
  `flag` tinyint(1) NOT NULL DEFAULT '0',
  `send` bigint(20) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=34800 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `im_open`
--

CREATE TABLE IF NOT EXISTS `im_open` (
`id` int(11) unsigned NOT NULL,
  `from_user` int(11) unsigned NOT NULL DEFAULT '0',
  `to_user` int(11) unsigned NOT NULL DEFAULT '0',
  `mid` int(11) unsigned NOT NULL DEFAULT '0',
  `im_open_visible` enum('Y','N','C') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'C',
  `is_new_msg` tinyint(1) NOT NULL DEFAULT '0',
  `x` int(11) unsigned NOT NULL DEFAULT '0',
  `y` int(11) unsigned NOT NULL DEFAULT '0',
  `z` int(11) unsigned NOT NULL DEFAULT '0',
  `session` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `session_date` datetime NOT NULL,
  `last_writing` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=31978 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `info`
--

CREATE TABLE IF NOT EXISTS `info` (
  `page` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `title` text COLLATE utf8_unicode_ci NOT NULL,
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE IF NOT EXISTS `interests` (
`id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `interest` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `counter` int(11) NOT NULL,
  `lang` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=1440 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invites`
--

CREATE TABLE IF NOT EXISTS `invites` (
`id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `invite_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ip_block`
--

CREATE TABLE IF NOT EXISTS `ip_block` (
`id` int(11) NOT NULL,
  `ip` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mail_folder`
--

CREATE TABLE IF NOT EXISTS `mail_folder` (
`id` int(11) unsigned NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mail_msg`
--

CREATE TABLE IF NOT EXISTS `mail_msg` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `folder` int(11) NOT NULL DEFAULT '1',
  `new` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y',
  `subject` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `date_sent` int(11) NOT NULL DEFAULT '0',
  `type` enum('plain','postcard') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'plain',
  `sent_id` bigint(20) NOT NULL DEFAULT '0',
  `receiver_read` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text_hash` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `system` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `massmail`
--

CREATE TABLE IF NOT EXISTS `massmail` (
`id` int(11) NOT NULL,
  `subject` text COLLATE utf8_unicode_ci NOT NULL,
  `text` longtext COLLATE utf8_unicode_ci NOT NULL,
  `users` tinyint(1) NOT NULL,
  `other` tinyint(1) NOT NULL,
  `partners` tinyint(1) NOT NULL,
  `languages` text COLLATE utf8_unicode_ci NOT NULL,
  `last_id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `date` int(11) NOT NULL,
  `send_partner` tinyint(1) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_category`
--

CREATE TABLE IF NOT EXISTS `music_category` (
`category_id` bigint(20) NOT NULL,
  `category_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `position` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_musician`
--

CREATE TABLE IF NOT EXISTS `music_musician` (
`musician_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `musician_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `musician_leader` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `musician_about` text COLLATE utf8_unicode_ci NOT NULL,
  `musician_founded` year(4) NOT NULL DEFAULT '0000',
  `country_id` bigint(20) NOT NULL DEFAULT '0',
  `musician_rating` int(11) NOT NULL DEFAULT '0',
  `musician_n_votes` bigint(20) NOT NULL DEFAULT '0',
  `musician_has_images` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_musician_comment`
--

CREATE TABLE IF NOT EXISTS `music_musician_comment` (
`comment_id` bigint(20) NOT NULL,
  `musician_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_musician_image`
--

CREATE TABLE IF NOT EXISTS `music_musician_image` (
`image_id` bigint(20) NOT NULL,
  `musician_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_musician_vote`
--

CREATE TABLE IF NOT EXISTS `music_musician_vote` (
`vote_id` bigint(20) NOT NULL,
  `musician_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `vote_rating` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_setting`
--

CREATE TABLE IF NOT EXISTS `music_setting` (
`setting_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL DEFAULT '0',
  `setting_limit` enum('all','today','week','month') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'all'
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_song`
--

CREATE TABLE IF NOT EXISTS `music_song` (
`song_id` bigint(20) NOT NULL,
  `musician_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `song_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `song_about` text COLLATE utf8_unicode_ci NOT NULL,
  `song_year` year(4) NOT NULL DEFAULT '0000',
  `song_n_plays` bigint(20) NOT NULL DEFAULT '0',
  `song_n_comments` bigint(20) NOT NULL DEFAULT '0',
  `song_rating` int(11) NOT NULL DEFAULT '0',
  `song_length` int(11) NOT NULL DEFAULT '0',
  `song_n_votes` bigint(20) NOT NULL DEFAULT '0',
  `song_has_images` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_song_comment`
--

CREATE TABLE IF NOT EXISTS `music_song_comment` (
`comment_id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `comment_text` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_song_image`
--

CREATE TABLE IF NOT EXISTS `music_song_image` (
`image_id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `music_song_vote`
--

CREATE TABLE IF NOT EXISTS `music_song_vote` (
`vote_id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `vote_rating` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE IF NOT EXISTS `news` (
`id` int(11) NOT NULL,
  `cat` int(11) NOT NULL DEFAULT '0',
  `visible` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `news_short` text COLLATE utf8_unicode_ci NOT NULL,
  `news_long` text COLLATE utf8_unicode_ci NOT NULL,
  `dt` int(11) NOT NULL DEFAULT '0',
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `root` tinyint(1) NOT NULL,
  `root_id` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_cats`
--

CREATE TABLE IF NOT EXISTS `news_cats` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `root` tinyint(1) NOT NULL,
  `root_id` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `object`
--

CREATE TABLE IF NOT EXISTS `object` (
`id` int(11) unsigned NOT NULL,
  `location` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `object_id` int(11) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `button_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `button_url` text COLLATE utf8_unicode_ci NOT NULL,
  `big_image_url` text COLLATE utf8_unicode_ci NOT NULL,
  `image_url` text COLLATE utf8_unicode_ci NOT NULL,
  `video_url` text COLLATE utf8_unicode_ci NOT NULL,
  `size` float NOT NULL DEFAULT '0',
  `pos_x` int(11) NOT NULL DEFAULT '0',
  `pos_y` int(11) NOT NULL DEFAULT '0',
  `pos_z` int(11) NOT NULL DEFAULT '0',
  `rot_x` int(11) NOT NULL DEFAULT '0',
  `rot_y` int(11) NOT NULL DEFAULT '0',
  `rot_z` int(11) NOT NULL DEFAULT '0',
  `rotation_speed` int(11) NOT NULL DEFAULT '0',
  `cursor_rotation` tinyint(1) NOT NULL DEFAULT '1',
  `info_on_hover` tinyint(1) NOT NULL DEFAULT '0',
  `enabled` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `object_type`
--

CREATE TABLE IF NOT EXISTS `object_type` (
`id` int(11) unsigned NOT NULL,
  `texture` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `obj` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `outside_image`
--

CREATE TABLE IF NOT EXISTS `outside_image` (
`image_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `image_n_links` bigint(20) NOT NULL DEFAULT '1',
  `outside_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE IF NOT EXISTS `pages` (
`id` int(11) NOT NULL,
  `menu_title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `menu_style` tinyint(1) NOT NULL DEFAULT '0',
  `title` text COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci NOT NULL,
  `section` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `position` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `hide_from_guests` tinyint(1) NOT NULL DEFAULT '0',
  `parent` int(11) NOT NULL DEFAULT '0',
  `system` tinyint(1) NOT NULL DEFAULT '0',
  `lang` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `set` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=176 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner`
--

CREATE TABLE IF NOT EXISTS `partner` (
`partner_id` int(11) NOT NULL,
  `p_partner` int(11) NOT NULL DEFAULT '0',
  `summary` decimal(7,2) NOT NULL DEFAULT '0.00',
  `account` decimal(7,2) NOT NULL DEFAULT '0.00',
  `payment` decimal(7,2) NOT NULL DEFAULT '0.00',
  `payment_last` decimal(7,2) NOT NULL DEFAULT '0.00',
  `payment_last_date` datetime NOT NULL,
  `count_users` int(11) NOT NULL DEFAULT '0',
  `count_refs` int(11) NOT NULL DEFAULT '0',
  `count_golds` int(11) NOT NULL DEFAULT '0',
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `company` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `domain` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `real_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `mail` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `adress` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `adress2` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `country_id` int(11) NOT NULL DEFAULT '0',
  `state_id` int(11) NOT NULL DEFAULT '0',
  `city_id` int(11) NOT NULL DEFAULT '0',
  `zip` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `tax` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `other` text COLLATE utf8_unicode_ci NOT NULL,
  `bank_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_phone` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_adress1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_adress2` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_city` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_state` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_zip` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_country` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_account` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_aba` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_swift` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank_to` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `paypal` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner_banners`
--

CREATE TABLE IF NOT EXISTS `partner_banners` (
`id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` text COLLATE utf8_unicode_ci NOT NULL,
  `size` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `file` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `langs` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner_faq`
--

CREATE TABLE IF NOT EXISTS `partner_faq` (
`id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner_main`
--

CREATE TABLE IF NOT EXISTS `partner_main` (
`id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner_terms`
--

CREATE TABLE IF NOT EXISTS `partner_terms` (
`id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partner_tips`
--

CREATE TABLE IF NOT EXISTS `partner_tips` (
`id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_after`
--

CREATE TABLE IF NOT EXISTS `payment_after` (
`id` int(11) NOT NULL,
  `dt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `data` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_before`
--

CREATE TABLE IF NOT EXISTS `payment_before` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `dt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `item` int(11) NOT NULL DEFAULT '0',
  `system` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `request_uri` text COLLATE utf8_unicode_ci NOT NULL,
  `subscription_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=1069 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_cat`
--

CREATE TABLE IF NOT EXISTS `payment_cat` (
`id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_features`
--

CREATE TABLE IF NOT EXISTS `payment_features` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `alias` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_log`
--

CREATE TABLE IF NOT EXISTS `payment_log` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `amount` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `system` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `ip` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `referer` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `dt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_plan`
--

CREATE TABLE IF NOT EXISTS `payment_plan` (
`item` int(11) NOT NULL,
  `item_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `amount` decimal(7,2) NOT NULL DEFAULT '0.00',
  `amount_old` decimal(7,2) NOT NULL DEFAULT '0.00',
  `gold_days` int(11) NOT NULL DEFAULT '0',
  `type` enum('none','gold','silver','platinum','membership','credits') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'none',
  `co_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `default` tinyint(1) NOT NULL DEFAULT '0',
  `set` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `payment_modules_off` text COLLATE utf8_unicode_ci NOT NULL,
  `fortumo_service_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fortumo_secret` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `zombaio_pricing_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_price`
--

CREATE TABLE IF NOT EXISTS `payment_price` (
`id` int(11) NOT NULL,
  `title` text COLLATE utf8_unicode_ci NOT NULL,
  `alias` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `credits` int(11) NOT NULL DEFAULT '0',
  `set` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_type`
--

CREATE TABLE IF NOT EXISTS `payment_type` (
  `type` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE IF NOT EXISTS `photo` (
`photo_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `photo_name` varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `visible` enum('Y','N','P','Nudity') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `default` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `private` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `votes` int(11) NOT NULL DEFAULT '0',
  `rating` int(11) NOT NULL DEFAULT '0',
  `average` float NOT NULL DEFAULT '0',
  `wall_id` bigint(20) NOT NULL,
  `published` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `users_reports` text COLLATE utf8_unicode_ci NOT NULL,
  `version` int(11) NOT NULL DEFAULT '0',
  `width` int(11) NOT NULL DEFAULT '0',
  `height` int(11) NOT NULL DEFAULT '0',
  `count_comments` int(11) unsigned NOT NULL DEFAULT '0',
  `count_comments_replies` int(11) unsigned NOT NULL DEFAULT '0',
  `count_comments_all` int(11) unsigned NOT NULL DEFAULT '0',
  `count_views` int(11) unsigned NOT NULL DEFAULT '0',
  `hide_header` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=1087622 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photo_comments`
--

CREATE TABLE IF NOT EXISTS `photo_comments` (
`id` int(11) unsigned NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `photo_id` int(11) unsigned NOT NULL DEFAULT '0',
  `photo_user_id` int(11) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `send` bigint(20) unsigned NOT NULL DEFAULT '0',
  `comment` text COLLATE utf8_unicode_ci NOT NULL,
  `parent_id` int(11) DEFAULT '0',
  `parent_user_id` int(11) DEFAULT '0',
  `replies` int(11) DEFAULT '0',
  `likes` int(11) NOT NULL DEFAULT '0',
  `last_action_like` datetime NOT NULL,
  `system` tinyint(1) NOT NULL DEFAULT '0',
  `is_new` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=3026 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photo_comments_likes`
--

CREATE TABLE IF NOT EXISTS `photo_comments_likes` (
`id` bigint(20) NOT NULL,
  `photo_id` int(11) NOT NULL,
  `photo_user_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `comment_user_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `is_new` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photo_rate`
--

CREATE TABLE IF NOT EXISTS `photo_rate` (
`id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL DEFAULT '0',
  `photo_user_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `rating` tinyint(1) NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `is_new` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=3208 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photo_tags`
--

CREATE TABLE IF NOT EXISTS `photo_tags` (
`id` bigint(20) NOT NULL,
  `tag` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `counter` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photo_tags_relations`
--

CREATE TABLE IF NOT EXISTS `photo_tags_relations` (
`id` bigint(20) NOT NULL,
  `photo_id` int(11) NOT NULL,
  `tag_id` bigint(20) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places_category`
--

CREATE TABLE IF NOT EXISTS `places_category` (
`id` bigint(20) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `position` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places_place`
--

CREATE TABLE IF NOT EXISTS `places_place` (
`id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `phone` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `site` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `about` text COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `city_id` bigint(20) NOT NULL DEFAULT '0',
  `rating` int(11) NOT NULL DEFAULT '0',
  `n_votes` bigint(20) NOT NULL DEFAULT '0',
  `has_images` tinyint(4) NOT NULL DEFAULT '0',
  `n_reviews` bigint(20) NOT NULL DEFAULT '0',
  `reviews_rating` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places_place_image`
--

CREATE TABLE IF NOT EXISTS `places_place_image` (
`id` bigint(20) NOT NULL,
  `place_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places_place_vote`
--

CREATE TABLE IF NOT EXISTS `places_place_vote` (
`id` bigint(20) NOT NULL,
  `place_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `rating` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places_review`
--

CREATE TABLE IF NOT EXISTS `places_review` (
`id` bigint(20) NOT NULL,
  `place_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `n_votes` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places_review_vote`
--

CREATE TABLE IF NOT EXISTS `places_review_vote` (
`id` bigint(20) NOT NULL,
  `review_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile_status`
--

CREATE TABLE IF NOT EXISTS `profile_status` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `status` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `search_save`
--

CREATE TABLE IF NOT EXISTS `search_save` (
`id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `query` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo`
--

CREATE TABLE IF NOT EXISTS `seo` (
`id` int(11) NOT NULL,
  `url` text COLLATE utf8_unicode_ci NOT NULL,
  `title` text COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `keywords` text COLLATE utf8_unicode_ci NOT NULL,
  `lang` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `default` tinyint(1) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `spotlight`
--

CREATE TABLE IF NOT EXISTS `spotlight` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=171 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stats`
--

CREATE TABLE IF NOT EXISTS `stats` (
  `date` date NOT NULL,
  `orientation` smallint(5) unsigned NOT NULL,
  `logins` int(10) unsigned NOT NULL,
  `registrations` int(10) unsigned NOT NULL,
  `mail_messages_sent` int(10) unsigned NOT NULL,
  `postcards_sent` int(10) unsigned NOT NULL,
  `videos_uploaded` int(10) unsigned NOT NULL,
  `videos_viewed` int(10) unsigned NOT NULL,
  `videos_comments` int(10) unsigned NOT NULL,
  `profiles_viewved` int(10) unsigned NOT NULL,
  `3d_city_started` int(10) unsigned NOT NULL,
  `hot_or_not_votes` int(10) unsigned NOT NULL,
  `pics_uploaded` int(10) unsigned NOT NULL,
  `photos_uploaded` int(10) unsigned NOT NULL,
  `added_to_friends` int(10) unsigned NOT NULL,
  `3d_chat_opened` int(10) unsigned NOT NULL,
  `flash_chat_opened` int(10) unsigned NOT NULL,
  `new_blogs` int(10) unsigned NOT NULL,
  `events_created` int(10) unsigned NOT NULL,
  `new_forum_posts` int(10) unsigned NOT NULL,
  `groups_created` int(10) unsigned NOT NULL,
  `winks_sent` int(10) unsigned NOT NULL,
  `gold_memberships` int(10) unsigned NOT NULL,
  `ads_published` int(10) unsigned NOT NULL,
  `replies_to_ads` int(10) unsigned NOT NULL,
  `mp3_uploaded` int(10) unsigned NOT NULL,
  `user_blocks` int(10) unsigned NOT NULL,
  `games_started` int(10) unsigned NOT NULL,
  `im_started` int(10) unsigned NOT NULL,
  `im_messages` int(10) unsigned NOT NULL,
  `added_to_favourites` int(10) unsigned NOT NULL,
  `blog_search_used` int(10) unsigned NOT NULL,
  `user_search_used` int(10) unsigned NOT NULL,
  `gifts_sent` int(10) unsigned NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `texts`
--

CREATE TABLE IF NOT EXISTS `texts` (
`id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `headline` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `essay` text COLLATE utf8_unicode_ci NOT NULL,
  `about_me` text COLLATE utf8_unicode_ci NOT NULL,
  `interested_in` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `update_geo_city_backup`
--

CREATE TABLE IF NOT EXISTS `update_geo_city_backup` (
`city_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL DEFAULT '0',
  `country_id` int(11) NOT NULL DEFAULT '0',
  `city_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `lat` bigint(20) NOT NULL,
  `long` bigint(20) NOT NULL,
  `pop` int(10) unsigned NOT NULL,
  `hidden` tinyint(1) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=136736 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `update_geo_state_backup`
--

CREATE TABLE IF NOT EXISTS `update_geo_state_backup` (
`state_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL DEFAULT '0',
  `state_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` varchar(4) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `hidden` tinyint(1) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=3172 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `update_userinfo_backup`
--

CREATE TABLE IF NOT EXISTS `update_userinfo_backup` (
`user_id` int(11) unsigned NOT NULL,
  `headline` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `essay` text COLLATE utf8_unicode_ci NOT NULL,
  `height` int(11) unsigned NOT NULL DEFAULT '0',
  `weight` int(11) unsigned NOT NULL DEFAULT '0',
  `body` int(11) unsigned NOT NULL DEFAULT '0',
  `drinking` int(11) unsigned NOT NULL DEFAULT '0',
  `ethnicity` int(11) unsigned NOT NULL DEFAULT '0',
  `eye` int(11) unsigned NOT NULL DEFAULT '0',
  `religion` int(11) unsigned NOT NULL DEFAULT '0',
  `family` int(11) unsigned NOT NULL DEFAULT '0',
  `hair` int(11) unsigned NOT NULL DEFAULT '0',
  `income` int(11) unsigned NOT NULL DEFAULT '0',
  `career` int(11) unsigned NOT NULL DEFAULT '0',
  `smoking` int(11) unsigned NOT NULL DEFAULT '0',
  `status` int(11) unsigned NOT NULL DEFAULT '0',
  `age_preference` int(11) unsigned NOT NULL DEFAULT '0',
  `appearance` int(11) unsigned NOT NULL DEFAULT '0',
  `first_date` int(11) unsigned NOT NULL DEFAULT '0',
  `humor` int(11) unsigned NOT NULL DEFAULT '0',
  `level_of_faith` int(11) unsigned NOT NULL DEFAULT '0',
  `live_where` int(11) unsigned NOT NULL DEFAULT '0',
  `living_with` int(11) unsigned NOT NULL DEFAULT '0',
  `spending_habits` int(11) unsigned NOT NULL DEFAULT '0',
  `user_editor_xml` text COLLATE utf8_unicode_ci NOT NULL,
  `about_me` text COLLATE utf8_unicode_ci NOT NULL,
  `interested_in` text COLLATE utf8_unicode_ci NOT NULL,
  `interests` int(11) unsigned NOT NULL DEFAULT '0',
  `sexuality` int(11) NOT NULL,
  `star_sign` int(11) NOT NULL,
  `education` int(11) NOT NULL,
  `user_search_filters` text COLLATE utf8_unicode_ci NOT NULL,
  `state_filter_search` tinyint(1) NOT NULL DEFAULT '0',
  `user_search_filters_mobile` text COLLATE utf8_unicode_ci NOT NULL,
  `your_private_note` text COLLATE utf8_unicode_ci NOT NULL,
  `user_blogs_filters` text COLLATE utf8_unicode_ci NOT NULL,
  `videos_filters` text COLLATE utf8_unicode_ci NOT NULL,
  `photos_filters` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=432114 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
`user_id` int(11) unsigned NOT NULL,
  `partner` int(11) unsigned NOT NULL DEFAULT '0',
  `gold_days` int(5) unsigned NOT NULL DEFAULT '0',
  `role` enum('user','admin','demo_admin') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `name_seo` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `gender` enum('M','F') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'M',
  `orientation` int(11) unsigned NOT NULL DEFAULT '0',
  `p_orientation` int(11) unsigned NOT NULL DEFAULT '0',
  `relation` int(2) unsigned NOT NULL DEFAULT '0',
  `couple` enum('Y','N','A') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `couple_id` int(11) NOT NULL DEFAULT '0',
  `mail` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `change_mail` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `password` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `avatar` int(2) unsigned NOT NULL DEFAULT '0',
  `is_photo` enum('N','Y') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `is_photo_public` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `record` enum('Y','N') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `record_id` int(6) NOT NULL DEFAULT '0',
  `country_id` int(5) unsigned NOT NULL DEFAULT '0',
  `state_id` int(6) unsigned NOT NULL DEFAULT '0',
  `city_id` int(11) unsigned NOT NULL DEFAULT '0',
  `country` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `state` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `city` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `zip` int(5) unsigned NOT NULL DEFAULT '0',
  `birth` date NOT NULL DEFAULT '0000-00-00',
  `p_age_from` int(5) unsigned NOT NULL DEFAULT '0',
  `p_age_to` int(5) unsigned NOT NULL DEFAULT '0',
  `horoscope` int(2) unsigned NOT NULL DEFAULT '0',
  `p_horoscope` bigint(22) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `active_code` varchar(40) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `hide_time` int(5) unsigned NOT NULL DEFAULT '0',
  `register` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last_visit` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `rating` int(7) unsigned NOT NULL DEFAULT '0',
  `new_mails` int(7) unsigned NOT NULL DEFAULT '0',
  `new_interests` int(7) unsigned NOT NULL DEFAULT '0',
  `new_views` int(7) unsigned NOT NULL DEFAULT '0',
  `total_views` int(7) unsigned NOT NULL DEFAULT '0',
  `last_ip` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `set_email_mail` int(1) unsigned NOT NULL DEFAULT '2',
  `set_email_interest` int(1) unsigned NOT NULL DEFAULT '2',
  `type` enum('none','gold','silver','platinum','membership','credits') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'none',
  `city_money` mediumint(6) unsigned NOT NULL DEFAULT '0',
  `forum_n_messages` bigint(20) NOT NULL DEFAULT '0',
  `sound` tinyint(1) NOT NULL DEFAULT '1',
  `blog_visits` int(10) unsigned NOT NULL,
  `blog_comments` int(10) unsigned NOT NULL,
  `blog_posts` int(10) unsigned NOT NULL,
  `vid_visits` int(10) unsigned NOT NULL,
  `vid_comments` int(10) unsigned NOT NULL,
  `vid_videos` int(10) unsigned NOT NULL,
  `moderator_photo` tinyint(1) unsigned NOT NULL,
  `moderator_vids_video` tinyint(1) unsigned NOT NULL,
  `moderator_texts` tinyint(1) unsigned NOT NULL,
  `moderator_profiles` tinyint(1) unsigned NOT NULL,
  `facebook_id` bigint(20) unsigned NOT NULL,
  `google_plus_id` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `linkedin_id` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `twitter_id` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `vk_id` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `default_online_view` enum('B','M','F') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'B',
  `albums_to_see` enum('users','friends') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'users',
  `wall_like_comment_alert` tinyint(1) NOT NULL,
  `use_as_online` tinyint(1) NOT NULL,
  `isMobile` enum('true','false') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false',
  `couple_from` int(11) DEFAULT NULL,
  `couple_to` int(11) DEFAULT NULL,
  `state_narrow_box` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `match_mail` tinyint(1) NOT NULL DEFAULT '0',
  `lang` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `smart_profile` tinyint(1) NOT NULL DEFAULT '1',
  `wall_only_post` tinyint(1) NOT NULL DEFAULT '2',
  `review_link` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'info',
  `color_scheme` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `ban_mails` tinyint(1) NOT NULL DEFAULT '0',
  `is_online_users_im` tinyint(1) NOT NULL DEFAULT '2',
  `ban_time` datetime NOT NULL,
  `ban_time_release` int(11) NOT NULL DEFAULT '0',
  `i_am_here_to` tinyint(11) NOT NULL DEFAULT '1',
  `profile_bg` varchar(10) COLLATE utf8_unicode_ci DEFAULT '',
  `set_who_view_profile` enum('anyone','members') COLLATE utf8_unicode_ci DEFAULT 'anyone',
  `set_can_comment_photos` enum('anyone','members') COLLATE utf8_unicode_ci DEFAULT 'anyone',
  `set_notif_profile_visitors` tinyint(1) DEFAULT '1',
  `set_notif_gifts` tinyint(1) DEFAULT '1',
  `set_notif_voted_photos` tinyint(1) DEFAULT '1',
  `set_notif_push_notifications` tinyint(1) DEFAULT '1',
  `set_hide_my_presence` tinyint(1) DEFAULT '2',
  `set_do_not_show_me_visitors` tinyint(1) DEFAULT '2',
  `rated_photos` tinyint(1) NOT NULL DEFAULT '0',
  `last_photo_visible_rated` int(11) NOT NULL DEFAULT '0',
  `popularity` int(11) NOT NULL DEFAULT '0',
  `credits` int(11) NOT NULL DEFAULT '0',
  `date_search` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_encounters` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sp_sending_messages_per_day` int(11) NOT NULL DEFAULT '0',
  `profile_bg_video` varchar(510) COLLATE utf8_unicode_ci DEFAULT '{}',
  `set_notif_mutual_attraction` tinyint(1) DEFAULT '1',
  `set_notif_want_to_meet_you` tinyint(1) DEFAULT '1',
  `set_notif_new_msg` tinyint(1) DEFAULT '1',
  `set_notif_new_comments` tinyint(1) DEFAULT '1',
  `ban_global` tinyint(1) NOT NULL DEFAULT '0',
  `password_reminder` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `payment_day` date NOT NULL,
  `payment_hour` int(11) NOT NULL,
  `wall_mode` enum('all','friends') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'all',
  `users_reports` text COLLATE utf8_unicode_ci NOT NULL,
  `translation_off` text COLLATE utf8_unicode_ci NOT NULL,
  `timezone` varchar(40) COLLATE utf8_unicode_ci DEFAULT '',
  `video_greeting` int(11) NOT NULL DEFAULT '0',
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `auth_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `last_broadcast` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `hide_ads` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `hide_ads_mobile` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `im_reply_new_contact_rate` tinyint(3) unsigned NOT NULL DEFAULT '100',
  `welcoming_message_notify` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `geo_position_lat` bigint(20) NOT NULL DEFAULT '0',
  `geo_position_long` bigint(20) NOT NULL DEFAULT '0',
  `geo_position_age` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `geo_position_city_id` int(11) NOT NULL DEFAULT '0',
  `geo_position_state_id` int(11) NOT NULL DEFAULT '0',
  `geo_position_country_id` int(11) NOT NULL DEFAULT '0',
  `geo_position_city` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `geo_position_state` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `geo_position_country` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `set_notif_show_my_age` tinyint(1) DEFAULT '1',
  `wall_post_access` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=432418 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE IF NOT EXISTS `userinfo` (
`user_id` int(11) unsigned NOT NULL,
  `headline` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `essay` text COLLATE utf8_unicode_ci NOT NULL,
  `height` int(11) unsigned NOT NULL DEFAULT '0',
  `weight` int(11) unsigned NOT NULL DEFAULT '0',
  `body` int(11) unsigned NOT NULL DEFAULT '0',
  `drinking` int(11) unsigned NOT NULL DEFAULT '0',
  `ethnicity` int(11) unsigned NOT NULL DEFAULT '0',
  `eye` int(11) unsigned NOT NULL DEFAULT '0',
  `religion` int(11) unsigned NOT NULL DEFAULT '0',
  `family` int(11) unsigned NOT NULL DEFAULT '0',
  `hair` int(11) unsigned NOT NULL DEFAULT '0',
  `income` int(11) unsigned NOT NULL DEFAULT '0',
  `career` int(11) unsigned NOT NULL DEFAULT '0',
  `smoking` int(11) unsigned NOT NULL DEFAULT '0',
  `status` int(11) unsigned NOT NULL DEFAULT '0',
  `age_preference` int(11) unsigned NOT NULL DEFAULT '0',
  `appearance` int(11) unsigned NOT NULL DEFAULT '0',
  `first_date` int(11) unsigned NOT NULL DEFAULT '0',
  `humor` int(11) unsigned NOT NULL DEFAULT '0',
  `level_of_faith` int(11) unsigned NOT NULL DEFAULT '0',
  `live_where` int(11) unsigned NOT NULL DEFAULT '0',
  `living_with` int(11) unsigned NOT NULL DEFAULT '0',
  `spending_habits` int(11) unsigned NOT NULL DEFAULT '0',
  `user_editor_xml` text COLLATE utf8_unicode_ci NOT NULL,
  `about_me` text COLLATE utf8_unicode_ci NOT NULL,
  `interested_in` text COLLATE utf8_unicode_ci NOT NULL,
  `interests` int(11) unsigned NOT NULL DEFAULT '0',
  `sexuality` int(11) NOT NULL,
  `star_sign` int(11) NOT NULL,
  `education` int(11) NOT NULL,
  `user_search_filters` text COLLATE utf8_unicode_ci NOT NULL,
  `state_filter_search` tinyint(1) NOT NULL DEFAULT '0',
  `user_search_filters_mobile` text COLLATE utf8_unicode_ci NOT NULL,
  `your_private_note` text COLLATE utf8_unicode_ci NOT NULL,
  `blogs_filters` text COLLATE utf8_unicode_ci NOT NULL,
  `videos_filters` text COLLATE utf8_unicode_ci NOT NULL,
  `photos_filters` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=432418 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userpartner`
--

CREATE TABLE IF NOT EXISTS `userpartner` (
`user_id` int(11) unsigned NOT NULL,
  `p_height_from` int(11) unsigned NOT NULL DEFAULT '0',
  `p_height_to` int(11) unsigned NOT NULL DEFAULT '0',
  `p_weight_from` int(11) unsigned NOT NULL DEFAULT '0',
  `p_weight_to` int(11) unsigned NOT NULL DEFAULT '0',
  `p_relation` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_body` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_drinking` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_ethnicity` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_eye` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_religion` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_family` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_hair` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_income` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_career` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_smoking` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_status` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_education` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_sexuality` bigint(22) unsigned NOT NULL DEFAULT '0',
  `p_star_sign` bigint(22) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=432418 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` bigint(20) NOT NULL,
  `login` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `enemy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nowX` smallint(6) DEFAULT NULL,
  `x0` smallint(6) DEFAULT NULL,
  `ingame` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `time_in` bigint(11) DEFAULT NULL,
  `gender` enum('m','f') COLLATE utf8_unicode_ci DEFAULT NULL,
  `angle` smallint(6) DEFAULT NULL,
  `sila` smallint(6) DEFAULT NULL,
  `upal` enum('yes','no') COLLATE utf8_unicode_ci DEFAULT NULL,
  `popal` enum('yes','no') COLLATE utf8_unicode_ci DEFAULT NULL,
  `active` enum('yes','no') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no',
  `zernoX` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_block`
--

CREATE TABLE IF NOT EXISTS `users_block` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `comment` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_checkbox`
--

CREATE TABLE IF NOT EXISTS `users_checkbox` (
  `field` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_comments`
--

CREATE TABLE IF NOT EXISTS `users_comments` (
`id` mediumint(8) NOT NULL,
  `user_id` mediumint(8) NOT NULL DEFAULT '0',
  `from_user_id` mediumint(8) NOT NULL DEFAULT '0',
  `comment` text COLLATE utf8_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_favorite`
--

CREATE TABLE IF NOT EXISTS `users_favorite` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `comment` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_flash`
--

CREATE TABLE IF NOT EXISTS `users_flash` (
  `user_id` int(10) NOT NULL DEFAULT '0' COMMENT 'id of user',
  `backgrounds` text COLLATE utf8_unicode_ci COMMENT 'names upload background'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_interest`
--

CREATE TABLE IF NOT EXISTS `users_interest` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `new` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y',
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_private_note`
--

CREATE TABLE IF NOT EXISTS `users_private_note` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `from_user_id` int(11) NOT NULL DEFAULT '0',
  `comment` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=265 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_reports`
--

CREATE TABLE IF NOT EXISTS `users_reports` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `msg` text COLLATE utf8_unicode_ci NOT NULL,
  `photo_id` int(11) NOT NULL DEFAULT '0',
  `video` tinyint(1) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_view`
--

CREATE TABLE IF NOT EXISTS `users_view` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `new` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y',
  `visited` tinyint(1) NOT NULL DEFAULT '0',
  `ref` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM AUTO_INCREMENT=101427 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_visitors`
--

CREATE TABLE IF NOT EXISTS `users_visitors` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `last_visit` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM AUTO_INCREMENT=78 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_block_list`
--

CREATE TABLE IF NOT EXISTS `user_block_list` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `mail` tinyint(1) NOT NULL,
  `im` tinyint(1) NOT NULL DEFAULT '0',
  `audiochat` tinyint(1) NOT NULL DEFAULT '0',
  `videochat` tinyint(1) NOT NULL DEFAULT '0',
  `games` tinyint(1) NOT NULL DEFAULT '0',
  `wall` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=407 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_chart_random_value`
--

CREATE TABLE IF NOT EXISTS `user_chart_random_value` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `chart` tinyint(1) NOT NULL DEFAULT '0',
  `value` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_gift`
--

CREATE TABLE IF NOT EXISTS `user_gift` (
`id` int(11) NOT NULL,
  `user_from` int(11) NOT NULL DEFAULT '0',
  `user_to` int(11) NOT NULL DEFAULT '0',
  `gift` int(11) NOT NULL DEFAULT '0',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `visibility` tinyint(1) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `gifts_credits` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=1581 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_interests`
--

CREATE TABLE IF NOT EXISTS `user_interests` (
`id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `interest` int(11) NOT NULL,
  `wall_id` bigint(20) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=9366 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_age_preference`
--

CREATE TABLE IF NOT EXISTS `var_age_preference` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_appearance`
--

CREATE TABLE IF NOT EXISTS `var_appearance` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_body`
--

CREATE TABLE IF NOT EXISTS `var_body` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_career`
--

CREATE TABLE IF NOT EXISTS `var_career` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_drinking`
--

CREATE TABLE IF NOT EXISTS `var_drinking` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_education`
--

CREATE TABLE IF NOT EXISTS `var_education` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_ethnicity`
--

CREATE TABLE IF NOT EXISTS `var_ethnicity` (
`id` bigint(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_eye`
--

CREATE TABLE IF NOT EXISTS `var_eye` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_family`
--

CREATE TABLE IF NOT EXISTS `var_family` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_first_date`
--

CREATE TABLE IF NOT EXISTS `var_first_date` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_hair`
--

CREATE TABLE IF NOT EXISTS `var_hair` (
`id` int(10) unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_height`
--

CREATE TABLE IF NOT EXISTS `var_height` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `value_cm` int(3) NOT NULL DEFAULT '0',
  `value_f` float NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_hobbies`
--

CREATE TABLE IF NOT EXISTS `var_hobbies` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_humor`
--

CREATE TABLE IF NOT EXISTS `var_humor` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_income`
--

CREATE TABLE IF NOT EXISTS `var_income` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_language`
--

CREATE TABLE IF NOT EXISTS `var_language` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=79 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_level_of_faith`
--

CREATE TABLE IF NOT EXISTS `var_level_of_faith` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_live_where`
--

CREATE TABLE IF NOT EXISTS `var_live_where` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_living_with`
--

CREATE TABLE IF NOT EXISTS `var_living_with` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_religion`
--

CREATE TABLE IF NOT EXISTS `var_religion` (
`id` bigint(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_sexuality`
--

CREATE TABLE IF NOT EXISTS `var_sexuality` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_smoking`
--

CREATE TABLE IF NOT EXISTS `var_smoking` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_spending_habits`
--

CREATE TABLE IF NOT EXISTS `var_spending_habits` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_star_sign`
--

CREATE TABLE IF NOT EXISTS `var_star_sign` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_status`
--

CREATE TABLE IF NOT EXISTS `var_status` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `var_weight`
--

CREATE TABLE IF NOT EXISTS `var_weight` (
`id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `value_kg` int(3) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=104 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_invite`
--

CREATE TABLE IF NOT EXISTS `video_invite` (
`id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL DEFAULT '0',
  `to_user` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=650 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_reject`
--

CREATE TABLE IF NOT EXISTS `video_reject` (
`id` int(11) NOT NULL,
  `from_user` int(11) NOT NULL DEFAULT '0',
  `to_user` int(11) NOT NULL DEFAULT '0',
  `go` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM AUTO_INCREMENT=305 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_category`
--

CREATE TABLE IF NOT EXISTS `vids_category` (
`category_id` bigint(20) NOT NULL,
  `category_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `position` int(11) NOT NULL,
  `check` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_comment`
--

CREATE TABLE IF NOT EXISTS `vids_comment` (
`id` int(11) unsigned NOT NULL,
  `video_id` int(11) unsigned NOT NULL DEFAULT '0',
  `video_user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `dt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `send` bigint(20) unsigned NOT NULL DEFAULT '0',
  `parent_id` int(11) DEFAULT '0',
  `parent_user_id` int(11) DEFAULT '0',
  `replies` int(11) DEFAULT '0',
  `likes` int(11) NOT NULL DEFAULT '0',
  `last_action_like` datetime NOT NULL,
  `is_new` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_comments_likes`
--

CREATE TABLE IF NOT EXISTS `vids_comments_likes` (
`id` bigint(20) NOT NULL,
  `video_id` int(11) NOT NULL,
  `video_user_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `comment_user_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `is_new` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_rate`
--

CREATE TABLE IF NOT EXISTS `vids_rate` (
  `video_id` int(11) unsigned NOT NULL DEFAULT '0',
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_subscribe`
--

CREATE TABLE IF NOT EXISTS `vids_subscribe` (
`id` int(11) unsigned NOT NULL,
  `subscriber_user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `uploader_user_id` int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_tags`
--

CREATE TABLE IF NOT EXISTS `vids_tags` (
`id` bigint(20) NOT NULL,
  `tag` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `counter` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_tags_relations`
--

CREATE TABLE IF NOT EXISTS `vids_tags_relations` (
`id` bigint(20) NOT NULL,
  `video_id` int(11) NOT NULL,
  `tag_id` bigint(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vids_video`
--

CREATE TABLE IF NOT EXISTS `vids_video` (
`id` int(11) NOT NULL,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `dt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `count_comments` int(11) unsigned NOT NULL DEFAULT '0',
  `count_comments_replies` int(11) unsigned NOT NULL DEFAULT '0',
  `count_views` int(11) unsigned NOT NULL DEFAULT '0',
  `count_rates` int(11) unsigned NOT NULL DEFAULT '0',
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `search_index` text COLLATE utf8_unicode_ci NOT NULL,
  `tags` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `rating` float NOT NULL DEFAULT '0',
  `active` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `private` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `cat` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_uploaded` tinyint(1) NOT NULL DEFAULT '0',
  `users_reports` text COLLATE utf8_unicode_ci NOT NULL,
  `version` int(11) NOT NULL,
  `hide_header` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wall`
--

CREATE TABLE IF NOT EXISTS `wall` (
`id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `section` enum('comment','status','friends','pics','pics_comment','photo','photo_comment','photo_default','vids','vids_comment','music','music_photo','music_comment','musician','musician_photo','musician_comment','event_added','event_member','event_comment','event_comment_comment','event_photo','places_review','places_photo','group_join','group_wall','group_wall_comment','group_forum_post','group_forum_post_comment','3dcity','blog_post','blog_comment','forum_thread','forum_post','field_status','share','birthday','interests') COLLATE utf8_unicode_ci NOT NULL,
  `access` enum('public','friends','private') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'public',
  `item_id` int(11) NOT NULL,
  `parent_user_id` int(11) NOT NULL,
  `params_section` text COLLATE utf8_unicode_ci NOT NULL,
  `params` text COLLATE utf8_unicode_ci NOT NULL,
  `comments` int(11) NOT NULL,
  `comments_item` int(11) NOT NULL,
  `likes` int(11) NOT NULL,
  `hide_from_user` int(11) NOT NULL,
  `comment_user_id` int(11) NOT NULL,
  `site_section` enum('','blog','event','forum','group','music','musician','pics','photo','places','vids') COLLATE utf8_unicode_ci NOT NULL,
  `site_section_item_id` bigint(20) NOT NULL,
  `last_action_like` datetime NOT NULL,
  `last_action_comment` datetime NOT NULL,
  `last_action_comment_like` datetime NOT NULL,
  `shares_count` int(11) NOT NULL,
  `last_action_shares` datetime NOT NULL,
  `send` bigint(20) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=47921 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wall_comments`
--

CREATE TABLE IF NOT EXISTS `wall_comments` (
`id` bigint(20) NOT NULL,
  `wall_item_id` bigint(20) NOT NULL,
  `wall_item_user_id` int(11) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `send` bigint(20) unsigned NOT NULL DEFAULT '0',
  `comment` text COLLATE utf8_unicode_ci NOT NULL,
  `parent_id` bigint(20) DEFAULT '0',
  `parent_user_id` int(11) DEFAULT '0',
  `replies` int(11) DEFAULT '0',
  `likes` int(11) NOT NULL DEFAULT '0',
  `last_action_like` datetime NOT NULL,
  `is_new` tinyint(1) NOT NULL DEFAULT '0',
  `is_new_like` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=189 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wall_comments_likes`
--

CREATE TABLE IF NOT EXISTS `wall_comments_likes` (
`id` bigint(20) NOT NULL,
  `wall_item_id` bigint(20) NOT NULL,
  `wall_item_user_id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `cid` bigint(20) NOT NULL,
  `parent_id` bigint(20) DEFAULT '0',
  `comment_user_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `is_new` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wall_comments_viewed`
--

CREATE TABLE IF NOT EXISTS `wall_comments_viewed` (
  `user_id` int(10) DEFAULT NULL,
  `item_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wall_items_for_user`
--

CREATE TABLE IF NOT EXISTS `wall_items_for_user` (
  `user_id` int(11) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `section` enum('blog','event','forum','group','music','musician','pics','photo','places','vids') COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wall_likes`
--

CREATE TABLE IF NOT EXISTS `wall_likes` (
`id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wall_item_id` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=1812 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wall_stats`
--

CREATE TABLE IF NOT EXISTS `wall_stats` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wall_posts` int(11) NOT NULL DEFAULT '0',
  `shared_posts` int(11) NOT NULL DEFAULT '0',
  `comments` int(11) NOT NULL DEFAULT '0',
  `date` date NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `widgets`
--

CREATE TABLE IF NOT EXISTS `widgets` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `widget` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `open` tinyint(1) NOT NULL DEFAULT '0',
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `z` int(11) NOT NULL DEFAULT '0',
  `settings` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `session` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `session_date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `20k_ww_elite`
--
ALTER TABLE `20k_ww_elite`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_login`
--
ALTER TABLE `admin_login`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_replier`
--
ALTER TABLE `admin_replier`
 ADD PRIMARY KEY (`id`), ADD KEY `name` (`username`), ADD KEY `password` (`password`);

--
-- Indexes for table `adv_cars`
--
ALTER TABLE `adv_cars`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_casting`
--
ALTER TABLE `adv_casting`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_cats`
--
ALTER TABLE `adv_cats`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_film`
--
ALTER TABLE `adv_film`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_housting`
--
ALTER TABLE `adv_housting`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_images`
--
ALTER TABLE `adv_images`
 ADD PRIMARY KEY (`id`), ADD KEY `adv_cat_id` (`adv_cat_id`,`adv_id`);

--
-- Indexes for table `adv_items`
--
ALTER TABLE `adv_items`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_jobs`
--
ALTER TABLE `adv_jobs`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_music`
--
ALTER TABLE `adv_music`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_myspace`
--
ALTER TABLE `adv_myspace`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_personals`
--
ALTER TABLE `adv_personals`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_razd`
--
ALTER TABLE `adv_razd`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_sale`
--
ALTER TABLE `adv_sale`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adv_services`
--
ALTER TABLE `adv_services`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audio_greeting`
--
ALTER TABLE `audio_greeting`
 ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `audio_invite`
--
ALTER TABLE `audio_invite`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audio_reject`
--
ALTER TABLE `audio_reject`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `aux_embed_vids`
--
ALTER TABLE `aux_embed_vids`
 ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
 ADD PRIMARY KEY (`id`), ADD KEY `place` (`place`), ADD KEY `active` (`active`), ADD FULLTEXT KEY `templates` (`templates`), ADD FULLTEXT KEY `langs` (`langs`);

--
-- Indexes for table `banners_places`
--
ALTER TABLE `banners_places`
 ADD PRIMARY KEY (`id`), ADD KEY `place` (`place`), ADD KEY `active` (`active`);

--
-- Indexes for table `blogs_comment`
--
ALTER TABLE `blogs_comment`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs_hotsearch`
--
ALTER TABLE `blogs_hotsearch`
 ADD PRIMARY KEY (`id`), ADD KEY `count` (`count`);

--
-- Indexes for table `blogs_post`
--
ALTER TABLE `blogs_post`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`), ADD KEY `dt` (`dt`);

--
-- Indexes for table `blogs_subscribe`
--
ALTER TABLE `blogs_subscribe`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_chair`
--
ALTER TABLE `chat_chair`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_line`
--
ALTER TABLE `chat_line`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_room`
--
ALTER TABLE `chat_room`
 ADD KEY `id` (`id`);

--
-- Indexes for table `city_avatar_face`
--
ALTER TABLE `city_avatar_face`
 ADD PRIMARY KEY (`id`), ADD KEY `id` (`photo_id`,`user_id`);

--
-- Indexes for table `city_avatar_face_default`
--
ALTER TABLE `city_avatar_face_default`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `city_custom_data`
--
ALTER TABLE `city_custom_data`
 ADD PRIMARY KEY (`data_id`), ADD UNIQUE KEY `type_data` (`location`,`pos_map`,`type`), ADD KEY `location` (`location`), ADD KEY `pos_map` (`pos_map`);

--
-- Indexes for table `city_invite`
--
ALTER TABLE `city_invite`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `city_link`
--
ALTER TABLE `city_link`
 ADD PRIMARY KEY (`id`), ADD KEY `location` (`location`);

--
-- Indexes for table `city_moving`
--
ALTER TABLE `city_moving`
 ADD PRIMARY KEY (`step`), ADD KEY `id` (`id`,`location`);

--
-- Indexes for table `city_msg`
--
ALTER TABLE `city_msg`
 ADD PRIMARY KEY (`id`), ADD KEY `to` (`to_user`), ADD KEY `from` (`from_user`), ADD KEY `born` (`born`), ADD KEY `is_new` (`is_new`), ADD KEY `to_user_from_user_from_user_deleted_id` (`to_user`,`from_user`,`from_user_deleted`,`id`), ADD KEY `to_user_from_user_to_user_deleted_id` (`to_user`,`from_user`,`to_user_deleted`,`id`);

--
-- Indexes for table `city_msg_backup`
--
ALTER TABLE `city_msg_backup`
 ADD PRIMARY KEY (`id`), ADD KEY `to` (`to_user`), ADD KEY `from` (`from_user`), ADD KEY `born` (`born`);

--
-- Indexes for table `city_open`
--
ALTER TABLE `city_open`
 ADD PRIMARY KEY (`id`), ADD KEY `from` (`from_user`), ADD KEY `to` (`to_user`), ADD KEY `mid` (`mid`);

--
-- Indexes for table `city_photo`
--
ALTER TABLE `city_photo`
 ADD PRIMARY KEY (`photo_id`), ADD KEY `user_id_2` (`user_id`,`visible`), ADD KEY `photo_id` (`photo_id`,`user_id`), ADD KEY `visible` (`visible`), ADD KEY `user_id` (`user_id`), ADD KEY `wall_id` (`wall_id`), ADD KEY `private` (`private`), ADD KEY `default` (`default`);

--
-- Indexes for table `city_reject`
--
ALTER TABLE `city_reject`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `city_rooms`
--
ALTER TABLE `city_rooms`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `city_temp`
--
ALTER TABLE `city_temp`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `city_users`
--
ALTER TABLE `city_users`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`), ADD KEY `location` (`location`), ADD KEY `last_visit` (`last_visit`);

--
-- Indexes for table `city_users_in_rooms`
--
ALTER TABLE `city_users_in_rooms`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `luid` (`cuid`,`location`,`pos_map`,`house`), ADD KEY `cuid` (`cuid`), ADD KEY `location` (`location`), ADD KEY `pos_map` (`pos_map`), ADD KEY `last_visit` (`last_visit`);

--
-- Indexes for table `col_order`
--
ALTER TABLE `col_order`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `const_horoscope`
--
ALTER TABLE `const_horoscope`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `const_interests`
--
ALTER TABLE `const_interests`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `const_i_am_here_to`
--
ALTER TABLE `const_i_am_here_to`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `const_looking`
--
ALTER TABLE `const_looking`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `const_orientation`
--
ALTER TABLE `const_orientation`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `const_relation`
--
ALTER TABLE `const_relation`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_partner`
--
ALTER TABLE `contact_partner`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email`
--
ALTER TABLE `email`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `mail` (`mail`);

--
-- Indexes for table `email_auto`
--
ALTER TABLE `email_auto`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `note_lang` (`note`,`lang`);

--
-- Indexes for table `email_auto_settings`
--
ALTER TABLE `email_auto_settings`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `option` (`option`);

--
-- Indexes for table `email_queue`
--
ALTER TABLE `email_queue`
 ADD PRIMARY KEY (`id`), ADD KEY `added_at` (`added_at`);

--
-- Indexes for table `encounters`
--
ALTER TABLE `encounters`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`), ADD KEY `user_to` (`user_to`), ADD KEY `new` (`new`), ADD KEY `new_to` (`new_to`), ADD KEY `user_to_from_reply_to_reply_id` (`user_to`,`from_reply`,`to_reply`,`id`), ADD KEY `user_from_id` (`user_from`,`id`), ADD KEY `user_to_id` (`user_to`,`id`), ADD KEY `user_from_from_reply_to_reply_id` (`user_from`,`from_reply`,`to_reply`,`id`), ADD KEY `user_from_from_reply_id` (`user_from`,`from_reply`,`id`), ADD KEY `user_to_to_reply_id` (`user_to`,`to_reply`,`id`);

--
-- Indexes for table `events_category`
--
ALTER TABLE `events_category`
 ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `events_event`
--
ALTER TABLE `events_event`
 ADD PRIMARY KEY (`event_id`), ADD KEY `category_id` (`category_id`), ADD KEY `user_id` (`user_id`), ADD KEY `event_private` (`event_private`), ADD KEY `city_id` (`city_id`), ADD KEY `event_datetime` (`event_datetime`), ADD KEY `event_n_comments` (`event_n_comments`), ADD KEY `event_n_guests` (`event_n_guests`), ADD KEY `event_has_images` (`event_has_images`);

--
-- Indexes for table `events_event_comment`
--
ALTER TABLE `events_event_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `event_id` (`event_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `events_event_comment_comment`
--
ALTER TABLE `events_event_comment_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `parent_comment_id` (`parent_comment_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `events_event_guest`
--
ALTER TABLE `events_event_guest`
 ADD PRIMARY KEY (`guest_id`), ADD KEY `event_id` (`event_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `events_event_image`
--
ALTER TABLE `events_event_image`
 ADD PRIMARY KEY (`image_id`), ADD KEY `event_id` (`event_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `events_setting`
--
ALTER TABLE `events_setting`
 ADD PRIMARY KEY (`setting_id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `flashchat_messages`
--
ALTER TABLE `flashchat_messages`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flashchat_rooms`
--
ALTER TABLE `flashchat_rooms`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flashchat_users`
--
ALTER TABLE `flashchat_users`
 ADD PRIMARY KEY (`id`), ADD KEY `time_out` (`time_out`), ADD KEY `user_id` (`user_id`), ADD KEY `room_time_out` (`room`,`time_out`);

--
-- Indexes for table `forum_category`
--
ALTER TABLE `forum_category`
 ADD PRIMARY KEY (`id`), ADD KEY `sort_rank` (`sort_rank`);

--
-- Indexes for table `forum_forum`
--
ALTER TABLE `forum_forum`
 ADD PRIMARY KEY (`id`), ADD KEY `category_id` (`category_id`,`sort_rank`), ADD KEY `parent_forum_id` (`parent_forum_id`), ADD KEY `updated_at` (`updated_at`);

--
-- Indexes for table `forum_message`
--
ALTER TABLE `forum_message`
 ADD PRIMARY KEY (`id`), ADD KEY `updated_at` (`updated_at`), ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `forum_read_marker`
--
ALTER TABLE `forum_read_marker`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`,`forum_id`,`read_until`);

--
-- Indexes for table `forum_setting`
--
ALTER TABLE `forum_setting`
 ADD PRIMARY KEY (`setting_id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `forum_topic`
--
ALTER TABLE `forum_topic`
 ADD PRIMARY KEY (`id`), ADD KEY `forum_id` (`forum_id`,`user_id`), ADD KEY `updated_at` (`updated_at`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`), ADD KEY `fr_user_id` (`fr_user_id`);

--
-- Indexes for table `friends_requests`
--
ALTER TABLE `friends_requests`
 ADD UNIQUE KEY `user_id` (`user_id`,`friend_id`), ADD KEY `accepted` (`accepted`), ADD KEY `featured` (`featured`), ADD KEY `friend_featured` (`friend_featured`), ADD KEY `user_id_2` (`user_id`), ADD KEY `friend_id` (`friend_id`), ADD KEY `accepted_user_id_friend_id` (`accepted`,`user_id`,`friend_id`), ADD KEY `friend_id_accepted` (`friend_id`,`accepted`), ADD KEY `user_id_accepted` (`user_id`,`accepted`);

--
-- Indexes for table `gallery_albums`
--
ALTER TABLE `gallery_albums`
 ADD PRIMARY KEY (`id`), ADD KEY `folder` (`folder`);

--
-- Indexes for table `gallery_comments`
--
ALTER TABLE `gallery_comments`
 ADD PRIMARY KEY (`id`), ADD KEY `imageid` (`imageid`), ADD KEY `date` (`date`);

--
-- Indexes for table `gallery_images`
--
ALTER TABLE `gallery_images`
 ADD PRIMARY KEY (`id`), ADD KEY `filename` (`filename`,`albumid`), ADD KEY `albumid` (`albumid`);

--
-- Indexes for table `game_chess`
--
ALTER TABLE `game_chess`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_invite`
--
ALTER TABLE `game_invite`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_morboy`
--
ALTER TABLE `game_morboy`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_reject`
--
ALTER TABLE `game_reject`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_shashki`
--
ALTER TABLE `game_shashki`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `geo_city`
--
ALTER TABLE `geo_city`
 ADD PRIMARY KEY (`city_id`), ADD KEY `country_id` (`country_id`), ADD KEY `state_id` (`state_id`), ADD KEY `lat` (`lat`), ADD KEY `long` (`long`), ADD KEY `hidden` (`hidden`);

--
-- Indexes for table `geo_country`
--
ALTER TABLE `geo_country`
 ADD PRIMARY KEY (`country_id`), ADD KEY `hidden` (`hidden`);

--
-- Indexes for table `geo_state`
--
ALTER TABLE `geo_state`
 ADD PRIMARY KEY (`state_id`), ADD KEY `country_id` (`country_id`), ADD KEY `hidden` (`hidden`);

--
-- Indexes for table `gifts`
--
ALTER TABLE `gifts`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gifts_set`
--
ALTER TABLE `gifts_set`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groups_category`
--
ALTER TABLE `groups_category`
 ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `groups_forum`
--
ALTER TABLE `groups_forum`
 ADD PRIMARY KEY (`forum_id`), ADD KEY `group_id` (`group_id`), ADD KEY `user_id` (`user_id`), ADD KEY `forum_n_comments` (`forum_n_comments`), ADD KEY `forum_n_views` (`forum_n_views`);

--
-- Indexes for table `groups_forum_comment`
--
ALTER TABLE `groups_forum_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `forum_id` (`forum_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `groups_forum_comment_comment`
--
ALTER TABLE `groups_forum_comment_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `parent_comment_id` (`parent_comment_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `groups_group`
--
ALTER TABLE `groups_group`
 ADD PRIMARY KEY (`group_id`), ADD KEY `category_id` (`category_id`), ADD KEY `user_id` (`user_id`), ADD KEY `group_private` (`group_private`), ADD KEY `group_n_posts` (`group_n_posts`), ADD KEY `group_n_comments` (`group_n_comments`), ADD KEY `group_n_members` (`group_n_members`), ADD KEY `group_has_images` (`group_has_images`);

--
-- Indexes for table `groups_group_comment`
--
ALTER TABLE `groups_group_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `group_id` (`group_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `groups_group_comment_comment`
--
ALTER TABLE `groups_group_comment_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `parent_comment_id` (`parent_comment_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `groups_group_image`
--
ALTER TABLE `groups_group_image`
 ADD PRIMARY KEY (`image_id`), ADD KEY `group_id` (`group_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `groups_group_member`
--
ALTER TABLE `groups_group_member`
 ADD PRIMARY KEY (`member_id`), ADD KEY `group_id` (`group_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `groups_invite`
--
ALTER TABLE `groups_invite`
 ADD PRIMARY KEY (`invite_id`), ADD KEY `group_id` (`group_id`), ADD KEY `user_id` (`user_id`), ADD KEY `invite_key` (`invite_key`);

--
-- Indexes for table `groups_setting`
--
ALTER TABLE `groups_setting`
 ADD PRIMARY KEY (`setting_id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `help_answer`
--
ALTER TABLE `help_answer`
 ADD PRIMARY KEY (`id`), ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `help_topic`
--
ALTER TABLE `help_topic`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `im_contact_replied`
--
ALTER TABLE `im_contact_replied`
 ADD UNIQUE KEY `user_id` (`user_id`,`user_to`), ADD KEY `user_id_replied` (`user_id`,`replied`);

--
-- Indexes for table `im_msg`
--
ALTER TABLE `im_msg`
 ADD PRIMARY KEY (`id`), ADD KEY `to` (`to_user`), ADD KEY `from` (`from_user`), ADD KEY `born` (`born`), ADD KEY `is_new` (`is_new`), ADD KEY `to_user_from_user_from_user_deleted_id` (`to_user`,`from_user`,`from_user_deleted`,`id`), ADD KEY `to_user_from_user_to_user_deleted_id` (`to_user`,`from_user`,`to_user_deleted`,`id`), ADD KEY `to_user_to_user_deleted_from_user_is_new` (`to_user`,`to_user_deleted`,`from_user`,`is_new`), ADD KEY `from_user_to_user_is_new` (`from_user`,`to_user`,`is_new`), ADD KEY `is_new_to_user_to_user_deleted_id` (`is_new`,`to_user`,`to_user_deleted`,`id`);

--
-- Indexes for table `im_open`
--
ALTER TABLE `im_open`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `from` (`from_user`,`to_user`), ADD KEY `to` (`to_user`), ADD KEY `mid` (`mid`), ADD KEY `from_user_is_new_msg_z_mid` (`from_user`,`is_new_msg`,`z`,`mid`);

--
-- Indexes for table `info`
--
ALTER TABLE `info`
 ADD UNIQUE KEY `page` (`page`,`lang`);

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`), ADD KEY `category` (`category`), ADD KEY `interest` (`interest`), ADD KEY `counter` (`counter`);

--
-- Indexes for table `invites`
--
ALTER TABLE `invites`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ip_block`
--
ALTER TABLE `ip_block`
 ADD PRIMARY KEY (`id`), ADD KEY `ip` (`ip`);

--
-- Indexes for table `mail_folder`
--
ALTER TABLE `mail_folder`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `mail_msg`
--
ALTER TABLE `mail_msg`
 ADD PRIMARY KEY (`id`), ADD KEY `from_user` (`user_from`), ADD KEY `to_user` (`user_to`);

--
-- Indexes for table `massmail`
--
ALTER TABLE `massmail`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `music_category`
--
ALTER TABLE `music_category`
 ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `music_musician`
--
ALTER TABLE `music_musician`
 ADD PRIMARY KEY (`musician_id`), ADD KEY `category_id` (`category_id`), ADD KEY `country_id` (`country_id`), ADD KEY `user_id` (`user_id`), ADD KEY `musician_rating` (`musician_rating`), ADD KEY `musician_has_images` (`musician_has_images`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `music_musician_comment`
--
ALTER TABLE `music_musician_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `musician_id` (`musician_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `music_musician_image`
--
ALTER TABLE `music_musician_image`
 ADD PRIMARY KEY (`image_id`), ADD KEY `musician_id` (`musician_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `music_musician_vote`
--
ALTER TABLE `music_musician_vote`
 ADD PRIMARY KEY (`vote_id`), ADD KEY `musician_id` (`musician_id`);

--
-- Indexes for table `music_setting`
--
ALTER TABLE `music_setting`
 ADD PRIMARY KEY (`setting_id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `music_song`
--
ALTER TABLE `music_song`
 ADD PRIMARY KEY (`song_id`), ADD KEY `musician_id` (`musician_id`), ADD KEY `user_id` (`user_id`), ADD KEY `rating` (`song_rating`), ADD KEY `has_images` (`song_has_images`), ADD KEY `n_comments` (`song_n_comments`), ADD KEY `n_plays` (`song_n_plays`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `music_song_comment`
--
ALTER TABLE `music_song_comment`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `song_id` (`song_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `music_song_image`
--
ALTER TABLE `music_song_image`
 ADD PRIMARY KEY (`image_id`), ADD KEY `song_id` (`song_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `music_song_vote`
--
ALTER TABLE `music_song_vote`
 ADD PRIMARY KEY (`vote_id`), ADD KEY `song_id` (`song_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
 ADD PRIMARY KEY (`id`), ADD KEY `cat` (`cat`);

--
-- Indexes for table `news_cats`
--
ALTER TABLE `news_cats`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `object`
--
ALTER TABLE `object`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `object_type`
--
ALTER TABLE `object_type`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outside_image`
--
ALTER TABLE `outside_image`
 ADD PRIMARY KEY (`image_id`), ADD KEY `outside_url` (`outside_url`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
 ADD PRIMARY KEY (`id`), ADD KEY `menu_title` (`menu_title`), ADD KEY `lang` (`lang`), ADD KEY `status` (`status`), ADD KEY `section` (`section`), ADD KEY `lang_2` (`lang`), ADD KEY `position` (`position`);

--
-- Indexes for table `partner`
--
ALTER TABLE `partner`
 ADD PRIMARY KEY (`partner_id`);

--
-- Indexes for table `partner_banners`
--
ALTER TABLE `partner_banners`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partner_faq`
--
ALTER TABLE `partner_faq`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partner_main`
--
ALTER TABLE `partner_main`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partner_terms`
--
ALTER TABLE `partner_terms`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partner_tips`
--
ALTER TABLE `partner_tips`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_after`
--
ALTER TABLE `payment_after`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_before`
--
ALTER TABLE `payment_before`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_cat`
--
ALTER TABLE `payment_cat`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_features`
--
ALTER TABLE `payment_features`
 ADD KEY `id` (`id`), ADD KEY `alias` (`alias`);

--
-- Indexes for table `payment_log`
--
ALTER TABLE `payment_log`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_plan`
--
ALTER TABLE `payment_plan`
 ADD PRIMARY KEY (`item`);

--
-- Indexes for table `payment_price`
--
ALTER TABLE `payment_price`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_type`
--
ALTER TABLE `payment_type`
 ADD PRIMARY KEY (`type`,`code`), ADD KEY `type` (`type`), ADD KEY `code` (`code`);

--
-- Indexes for table `photo`
--
ALTER TABLE `photo`
 ADD PRIMARY KEY (`photo_id`), ADD KEY `user_id_2` (`user_id`,`visible`), ADD KEY `photo_id` (`photo_id`,`user_id`), ADD KEY `visible` (`visible`), ADD KEY `user_id` (`user_id`), ADD KEY `wall_id` (`wall_id`), ADD KEY `private` (`private`), ADD KEY `default` (`default`), ADD KEY `date` (`date`), ADD KEY `hide_header` (`hide_header`);

--
-- Indexes for table `photo_comments`
--
ALTER TABLE `photo_comments`
 ADD PRIMARY KEY (`id`), ADD KEY `photo_id` (`photo_id`), ADD KEY `date` (`date`), ADD KEY `is_new` (`is_new`), ADD KEY `parent_id` (`parent_id`), ADD KEY `id_parent_id` (`id`,`parent_id`), ADD KEY `photo_id_parent_id` (`photo_id`,`parent_id`), ADD KEY `parent_user_id` (`parent_user_id`);

--
-- Indexes for table `photo_comments_likes`
--
ALTER TABLE `photo_comments_likes`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `user_id_cid` (`user_id`,`cid`,`photo_id`), ADD KEY `cid_id` (`cid`,`id`), ADD KEY `date` (`date`), ADD KEY `is_new` (`is_new`);

--
-- Indexes for table `photo_rate`
--
ALTER TABLE `photo_rate`
 ADD PRIMARY KEY (`id`), ADD KEY `photo_id` (`photo_id`), ADD KEY `photo_user_id` (`photo_user_id`,`visible`,`is_new`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `photo_tags`
--
ALTER TABLE `photo_tags`
 ADD PRIMARY KEY (`id`), ADD KEY `tag` (`tag`), ADD KEY `counter` (`counter`);

--
-- Indexes for table `photo_tags_relations`
--
ALTER TABLE `photo_tags_relations`
 ADD PRIMARY KEY (`id`), ADD KEY `photo_id` (`photo_id`), ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `places_category`
--
ALTER TABLE `places_category`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `places_place`
--
ALTER TABLE `places_place`
 ADD PRIMARY KEY (`id`), ADD KEY `category_id` (`category_id`), ADD KEY `city_id` (`city_id`), ADD KEY `user_id` (`user_id`), ADD KEY `rating` (`rating`), ADD KEY `has_images` (`has_images`), ADD KEY `n_reviews` (`n_reviews`), ADD KEY `reviews_rating` (`reviews_rating`);

--
-- Indexes for table `places_place_image`
--
ALTER TABLE `places_place_image`
 ADD PRIMARY KEY (`id`), ADD KEY `place_id` (`place_id`), ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `places_place_vote`
--
ALTER TABLE `places_place_vote`
 ADD PRIMARY KEY (`id`), ADD KEY `place_id` (`place_id`);

--
-- Indexes for table `places_review`
--
ALTER TABLE `places_review`
 ADD PRIMARY KEY (`id`), ADD KEY `place_id` (`place_id`,`user_id`);

--
-- Indexes for table `places_review_vote`
--
ALTER TABLE `places_review_vote`
 ADD PRIMARY KEY (`id`), ADD KEY `review_id` (`review_id`);

--
-- Indexes for table `profile_status`
--
ALTER TABLE `profile_status`
 ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `search_save`
--
ALTER TABLE `search_save`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `seo`
--
ALTER TABLE `seo`
 ADD PRIMARY KEY (`id`), ADD KEY `lang` (`lang`,`default`), ADD FULLTEXT KEY `url` (`url`);

--
-- Indexes for table `spotlight`
--
ALTER TABLE `spotlight`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stats`
--
ALTER TABLE `stats`
 ADD PRIMARY KEY (`date`,`orientation`);

--
-- Indexes for table `texts`
--
ALTER TABLE `texts`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `update_geo_city_backup`
--
ALTER TABLE `update_geo_city_backup`
 ADD PRIMARY KEY (`city_id`), ADD KEY `country_id` (`country_id`), ADD KEY `state_id` (`state_id`), ADD KEY `lat` (`lat`), ADD KEY `long` (`long`), ADD KEY `hidden` (`hidden`);

--
-- Indexes for table `update_geo_state_backup`
--
ALTER TABLE `update_geo_state_backup`
 ADD PRIMARY KEY (`state_id`), ADD KEY `country_id` (`country_id`), ADD KEY `hidden` (`hidden`);

--
-- Indexes for table `update_userinfo_backup`
--
ALTER TABLE `update_userinfo_backup`
 ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`user_id`), ADD UNIQUE KEY `mail` (`mail`), ADD KEY `country_id` (`country_id`), ADD KEY `state_id` (`state_id`), ADD KEY `city_id` (`city_id`), ADD KEY `hide_time` (`hide_time`), ADD KEY `register` (`register`), ADD KEY `orientation` (`orientation`), ADD KEY `orientation_2` (`orientation`,`last_visit`), ADD KEY `is_photo` (`is_photo`), ADD KEY `name` (`name`), ADD KEY `orientation_3` (`orientation`,`city_id`,`register`), ADD KEY `city_id_2` (`city_id`,`register`), ADD KEY `is_photo_2` (`is_photo`,`register`), ADD KEY `blog_fields` (`blog_visits`,`blog_comments`,`blog_posts`), ADD KEY `last_visit` (`last_visit`), ADD KEY `popularity` (`popularity`), ADD KEY `date_search` (`date_search`), ADD KEY `date_encounters` (`date_encounters`), ADD KEY `i_am_here_to` (`i_am_here_to`), ADD KEY `ban_global` (`ban_global`), ADD KEY `gold_days` (`gold_days`), ADD KEY `payment_day` (`payment_day`), ADD KEY `payment_hour` (`payment_hour`), ADD KEY `facebook_id` (`facebook_id`), ADD KEY `google_plus_id` (`google_plus_id`), ADD KEY `twitter_id` (`twitter_id`), ADD KEY `linkedin_id` (`linkedin_id`), ADD KEY `vk_id` (`vk_id`), ADD KEY `name_seo` (`name_seo`), ADD KEY `hide_time_2` (`hide_time`,`user_id`,`last_visit`), ADD KEY `city_id_popularity` (`city_id`,`popularity`), ADD KEY `birth` (`birth`), ADD KEY `is_photo_date_search_user_id` (`is_photo`,`date_search`,`user_id`), ADD KEY `is_photo_date_encounters_user_id` (`is_photo`,`date_encounters`,`user_id`), ADD KEY `is_photo_user_id` (`is_photo`,`user_id`), ADD KEY `hide_time_use_as_online` (`hide_time`,`use_as_online`), ADD KEY `active_code` (`active_code`), ADD KEY `country_id_set_hide_my_presence` (`country_id`,`set_hide_my_presence`), ADD KEY `geo_position_lat` (`geo_position_lat`), ADD KEY `geo_position_long` (`geo_position_long`);

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
 ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `userpartner`
--
ALTER TABLE `userpartner`
 ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_block`
--
ALTER TABLE `users_block`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`), ADD KEY `user_to` (`user_to`);

--
-- Indexes for table `users_checkbox`
--
ALTER TABLE `users_checkbox`
 ADD UNIQUE KEY `field_user_id_value` (`field`,`user_id`,`value`), ADD KEY `field` (`field`,`value`);

--
-- Indexes for table `users_comments`
--
ALTER TABLE `users_comments`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_favorite`
--
ALTER TABLE `users_favorite`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`), ADD KEY `user_to` (`user_to`);

--
-- Indexes for table `users_flash`
--
ALTER TABLE `users_flash`
 ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users_interest`
--
ALTER TABLE `users_interest`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`), ADD KEY `user_to` (`user_to`), ADD KEY `user_to_id` (`user_to`,`id`);

--
-- Indexes for table `users_private_note`
--
ALTER TABLE `users_private_note`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_reports`
--
ALTER TABLE `users_reports`
 ADD PRIMARY KEY (`id`), ADD KEY `from_user` (`user_from`), ADD KEY `to_user` (`user_to`);

--
-- Indexes for table `users_view`
--
ALTER TABLE `users_view`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`), ADD KEY `user_to` (`user_to`), ADD KEY `user_to_id` (`user_to`,`id`), ADD KEY `user_from_user_to` (`user_from`,`user_to`), ADD KEY `user_from_id` (`user_from`,`id`);

--
-- Indexes for table `users_visitors`
--
ALTER TABLE `users_visitors`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`), ADD KEY `user_to` (`user_to`);

--
-- Indexes for table `user_block_list`
--
ALTER TABLE `user_block_list`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`,`user_to`), ADD KEY `user_from_2` (`user_from`), ADD KEY `user_to` (`user_to`);

--
-- Indexes for table `user_chart_random_value`
--
ALTER TABLE `user_chart_random_value`
 ADD PRIMARY KEY (`id`), ADD KEY `user_from` (`user_from`), ADD KEY `user_to` (`user_to`), ADD KEY `chart` (`chart`);

--
-- Indexes for table `user_gift`
--
ALTER TABLE `user_gift`
 ADD PRIMARY KEY (`id`), ADD KEY `from_user` (`user_from`), ADD KEY `to_user` (`user_to`);

--
-- Indexes for table `user_interests`
--
ALTER TABLE `user_interests`
 ADD KEY `user_id` (`user_id`), ADD KEY `interest` (`interest`), ADD KEY `wall_id` (`wall_id`), ADD KEY `id` (`id`);

--
-- Indexes for table `var_age_preference`
--
ALTER TABLE `var_age_preference`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_appearance`
--
ALTER TABLE `var_appearance`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_body`
--
ALTER TABLE `var_body`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_career`
--
ALTER TABLE `var_career`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_drinking`
--
ALTER TABLE `var_drinking`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_education`
--
ALTER TABLE `var_education`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_ethnicity`
--
ALTER TABLE `var_ethnicity`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_eye`
--
ALTER TABLE `var_eye`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_family`
--
ALTER TABLE `var_family`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_first_date`
--
ALTER TABLE `var_first_date`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_hair`
--
ALTER TABLE `var_hair`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_height`
--
ALTER TABLE `var_height`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_hobbies`
--
ALTER TABLE `var_hobbies`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_humor`
--
ALTER TABLE `var_humor`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_income`
--
ALTER TABLE `var_income`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_language`
--
ALTER TABLE `var_language`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_level_of_faith`
--
ALTER TABLE `var_level_of_faith`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_live_where`
--
ALTER TABLE `var_live_where`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_living_with`
--
ALTER TABLE `var_living_with`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_religion`
--
ALTER TABLE `var_religion`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_sexuality`
--
ALTER TABLE `var_sexuality`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_smoking`
--
ALTER TABLE `var_smoking`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_spending_habits`
--
ALTER TABLE `var_spending_habits`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_star_sign`
--
ALTER TABLE `var_star_sign`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_status`
--
ALTER TABLE `var_status`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `var_weight`
--
ALTER TABLE `var_weight`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video_invite`
--
ALTER TABLE `video_invite`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video_reject`
--
ALTER TABLE `video_reject`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vids_category`
--
ALTER TABLE `vids_category`
 ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `vids_comment`
--
ALTER TABLE `vids_comment`
 ADD PRIMARY KEY (`id`), ADD KEY `dt` (`dt`), ADD KEY `is_new` (`is_new`), ADD KEY `parent_id` (`parent_id`), ADD KEY `parent_user_id` (`parent_user_id`), ADD KEY `video_id_parent_id` (`video_id`,`parent_id`);

--
-- Indexes for table `vids_comments_likes`
--
ALTER TABLE `vids_comments_likes`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `user_id_cid` (`user_id`,`cid`,`video_id`), ADD KEY `cid_id` (`cid`,`id`), ADD KEY `date` (`date`), ADD KEY `is_new` (`is_new`);

--
-- Indexes for table `vids_rate`
--
ALTER TABLE `vids_rate`
 ADD PRIMARY KEY (`video_id`,`user_id`);

--
-- Indexes for table `vids_subscribe`
--
ALTER TABLE `vids_subscribe`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vids_tags`
--
ALTER TABLE `vids_tags`
 ADD PRIMARY KEY (`id`), ADD KEY `tag` (`tag`), ADD KEY `counter` (`counter`);

--
-- Indexes for table `vids_tags_relations`
--
ALTER TABLE `vids_tags_relations`
 ADD PRIMARY KEY (`id`), ADD KEY `video_id` (`video_id`), ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `vids_video`
--
ALTER TABLE `vids_video`
 ADD PRIMARY KEY (`id`), ADD KEY `hide_header` (`hide_header`);

--
-- Indexes for table `wall`
--
ALTER TABLE `wall`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`), ADD KEY `section_item_id` (`section`,`item_id`);

--
-- Indexes for table `wall_comments`
--
ALTER TABLE `wall_comments`
 ADD PRIMARY KEY (`id`), ADD KEY `wall_item_id_user_id_id` (`wall_item_id`,`user_id`,`id`), ADD KEY `date` (`date`), ADD KEY `is_new` (`is_new`), ADD KEY `parent_id` (`parent_id`), ADD KEY `parent_user_id` (`parent_user_id`), ADD KEY `id_parent_id` (`id`,`parent_id`);

--
-- Indexes for table `wall_comments_likes`
--
ALTER TABLE `wall_comments_likes`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `user_id_cid` (`user_id`,`cid`), ADD KEY `date` (`date`), ADD KEY `is_new` (`is_new`), ADD KEY `cid_id` (`cid`,`id`);

--
-- Indexes for table `wall_comments_viewed`
--
ALTER TABLE `wall_comments_viewed`
 ADD KEY `user_id` (`user_id`), ADD KEY `item_id` (`item_id`), ADD KEY `user_id_item_id_id` (`user_id`,`item_id`,`id`);

--
-- Indexes for table `wall_items_for_user`
--
ALTER TABLE `wall_items_for_user`
 ADD UNIQUE KEY `user_id` (`user_id`,`item_id`,`section`), ADD KEY `item_id` (`item_id`,`section`);

--
-- Indexes for table `wall_likes`
--
ALTER TABLE `wall_likes`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `user_id` (`user_id`,`wall_item_id`), ADD KEY `wall_item_id_id` (`wall_item_id`,`id`);

--
-- Indexes for table `wall_stats`
--
ALTER TABLE `wall_stats`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `20k_ww_elite`
--
ALTER TABLE `20k_ww_elite`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=411129;
--
-- AUTO_INCREMENT for table `admin_login`
--
ALTER TABLE `admin_login`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=649;
--
-- AUTO_INCREMENT for table `admin_replier`
--
ALTER TABLE `admin_replier`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `adv_cars`
--
ALTER TABLE `adv_cars`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_casting`
--
ALTER TABLE `adv_casting`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_cats`
--
ALTER TABLE `adv_cats`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `adv_film`
--
ALTER TABLE `adv_film`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_housting`
--
ALTER TABLE `adv_housting`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_images`
--
ALTER TABLE `adv_images`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_items`
--
ALTER TABLE `adv_items`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_jobs`
--
ALTER TABLE `adv_jobs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_music`
--
ALTER TABLE `adv_music`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_myspace`
--
ALTER TABLE `adv_myspace`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_personals`
--
ALTER TABLE `adv_personals`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_razd`
--
ALTER TABLE `adv_razd`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=128;
--
-- AUTO_INCREMENT for table `adv_sale`
--
ALTER TABLE `adv_sale`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `adv_services`
--
ALTER TABLE `adv_services`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `audio_invite`
--
ALTER TABLE `audio_invite`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=830;
--
-- AUTO_INCREMENT for table `audio_reject`
--
ALTER TABLE `audio_reject`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=340;
--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
MODIFY `id` int(5) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `banners_places`
--
ALTER TABLE `banners_places`
MODIFY `id` int(5) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `blogs_comment`
--
ALTER TABLE `blogs_comment`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=487;
--
-- AUTO_INCREMENT for table `blogs_hotsearch`
--
ALTER TABLE `blogs_hotsearch`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4822;
--
-- AUTO_INCREMENT for table `blogs_post`
--
ALTER TABLE `blogs_post`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15472;
--
-- AUTO_INCREMENT for table `blogs_subscribe`
--
ALTER TABLE `blogs_subscribe`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `chat_chair`
--
ALTER TABLE `chat_chair`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `chat_line`
--
ALTER TABLE `chat_line`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `chat_room`
--
ALTER TABLE `chat_room`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `city_avatar_face`
--
ALTER TABLE `city_avatar_face`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_avatar_face_default`
--
ALTER TABLE `city_avatar_face_default`
MODIFY `id` int(5) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `city_custom_data`
--
ALTER TABLE `city_custom_data`
MODIFY `data_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_invite`
--
ALTER TABLE `city_invite`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_link`
--
ALTER TABLE `city_link`
MODIFY `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `city_moving`
--
ALTER TABLE `city_moving`
MODIFY `step` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_msg`
--
ALTER TABLE `city_msg`
MODIFY `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_msg_backup`
--
ALTER TABLE `city_msg_backup`
MODIFY `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_open`
--
ALTER TABLE `city_open`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_photo`
--
ALTER TABLE `city_photo`
MODIFY `photo_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_reject`
--
ALTER TABLE `city_reject`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_rooms`
--
ALTER TABLE `city_rooms`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT for table `city_temp`
--
ALTER TABLE `city_temp`
MODIFY `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_users`
--
ALTER TABLE `city_users`
MODIFY `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `city_users_in_rooms`
--
ALTER TABLE `city_users_in_rooms`
MODIFY `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `col_order`
--
ALTER TABLE `col_order`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=163;
--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1211;
--
-- AUTO_INCREMENT for table `const_horoscope`
--
ALTER TABLE `const_horoscope`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `const_interests`
--
ALTER TABLE `const_interests`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `const_i_am_here_to`
--
ALTER TABLE `const_i_am_here_to`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `const_looking`
--
ALTER TABLE `const_looking`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `const_orientation`
--
ALTER TABLE `const_orientation`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `const_relation`
--
ALTER TABLE `const_relation`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=132;
--
-- AUTO_INCREMENT for table `contact_partner`
--
ALTER TABLE `contact_partner`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `email`
--
ALTER TABLE `email`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21369;
--
-- AUTO_INCREMENT for table `email_auto`
--
ALTER TABLE `email_auto`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=47;
--
-- AUTO_INCREMENT for table `email_auto_settings`
--
ALTER TABLE `email_auto_settings`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `email_queue`
--
ALTER TABLE `email_queue`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `encounters`
--
ALTER TABLE `encounters`
MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=79680;
--
-- AUTO_INCREMENT for table `events_category`
--
ALTER TABLE `events_category`
MODIFY `category_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `events_event`
--
ALTER TABLE `events_event`
MODIFY `event_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events_event_comment`
--
ALTER TABLE `events_event_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events_event_comment_comment`
--
ALTER TABLE `events_event_comment_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events_event_guest`
--
ALTER TABLE `events_event_guest`
MODIFY `guest_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events_event_image`
--
ALTER TABLE `events_event_image`
MODIFY `image_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `events_setting`
--
ALTER TABLE `events_setting`
MODIFY `setting_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `flashchat_messages`
--
ALTER TABLE `flashchat_messages`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3357;
--
-- AUTO_INCREMENT for table `flashchat_rooms`
--
ALTER TABLE `flashchat_rooms`
MODIFY `id` int(5) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `flashchat_users`
--
ALTER TABLE `flashchat_users`
MODIFY `id` int(5) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=821;
--
-- AUTO_INCREMENT for table `forum_category`
--
ALTER TABLE `forum_category`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `forum_forum`
--
ALTER TABLE `forum_forum`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `forum_message`
--
ALTER TABLE `forum_message`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `forum_setting`
--
ALTER TABLE `forum_setting`
MODIFY `setting_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `forum_topic`
--
ALTER TABLE `forum_topic`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `gallery_albums`
--
ALTER TABLE `gallery_albums`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `gallery_comments`
--
ALTER TABLE `gallery_comments`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `gallery_images`
--
ALTER TABLE `gallery_images`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=76;
--
-- AUTO_INCREMENT for table `game_chess`
--
ALTER TABLE `game_chess`
MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_invite`
--
ALTER TABLE `game_invite`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_morboy`
--
ALTER TABLE `game_morboy`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_reject`
--
ALTER TABLE `game_reject`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_shashki`
--
ALTER TABLE `game_shashki`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `geo_city`
--
ALTER TABLE `geo_city`
MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=136736;
--
-- AUTO_INCREMENT for table `geo_country`
--
ALTER TABLE `geo_country`
MODIFY `country_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=244;
--
-- AUTO_INCREMENT for table `geo_state`
--
ALTER TABLE `geo_state`
MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4174;
--
-- AUTO_INCREMENT for table `gifts`
--
ALTER TABLE `gifts`
MODIFY `id` int(5) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=53;
--
-- AUTO_INCREMENT for table `gifts_set`
--
ALTER TABLE `gifts_set`
MODIFY `id` int(5) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `groups_category`
--
ALTER TABLE `groups_category`
MODIFY `category_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `groups_forum`
--
ALTER TABLE `groups_forum`
MODIFY `forum_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_forum_comment`
--
ALTER TABLE `groups_forum_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_forum_comment_comment`
--
ALTER TABLE `groups_forum_comment_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_group`
--
ALTER TABLE `groups_group`
MODIFY `group_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_group_comment`
--
ALTER TABLE `groups_group_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_group_comment_comment`
--
ALTER TABLE `groups_group_comment_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_group_image`
--
ALTER TABLE `groups_group_image`
MODIFY `image_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_group_member`
--
ALTER TABLE `groups_group_member`
MODIFY `member_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_invite`
--
ALTER TABLE `groups_invite`
MODIFY `invite_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups_setting`
--
ALTER TABLE `groups_setting`
MODIFY `setting_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `help_answer`
--
ALTER TABLE `help_answer`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `help_topic`
--
ALTER TABLE `help_topic`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `im_msg`
--
ALTER TABLE `im_msg`
MODIFY `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34800;
--
-- AUTO_INCREMENT for table `im_open`
--
ALTER TABLE `im_open`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31978;
--
-- AUTO_INCREMENT for table `interests`
--
ALTER TABLE `interests`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1440;
--
-- AUTO_INCREMENT for table `invites`
--
ALTER TABLE `invites`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ip_block`
--
ALTER TABLE `ip_block`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `mail_folder`
--
ALTER TABLE `mail_folder`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `mail_msg`
--
ALTER TABLE `mail_msg`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `massmail`
--
ALTER TABLE `massmail`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `music_category`
--
ALTER TABLE `music_category`
MODIFY `category_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `music_musician`
--
ALTER TABLE `music_musician`
MODIFY `musician_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `music_musician_comment`
--
ALTER TABLE `music_musician_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `music_musician_image`
--
ALTER TABLE `music_musician_image`
MODIFY `image_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `music_musician_vote`
--
ALTER TABLE `music_musician_vote`
MODIFY `vote_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `music_setting`
--
ALTER TABLE `music_setting`
MODIFY `setting_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `music_song`
--
ALTER TABLE `music_song`
MODIFY `song_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `music_song_comment`
--
ALTER TABLE `music_song_comment`
MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `music_song_image`
--
ALTER TABLE `music_song_image`
MODIFY `image_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `music_song_vote`
--
ALTER TABLE `music_song_vote`
MODIFY `vote_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `news_cats`
--
ALTER TABLE `news_cats`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `object`
--
ALTER TABLE `object`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `object_type`
--
ALTER TABLE `object_type`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `outside_image`
--
ALTER TABLE `outside_image`
MODIFY `image_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=176;
--
-- AUTO_INCREMENT for table `partner`
--
ALTER TABLE `partner`
MODIFY `partner_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `partner_banners`
--
ALTER TABLE `partner_banners`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `partner_faq`
--
ALTER TABLE `partner_faq`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `partner_main`
--
ALTER TABLE `partner_main`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `partner_terms`
--
ALTER TABLE `partner_terms`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `partner_tips`
--
ALTER TABLE `partner_tips`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `payment_after`
--
ALTER TABLE `payment_after`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `payment_before`
--
ALTER TABLE `payment_before`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1069;
--
-- AUTO_INCREMENT for table `payment_cat`
--
ALTER TABLE `payment_cat`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `payment_features`
--
ALTER TABLE `payment_features`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `payment_log`
--
ALTER TABLE `payment_log`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `payment_plan`
--
ALTER TABLE `payment_plan`
MODIFY `item` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `payment_price`
--
ALTER TABLE `payment_price`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
MODIFY `photo_id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1087622;
--
-- AUTO_INCREMENT for table `photo_comments`
--
ALTER TABLE `photo_comments`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3026;
--
-- AUTO_INCREMENT for table `photo_comments_likes`
--
ALTER TABLE `photo_comments_likes`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=52;
--
-- AUTO_INCREMENT for table `photo_rate`
--
ALTER TABLE `photo_rate`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3208;
--
-- AUTO_INCREMENT for table `photo_tags`
--
ALTER TABLE `photo_tags`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `photo_tags_relations`
--
ALTER TABLE `photo_tags_relations`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `places_category`
--
ALTER TABLE `places_category`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `places_place`
--
ALTER TABLE `places_place`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `places_place_image`
--
ALTER TABLE `places_place_image`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `places_place_vote`
--
ALTER TABLE `places_place_vote`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `places_review`
--
ALTER TABLE `places_review`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `places_review_vote`
--
ALTER TABLE `places_review_vote`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `search_save`
--
ALTER TABLE `search_save`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `seo`
--
ALTER TABLE `seo`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `spotlight`
--
ALTER TABLE `spotlight`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=171;
--
-- AUTO_INCREMENT for table `texts`
--
ALTER TABLE `texts`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `update_geo_city_backup`
--
ALTER TABLE `update_geo_city_backup`
MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=136736;
--
-- AUTO_INCREMENT for table `update_geo_state_backup`
--
ALTER TABLE `update_geo_state_backup`
MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3172;
--
-- AUTO_INCREMENT for table `update_userinfo_backup`
--
ALTER TABLE `update_userinfo_backup`
MODIFY `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=432114;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
MODIFY `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=432418;
--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
MODIFY `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=432418;
--
-- AUTO_INCREMENT for table `userpartner`
--
ALTER TABLE `userpartner`
MODIFY `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=432418;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users_block`
--
ALTER TABLE `users_block`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users_comments`
--
ALTER TABLE `users_comments`
MODIFY `id` mediumint(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users_favorite`
--
ALTER TABLE `users_favorite`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `users_interest`
--
ALTER TABLE `users_interest`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users_private_note`
--
ALTER TABLE `users_private_note`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=265;
--
-- AUTO_INCREMENT for table `users_reports`
--
ALTER TABLE `users_reports`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `users_view`
--
ALTER TABLE `users_view`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=101427;
--
-- AUTO_INCREMENT for table `users_visitors`
--
ALTER TABLE `users_visitors`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=78;
--
-- AUTO_INCREMENT for table `user_block_list`
--
ALTER TABLE `user_block_list`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=407;
--
-- AUTO_INCREMENT for table `user_chart_random_value`
--
ALTER TABLE `user_chart_random_value`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user_gift`
--
ALTER TABLE `user_gift`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1581;
--
-- AUTO_INCREMENT for table `user_interests`
--
ALTER TABLE `user_interests`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9366;
--
-- AUTO_INCREMENT for table `var_age_preference`
--
ALTER TABLE `var_age_preference`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `var_appearance`
--
ALTER TABLE `var_appearance`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `var_body`
--
ALTER TABLE `var_body`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `var_career`
--
ALTER TABLE `var_career`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `var_drinking`
--
ALTER TABLE `var_drinking`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `var_education`
--
ALTER TABLE `var_education`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `var_ethnicity`
--
ALTER TABLE `var_ethnicity`
MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `var_eye`
--
ALTER TABLE `var_eye`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `var_family`
--
ALTER TABLE `var_family`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `var_first_date`
--
ALTER TABLE `var_first_date`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `var_hair`
--
ALTER TABLE `var_hair`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `var_height`
--
ALTER TABLE `var_height`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=38;
--
-- AUTO_INCREMENT for table `var_hobbies`
--
ALTER TABLE `var_hobbies`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `var_humor`
--
ALTER TABLE `var_humor`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `var_income`
--
ALTER TABLE `var_income`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `var_language`
--
ALTER TABLE `var_language`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=79;
--
-- AUTO_INCREMENT for table `var_level_of_faith`
--
ALTER TABLE `var_level_of_faith`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `var_live_where`
--
ALTER TABLE `var_live_where`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `var_living_with`
--
ALTER TABLE `var_living_with`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `var_religion`
--
ALTER TABLE `var_religion`
MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `var_sexuality`
--
ALTER TABLE `var_sexuality`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `var_smoking`
--
ALTER TABLE `var_smoking`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `var_spending_habits`
--
ALTER TABLE `var_spending_habits`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `var_star_sign`
--
ALTER TABLE `var_star_sign`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `var_status`
--
ALTER TABLE `var_status`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `var_weight`
--
ALTER TABLE `var_weight`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=104;
--
-- AUTO_INCREMENT for table `video_invite`
--
ALTER TABLE `video_invite`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=650;
--
-- AUTO_INCREMENT for table `video_reject`
--
ALTER TABLE `video_reject`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=305;
--
-- AUTO_INCREMENT for table `vids_category`
--
ALTER TABLE `vids_category`
MODIFY `category_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `vids_comment`
--
ALTER TABLE `vids_comment`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `vids_comments_likes`
--
ALTER TABLE `vids_comments_likes`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `vids_subscribe`
--
ALTER TABLE `vids_subscribe`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `vids_tags`
--
ALTER TABLE `vids_tags`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `vids_tags_relations`
--
ALTER TABLE `vids_tags_relations`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `vids_video`
--
ALTER TABLE `vids_video`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `wall`
--
ALTER TABLE `wall`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=47921;
--
-- AUTO_INCREMENT for table `wall_comments`
--
ALTER TABLE `wall_comments`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=189;
--
-- AUTO_INCREMENT for table `wall_comments_likes`
--
ALTER TABLE `wall_comments_likes`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=58;
--
-- AUTO_INCREMENT for table `wall_likes`
--
ALTER TABLE `wall_likes`
MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1812;
--
-- AUTO_INCREMENT for table `wall_stats`
--
ALTER TABLE `wall_stats`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
