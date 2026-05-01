const { Model } = require("sequelize");

/**
 * BaseModel — extended by all resource models.
 * Provides common async CRUD operations using Sequelize ORM.
 */
class BaseModel extends Model {
  /**
   * Paginated findAll with optional where clause, includes, and ordering.
   */
  static async findPaginated({ where = {}, page = 1, limit = 10, include = [], order = [] } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await this.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include,
      order,
    });
    return {
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    };
  }

  /**
   * Find a single record by a specific field value.
   */
  static async findByField(field, value) {
    return this.findOne({ where: { [field]: value } });
  }

  /**
   * Create a record and return the new instance.
   */
  static async createRecord(data) {
    return this.create(data);
  }

  /**
   * Update a record by primary key.
   */
  static async updateById(id, data) {
    const [affectedRows] = await this.update(data, { where: { id } });
    return affectedRows;
  }

  /**
   * Delete a record by primary key.
   */
  static async deleteById(id) {
    return this.destroy({ where: { id } });
  }
}

module.exports = BaseModel;
