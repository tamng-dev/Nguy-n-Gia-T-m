import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CompanyAttributes {
  id: number;
  name?: string;
  company_representative?: string;
  note?: string;
  tax_code?: string;
  address?: string;
  contact?: string;
  is_cancel?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type CompanyPk = "id";
export type CompanyId = Company[CompanyPk];
export type CompanyOptionalAttributes = "id" | "name" | "company_representative" | "note" | "tax_code" | "address" | "contact" | "created_at" | "updated_at";
export type CompanyCreationAttributes = Optional<CompanyAttributes, CompanyOptionalAttributes>;

export class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  declare id: number;
  declare name?: string;
  declare company_representative?: string;
  declare note?: string;
  declare tax_code?: string;
  declare address?: string;
  declare contact?: string;
  declare is_cancel?: number;
  declare created_at?: Date;
  declare updated_at?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof Company {
    return Company.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    company_representative: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tax_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contact: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_cancel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'company',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "company_tax_code_IDX",
        using: "BTREE",
        fields: [
          { name: "tax_code" },
          { name: "created_at" },
        ]
      },
    ]
  });
  }
}
