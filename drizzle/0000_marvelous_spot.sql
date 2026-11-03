CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`patient` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`landmark` text NOT NULL,
	`area` text NOT NULL,
	`notes` text NOT NULL,
	`files` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`partner` text DEFAULT '' NOT NULL,
	`created` integer NOT NULL,
	`print_attempts` integer DEFAULT 0 NOT NULL
);
