import { models } from '../database/database.js';
import { check_values, str, num, PATTERN, } from '../library/helper/general.helper.js'
import { Req, Res } from '../library/interface-type/general.itf.js'
import { Op } from 'sequelize';
import { IS_CANCEL } from '../library/enum/general.enum.js';

export const create_company = async (req: Req, res: Res): Promise<any> => {

    const name = req.body.name;
    const company_representative = req.body.company_representative;
    const tax_code = req.body.tax_code;
    const address = req.body.address;
    const contact = req.body.contact;
    const note = req.body.note

    check_values([
        PATTERN.VARCHAR.test(name),
        PATTERN.VARCHAR.test(company_representative),
        PATTERN.VARCHAR.test(address),
        !note || typeof note === "string"
    ], [
        "Invalid name",
        "Invalid company representative",
        "Invalid address",
        "Invalid note"
    ])

    const new_company = await models.Company.create({
        name: name,
        company_representative: company_representative,
        address: address,
        tax_code: PATTERN.VARCHAR.test(tax_code) ? tax_code : "",
        contact: PATTERN.VARCHAR.test(contact) ? contact : "",
        note: note ?? "",
        is_cancel: IS_CANCEL.FALSE
    })

    res.success(new_company)
}

export const update_company = async (req: Req, res: Res): Promise<any> => {
    const company_id = req.body.company_id;
    const name = req.body.name;
    const company_representative = req.body.company_representative;
    const tax_code = req.body.tax_code;
    const address = req.body.address;
    const contact = req.body.contact;
    const note = req.body.note

    check_values([
        PATTERN.POSITIVE_INTEGER.test(company_id),
        PATTERN.VARCHAR.test(name),
        PATTERN.VARCHAR.test(company_representative),
        PATTERN.VARCHAR.test(address),
        !note || typeof note === "string"
    ], [
        "Invalid company id",
        "Invalid name",
        "Invalid company representative",
        "Invalid address",
        "Invalid note"
    ])


    const company_info = await models.Company.findOne({
        where: {
            id: company_id,
            is_cancel: IS_CANCEL.FALSE
        }
    })

    if (!company_info) {
        return res.fail("Company not exist")
    }

    company_info.name = name
    company_info.company_representative = company_representative
    company_info.address = address
    company_info.tax_code = PATTERN.VARCHAR.test(tax_code) ? tax_code : ""
    company_info.contact = PATTERN.VARCHAR.test(contact) ? contact : ""
    company_info.note = note ?? ""
    await company_info.save()

    res.success("Successfully")
}

export const remove_company = async (req: Req, res: Res): Promise<any> => {
    const company_id = req.body.company_id;

    if (!PATTERN.POSITIVE_INTEGER.test(str(company_id))) {
        return res.fail("Invalid company id")
    }

    const company_info = await models.Company.findOne({
        where: {
            id: company_id,
            is_cancel: IS_CANCEL.FALSE
        }
    })

    if (!company_info) {
        return res.fail("Company not exist")
    }

    company_info.is_cancel = IS_CANCEL.TRUE
    await company_info.save()

    res.success("Successfully")
}

export const get_company = async (req: Req, res: Res): Promise<any> => {

    const page = num(req.query.page) ?? 1;
    const limit = num(req.query.limit) ?? 10;
    const key_search = str(req.query.key_search);

    if (!PATTERN.POSITIVE_INTEGER.test(str(page)) || !PATTERN.POSITIVE_INTEGER.test(str(limit))) {
        return res.fail("Invalid page or limit")
    }

    if (key_search && !PATTERN.STRING.test(key_search)) {
        return res.fail("Invalid key search")
    }

    const companys = await models.Company.findAndCountAll({
        attributes: [["id", "company_id"], "name", "company_representative", "address", "tax_code", "contact", "note"],
        where: {
            ...(PATTERN.VARCHAR.test(key_search) ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${key_search}%` } },
                    { company_representative: { [Op.like]: `%${key_search}%` } },
                    { tax_code: { [Op.like]: `%${key_search}%` } },
                    { contact: { [Op.like]: `%${key_search}%` } }
                ]
            } : {}),
            is_cancel: IS_CANCEL.FALSE
        },
        offset: (page - 1) * limit,
        limit: limit,
        order: [["created_at", "DESC"]],
        raw: true
    })

    res.success({
        total: companys.count,
        data: companys.rows
    })
}

export const get_company_detail = async (req: Req, res: Res): Promise<any> => {

    const company_id = req.user_info?.company_id ?? num(req.query.company_id);

    if (!PATTERN.POSITIVE_INTEGER.test(str(company_id))) {
        return res.fail("Invalid company id")
    }

    const company_info = await models.Company.findOne({
        attributes: [["id", "company_id"], "name", "company_representative", "address", "tax_code", "contact", "note"],
        where: {
            id: company_id,
            is_cancel: IS_CANCEL.FALSE
        },
        raw: true
    })

    if (!company_info) {
        return res.fail("Company not exist")
    }

    res.success(company_info)
}

export default {
    create_company,
    update_company,
    remove_company,
    get_company,
    get_company_detail
}