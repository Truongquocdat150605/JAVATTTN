-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 10, 2026 lúc 08:33 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quan_ly_phong_tro`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `business_expenses`
--

CREATE TABLE `business_expenses` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `expense_date` date NOT NULL,
  `notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `message` varchar(1200) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contracts`
--

CREATE TABLE `contracts` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `deposit` decimal(38,2) NOT NULL,
  `end_date` date DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `rent_price` decimal(38,2) NOT NULL,
  `start_date` date NOT NULL,
  `status` enum('PENDING','ACTIVE','EXPIRED','TERMINATED') DEFAULT NULL,
  `room_id` bigint(20) NOT NULL,
  `tenant_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) NOT NULL,
  `billing_date` datetime(6) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `electricity_amount` decimal(38,2) DEFAULT NULL,
  `electricity_end` double DEFAULT NULL,
  `electricity_price` decimal(38,2) DEFAULT NULL,
  `electricity_start` double DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `rental_amount` decimal(38,2) NOT NULL,
  `service_amount` decimal(38,2) DEFAULT NULL,
  `status` enum('PAID','UNPAID','OVERDUE') NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `water_amount` decimal(38,2) DEFAULT NULL,
  `water_end` double DEFAULT NULL,
  `water_price` decimal(38,2) DEFAULT NULL,
  `water_start` double DEFAULT NULL,
  `contract_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `maintenance_requests`
--

CREATE TABLE `maintenance_requests` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('PENDING','IN_PROGRESS','RESOLVED','CANCELLED') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `room_id` bigint(20) NOT NULL,
  `tenant_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `broadcast` bit(1) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `target_user_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `method` enum('CASH','QR','STRIPE','PAYOS') NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `qr_url` varchar(1000) DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','CANCELLED') NOT NULL,
  `transaction_code` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `invoice_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rental_requests`
--

CREATE TABLE `rental_requests` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `desired_move_in_date` date DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `identity_number` varchar(255) DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT NULL,
  `room_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rental_services`
--

CREATE TABLE `rental_services` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `category` enum('WATER','ELECTRICITY','GARBAGE','INTERNET','SECURITY','CLEANING','MAINTENANCE','OTHER') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `frequency` enum('MONTHLY','WEEKLY','DAILY','ONE_TIME','QUARTERLY','ANNUAL') DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit` enum('UNIT','PERSON','MONTH','WEEK','DAY','KWH','CUBIC_METER','LITER','HOUR','TIME') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) NOT NULL,
  `area` double NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `status` enum('AVAILABLE','OCCUPIED','RENTED','MAINTENANCE') DEFAULT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_services_mapping`
--

CREATE TABLE `room_services_mapping` (
  `room_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `identity_number` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','TENANT') NOT NULL,
  `telegram_chat_id` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `active`, `address`, `avatar`, `email`, `full_name`, `identity_number`, `password`, `phone`, `role`, `telegram_chat_id`, `username`) VALUES
(1, b'1', NULL, NULL, 'admin@phongtro.vn', 'System Administrator', NULL, '$2a$10$fs61BXt3RvIuOGFC3LdM0uIy0450kuaDdmKrXrDjL4wZvwgHVlHpW', '0123456789', 'ADMIN', NULL, 'admin');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `business_expenses`
--
ALTER TABLE `business_expenses`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKju1b0xobla9t8oexrb8lpi8jq` (`room_id`),
  ADD KEY `FKra7p26cb32ydditq6ab80pv6l` (`tenant_id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKeads7q9fktwtsgdwmp1x16eqc` (`contract_id`);

--
-- Chỉ mục cho bảng `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcndie7sbh4o14jhu4yvro53jy` (`room_id`),
  ADD KEY `FKm1h380tkvba23mb1lfpb404t0` (`tenant_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_71lqwbwtklmljk3qlsugr1mig` (`token`);

--
-- Chỉ mục cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKd92ib2ip4k7hm0wmou7ckivhl` (`invoice_id`);

--
-- Chỉ mục cho bảng `rental_requests`
--
ALTER TABLE `rental_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK37fcw837567yells07xxio8fs` (`room_id`);

--
-- Chỉ mục cho bảng `rental_services`
--
ALTER TABLE `rental_services`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_7ljglxlj90ln3lbas4kl983m2` (`room_number`);

--
-- Chỉ mục cho bảng `room_services_mapping`
--
ALTER TABLE `room_services_mapping`
  ADD PRIMARY KEY (`room_id`,`service_id`),
  ADD KEY `FKlkvf38iwhi4ktbyxv2jts29gv` (`service_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `business_expenses`
--
ALTER TABLE `business_expenses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `rental_requests`
--
ALTER TABLE `rental_requests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `rental_services`
--
ALTER TABLE `rental_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `FKju1b0xobla9t8oexrb8lpi8jq` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `FKra7p26cb32ydditq6ab80pv6l` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `FKeads7q9fktwtsgdwmp1x16eqc` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`);

--
-- Các ràng buộc cho bảng `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD CONSTRAINT `FKcndie7sbh4o14jhu4yvro53jy` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `FKm1h380tkvba23mb1lfpb404t0` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `FKd92ib2ip4k7hm0wmou7ckivhl` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`);

--
-- Các ràng buộc cho bảng `rental_requests`
--
ALTER TABLE `rental_requests`
  ADD CONSTRAINT `FK37fcw837567yells07xxio8fs` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Các ràng buộc cho bảng `room_services_mapping`
--
ALTER TABLE `room_services_mapping`
  ADD CONSTRAINT `FKk98o13e9bj0b3li6b961gfcik` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `FKlkvf38iwhi4ktbyxv2jts29gv` FOREIGN KEY (`service_id`) REFERENCES `rental_services` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
