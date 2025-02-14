import extention from './extention.js';
import ctl from '../controller/company.ctl.js';

const router = extention();


router.postS(
    "/create",
    ctl.create_company
);

router.postS(
    "/update",
    ctl.update_company
);

router.postS(
    "/remove",
    ctl.remove_company
);

router.getS(
    "/list",
    ctl.get_company
)

router.getS(
    "/detail",
    ctl.get_company_detail
)

export default router