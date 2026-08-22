-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: trangcdtt
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Nike','nike','nike.jpg','2026-07-30 06:49:36',0),(2,'Adidas','adidas','adidas.jpg','2026-07-30 06:49:36',0),(3,'Puma','puma','puma.jpg','2026-07-30 06:52:47',0),(4,'Jordan','jordan','jordan.jpg','2026-08-10 02:46:33',0),(5,'Balenciaga','balenciaga','balenciaga.jpg','2026-08-10 02:46:33',0),(6,'Manduka','manduka',NULL,'2026-08-12 02:40:33',1);
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  KEY `fk_cart_items_variant` (`variant_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,'2026-08-02 09:05:16'),(2,2,'2026-08-03 03:28:25');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Áo Nam','ao-nam','2026-07-30 07:28:09',0),(2,'Quần Nam','quan-nam','2026-07-30 07:28:09',0),(3,'Phụ Kiện','phu-kien','2026-07-30 07:28:09',0),(4,'Áo Khoác Nam','ao-khoac-nam','2026-07-30 07:35:02',0),(5,'Giày Thể Thao','giay-the-thao','2026-08-10 02:46:33',0),(6,'Bộ Đồ Thể Thao','bo-do-the-thao','2026-08-10 02:46:33',0),(7,'Áo Nữ','ao-nu','2026-08-10 03:19:48',0),(8,'Quần Nữ','quan-nu','2026-08-10 03:19:48',0),(9,'Áo Khoác Nữ','ao-khoac-nu','2026-08-10 03:19:48',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(100) NOT NULL,
  `sender_name` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,'user_2','Trang Si','tôi muốn mua đồ free thôi. chứ tôi ko có tiền',0,'2026-08-17 03:08:34'),(2,'user_2','Admin Store','bạn có học qua lớp của thầy huấn chưa. hay trốn học buổi đó',1,'2026-08-17 03:09:20'),(3,'user_2','Trang Si','à tôi có vào rồi. nhưng mà tôi ko thích ăn shit. tôi chỉ muốn ăn đồ của shop free thôi',0,'2026-08-17 03:09:52'),(4,'user_2_1786938301495','Trang Si (Cuộc trò chuyện #2)','tôi muốn mua đồ free. chứ tôi ko có tiền ',0,'2026-08-17 03:45:15'),(5,'user_2_1786938301495','Admin Store','bạn bỏ học buổi học thầy huấn dạy à',1,'2026-08-17 03:45:40'),(6,'user_2_1786938301495','Trang Si (Cuộc trò chuyện #2)','tôi biết. nm tôi ko thích ăn shit. tôi muốn ăn đồ free của shop bạn ',0,'2026-08-17 03:46:10'),(7,'user_2_1786938301495','Admin Store','vậy bạn đến địa chỉ shop vào đêm nay. tôi sẽ cho bạn đồ free shop tôi',1,'2026-08-17 03:47:19'),(8,'user_2_1786938301495','Trang Si (Cuộc trò chuyện #2)','tôi sợ mẹ mắng lắm. đi tới nhà đàn ông vào ban đêm  nguy hiểm.',0,'2026-08-17 03:47:55'),(9,'user_2_1786938301495','Trang Si (Cuộc trò chuyện #2)','nam nữ thụ thụ bất thân',0,'2026-08-17 03:48:07'),(10,'user_2_1786938301495','Admin Store','ai nói bạn tôi là đàn ông?',1,'2026-08-17 03:48:22'),(11,'user_2_1786938301495','Trang Si (Cuộc trò chuyện #2)','ồ les les',0,'2026-08-17 03:49:20'),(12,'user_2','Admin Store','ok',1,'2026-08-17 03:50:27'),(13,'user_2','Admin Store','vậy tới đây đêm nay với tôi',1,'2026-08-17 03:50:41'),(14,'user_2','Admin Store','tôi sẽ cho bạn đồ free của shop tôi trọn đời',1,'2026-08-17 03:50:59'),(15,'test_session_1787314407263','Khách hàng thử nghiệm','Tôi muốn tư vấn về giày đá bóng sân cỏ nhân tạo size 41.',0,'2026-08-21 12:13:27'),(16,'test_session_1787314407263','Admin Store','Chào bạn, shop hiện có mẫu giày Nike Mercurial và Adidas Predator size 41 phù hợp với sân cỏ nhân tạo nhé!',1,'2026-08-21 12:13:27'),(17,'user_2_1787314836685','Trang Si (Cuộc trò chuyện #2)','chào',0,'2026-08-21 12:20:42'),(18,'user_2_1787314836685','Admin Store','ừm. sao bạn',1,'2026-08-21 12:20:57'),(19,'user_2_1787314836685','Trang Si (Cuộc trò chuyện #2)','? tư vấn sản phẩm bên shop đi',0,'2026-08-21 12:21:16'),(20,'user_2_1787314836685','Admin Store','hay hỏi sản phẩm nào t mới tư vấn đucợ nhé. mày hỏi nkhac như thượng đế ddaaas à. hỏi cho rõ ràng',1,'2026-08-21 12:22:01'),(21,'user_2_1787314836685','Trang Si (Cuộc trò chuyện #2)','!!! ',0,'2026-08-21 12:22:14'),(22,'user_2_1787314940074','Trang Si (Cuộc trò chuyện #3)','Tôi cần tư vấn về sản phẩm: Tất Thể Thao Cổ Cao Nike Everyday (3 Đôi) Update (Mã: #6).',0,'2026-08-21 12:29:05'),(23,'user_2_1787314940074','Trang Si (Cuộc trò chuyện #3)','Tôi cần tư vấn về sản phẩm: Quần Dài Thể Thao Nam Adidas Ultimate365+ Twistweave Grid - Xanh Navy (Mã: #12).',0,'2026-08-21 12:41:25'),(24,'user_2_1787316151273','Trang Si (Cuộc trò chuyện #4)','Tôi cần tư vấn về sản phẩm: Áo Khoác Nam Adidas Kit 3-Stripes Full-Zip - Đen (Mã: #16).',0,'2026-08-21 12:42:33');
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `status` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contacts_products` (`product_id`),
  CONSTRAINT `fk_contacts_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Nguyễn Văn A','vana@gmail.com','0901234567','Shop ơi tư vấn giúp mình áo thun size L nhé.',0,'2026-07-30 07:36:07',0,NULL),(2,'Trần Thị B','tranb@gmail.com','0987654321','Shop ơi sản phẩm này còn hàng không ạ?',0,'2026-07-30 07:37:29',0,NULL),(3,'trang si','admin@gmail.com','0354717682','trang web quá tuyệt vời',0,'2026-08-02 09:53:26',0,NULL),(4,'Trang Si','admin1@gmail.com','','good',0,'2026-08-02 10:03:27',1,NULL),(5,'Trang Si','admin1@gmail.com','','Tôi muốn nhận tư vấn thêm về sản phẩm: Tất Thể Thao Cổ Cao Nike Everyday (3 Đôi) Update (Mã sản phẩm: #6).',0,'2026-08-17 03:03:45',0,6),(6,'Trang Si','admin1@gmail.com','','Tôi muốn nhận tư vấn thêm về sản phẩm: Áo Thun Nữ Nike Sportswear Classic Oversized - Đen (Mã sản phẩm: #31).',0,'2026-08-21 12:22:34',0,31);
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `fk_order_details_variant` (`variant_id`),
  CONSTRAINT `fk_order_details_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL,
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,3,3,112,2,1029000.00),(2,4,3,112,2,1029000.00),(3,5,2,108,2,894000.00),(4,6,7,136,1,2289000.00),(5,6,8,144,1,2289000.00),(6,7,2,109,1,894000.00),(7,8,2,109,1,894000.00);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (3,1,'Trang Test','0354717682','38 Gò Cát',2058000.00,'Đang giao','2026-08-17 02:08:08'),(4,1,'Trang Test','0354717682','38 Gò Cát',2058000.00,'Pending','2026-08-17 02:17:03'),(5,1,'Trang Test','0354717682','38 gò cát',1788000.00,'Pending','2026-08-17 02:17:49'),(6,1,'Trang Test','0354717682','38 gò cát',4578000.00,'Đã thanh toán','2026-08-17 02:19:14'),(7,2,'Trang Si','111','111',894000.00,'Pending','2026-08-21 12:30:12'),(8,2,'Trang Si','111','111',894000.00,'Pending','2026-08-21 12:31:49');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Mẹo phối đồ mùa hè cực chất cho nam giới','meo-phoi-do-mua-he','post1.jpg','Tổng hợp những cách phối đồ áo thun, quần jean cực kỳ năng động và thoáng mát trong mùa hè này...','2026-07-30 07:41:48',0),(2,'Xu hướng thời trang thu đông năm nay','xu-huong-thoi-trang-thu-dong','post2.jpg','Cùng khám phá những mẫu áo khoác và phong cách phối đồ ấm áp, lịch lãm cho mùa thu đông...','2026-07-30 07:43:52',0),(3,'PUMA appoints Dusan Hamlin as Vice President E-Commerce','puma-appoints-dusan-hamlin-as-vice-president-e-commerce','https://about.puma.com/sites/default/files/styles/dd_hero_tablet/public/media/news/images/puma-dusan-hamlin.webp?itok=dp_9oTTm','Sports company PUMA has appointed digital industry veteran Dusan Hamlin to the newly created role of Vice President E-Commerce with immediate effect. He will report to PUMA’s Chief Commercial Officer Matthias Bäumer.\nDusan has more than 25 years of experience in the industry and has previously led digital and E-Commerce transformations at both Reebok and adidas. In the more recent years, he has co-founded and managed several companies, including global performance marketing company M&C Saatchi Performance and digital innovation and design consultancy This Place. He has also held a long-term board position in Tokyo-listed software company Asteria Corporation.\n\nAt PUMA, Dusan will drive the global strategy and commercial direction of the company’s digital and E-Commerce businesses. This appointment follows the announcement in late 2025 to split PUMA’s direct-to-consumer business into two dedicated areas: Global Retail and Global E-Commerce.\n\n\n“With Dusan, we have found a proven digital transformation expert to take PUMA’s E-Commerce to the next level,” said Matthias Bäumer, PUMA’s Chief Commercial Officer. “Our digital channels have become increasingly important for our business in recent years. Considering this, it was crucial to establish dedicated e-commerce leadership to further develop our strategy and enhance the consumer experience across our website, apps and marketplaces.”\n\n\n“We have a massive opportunity at PUMA,” said Dusan Hamlin. “We continue to significantly improve our platform capabilities, and we are now putting in place a world class operating model and extended digital team to support our goals. Globally emerging technologies such as social commerce and AI-driven commerce at scale will be a key focus to meet our customers’ needs.”','2026-08-04 02:50:15',0),(4,'PUMA Q2 2026 reflects reset measures and softer demand - Strong free cash flow - FY 2026 outlook confirmed','puma-q2-2026-reflects-reset-measures-and-softer-demand-strong-free-cash-flow-fy-2026-outlook-confirmed','https://about.puma.com/sites/default/files/styles/dd_hero_tablet/public/media/news/images/2x2a2577_5.webp?itok=iuJfgzM8','Key developments Q2 2026\nSales down 9.4% currency adjusted (ca) to € 1,690.6 million, due to reset measures and softer consumer demand in key regions\nGross profit margin up by around 180 basis points to 48.0%, driven by lower sourcing prices, including tariff refund effects, as well as currency effects and channel mix\nEBIT improved to € -53.1 million from € -109.1 million in Q2 2025, including tariff refund effects of € 11.5 million \nInventories decreased 15.3% to € 1,821.1 million, mainly due to lower purchasing volumes; inventory clean-up is on track and normalisation expected by year-end 2026\nFree cash flow increased significantly to € 328.8 million (Q2 2025: € 94.9 million), mainly driven by improved working capital management and lower CAPEX\nFY 2026 outlook confirmed\nFY 2026 outlook confirmed; now includes current assessment of the impact from the Middle East conflict and tariffs, which were not reflected previously\nCurrency-adjusted sales to decline in the low- to mid-single-digit percentage range\nOperating result (EBIT) between € -50 million and € -150 million\nCapital expenditures (CAPEX) at around € 200 million planned\n','2026-08-04 02:51:49',0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (3,1,'/uploads/aoxanhanhphu_id1_1.jpg'),(4,1,'/uploads/aoxanhanhphu_id1_2.jpg'),(5,1,'/uploads/aoxanhanhphu_id1_3.jpg'),(6,1,'/uploads/aoxanhanhphu_id1_4.jpg'),(7,1,'/uploads/aodenanhphu_id1_2.jpg'),(8,1,'/uploads/aotranganhphu_id1_1.jpg'),(9,1,'/uploads/aotranganhphu_id1_2.jpg'),(10,2,'/uploads/aoxanhanhphu_id2_1.jpg'),(11,2,'/uploads/aoxanhanhphu_id2_2.jpg'),(12,2,'/uploads/aoxanhanhphu_id2_3.jpg'),(13,2,'/uploads/aoxanhanhphu_id2_4.jpg'),(14,3,'/uploads/quandenanhphu_id3_1.jpg'),(15,3,'/uploads/quandenanhphu_id3_2.jpg'),(16,3,'/uploads/quandenanhphu_id3_3.jpg'),(17,3,'/uploads/quandenanhphu_id3_4.jpg'),(18,3,'/uploads/quanxamanhphu_id3_1.jpg'),(19,3,'/uploads/quanxamanhphu_id3_2.jpg'),(20,3,'/uploads/quannauanhphu_id3_1.jpg'),(21,3,'/uploads/quannauanhphu_id3_2.jpg'),(22,4,'/uploads/quandenanhphu_id4_1.jpg'),(23,4,'/uploads/quandenanhphu_id4_2.jpg'),(24,4,'/uploads/quandenanhphu_id4_3.jpg'),(25,4,'/uploads/quandenanhphu_id4_4.jpg'),(26,4,'/uploads/quandenanhphu_id4_5.jpg'),(27,4,'/uploads/quandenanhphu_id4_6.jpg'),(28,4,'/uploads/quandenanhphu_id4_7.jpg'),(29,5,'/uploads/thamdenanhphu_id5_1.jpg'),(30,5,'/uploads/thamdenanhphu_id5_2.jpg'),(31,5,'/uploads/thamdenanhphu_id5_3.jpg'),(32,5,'/uploads/thamxanhanhphu_id5_1.jpg'),(33,5,'/uploads/thamxanhanhphu_id5_2.jpg'),(36,6,'/uploads/votrang_id6_1_1.jpg'),(37,6,'/uploads/votrang_id6_1_1_1.jpg'),(38,6,'/uploads/votranganhphu_id6_2_1.jpg'),(39,7,'/uploads/aokhoacdenanhphu_id7_1.jpg'),(40,7,'/uploads/aokhoacdenanhphu_id7_2.jpg'),(41,7,'/uploads/aokhoacdenanhphu_id7_3.jpg'),(42,7,'/uploads/aokhoacdenanhphu_id7_4.jpg'),(43,7,'/uploads/aokhoacdenanhphu_id7_5.jpg'),(44,7,'/uploads/aokhoacnauanhphu_id7_1.jpg'),(45,7,'/uploads/aokhoacnauanhphu_id7_2.jpg'),(46,8,'/uploads/aokhoacnauanhphu_id8_1.jpg'),(47,8,'/uploads/aokhoacnauanhphu_id8_2.jpg'),(48,8,'/uploads/aokhoacnauanhphu_id8_3.jpg'),(49,8,'/uploads/aokhoacdenanhphu_id8_1.jpg'),(50,8,'/uploads/aokhoacdenanhphu_id8_2.jpg'),(51,8,'/uploads/aokhoacdenanhphu_id8_3.jpg'),(56,34,'/uploads/quandai_denanhphu_id34_1.jpg'),(57,34,'/uploads/quandai_denanhphu_id34_2.jpg'),(58,34,'/uploads/quandai_denanhphu_id34_3.jpg'),(59,34,'/uploads/quandai_denanhphu_id34_4.jpg'),(60,34,'/uploads/quandai_denanhphu_id34_5.jpg'),(61,37,'/uploads/aokhoac_navyanhphu_id37_1.jpg'),(62,37,'/uploads/aokhoac_navyanhphu_id37_2.jpg'),(63,37,'/uploads/aokhoac_navyanhphu_id37_3.jpg'),(64,37,'/uploads/aokhoac_navyanhphu_id37_4.jpg'),(65,37,'/uploads/aokhoac_navyanhphu_id37_5.jpg'),(66,31,'/uploads/aothun_denanhphu_id31_1.jpg'),(67,31,'/uploads/aothun_denanhphu_id31_2.jpg'),(68,31,'/uploads/aothun_denanhphu_id31_3.jpg'),(69,31,'/uploads/aothun_denanhphu_id31_4.jpg'),(70,9,'/uploads/aothunanhphu_id9_1.jpg'),(71,9,'/uploads/aothunanhphu_id9_2.jpg'),(72,9,'/uploads/aothunanhphu_id9_3.jpg'),(73,9,'/uploads/aothunanhphu_id9_4.jpg'),(74,9,'/uploads/aothunanhphu_id9_5.jpg'),(75,10,'/uploads/aopolo_denanhphu_id10_1.jpg'),(76,10,'/uploads/aopolo_denanhphu_id10_2.jpg'),(77,10,'/uploads/aopolo_denanhphu_id10_3.jpg'),(78,10,'/uploads/aopolo_denanhphu_id10_4.jpg'),(79,10,'/uploads/aopolo_denanhphu_id10_5.jpg'),(80,11,'/uploads/quanngan_denanhphu_id11_1.jpg'),(81,11,'/uploads/quanngan_denanhphu_id11_2.jpg'),(82,11,'/uploads/quanngan_denanhphu_id11_3.jpg'),(83,11,'/uploads/quanngan_denanhphu_id11_4.jpg'),(84,11,'/uploads/quanngan_denanhphu_id11_5.jpg'),(85,12,'/uploads/quandai_navyanhphu_id12_1.jpg'),(86,12,'/uploads/quandai_navyanhphu_id12_2.jpg'),(87,12,'/uploads/quandai_navyanhphu_id12_3.jpg'),(88,12,'/uploads/quandai_navyanhphu_id12_4.jpg'),(89,12,'/uploads/quandai_navyanhphu_id12_5.jpg'),(90,13,'/uploads/balo_denanhphu_id13_1.jpg'),(91,13,'/uploads/balo_denanhphu_id13_2.jpg'),(92,13,'/uploads/balo_denanhphu_id13_3.jpg'),(93,13,'/uploads/balo_denanhphu_id13_4.jpg'),(94,13,'/uploads/balo_denanhphu_id13_5.jpg'),(95,14,'/uploads/muanhphu_id14_1.jpg'),(96,14,'/uploads/muanhphu_id14_2.jpg'),(97,14,'/uploads/muanhphu_id14_3.jpg'),(98,14,'/uploads/muanhphu_id14_4.jpg'),(99,14,'/uploads/muanhphu_id14_5.jpg'),(100,15,'/uploads/aokhoac_navyanhphu_id15_1.jpg'),(101,15,'/uploads/aokhoac_navyanhphu_id15_2.jpg'),(102,15,'/uploads/aokhoac_navyanhphu_id15_3.jpg'),(103,15,'/uploads/aokhoac_navyanhphu_id15_4.jpg'),(104,15,'/uploads/aokhoac_navyanhphu_id15_5.jpg'),(105,16,'/uploads/aokhoac_denanhphu_id16_1.jpg'),(106,16,'/uploads/aokhoac_denanhphu_id16_2.jpg'),(107,16,'/uploads/aokhoac_denanhphu_id16_3.jpg'),(108,16,'/uploads/aokhoac_denanhphu_id16_4.jpg'),(109,16,'/uploads/aokhoac_denanhphu_id16_5.jpg'),(110,32,'/uploads/aothun_doanhphu_id32_1.jpg'),(111,32,'/uploads/aothun_doanhphu_id32_2.jpg'),(112,32,'/uploads/aothun_doanhphu_id32_3.jpg'),(113,32,'/uploads/aothun_doanhphu_id32_4.jpg'),(114,32,'/uploads/aothun_doanhphu_id32_5.jpg'),(115,38,'/uploads/quanngananhphu_id38_1.jpg'),(116,38,'/uploads/quanngananhphu_id38_2.jpg'),(117,38,'/uploads/quanngananhphu_id38_3.jpg'),(118,38,'/uploads/quanngananhphu_id38_4.jpg'),(119,38,'/uploads/quanngananhphu_id38_5.jpg'),(120,35,'/uploads/iq2655-4_120x.webp'),(121,35,'/uploads/iq2655-2_120x.webp'),(122,35,'/uploads/iq2655-3_120x.webp'),(123,17,'/uploads/52854001-2_120x.webp'),(124,17,'/uploads/52854001-3_120x.webp');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (44,18,'Xám','M',0.00,40,NULL),(45,18,'Xanh Coban','L',0.00,30,NULL),(46,19,'Xám Nhạt','M',0.00,25,NULL),(47,19,'Xám Nhạt','L',20000.00,20,NULL),(48,19,'Đen','L',20000.00,30,NULL),(49,20,'Đen','M',0.00,45,NULL),(50,20,'Xám','L',0.00,40,NULL),(51,21,'Đen','Free Size',0.00,50,NULL),(52,21,'Xanh Navy','Free Size',0.00,20,NULL),(53,22,'Đen','Free Size',0.00,80,NULL),(54,22,'Hồng Nhạt','Free Size',0.00,40,NULL),(55,23,'Đen','M',0.00,20,NULL),(56,23,'Đen','L',40000.00,15,NULL),(57,23,'Xanh Rêu','L',40000.00,10,NULL),(58,24,'Đen','M',0.00,30,NULL),(59,24,'Xám','L',0.00,25,NULL),(60,25,'─Éen ─Éß╗Å','40',0.00,20,NULL),(61,25,'─Éen ─Éß╗Å','41',0.00,25,NULL),(62,25,'─Éen ─Éß╗Å','42',0.00,15,NULL),(63,26,'─Éen','M',0.00,30,NULL),(64,26,'─Éen','L',0.00,20,NULL),(65,26,'Trß║»ng','L',0.00,25,NULL),(66,27,'─Éen','L',0.00,15,NULL),(67,27,'X├ím','XL',0.00,10,NULL),(68,28,'─Éen','M',0.00,40,NULL),(69,28,'─Éen','L',0.00,35,NULL),(70,28,'X├ím','M',0.00,30,NULL),(71,29,'─Éen','M',0.00,50,NULL),(72,29,'─Éen','L',0.00,45,NULL),(73,30,'─Éen','M',0.00,20,NULL),(74,30,'─Éen','L',0.00,25,NULL),(81,33,'Đen','Free Size',0.00,15,NULL),(82,33,'Trắng','Free Size',0.00,20,NULL),(88,36,'Xám','S',0.00,15,NULL),(89,36,'Xám','M',0.00,20,NULL),(94,39,'Xanh Jean','S',0.00,10,NULL),(95,39,'Xanh Jean','M',0.00,8,NULL),(96,1,'Xanh Dương','S',879000.00,39,'/uploads/aoxanh_id1.jpg'),(97,1,'Xanh Dương','M',879000.00,37,'/uploads/aoxanh_id1.jpg'),(98,1,'Xanh Dương','L',879000.00,40,'/uploads/aoxanh_id1.jpg'),(99,1,'Xanh Dương','XL',879000.00,27,'/uploads/aoxanh_id1.jpg'),(100,1,'Đen','S',879000.00,14,'/uploads/aoden_id1.jpg'),(101,1,'Đen','M',879000.00,45,'/uploads/aoden_id1.jpg'),(102,1,'Đen','L',879000.00,41,'/uploads/aoden_id1.jpg'),(103,1,'Đen','XL',879000.00,50,'/uploads/aoden_id1.jpg'),(104,1,'Trắng','S',879000.00,13,'/uploads/aotrang_id1.jpg'),(105,1,'Trắng','M',879000.00,33,'/uploads/aotrang_id1.jpg'),(106,1,'Trắng','L',879000.00,21,'/uploads/aotrang_id1.jpg'),(107,1,'Trắng','XL',879000.00,14,'/uploads/aotrang_id1.jpg'),(108,2,'Xanh Dương','S',929000.00,23,'/uploads/aoxanh_id2.jpg'),(109,2,'Xanh Dương','M',929000.00,17,'/uploads/aoxanh_id2.jpg'),(110,2,'Xanh Dương','L',929000.00,37,'/uploads/aoxanh_id2.jpg'),(111,2,'Xanh Dương','XL',929000.00,20,'/uploads/aoxanh_id2.jpg'),(112,3,'Đen','S',1029000.00,21,'/uploads/quanden_id3.jpg'),(113,3,'Đen','M',1029000.00,11,'/uploads/quanden_id3.jpg'),(114,3,'Đen','L',1029000.00,35,'/uploads/quanden_id3.jpg'),(115,3,'Đen','XL',1029000.00,15,'/uploads/quanden_id3.jpg'),(116,3,'Xám','S',1029000.00,37,'/uploads/quanxam_id3.jpg'),(117,3,'Xám','M',1029000.00,14,'/uploads/quanxam_id3.jpg'),(118,3,'Xám','L',1029000.00,44,'/uploads/quanxam_id3.jpg'),(119,3,'Xám','XL',1029000.00,43,'/uploads/quanxam_id3.jpg'),(120,3,'Nâu','S',1029000.00,15,'/uploads/quannau_id3.jpg'),(121,3,'Nâu','M',1029000.00,15,'/uploads/quannau_id3.jpg'),(122,3,'Nâu','L',1029000.00,18,'/uploads/quannau_id3.jpg'),(123,3,'Nâu','XL',1029000.00,19,'/uploads/quannau_id3.jpg'),(124,4,'Đen','S',1259000.00,15,'/uploads/quanden_id4.jpg'),(125,4,'Đen','M',1259000.00,35,'/uploads/quanden_id4.jpg'),(126,4,'Đen','L',1259000.00,49,'/uploads/quanden_id4.jpg'),(127,4,'Đen','XL',1259000.00,25,'/uploads/quanden_id4.jpg'),(128,5,'Đen','6 MM',4300000.00,33,'/uploads/thamden_id5.jpg'),(129,5,'Đen','8 MM',4300000.00,26,'/uploads/thamden_id5.jpg'),(130,5,'Xanh Dương','6 MM',4300000.00,11,'/uploads/thamxanh_id5.jpg'),(131,5,'Xanh Dương','8 MM',4300000.00,11,'/uploads/thamxanh_id5.jpg'),(132,6,'Trắng','S',489000.00,46,'/uploads/votrang_id6.jpg'),(133,6,'Trắng','M',489000.00,33,'/uploads/votrang_id6.jpg'),(134,6,'Trắng','L',489000.00,28,'/uploads/votrang_id6.jpg'),(135,6,'Trắng','XL',489000.00,26,'/uploads/votrang_id6.jpg'),(136,7,'Đen','S',2289000.00,11,'/uploads/aokhoacden_id7.jpg'),(137,7,'Đen','M',2289000.00,50,'/uploads/aokhoacden_id7.jpg'),(138,7,'Đen','L',2289000.00,49,'/uploads/aokhoacden_id7.jpg'),(139,7,'Đen','XL',2289000.00,37,'/uploads/aokhoacden_id7.jpg'),(140,7,'Nâu','S',2289000.00,22,'/uploads/aokhoacnau_id7.jpg'),(141,7,'Nâu','M',2289000.00,18,'/uploads/aokhoacnau_id7.jpg'),(142,7,'Nâu','L',2289000.00,23,'/uploads/aokhoacnau_id7.jpg'),(143,7,'Nâu','XL',2289000.00,47,'/uploads/aokhoacnau_id7.jpg'),(144,8,'Nâu','S',2289000.00,39,'/uploads/aokhoacnau_id8.jpg'),(145,8,'Nâu','M',2289000.00,12,'/uploads/aokhoacnau_id8.jpg'),(146,8,'Nâu','L',2289000.00,16,'/uploads/aokhoacnau_id8.jpg'),(147,8,'Nâu','XL',2289000.00,37,'/uploads/aokhoacnau_id8.jpg'),(148,8,'Đen','S',2289000.00,48,'/uploads/aokhoacden_id8.jpg'),(149,8,'Đen','M',2289000.00,22,'/uploads/aokhoacden_id8.jpg'),(150,8,'Đen','L',2289000.00,11,'/uploads/aokhoacden_id8.jpg'),(151,8,'Đen','XL',2289000.00,22,'/uploads/aokhoacden_id8.jpg'),(157,34,'ĐEN','XS',1659000.00,49,'/uploads/quandai_den_id34.jpg'),(158,34,'ĐEN','S',1659000.00,14,'/uploads/quandai_den_id34.jpg'),(159,34,'ĐEN','M',1659000.00,20,'/uploads/quandai_den_id34.jpg'),(160,34,'ĐEN','L',1659000.00,26,'/uploads/quandai_den_id34.jpg'),(161,34,'ĐEN','XL',1659000.00,38,'/uploads/quandai_den_id34.jpg'),(162,37,'XANH NAVY','XS',2619000.00,23,'/uploads/aokhoac_navy_id37.jpg'),(163,37,'XANH NAVY','S',2619000.00,47,'/uploads/aokhoac_navy_id37.jpg'),(164,37,'XANH NAVY','M',2619000.00,38,'/uploads/aokhoac_navy_id37.jpg'),(165,37,'XANH NAVY','L',2619000.00,23,'/uploads/aokhoac_navy_id37.jpg'),(166,37,'XANH NAVY','XL',2619000.00,16,'/uploads/aokhoac_navy_id37.jpg'),(167,31,'ĐEN','XS',1049000.00,25,'/uploads/aothun_den_id31.jpg'),(168,31,'ĐEN','S',1049000.00,22,'/uploads/aothun_den_id31.jpg'),(169,31,'ĐEN','M',1049000.00,22,'/uploads/aothun_den_id31.jpg'),(170,31,'ĐEN','L',1049000.00,48,'/uploads/aothun_den_id31.jpg'),(171,31,'ĐEN','XL',1049000.00,29,'/uploads/aothun_den_id31.jpg'),(172,9,'BE','A/S',1200000.00,25,'/uploads/aothun_id9.jpg'),(173,9,'BE','A/XS',1200000.00,11,'/uploads/aothun_id9.jpg'),(174,9,'BE','A/L',1200000.00,17,'/uploads/aothun_id9.jpg'),(175,9,'BE','A/M',1200000.00,30,'/uploads/aothun_id9.jpg'),(176,9,'BE','A/XL',1200000.00,49,'/uploads/aothun_id9.jpg'),(177,9,'BE','A/XXL',1200000.00,17,'/uploads/aothun_id9.jpg'),(178,10,'ĐEN','A/S',2300000.00,18,'/uploads/aopolo_den_id10.jpg'),(179,10,'ĐEN','A/M',2300000.00,39,'/uploads/aopolo_den_id10.jpg'),(180,10,'ĐEN','A/L',2300000.00,14,'/uploads/aopolo_den_id10.jpg'),(181,10,'ĐEN','A/XL',2300000.00,40,'/uploads/aopolo_den_id10.jpg'),(182,11,'ĐEN','A/S 7 Inch',1200000.00,41,'/uploads/quanngan_den_id11.jpg'),(183,11,'ĐEN','A/M 7 Inch',1200000.00,11,'/uploads/quanngan_den_id11.jpg'),(184,11,'ĐEN','A/L 7 Inch',1200000.00,50,'/uploads/quanngan_den_id11.jpg'),(185,11,'ĐEN','A/XL 7',1200000.00,37,'/uploads/quanngan_den_id11.jpg'),(186,12,'XANH NAVY','A/79',3000000.00,30,'/uploads/quandai_navy_id12.jpg'),(187,12,'XANH NAVY','A/82',3000000.00,15,'/uploads/quandai_navy_id12.jpg'),(188,12,'XANH NAVY','A/88',3000000.00,14,'/uploads/quandai_navy_id12.jpg'),(189,12,'XANH NAVY','A/92',3000000.00,21,'/uploads/quandai_navy_id12.jpg'),(190,12,'XANH NAVY','A/96',3000000.00,15,'/uploads/quandai_navy_id12.jpg'),(191,13,'ĐEN','ONE SIZE',650000.00,20,'/uploads/balo_den_id13.jpg'),(192,14,'BE','ONE SIZE',699000.00,26,'/uploads/mu_id14.jpg'),(193,15,'XANH DƯƠNG','A/XS',2200000.00,42,'/uploads/aokhoac_navy_id15.jpg'),(194,15,'XANH DƯƠNG','A/S',2200000.00,38,'/uploads/aokhoac_navy_id15.jpg'),(195,15,'XANH DƯƠNG','A/M',2200000.00,30,'/uploads/aokhoac_navy_id15.jpg'),(196,15,'XANH DƯƠNG','A/L',2200000.00,17,'/uploads/aokhoac_navy_id15.jpg'),(197,15,'XANH DƯƠNG','A/XL',2200000.00,43,'/uploads/aokhoac_navy_id15.jpg'),(198,16,'ĐEN','A/XS',2100000.00,36,'/uploads/aokhoac_den_id16.jpg'),(199,16,'ĐEN','A/S',2100000.00,21,'/uploads/aokhoac_den_id16.jpg'),(200,16,'ĐEN','A/L',2100000.00,16,'/uploads/aokhoac_den_id16.jpg'),(201,16,'ĐEN','A/M',2100000.00,20,'/uploads/aokhoac_den_id16.jpg'),(202,16,'ĐEN','A/XL',2100000.00,33,'/uploads/aokhoac_den_id16.jpg'),(203,32,'ĐỎ','A/XS',1200000.00,30,'/uploads/aothun_do_id32.jpg'),(204,32,'ĐỎ','A/S',1200000.00,14,'/uploads/aothun_do_id32.jpg'),(205,32,'ĐỎ','A/M',1200000.00,46,'/uploads/aothun_do_id32.jpg'),(206,32,'ĐỎ','A/L',1200000.00,16,'/uploads/aothun_do_id32.jpg'),(207,32,'ĐỎ','A/XL',1200000.00,45,'/uploads/aothun_do_id32.jpg'),(208,38,'TÍM','A/S 4 inch',1200000.00,23,'/uploads/quanngan_id38.jpg'),(209,38,'TÍM','A/XS 4',1200000.00,14,'/uploads/quanngan_id38.jpg'),(210,38,'TÍM','A/M 4 inch',1200000.00,23,'/uploads/quanngan_id38.jpg'),(211,38,'TÍM','A/L 4 inch',1200000.00,43,'/uploads/quanngan_id38.jpg'),(212,38,'TÍM','A/XL 4',1200000.00,23,'/uploads/quanngan_id38.jpg'),(213,35,'Đen','S',NULL,52,'/uploads/iq2655-1_1.webp'),(214,35,'Đen','M',NULL,52,'/uploads/iq2655-1_1.webp'),(215,35,'Đen','L',NULL,52,'/uploads/iq2655-1_1.webp'),(216,17,'Đen','S',NULL,8,'/uploads/52854001-1_1.webp'),(217,17,'Đen','M',NULL,11,'/uploads/52854001-1_1.webp'),(218,17,'Đen','L',NULL,14,'/uploads/52854001-1_1.webp'),(219,17,'Đỏ','S',NULL,6,'/uploads/52854098-2_120x.webp'),(220,17,'Đỏ','M',NULL,14,'/uploads/52854098-2_120x.webp'),(221,17,'Đỏ','L.XL',NULL,17,'/uploads/52854098-2_120x.webp');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_hot` tinyint(4) DEFAULT 0,
  `is_new` tinyint(4) DEFAULT 0,
  `price_sale` decimal(10,2) DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_products_categories` (`category_id`),
  KEY `fk_products_brands` (`brand_id`),
  CONSTRAINT `fk_products_brands` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Áo Thun Nam Nike Sportswear Icon Futura',879000.00,'/uploads/aoxanh_id1.jpg','Áo thun thể thao Nike Dri-FIT mang lại sự khô thoáng và thoải mái suốt ngày dài. Chất liệu 100% polyester tái chế mềm mại, co giãn tốt, phù hợp cho cả tập luyện và dạo phố.','2026-08-05 03:22:41','2026-08-17 02:01:08',1,1,0,1,0,NULL,0),(2,'Áo Thun Nam Nike Fc Barcelona Crest',929000.00,'/uploads/aoxanh_id2.jpg','Áo thun phong cách basic chất liệu 100% cotton cao cấp. Đường may tỉ mỉ, logo Nike thêu nổi bật trên ngực trái. Form dáng ôm nhẹ trẻ trung.','2026-08-05 03:22:41','2026-08-17 02:01:22',1,1,1,0,1,894000.00,0),(3,'Quần Ngắn Thể Thao Nam Nike Dri-Fit Miler 7 Inch Briefs-Lined',1029000.00,'/uploads/quanden_id3.jpg','QUẦN NGẮN THỂ THAO NAM NIKE DRI-FIT MILER 7 INCH BRIEFS-LINED\nChạy tự do trên từng bước chân. Quần Ngắn Thể Thao Nam Nike Dri-Fit Miler 7 Inch Briefs-Lined siêu nhẹ với chất liệu dệt mịn, thoáng, thấm mồ hôi giúp bạn luôn khô ráo và dễ chịu khi vận động. Các thanh phản quang đặc trưng cùng panel đục lỗ hai bên tăng độ thoáng khí, đồng hành cùng bạn qua từng kilomet.\n\nTHÔNG SỐ\nBộ sưu tập Challenger nâng cấp thành Miler với hiệu năng giữ nguyên nhưng cảm giác mặc hiện đại, thoải mái hơn.\nCông nghệ Nike Dri-FIT giúp hút mồ hôi khỏi da và bay hơi nhanh, giữ cơ thể khô thoáng và dễ chịu.\nQuần lót tích hợp bên trong mang lại độ nâng đỡ và hỗ trợ khi chạy.\nTúi sau có khóa dán kết hợp với túi hai bên giúp cất gọn chìa khóa, thẻ và vật dụng nhỏ cần thiết.\nXẻ tà gấu quần hỗ trợ sải bước dài, linh hoạt hơn.\nLưng thun co giãn cùng dây rút giúp điều chỉnh vừa vặn với mọi dáng người.\nChi tiết phản quang giúp bạn nổi bật hơn trong điều kiện ánh sáng yếu.\nThân quần: 100% polyester; lót: 92% polyester/8% spandex cho cảm giác vừa nhẹ vừa co giãn.\nPhom chuẩn (standard fit) cho cảm giác thoải mái, dễ mặc hằng ngày.\nMã sản phẩm: IF2071-010','2026-08-05 03:22:41','2026-08-17 02:01:29',2,1,0,1,0,NULL,0),(4,'Quần Ngắn Thể Thao Nam Nike DNA Dri-Fit 6 Inch Basketball',1259000.00,'/uploads/quanden_id4.jpg','QUẦN NGẮN THỂ THAO NAM NIKE DNA DRI-FIT 6 INCH BASKETBALL\nSẵn sàng tỏa sáng trong mọi khoảnh khắc trên sân. Quần Ngắn Thể Thao Nam Nike DNA Dri-FIT 6 Inch Basketball được thiết kế dành cho bóng rổ với chất liệu nhẹ nhưng bền, giúp thấm hút mồ hôi hiệu quả để bạn luôn khô ráo và tập trung trong suốt trận đấu. Bề mặt vải lưới kết hợp mặt trong mịn mang lại cảm giác thoải mái, trong khi túi khóa kéo tiện dụng giúp cất giữ an toàn những vật dụng cần thiết cả khi thi đấu lẫn trong các hoạt động hằng ngày. Hoàn thiện với kiểu dáng mang cảm hứng bóng rổ cổ điển, đây là lựa chọn phù hợp cả trên sân lẫn ngoài sân.\n\nTHÔNG SỐ\nThiết kế dành cho bóng rổ.\nChiều dài ống quần (Inseam): 15 cm (xấp xỉ).\nKhông có lớp lót.\nChất liệu nhẹ, tích hợp công nghệ Nike Dri-FIT giúp thấm hút mồ hôi; bề mặt vải lưới kết hợp mặt trong mịn tạo cảm giác thoải mái.\nTúi hai bên và túi khóa kéo tiện dụng, đủ rộng để đựng điện thoại.\nCạp quần co giãn kèm dây rút.\nXẻ gấu hai bên tăng sự linh hoạt khi di chuyển.\nLogo Swoosh thêu.\nChất liệu: 100% polyester.\nStandard Fit: Phom tiêu chuẩn, thoải mái và dễ mặc.\nMã sản phẩm: FV4934-010','2026-08-05 03:22:41','2026-08-17 01:47:21',2,1,0,0,1,NULL,0),(5,'Thảm Tập Yoga Manduka Pro',4300000.00,'/uploads/thamden_id5.jpg','THẢM TẬP YOGA MANDUKA PRO\nThảm Tập Yoga Manduka Pro là lựa chọn hoàn hảo cho không gian tập yoga tại nhà với độ đặc cao mang lại cảm giác chắc chắn như sàn, đồng thời êm ái bảo vệ khớp và bền bỉ vượt trội. Được sản xuất tại Đức từ năm 1997, thảm PRO có bề mặt kín, vệ sinh, không thấm mồ hôi, ẩm hay vi khuẩn, giúp bạn dễ dàng lau chùi và giữ thảm luôn sạch sẽ theo thời gian. Khi bạn sẵn sàng đầu tư nghiêm túc cho việc luyện tập tại nhà, hãy tin tưởng vào tấm thảm được thiết kế để đồng hành lâu dài.\n\nTHÔNG SỐ\nĐộ đặc cao và độ nâng đỡ vững chắc giúp giữ thăng bằng ổn định, cảm giác chắc chân như đứng trên nền đất tự nhiên.\nĐộ dày 6mm nâng đỡ tối ưu cho đầu gối, cổ tay và các vùng nhạy cảm trong mọi tư thế chống, tỳ, chịu lực.\nBề mặt cấu trúc kín hoàn toàn ngăn mồ hôi, ẩm và vi khuẩn thấm vào lõi thảm, giúp vệ sinh dễ dàng và luôn khô ráo.\nHọa tiết chấm độc quyền ở mặt đáy bám chặt sàn, hạn chế trượt dịch khi chuyển tư thế.\nTrọng lượng: Standard 3,4 kg; Long 4,3 kg; Short 3,2 kg – chắc chắn, ổn định cho tập luyện chuyên sâu.\nKích thước: Standard 180 × 66 cm; Long 216 × 66 cm; Short 173 × 66 cm – phù hợp nhiều chiều cao và không gian tập.\nChất liệu PVC cao cấp sản xuất tại Đức, đạt chứng nhận STANDARD 100 by OEKO-TEX® an toàn cho bạn và gia đình khỏi các chất độc hại.\nMã sản phẩm: 111011010','2026-08-05 03:22:41','2026-08-17 01:47:21',3,1,0,1,0,NULL,0),(6,'Tất Thể Thao Cổ Cao Nike Everyday (3 Đôi) Update',380000.00,'/uploads/votrang_id6_1.jpg','VỚ THỂ THAO UNISEX NIKE EVERYDAY CUSHIONED \n\nTiếp thêm sức mạnh cho quá trình tập luyện với vớ Nike Everyday Cushioned. Sản phẩm với lớp đệm dày dặn kết hợp thiết kế vòm chân có gân mang lại sự hỗ trợ và cảm giác thoải mái lâu dài.\n\nTHÔNG SỐ\n\nCông nghệ Dri-FIT giúp bạn luôn khô ráo và thoải mái\nNén vòm tăng cường hỗ trợ\nChất liệu: 73% cotton / 25% polyester / 1% spandex / 1% nylon (tỷ lệ phần trăm có thể thay đổi)\nCó thể giặt máy\nMã sản phẩm: SX7670-100','2026-08-05 03:22:41','2026-08-17 01:47:21',3,1,1,0,1,320000.00,0),(7,'Áo Khoác Nam Nike Miler Repel UV Protection Running - Đen',2289000.00,'/uploads/aokhoacden_id7.jpg','ÁO KHOÁC NAM NIKE MILER REPEL UV PROTECTION RUNNING\nChạy tự do trong mọi điều kiện thời tiết với chiếc Áo Khoác Nam Nike Miler Repel UV Protection Running. Lớp phủ chống thấm nước kết hợp cùng khả năng chống tia UV giúp bạn luôn khô ráo, thoải mái dù trời mưa hay nắng gắt. Các thanh phản quang đặc trưng nổi bật trên áo giúp bạn dễ dàng được nhìn thấy hơn, tăng độ an toàn mỗi khi chạy.\n\nTHÔNG SỐ\nLớp phủ chống thấm hỗ trợ giữ cơ thể khô ráo khi thời tiết ẩm ướt.\nTay áo raglan giảm ma sát, ôm vừa vặn và cho biên độ vận động tự nhiên, thoải mái.\nChất liệu 100% polyester nhẹ, bền, mau khô, phù hợp tập luyện hàng ngày.\nPhom dáng tiêu chuẩn, dễ mặc, thoải mái cho nhiều vóc dáng khác nhau.\nMã sản phẩm: IF2370-010','2026-08-05 03:22:41','2026-08-17 01:47:21',4,1,1,1,0,NULL,0),(8,'Áo Khoác Nam Nike Miler Repel UV Protection Running - Nâu',2289000.00,'/uploads/aokhoacnau_id8.jpg','ÁO KHOÁC NAM NIKE MILER REPEL UV PROTECTION RUNNING\nChạy tự do trong mọi điều kiện thời tiết với chiếc Áo Khoác Nam Nike Miler Repel UV Protection Running. Lớp phủ chống thấm nước kết hợp cùng khả năng chống tia UV giúp bạn luôn khô ráo, thoải mái dù trời mưa hay nắng gắt. Các thanh phản quang đặc trưng nổi bật trên áo giúp bạn dễ dàng được nhìn thấy hơn, tăng độ an toàn mỗi khi chạy.\n\nTHÔNG SỐ\nLớp phủ chống thấm hỗ trợ giữ cơ thể khô ráo khi thời tiết ẩm ướt.\nTay áo raglan giảm ma sát, ôm vừa vặn và cho biên độ vận động tự nhiên, thoải mái.\nChất liệu 100% polyester nhẹ, bền, mau khô, phù hợp tập luyện hàng ngày.\nPhom dáng tiêu chuẩn, dễ mặc, thoải mái cho nhiều vóc dáng khác nhau.\nMã sản phẩm: IF2370-213','2026-08-05 03:22:41','2026-08-17 01:47:21',4,1,0,0,0,NULL,0),(9,'Áo Thun Nam Adidas Puremotion - Be',1200000.00,'/uploads/aothun_id9.jpg','Fetched live','2026-08-05 03:22:41','2026-08-17 01:47:21',1,2,0,1,0,NULL,0),(10,'Áo Polo Nam Adidas Climacool Aop - Đen',2300000.00,'/uploads/aopolo_den_id10.jpg','Áo Polo Nam Adidas Climacool Aop được thiết kế dành cho những golfer mong muốn duy trì phong độ ổn định trong suốt trận đấu. Với phom dáng vừa vặn cùng chất vải single jersey mềm mại, chiếc áo mang đến cảm giác thoải mái và linh hoạt trong từng cú swing. Công nghệ CLIMACOOL tiên tiến hỗ trợ thấm hút và phân tán mồ hôi hiệu quả, giúp cơ thể luôn mát mẻ, khô ráo và tập trung tối đa ngay cả trong những vòng golf cường độ cao. Thiết kế polo cổ điển kết hợp họa tiết nổi bật tạo nên phong cách thể thao hiện đại, dễ dàng đồng hành cùng bạn cả trên sân golf lẫn trong các hoạt động hằng ngày.\n\n#### THÔNG SỐ\n\n- Dáng vừa vặn (Regular Fit)\n\n- Chất liệu: 87% polyester tái chế, 13% elastane\n\n- Cấu trúc vải single jersey mềm mại, thoáng nhẹ\n\n- Công nghệ CLIMACOOL hỗ trợ làm mát và thoát ẩm\n\n- Mã sản phẩm: KG9970','2026-08-05 03:22:41','2026-08-17 01:47:21',1,2,0,0,0,NULL,0),(11,'Quần Ngắn Thể Thao Nam Adidas Tech Apparel - Đen',1200000.00,'/uploads/quanngan_den_id11.jpg','Fetched live','2026-08-05 03:22:41','2026-08-17 01:47:21',2,2,1,1,0,NULL,0),(12,'Quần Dài Thể Thao Nam Adidas Ultimate365+ Twistweave Grid - Xanh Navy',3000000.00,'/uploads/quandai_navy_id12.jpg','Fetched live','2026-08-05 03:22:41','2026-08-17 01:47:21',2,2,0,0,1,NULL,0),(13,'Ba Lô Adidas Linear - Đen',650000.00,'/uploads/balo_den_id13.jpg','Fetched live','2026-08-05 03:22:41','2026-08-17 01:47:21',3,2,0,1,0,NULL,0),(14,'Mũ Lưỡi Trai Columbia Provisions™ Ball - Đỏ',699000.00,'/uploads/mu_id14.jpg','Mũ Lưỡi Trai Columbia Provisions™ Ball dáng mềm cổ điển, không bao giờ lỗi mốt với phần dây điều chỉnh linh hoạt, vừa vặn thoải mái cho mọi dáng đầu.\n\n#### THÔNG SỐ\n\n- Dây dán phía sau giúp điều chỉnh kích cỡ dễ dàng, phù hợp với nhiều người dùng.\n\n- Thiết kế không dựng phom, kiểu dáng thư giãn mang lại cảm giác đội nhẹ nhàng và linh hoạt.\n\n- Chất liệu 100% cotton thoáng mát, êm ái khi sử dụng cả ngày.\n\n- Mã sản phẩm: 2096351632','2026-08-05 03:22:41','2026-08-17 01:47:21',3,2,1,0,1,NULL,0),(15,'Áo Khoác Nam Adidas Soft Lux Full-Zip Hoodie - Xanh Dương',2200000.00,'/uploads/aokhoac_navy_id15.jpg','Fetched live','2026-08-05 03:22:41','2026-08-17 01:47:21',4,2,1,1,0,NULL,0),(16,'Áo Khoác Nam Adidas Kit 3-Stripes Full-Zip - Đen',2100000.00,'/uploads/aokhoac_den_id16.jpg','Fetched live','2026-08-05 03:22:41','2026-08-17 01:47:21',4,2,0,0,1,NULL,0),(17,'Áo Thun Puma Essentials Logo Tee',450000.00,'/uploads/52854001-1.webp','Áo phông cotton năng động in logo Puma Cat sắc nét trước ngực. Chất thun mát mẻ phù hợp mặc hàng ngày thoải mái.','2026-08-05 03:22:41','2026-08-17 01:47:21',1,3,1,1,0,390000.00,0),(18,'Áo Polo Puma Active Men Polo',650000.00,'/uploads/product_18.jpg','Áo polo nam phom dáng dryCELL hỗ trợ thoát mồ hôi tối đa, giữ cơ thể luôn thoải mái mát mẻ suốt cả ngày.','2026-08-05 03:22:41','2026-08-17 01:47:21',1,3,0,0,1,NULL,0),(19,'Quần Jogger Puma Evostripe',1100000.00,'/uploads/product_19.jpg','Quần dài thể thao Puma Evostripe với chất thun co giãn đa chiều, đường may cắt cúp hỗ trợ chuyển động tối đa cực kỳ thoải mái.','2026-08-05 03:22:41','2026-08-17 01:47:21',2,3,1,1,0,950000.00,0),(20,'Quần Short Nỉ Puma Essentials',500000.00,'/uploads/product_20.jpg','Quần short nỉ Puma basic năng động, cạp thun co giãn bản to kèm dây rút điều chỉnh tiện lợi.','2026-08-05 03:22:41','2026-08-17 01:47:21',2,3,0,0,1,NULL,0),(21,'Túi Đeo Chéo Thể Thao Puma Buzz',550000.00,'/uploads/product_21.jpg','Túi đeo chéo Puma Buzz nhỏ gọn tiện lợi để đựng ví, điện thoại, chìa khóa khi đi chơi, đi dạo phố năng động.','2026-08-05 03:22:41','2026-08-17 01:47:21',3,3,0,1,0,NULL,0),(22,'Mũ Lưỡi Trai Puma Archive Logo',350000.00,'/uploads/product_22.jpg','Mũ lưỡi trai Puma thêu logo nổi bật phía trước, chất liệu kaki dày dặn giữ dáng mũ tốt.','2026-08-05 03:22:41','2026-08-17 01:47:21',3,3,1,0,1,290000.00,0),(23,'Áo Khoác Gió Puma Essentials Hooded',1350000.00,'/uploads/product_23.jpg','Áo khoác dù Puma cản gió hiệu quả, thích hợp mặc che nắng mùa hè hoặc cản lạnh những ngày gió mùa.','2026-08-05 03:22:41','2026-08-17 01:47:21',4,3,1,1,0,1190000.00,0),(24,'Áo Khoác Nỉ Puma Power Hoodie',1250000.00,'/uploads/product_24.jpg','Áo hoodie Puma chất nỉ da cá dày dặn giữ nhiệt tốt, in họa tiết Puma cá tính chạy dọc bả vai phong cách.','2026-08-05 03:22:41','2026-08-17 01:47:21',4,3,0,0,1,NULL,0),(25,'Giày Bóng Rổ Air Jordan 1 Mid',3500000.00,'/uploads/product_25.jpg','Đôi giày bóng rổ huyền thoại Air Jordan 1 Mid phối màu classic cực chất. Chất liệu da cao cấp, đệm Air êm ái bảo vệ cổ chân tối đa.','2026-08-10 02:47:24','2026-08-17 01:47:21',5,4,1,1,1,3200000.00,0),(26,'Áo Thun Jordan Jumpman Tee',850000.00,'/uploads/product_26.jpg','Áo thun cotton Jordan với logo Jumpman thêu nổi bật trước ngực. Chất thun cotton 100% mềm mịn, thấm hút mồ hôi tốt.','2026-08-10 02:47:24','2026-08-17 01:47:21',1,4,0,0,1,NULL,0),(27,'Áo Khoác Hoodie Jordan Essentials',1950000.00,'/uploads/product_27.jpg','Áo khoác hoodie nỉ dày dặn ấm áp từ thương hiệu Jordan. Phom dáng rộng thoải mái, bo chun gấu tay chắc chắn.','2026-08-10 02:47:24','2026-08-17 01:47:21',4,4,1,1,0,1750000.00,0),(28,'Áo Thun Body Gym Balenciaga Premium',750000.00,'/uploads/product_28.jpg','Áo thun ôm body cao cấp chuyên dụng tập gym, chạy bộ từ Balenciaga. Chất vải siêu mát, co giãn 4 chiều tối ưu vận động.','2026-08-10 02:47:24','2026-08-17 01:47:21',1,5,1,0,1,650000.00,0),(29,'Quần Short Tập Luyện Balenciaga',690000.00,'/uploads/product_29.jpg','Quần đùi thể thao tập luyện siêu nhẹ Balenciaga, chất vải dù nhanh khô, cạp chun co giãn và có túi khoá kéo tiện lợi.','2026-08-10 02:47:24','2026-08-17 01:47:21',2,5,0,1,0,NULL,0),(30,'Bộ Quần Áo Thể Thao Balenciaga Sportswear',1450000.00,'/uploads/product_30.jpg','Bộ quần áo thể thao Balenciaga gồm 1 áo thun và 1 quần short đồng bộ. Chất liệu vải siêu mềm mại, nhanh khô và cực nhẹ.','2026-08-10 02:47:24','2026-08-17 01:47:21',6,5,1,1,1,1290000.00,0),(31,'Áo Thun Nữ Nike Sportswear Classic Oversized - Đen',1049000.00,'/uploads/aothun_den_id31.jpg','Fetched live','2026-08-10 03:20:00','2026-08-17 01:47:21',7,1,1,0,1,NULL,0),(32,'Áo Thun Nữ Adidas Stadium Mesh - Đỏ',1200000.00,'/uploads/aothun_do_id32.jpg','Fetched live','2026-08-10 03:20:00','2026-08-17 01:47:21',7,2,0,0,1,NULL,0),(33,'Áo Phông Nữ Balenciaga Oversized',1450000.00,'/uploads/product_33.jpg','Áo phông phom rộng (oversized) thời thượng từ Balenciaga dành cho nữ. Phong cách tối giản, cá tính bụi bặm và cực chất.','2026-08-10 03:20:00','2026-08-17 01:47:21',7,5,1,1,0,1250000.00,0),(34,'Quần Dài Thể Thao Nữ Nike Sportswear Street Oversized Mid-Rise Parachute - Đen',1659000.00,'/uploads/quandai_den_id34.jpg','Phong cách utility kết hợp hơi thở Sportswear năng động. Chiếc Quần Dài Thể Thao Nữ Nike Sportswear Street Oversized Mid-Rise Parachute được may từ chất liệu dày dặn, bề mặt chải mềm, tạo cảm giác vừa bền bỉ vừa êm ái. Phom parachute rộng rãi mang lại dáng vẻ phóng khoáng, thoải mái, cực hợp cho những tín đồ yêu sự tự do trong chuyển động và gu ăn mặc cá tính.\n\n#### THÔNG SỐ\n\n- Cạp lưng thoải mái, ôm nhẹ ngay dưới hông tự nhiên, tôn dáng mà vẫn dễ chịu.\n\n- Chiều dài qua gối, giúp che phủ tốt và linh hoạt trong nhiều hoạt động.\n\n- Logo Swoosh thêu tinh tế, tạo điểm nhấn thể thao cao cấp.\n\n- Túi hai bên tiện lợi, dễ dàng cất giữ những món đồ mang theo hằng ngày.\n\n- Lưng thun kèm dây rút, dễ điều chỉnh vừa vặn theo ý thích.\n\n- Chất liệu 69% cotton/28% modal/3% spandex, mềm mại, thoáng khí và co giãn đàn hồi.\n\n- Phom oversized rộng rãi, tạo vẻ ngoài phóng khoáng và siêu thoải mái khi mặc.\n\n- Mã sản phẩm: IM8412-010','2026-08-10 03:20:00','2026-08-17 01:47:21',8,1,1,1,0,NULL,0),(35,'Quần Short Tập Luyện Nữ Adidas 3-Stripes',650000.00,'/uploads/id31','Quần short thể thao nữ Adidas với cạp chun mềm mại co giãn tốt, tích hợp công nghệ thấm hút mồ hôi siêu tốc.','2026-08-10 03:20:00','2026-08-17 01:47:21',8,2,0,0,1,NULL,0),(36,'Quần Jogger Nữ Puma Classics',950000.00,'/uploads/product_36.jpg','Quần dài nỉ phom ôm chân trẻ trung từ Puma. Chất thun da cá mềm mại, giữ nhiệt nhẹ phù hợp cho mùa se lạnh.','2026-08-10 03:20:00','2026-08-17 01:47:21',8,3,1,0,0,850000.00,0),(37,'Áo Khoác Nữ Nike Sportswear Oversized Tracksuit - Xanh Navy',2619000.00,'/uploads/aokhoac_navy_id37.jpg','Đậm chất thể thao, nổi bật phong cách đường phố. Áo Khoác Nữ Nike Sportswear Oversized Tracksuit được làm từ chất liệu dệt cổ điển kết hợp lớp lót lưới thoáng khí, mang lại cảm giác thoải mái khi mặc. Phom oversized rộng rãi cùng các mảng phối màu tương phản tạo nên diện mạo cá tính, dễ dàng hoàn thiện phong cách hằng ngày.\n\n#### THÔNG SỐ\n\n- Khóa kéo hai chiều giúp dễ dàng điều chỉnh kiểu mặc và độ che phủ.\n\n- Lớp lót lưới tăng khả năng thoáng khí.\n\n- Phom oversized rộng rãi, tạo cảm giác thoải mái.\n\n- Logo Swoosh thêu.\n\n- Túi hai bên tiện dụng.\n\n- Gấu áo và cổ tay bo thun.\n\n- Chất liệu: Thân áo: 100% nylon. Lớp lót: 100% polyester.\n\n- Oversized fit: Phom rộng với thiết kế thoải mái.\n\n- Mã sản phẩm: IM8402-411','2026-08-10 03:20:00','2026-08-17 01:47:21',9,1,1,1,0,NULL,0),(38,'Quần Ngắn Thể Thao Nữ Adidas Adi365 Formotion - Tím',1200000.00,'/uploads/quanngan_id38.jpg','Fetched live','2026-08-10 03:20:00','2026-08-17 01:47:21',8,2,0,0,1,NULL,0),(39,'Áo Khoác Denim Nữ Balenciaga Chic',2850000.00,'/uploads/product_39.jpg','Áo khoác jean denim phong cách bụi bặm, cá tính dành cho nữ từ thương hiệu cao cấp Balenciaga.','2026-08-10 03:20:00','2026-08-17 01:47:21',9,5,1,1,1,2450000.00,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,4,'Đồ hãng sờ sướng tay ghê, đóng gói cẩn thận 10 điểm không có nhưng.','2026-08-05 03:22:41',0),(2,1,2,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(3,2,1,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(4,2,2,5,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(5,3,1,4,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(6,3,2,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(7,4,1,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(8,4,2,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(9,5,1,4,'Đẹp xuất sắc luôn ní ơi, mặc lên phom dáng sang xịn mịn lắm.','2026-08-05 03:22:41',0),(10,5,2,5,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(11,6,1,5,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(12,6,2,4,'Đẹp xuất sắc luôn ní ơi, mặc lên phom dáng sang xịn mịn lắm.','2026-08-05 03:22:41',0),(13,7,1,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(14,7,2,4,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(15,8,1,4,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(16,8,2,5,'Đồ hãng sờ sướng tay ghê, đóng gói cẩn thận 10 điểm không có nhưng.','2026-08-05 03:22:41',0),(17,9,1,4,'Đồ hãng sờ sướng tay ghê, đóng gói cẩn thận 10 điểm không có nhưng.','2026-08-05 03:22:41',0),(18,9,2,4,'Đẹp xuất sắc luôn ní ơi, mặc lên phom dáng sang xịn mịn lắm.','2026-08-05 03:22:41',0),(19,10,1,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(20,10,2,5,'Đẹp xuất sắc luôn ní ơi, mặc lên phom dáng sang xịn mịn lắm.','2026-08-05 03:22:41',0),(21,11,1,4,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(22,11,2,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(23,12,1,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(24,12,2,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(25,13,1,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(26,13,2,5,'Đẹp xuất sắc luôn ní ơi, mặc lên phom dáng sang xịn mịn lắm.','2026-08-05 03:22:41',0),(27,14,1,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(28,14,2,5,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(29,15,1,4,'Đẹp xuất sắc luôn ní ơi, mặc lên phom dáng sang xịn mịn lắm.','2026-08-05 03:22:41',0),(30,15,2,4,'Đồ hãng sờ sướng tay ghê, đóng gói cẩn thận 10 điểm không có nhưng.','2026-08-05 03:22:41',0),(31,16,1,5,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(32,16,2,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(33,17,1,5,'Đồ hãng sờ sướng tay ghê, đóng gói cẩn thận 10 điểm không có nhưng.','2026-08-05 03:22:41',0),(34,17,2,5,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(35,18,1,5,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(36,18,2,5,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(37,19,1,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(38,19,2,5,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(39,20,1,5,'Đồ hãng sờ sướng tay ghê, đóng gói cẩn thận 10 điểm không có nhưng.','2026-08-05 03:22:41',0),(40,20,2,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(41,21,1,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(42,21,2,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(43,22,1,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:41',0),(44,22,2,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(45,23,1,4,'Giao hàng nhanh, chủ shop dễ thương tư vấn size siêu nhiệt tình nha.','2026-08-05 03:22:41',0),(46,23,2,4,'Chất lượng tương xứng với giá tiền, sẽ mua thêm lần tới!','2026-08-05 03:22:41',0),(47,24,1,4,'Đẹp xuất sắc luôn ní ơi, mặc lên phom dáng sang xịn mịn lắm.','2026-08-05 03:22:42',0),(48,24,2,5,'Sản phẩm mặc rất vừa vặn, chất liệu vải mát mẻ, giao hàng nhanh.','2026-08-05 03:22:42',0);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Trang Test','trang@gmail.com','$2b$10$Sfv/pTSg.sCcIh/IWugfvuWRfUviakaY3g08CZaMnfnkpSr7r2Nea','customer','2026-07-30 06:47:36',0),(2,'Trang Si','admin1@gmail.com','$2b$10$Sfv/pTSg.sCcIh/IWugfvuWRfUviakaY3g08CZaMnfnkpSr7r2Nea','admin','2026-07-30 08:36:02',0),(3,'Trang Si','user1@example.com','$2b$10$eqFqGS1iBg3X3f6URbaSduEtYFIBlM5okYKmAD/a/2eT5HPbMlvuK','customer','2026-07-30 08:36:59',0),(4,'Trang SI','user2@example.com','$2b$10$hDRlkcfwgEbxtTj6CNPbsOJud1uAyXxhA4.56T4KtiP/HuszJ8ssW','customer','2026-07-30 08:46:46',0),(5,'Test User','testuser@gmail.com','','admin','2026-08-02 09:57:52',0),(6,'Admin','admin@gmail.com','','admin','2026-08-04 02:31:16',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-22 13:14:06
