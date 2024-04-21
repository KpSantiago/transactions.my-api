// @types vai ser um diretorio reponsável por adicionar definções de tipos para algumas das tecnmologias que utlizamos
// Ex: o Knex que não sabe ainda quais são minhas tableas e campos
import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string;
            session_id?: string;
            title: string;
            amount: number;
            type: 'debit' | 'credit';
            category: 'food' | 'travel' | 'clothes' | 'games' | 'job' | 'others';
            created_at: Date
        };
    }
}