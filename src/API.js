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

    static sort_month = (a, b) => {
        a = a.time;
        b = b.time;
        let year_a = parseInt(a.slice(0, 4));
        let year_b = parseInt(b.slice(0, 4));
        let month_a = parseInt(a.slice(5, 7));
        let month_b = parseInt(b.slice(5, 7));

        if(year_a > year_b) return 1;
        else if(year_a < year_b) return -1;
        else return (month_a - month_b);
    };

    static sort_date = (a, b) => {
        a = a.time;
        b = b.time;

        let year_a = parseInt(a.slice(0, 4));
        let year_b = parseInt(b.slice(0, 4));
        let month_a = parseInt(a.slice(5, 7));
        let month_b = parseInt(b.slice(5, 7));
        let date_a = parseInt(a.slice(8, 10));
        let date_b = parseInt(b.slice(8, 10));

        if(year_a > year_b) return 1;
        else if(year_a < year_b) return -1;
        else {
            if (month_a > month_b) return 1;
            else if (month_a < month_b) return -1;
            else return (date_a - date_b);
        }
    }

}

export default API;