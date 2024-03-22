CREATE TABLE `levels` (
	`id` text(21) PRIMARY KEY NOT NULL,
	`name` text(64),
	`segment_a` text(64),
	`segment_b` text(64),
	`segment_c` text(64),
	`segment_d` text(64),
	`segment_e` text(64)
);
--> statement-breakpoint
CREATE TABLE `point` (
	`id` text(21) PRIMARY KEY NOT NULL,
	`level_id` text(21) NOT NULL,
	`x` integer NOT NULL,
	`y` integer NOT NULL,
	FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON UPDATE no action ON DELETE no action
);
