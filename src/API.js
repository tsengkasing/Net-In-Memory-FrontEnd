/**
 * Created by kevin on 12/10/2016.
 */

let prefix = '';

//后端API
class API {

    static Oracle = prefix + '/api/oracle';

    static TimesTen = prefix + '/api/tt';

    //用户
    static SignIn = '/signin';

    static Balance = '/balance';

    static Recharge = '/recharge';

    static RechargeRecord = '/rechargerecord';

    static Record = '/record';

    //管理员
    static CallTotalTime = '/calltotaltime';

    static CallTotalAmount = '/calltotalamount';

    static CallDuration = '/callduration';

    static NewUser = '/newuser';

}

export default API;