const Account = require('../models/account');
const Transaction = require('../models/transaction');

/**
 * Accounts controller.
 * @class controllers/Account
 */
module.exports = {
    /**
     * Get list of all accounts
     *
     * @function
     * @name getAll
     * @memberof controllers/Account
     *
     * @param {getAllAccountsCallback} callback
     */
    /**
     * This callback is displayed as a global member.
     * @callback getAllAccountsCallback
     * @memberof controllers/Account
     *
     * @param {models/AccountSchema[]} data
     */
    getAll: function (callback) {
        Account.find(
            {
                _owner: user._id
            })
            .populate('currency')
            .exec(callback);
    },
    getById: function (id, callback) {
        Account.findOne({
            _id: id,
            _owner: user._id
        })
            .populate('currency')
            .exec(callback);
    },
    post: function (data, callback) {
        let account = new Account();

        data.initValue = data.initValue || 0;
        data.currency = data.currency || null;

        account._owner = user._id;
        account.name = data.name;
        account.value = data.initValue;
        account.initValue = data.initValue;
        account.currency = data.currency;

        account.save(callback);
    },
    update: function (id, data, callback) {
        Account.findById(
            id,
            {
                _owner: user._id
            },
            function (err, account) {
                if (err) {
                    callback(err);

                    return;
                }

                account.name = data.name;
                account.value = data.initValue;
                account.initValue = data.initValue;
                account.currency = data.currency;
                account.save(callback);
            }
        );
    },
    recalculate: function (accountId, callback) {
        console.log('recalculate');

        let accountValue;

        Account.findOne({
            _id: accountId,
            _owner: user._id
        })
            .exec(function (err, account) {
                if (err) {
                    callback(err);

                    return;
                }

                accountValue = account.initValue;
                console.log('init value', account.initValue);

                Transaction.find(
                    {
                        _owner: user._id,
                        accountSource: accountId
                    })
                    .exec(function (err, transactions) {
                        if (err) {
                            callback(err);

                            return;
                        }

                        for (let i = 0; i < transactions.length; i++) {
                            let transaction = transactions[i];

                            if (transaction.type === 'income') {
                                accountValue += transaction.value;
                            } else {
                                accountValue -= transaction.value;
                            }
                        }

                        Transaction.find(
                            {
                                _owner: user._id,
                                accountDestination: accountId
                            })
                            .exec(function (err, transactions) {
                                if (err) {
                                    callback(err);

                                    return;
                                }

                                for (let i = 0; i < transactions.length; i++) {
                                    let transaction = transactions[i];

                                    accountValue += transaction.value;
                                }

                                account.value = accountValue;
                                account.save(callback);
                            });
                    });
            });


    },
    remove: function (id, callback) {
        Account.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                Account.find(
                    {
                        _owner: user._id
                    })
                    .populate('currency')
                    .exec(callback);
            }
        );
    }
};
