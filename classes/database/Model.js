import knex from 'knex';
import knexConfig from '../../knexfile.js';

export default class Model {
    static tableName;
    
    static database = knex(knexConfig);

    static get table() {
        if (!this.tableName) {
            throw new Error('Table name is not set! Set the table\'s name!');
        }

        return this.database(this.tableName);
    }

    static async insert(data){
        const [result] = await this.table.insert(data).returning('*');
        return result;
    }

    static async update(id, data) {
        const [result] = await this.table.where({ id }).update(data).returning('*');
        return result;
    }

    static async delete(id) {
        return this.table.where({ id }).del();
    }

    static async all() {
        return this.table.select('*')
    }
    
    static async findBy(data) {
        return this.table.where(data).first();
    }
}