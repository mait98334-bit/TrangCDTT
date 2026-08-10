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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Nike','nike','nike.jpg','2026-07-30 06:49:36',0),(2,'Adidas','adidas','adidas.jpg','2026-07-30 06:49:36',0),(3,'Puma','puma','puma.jpg','2026-07-30 06:52:47',0),(4,'Jordan','jordan','jordan.jpg','2026-08-10 02:46:33',0),(5,'Under Armour','under-armour','under-armour.jpg','2026-08-10 02:46:33',0);
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
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Áo Nam','ao-nam','2026-07-30 07:28:09',0),(2,'Quần Nam','quan-nam','2026-07-30 07:28:09',0),(3,'Phụ Kiện','phu-kien','2026-07-30 07:28:09',0),(4,'Áo Khoác Nam','ao-khoac-nam','2026-07-30 07:35:02',0),(5,'Giày Thể Thao','giay-the-thao','2026-08-10 02:46:33',0),(6,'Bộ Đồ Thể Thao','bo-do-the-thao','2026-08-10 02:46:33',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Nguyễn Văn A','vana@gmail.com','0901234567','Shop ơi tư vấn giúp mình áo thun size L nhé.',0,'2026-07-30 07:36:07',0),(2,'Trần Thị B','tranb@gmail.com','0987654321','Shop ơi sản phẩm này còn hàng không ạ?',0,'2026-07-30 07:37:29',0),(3,'trang si','admin@gmail.com','0354717682','trang web quá tuyệt vời',0,'2026-08-02 09:53:26',0),(4,'Trang Si','admin1@gmail.com','','good',0,'2026-08-02 10:03:27',1);
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
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'),(2,1,'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop');
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
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'Đen','S',0.00,50,NULL),(2,1,'Đen','M',0.00,45,NULL),(3,1,'Đen','L',20000.00,30,NULL),(4,1,'Trắng','M',0.00,40,NULL),(5,1,'Trắng','L',20000.00,25,NULL),(6,2,'Xám','M',0.00,30,NULL),(7,2,'Xám','L',0.00,35,NULL),(8,2,'Đen','M',0.00,40,NULL),(9,3,'Xám Lông Chuột','M',0.00,20,NULL),(10,3,'Xám Lông Chuột','L',50000.00,15,NULL),(11,3,'Đen','L',50000.00,25,NULL),(12,4,'Đen','M',0.00,60,NULL),(13,4,'Xanh Navy','L',0.00,40,NULL),(14,5,'Đen','Free Size',0.00,100,NULL),(15,5,'Trắng','Free Size',0.00,80,NULL),(16,6,'Trắng','M (38-42)',0.00,150,NULL),(17,6,'Trắng','L (42-45)',0.00,120,NULL),(18,7,'Xanh Pha Trắng','M',0.00,15,NULL),(19,7,'Xanh Pha Trắng','L',50000.00,12,NULL),(20,7,'Đen Tuyền','L',50000.00,20,NULL),(21,8,'Xám','M',0.00,35,NULL),(22,8,'Xám','L',0.00,30,NULL),(23,9,'Đỏ Đô','M',0.00,25,NULL),(24,9,'Đỏ Đô','L',20000.00,20,NULL),(25,9,'Đen','M',0.00,35,NULL),(26,10,'Trắng','M',0.00,30,NULL),(27,10,'Trắng','L',0.00,25,NULL),(28,11,'Đen sọc Trắng','M',0.00,40,NULL),(29,11,'Đen sọc Trắng','L',30000.00,30,NULL),(30,12,'Đen','M',0.00,55,NULL),(31,12,'Xanh Than','L',0.00,45,NULL),(32,13,'Đen','Free Size',0.00,60,NULL),(33,13,'Xanh Rêu','Free Size',0.00,30,NULL),(34,14,'Trắng','Free Size',0.00,70,NULL),(35,14,'Đen','Free Size',0.00,90,NULL),(36,15,'Đen','M',0.00,15,NULL),(37,15,'Đen','L',50000.00,18,NULL),(38,15,'Xanh Dương','M',0.00,10,NULL),(39,16,'Đen','M',0.00,25,NULL),(40,16,'Đen','L',0.00,20,NULL),(41,17,'Đen','M',0.00,35,NULL),(42,17,'Đen','L',0.00,30,NULL),(43,17,'Đỏ','M',0.00,20,NULL),(44,18,'Xám','M',0.00,40,NULL),(45,18,'Xanh Coban','L',0.00,30,NULL),(46,19,'Xám Nhạt','M',0.00,25,NULL),(47,19,'Xám Nhạt','L',20000.00,20,NULL),(48,19,'Đen','L',20000.00,30,NULL),(49,20,'Đen','M',0.00,45,NULL),(50,20,'Xám','L',0.00,40,NULL),(51,21,'Đen','Free Size',0.00,50,NULL),(52,21,'Xanh Navy','Free Size',0.00,20,NULL),(53,22,'Đen','Free Size',0.00,80,NULL),(54,22,'Hồng Nhạt','Free Size',0.00,40,NULL),(55,23,'Đen','M',0.00,20,NULL),(56,23,'Đen','L',40000.00,15,NULL),(57,23,'Xanh Rêu','L',40000.00,10,NULL),(58,24,'Đen','M',0.00,30,NULL),(59,24,'Xám','L',0.00,25,NULL),(60,25,'─Éen ─Éß╗Å','40',0.00,20,NULL),(61,25,'─Éen ─Éß╗Å','41',0.00,25,NULL),(62,25,'─Éen ─Éß╗Å','42',0.00,15,NULL),(63,26,'─Éen','M',0.00,30,NULL),(64,26,'─Éen','L',0.00,20,NULL),(65,26,'Trß║»ng','L',0.00,25,NULL),(66,27,'─Éen','L',0.00,15,NULL),(67,27,'X├ím','XL',0.00,10,NULL),(68,28,'─Éen','M',0.00,40,NULL),(69,28,'─Éen','L',0.00,35,NULL),(70,28,'X├ím','M',0.00,30,NULL),(71,29,'─Éen','M',0.00,50,NULL),(72,29,'─Éen','L',0.00,45,NULL),(73,30,'─Éen','M',0.00,20,NULL),(74,30,'─Éen','L',0.00,25,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Áo Thun Nike Dri-FIT Sportswear',650000.00,'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop','Áo thun thể thao Nike Dri-FIT mang lại sự khô thoáng và thoải mái suốt ngày dài. Chất liệu 100% polyester tái chế mềm mại, co giãn tốt, phù hợp cho cả tập luyện và dạo phố.','2026-08-05 03:22:41',1,1,1,1,0,550000.00,0),(2,'Áo Thun Nike Club Tee Cotton',550000.00,'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop','Áo thun phong cách basic chất liệu 100% cotton cao cấp. Đường may tỉ mỉ, logo Nike thêu nổi bật trên ngực trái. Form dáng ôm nhẹ trẻ trung.','2026-08-05 03:22:41',1,1,0,0,1,NULL,0),(3,'Quần Jogger Nike Tech Fleece',1850000.00,'https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=600&auto=format&fit=crop','Quần nỉ ôm chân Tech Fleece cao cấp từ Nike mang lại sự ấm áp mà vẫn giữ form dáng thon gọn nhẹ nhàng. Có túi khoá kéo hông tiện lợi.','2026-08-05 03:22:41',2,1,1,1,0,1650000.00,0),(4,'Quần Short Thể Thao Nike Dri-FIT',750000.00,'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop','Quần short tập luyện đa năng thích hợp cho chạy bộ, gym hay mặc hàng ngày. Công nghệ thấm hút mồ hôi siêu tốc Dri-FIT.','2026-08-05 03:22:41',2,1,0,0,1,NULL,0),(5,'Mũ Lưỡi Trai Nike Heritage86',450000.00,'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop','Mũ lưỡi trai phong cách cổ điển, chất liệu 100% cotton thoáng mát, quai cài kim loại phía sau dễ dàng điều chỉnh kích cỡ đầu.','2026-08-05 03:22:41',3,1,0,1,0,NULL,0),(6,'Tất Thể Thao Cổ Cao Nike Everyday (3 Đôi)',380000.00,'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=600&auto=format&fit=crop','Bộ 3 đôi tất cổ cao dệt sợi dày dặn êm ái, co giãn đàn hồi vượt trội, hỗ trợ bảo vệ mắt cá chân tốt khi chơi thể thao.','2026-08-05 03:22:41',3,1,1,0,1,320000.00,0),(7,'Áo Gió Nike Windrunner Jacket',2150000.00,'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop','Áo khoác gió Nike Windrunner huyền thoại với thiết kế chữ V truyền thống trước ngực. Chất vải dù cản gió và chống tia nước nhẹ hiệu quả.','2026-08-05 03:22:41',4,1,1,1,0,1890000.00,0),(8,'Áo Khoác Nỉ Nike Sportswear Hoodie',1650000.00,'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop','Áo hoodie nỉ bông siêu ấm áp, mũ trùm sâu rộng rãi có dây rút tiện lợi. Thích hợp mặc vào mùa đông hoặc những ngày se lạnh.','2026-08-05 03:22:41',4,1,0,0,1,NULL,0),(9,'Áo Phông Adidas Adicolor Classics 3-Stripes',700000.00,'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop','Áo phông biểu tượng của Adidas Classics với 3 sọc chạy dọc bả vai. Chất vải cotton hữu cơ mềm mịn và cực kì thân thiện với làn da.','2026-08-05 03:22:41',1,2,1,1,1,630000.00,0),(10,'Áo Polo Thể Thao Adidas Club',850000.00,'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop','Áo polo có cổ thanh lịch tích hợp công nghệ Aeroready giúp kiểm soát độ ẩm tối ưu. Phù hợp cho cả mặc hàng ngày và chơi tennis, golf.','2026-08-05 03:22:41',1,2,0,0,0,NULL,0),(11,'Quần Jogger Adidas Tiro 23 Track Pants',1200000.00,'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop','Quần tập luyện bóng đá Tiro trứ danh với thiết kế bó hẹp dần về phía gấu quần. Khoá kéo dưới cổ chân giúp tháo cởi giày dễ dàng.','2026-08-05 03:22:41',2,2,1,1,0,990000.00,0),(12,'Quần Short Adidas Essentials Chelsea',600000.00,'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop','Quần đùi thể thao siêu nhẹ, tích hợp lớp lót lưới thoáng khí bên trong. Lựa chọn tuyệt vời cho các hoạt động ngoài trời nắng nóng.','2026-08-05 03:22:41',2,2,0,0,1,NULL,0),(13,'Balo Thể Thao Adidas Power VI',850000.00,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop','Balo siêu bền bỉ với đáy phủ TPE chống nước mài mòn. Thiết kế nhiều ngăn rộng rãi chứa vừa laptop 15.6 inch và quần áo tập.','2026-08-05 03:22:41',3,2,0,1,0,NULL,0),(14,'Mũ Lưỡi Trai Adidas Superlite',400000.00,'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=600&auto=format&fit=crop','Mũ lưỡi trai siêu nhẹ chống tia UV cao cấp, tấm lót thấm mồ hôi Climalite giữ trán luôn khô thoáng dễ chịu.','2026-08-05 03:22:41',3,2,1,0,1,350000.00,0),(15,'Áo Khoác Thể Thao Adidas SST Track Jacket',1900000.00,'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop','Chiếc áo khoác mang tính biểu tượng văn hoá đường phố toàn cầu. Cổ đứng cổ điển, bo chun tay gấu cực đẹp kết hợp 3 sọc đặc trưng.','2026-08-05 03:22:41',4,2,1,1,0,1690000.00,0),(16,'Áo Khoác Gió Adidas Own The Run',1500000.00,'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop','Áo khoác gió chạy bộ chuyên dụng của Adidas. Trọng lượng siêu nhẹ, phản quang ban đêm an toàn, hỗ trợ túi khoá ngực chống mồ hôi cho điện thoại.','2026-08-05 03:22:41',4,2,0,0,1,NULL,0),(17,'Áo Thun Puma Essentials Logo Tee',450000.00,'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop','Áo phông cotton năng động in logo Puma Cat sắc nét trước ngực. Chất thun mát mẻ phù hợp mặc hàng ngày thoải mái.','2026-08-05 03:22:41',1,3,1,1,0,390000.00,0),(18,'Áo Polo Puma Active Men Polo',650000.00,'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop','Áo polo nam phom dáng dryCELL hỗ trợ thoát mồ hôi tối đa, giữ cơ thể luôn thoải mái mát mẻ suốt cả ngày.','2026-08-05 03:22:41',1,3,0,0,1,NULL,0),(19,'Quần Jogger Puma Evostripe',1100000.00,'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop','Quần dài thể thao Puma Evostripe với chất thun co giãn đa chiều, đường may cắt cúp hỗ trợ chuyển động tối đa cực kỳ thoải mái.','2026-08-05 03:22:41',2,3,1,1,0,950000.00,0),(20,'Quần Short Nỉ Puma Essentials',500000.00,'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop','Quần short nỉ Puma basic năng động, cạp thun co giãn bản to kèm dây rút điều chỉnh tiện lợi.','2026-08-05 03:22:41',2,3,0,0,1,NULL,0),(21,'Túi Đeo Chéo Thể Thao Puma Buzz',550000.00,'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop','Túi đeo chéo Puma Buzz nhỏ gọn tiện lợi để đựng ví, điện thoại, chìa khóa khi đi chơi, đi dạo phố năng động.','2026-08-05 03:22:41',3,3,0,1,0,NULL,0),(22,'Mũ Lưỡi Trai Puma Archive Logo',350000.00,'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop','Mũ lưỡi trai Puma thêu logo nổi bật phía trước, chất liệu kaki dày dặn giữ dáng mũ tốt.','2026-08-05 03:22:41',3,3,1,0,1,290000.00,0),(23,'Áo Khoác Gió Puma Essentials Hooded',1350000.00,'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop','Áo khoác dù Puma cản gió hiệu quả, thích hợp mặc che nắng mùa hè hoặc cản lạnh những ngày gió mùa.','2026-08-05 03:22:41',4,3,1,1,0,1190000.00,0),(24,'Áo Khoác Nỉ Puma Power Hoodie',1250000.00,'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop','Áo hoodie Puma chất nỉ da cá dày dặn giữ nhiệt tốt, in họa tiết Puma cá tính chạy dọc bả vai phong cách.','2026-08-05 03:22:41',4,3,0,0,1,NULL,0),(25,'Giày Bóng Rổ Air Jordan 1 Mid',3500000.00,'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop','─É├┤i gi├áy b├│ng rß╗ò huyß╗ün thoß║íi Air Jordan 1 Mid phß╗æi m├áu classic cß╗▒c chß║Ñt. Chß║Ñt liß╗çu da cao cß║Ñp, ─æß╗çm Air ├¬m ├íi bß║úo vß╗ç cß╗ò ch├ón tß╗æi ─æa.','2026-08-10 02:47:24',5,4,1,1,1,3200000.00,0),(26,'Áo Thun Jordan Jumpman Tee',850000.00,'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop','├üo thun cotton Jordan vß╗øi logo Jumpman th├¬u nß╗òi bß║¡t trã░ß╗øc ngß╗▒c. Chß║Ñt thun cotton 100% mß╗üm mß╗ïn, thß║Ñm h├║t mß╗ô h├┤i tß╗æt.','2026-08-10 02:47:24',1,4,0,0,1,NULL,0),(27,'Áo Khoác Hoodie Jordan Essentials',1950000.00,'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop','├üo kho├íc hoodie nß╗ë d├áy dß║Àn ß║Ñm ├íp tß╗½ thã░ãíng hiß╗çu Jordan. Phom d├íng rß╗Öng thoß║úi m├íi, bo chun gß║Ñu tay chß║»c chß║»n.','2026-08-10 02:47:24',4,4,1,1,0,1750000.00,0),(28,'Áo Thun Body Gym Under Armour HeatGear',750000.00,'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop','├üo thun ├┤m body chuy├¬n dß╗Ñng cho tß║¡p gym, chß║íy bß╗Ö tß╗½ Under Armour. C├┤ng nghß╗ç HeatGear si├¬u m├ít, co gi├ún 4 chiß╗üu tß╗æi ã░u vß║¡n ─æß╗Öng.','2026-08-10 02:47:24',1,5,1,0,1,650000.00,0),(29,'Quần Short Tập Luyện Under Armour Launch',690000.00,'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop','Quß║ºn ─æ├╣i thß╗â thao tß║¡p luyß╗çn si├¬u nhß║╣ Under Armour, chß║Ñt vß║úi d├╣ nhanh kh├┤, cß║íp chun co gi├ún v├á c├│ t├║i kho├í k├®o tiß╗çn lß╗úi.','2026-08-10 02:47:24',2,5,0,1,0,NULL,0),(30,'Bộ Quần Áo Thể Thao Under Armour Tech',1450000.00,'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop','Bß╗Ö quß║ºn ├ío thß╗â thao Under Armour Tech gß╗ôm 1 ├ío thun v├á 1 quß║ºn short ─æß╗ông bß╗Ö. Chß║Ñt liß╗çu vß║úi Tech si├¬u mß╗üm mß║íi, nhanh kh├┤ v├á cß╗▒c nhß║╣.','2026-08-10 02:47:24',6,5,1,1,1,1290000.00,0);
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
INSERT INTO `users` VALUES (1,'Trang Test','trang@gmail.com','$2b$10$rYzuvlDLoRSIRr5cXKJSOOfth/zZWnusg557NovaSCJ9wCTb1rRLa','customer','2026-07-30 06:47:36',0),(2,'Trang Si','admin1@gmail.com','$2b$10$Fb0FncbfWjh4C.wmiam4eOZoapUYQFIiC0i3iYYN7fyAuE/4CBvU6','admin','2026-07-30 08:36:02',0),(3,'Trang Si','user1@example.com','$2b$10$eqFqGS1iBg3X3f6URbaSduEtYFIBlM5okYKmAD/a/2eT5HPbMlvuK','customer','2026-07-30 08:36:59',0),(4,'Trang SI','user2@example.com','$2b$10$hDRlkcfwgEbxtTj6CNPbsOJud1uAyXxhA4.56T4KtiP/HuszJ8ssW','customer','2026-07-30 08:46:46',0),(5,'Test User','testuser@gmail.com','$2b$10$2OlASAH8NjJigOKrTn629.WyS3NjtKnsOhLqv/8uOn4Pibx1aq.M.','admin','2026-08-02 09:57:52',0),(6,'Admin','admin@gmail.com','$2b$10$dfA3Ne.bITKqxeczAxm4C.luq/v.YKVivASocs0rNo7s1zoD..nVC','admin','2026-08-04 02:31:16',0);
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

-- Dump completed on 2026-08-10  9:52:00
