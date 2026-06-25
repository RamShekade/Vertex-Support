import { randomUUID } from "crypto";
import { db } from "../db/sqlite";
import { AIMessage } from "../models/message";
import { conversation } from "../models/conversation";
import { AIMessageRole } from "../models/message";

class ConversationRepository {

    createConversation(): string {

        const conversationId = randomUUID();

        const stmt = db.prepare(`
            INSERT INTO conversations (
                id
            )
            VALUES (?)
        `);

        stmt.run(
            conversationId
        );  

        return conversationId;
    }

    addMessage(
        conversationId: string,
        role: AIMessageRole,
        message: string
    ): void {

        const stmt = db.prepare(`
            INSERT INTO messages (
                id,
                conversation_id,
                role,
                message
            )
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(
            randomUUID(),
            conversationId,
            role,
            message
        );
    }

    getMessages(
        conversationId: string,
        limit?: number
    ): AIMessage[] {

        const stmt = db.prepare(`
            SELECT *
            FROM messages
            WHERE conversation_id = ?
            ORDER BY created_at DESC
            ${limit ? `LIMIT ${limit}` : ""}
        `);

        const rows = stmt.all(conversationId) as any[];


        return rows.map(r => ({
            conversationId: r.conversation_id,
            sender: r.role,
            text: r.message,
            createdAt: new Date(r.created_at)
        } as AIMessage));
    }

    getConversations(): conversation[] {

        const stmt = db.prepare(`
            SELECT *
            FROM conversations
            ORDER BY created_at DESC
        `);


        const rows = stmt.all() as any[];
        const firstMessageStmt = db.prepare(`
            SELECT message
            FROM messages
            WHERE conversation_id = ?
            ORDER BY created_at ASC
            LIMIT 1
        `);

        return rows.map(r => {
            const firstMessageRow = firstMessageStmt.get(r.id) as any;
            return {
                id: r.id,
                createdAt: new Date(r.created_at),
                firstMessage: firstMessageRow ? firstMessageRow.message : ""
            } as conversation;
        });
    }
}

export default ConversationRepository;