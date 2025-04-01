import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, HelpCircle } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';

const Wallet = () => {
  const balance = 345.75;
  
  const transactions = [
    {
      id: 'TRX-1001',
      date: '2023-07-15',
      type: 'credit',
      amount: 75.00,
      description: 'Refund for Order #ORD-12344',
    },
    {
      id: 'TRX-1002',
      date: '2023-07-12',
      type: 'debit',
      amount: 125.50,
      description: 'Purchase - Order #ORD-12345',
    },
    {
      id: 'TRX-1003',
      date: '2023-07-05',
      type: 'credit',
      amount: 100.00,
      description: 'Wallet recharge',
    },
    {
      id: 'TRX-1004',
      date: '2023-06-28',
      type: 'debit',
      amount: 65.75,
      description: 'Purchase - Order #ORD-12341',
    },
    {
      id: 'TRX-1005',
      date: '2023-06-20',
      type: 'credit',
      amount: 50.00,
      description: 'Referral bonus',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Wallet</h2>
        <CustomButton variant="outline" size="sm">
          Add Money
        </CustomButton>
      </div>
      
      <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Current Balance</p>
            <h3 className="mt-1 text-3xl font-bold">{formatCurrency(balance)}</h3>
          </div>
          <WalletIcon className="h-10 w-10 text-white/90" />
        </div>
        
        <div className="mt-6 flex gap-2">
          <CustomButton size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            Withdraw
          </CustomButton>
          <CustomButton size="sm" className="bg-white text-primary hover:bg-white/90">
            Add Money
          </CustomButton>
        </div>
      </div>
      
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">Recent Transactions</h3>
        </div>
        
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' 
                      ? <ArrowUpRight className="h-5 w-5" /> 
                      : <ArrowDownLeft className="h-5 w-5" />}
                  </div>
                  
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)} • {transaction.id}</p>
                  </div>
                </div>
                
                <div className={`font-medium ${
                  transaction.type === 'credit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
            
            <div className="flex justify-center pt-4">
              <CustomButton variant="outline" size="sm">
                View All Transactions
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
            <WalletIcon className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No Transactions Yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
