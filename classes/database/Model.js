import knex from 'knex';
import knexConfig from '../../knexfile.js';

export default class Model {
    // Table name for the model.
    static tableName;
    
    // Initialize the database connection using Knex.
    static database = knex(knexConfig);

    /**
     * Getter for the table property.
     */
    static get table() {
        if (!this.tableName) {
            throw new Error('Table name is not set! Set the table\'s name!');
        }

        return this.database(this.tableName);
    }

    /**
     * Method to insert data into the table.
     * 
     * @param {*} data 
     * @returns 
     */
    static async insert(data){
        const [result] = await this.table.insert(data).returning('*');
        return result;
    }

    /**
     * Method to update data in the table by id.
     * 
     * @param {*} id 
     * @param {*} data 
     * @returns 
     */
    static async update(id, data) {
        const [result] = await this.table.where({ id }).update(data).returning('*');
        return result;
    }

    /**
     * Method to delete data from the table by id.
     * 
     * @param {*} id 
     * @returns 
     */
    static async delete(id) {
        return this.table.where({ id }).del();
    }

    /**
     * Method to get all data from the table.
     * 
     * @returns
     */
    static async all() {
        return this.table.select('*')
    }
    
    /**
     * Method to find data in the table by a specific column.
     * 
     * @param {*} data 
     * @returns 
     */
    static async findBy(data) {
        return this.table.where(data).first();
    }
}