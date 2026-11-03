import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const orders = sqliteTable('orders', {
 id: text('id').primaryKey(), patient: text('patient').notNull(), phone: text('phone').notNull(), address: text('address').notNull(), landmark: text('landmark').notNull(), area: text('area').notNull(), notes: text('notes').notNull(), files: text('files').notNull(), status: text('status').notNull().default('queued'), partner: text('partner').notNull().default(''), created: integer('created').notNull(), printAttempts: integer('print_attempts').notNull().default(0)
});
