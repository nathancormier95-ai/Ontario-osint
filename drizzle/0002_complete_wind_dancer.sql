CREATE TABLE `research_collection_citations` (
	`collectionId` varchar(64) NOT NULL,
	`citationId` varchar(64) NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `research_collection_citations_collectionId_citationId_pk` PRIMARY KEY(`collectionId`,`citationId`)
);
--> statement-breakpoint
CREATE TABLE `research_collections` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`accent` varchar(24) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `research_collection_citations` ADD CONSTRAINT `rcc_collection_fk` FOREIGN KEY (`collectionId`) REFERENCES `research_collections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_collection_citations` ADD CONSTRAINT `rcc_citation_fk` FOREIGN KEY (`citationId`) REFERENCES `synced_citation_entries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_collections` ADD CONSTRAINT `rc_user_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `research_collection_citations_citation_idx` ON `research_collection_citations` (`citationId`);--> statement-breakpoint
CREATE INDEX `research_collections_user_idx` ON `research_collections` (`userId`);
