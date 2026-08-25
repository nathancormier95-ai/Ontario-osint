CREATE TABLE `citation_sync_settings` (
	`userId` int NOT NULL,
	`consentedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `citation_sync_settings_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `synced_citation_entries` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`sourceTitle` varchar(500) NOT NULL,
	`sourceUrl` text NOT NULL,
	`accessedOn` varchar(10) NOT NULL,
	`purpose` text NOT NULL,
	`notes` text NOT NULL,
	`savedAt` varchar(40) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `synced_citation_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `citation_sync_settings` ADD CONSTRAINT `citation_sync_settings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `synced_citation_entries` ADD CONSTRAINT `synced_citation_entries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `synced_citation_entries_user_idx` ON `synced_citation_entries` (`userId`);